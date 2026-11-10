import { loadEnvConfig } from "@next/env";

// Environment must be loaded before the Prisma client module is
// evaluated: `lib/prisma` constructs `new PrismaClient()` at import
// time. Static `import { prisma } from "../lib/prisma"` statements are
// hoisted above this line, so the client is imported dynamically
// inside main(), after the env is populated.
loadEnvConfig(process.cwd());

import type { Service, ServiceCategory } from "../lib/services";

/**
 * Dedicated Services-CMS content import.
 *
 * Copies the static WebEaz services catalog (`lib/services.ts`: exactly
 * 4 categories / 24 services) into the database. Companion to
 * `scripts/seed-content.ts`, which must not be used for this — it also
 * seeds unrelated tables and is not per-row idempotent.
 *
 * Safety properties:
 *
 *   - DRY RUN by default. Nothing is written unless `--apply` is passed.
 *   - Per-row upserts keyed on `ServiceCategory.slug` and the
 *     `(categoryId, slug)` unique index on `Service`. Re-running never
 *     creates duplicates; it converges.
 *   - Never deletes any row — not in this script, not through cascades
 *     (no deletes are issued against relations).
 *   - Unrelated records are out of scope: industries, admin, homepage,
 *     blog, testimonials and site settings are never read for writing
 *     or modified. Only rows matching the 4 source category slugs and
 *     their services are written.
 *   - Ordering matches the public site: categories `(index + 1) * 10`,
 *     services `(serviceIndex + 1) * 10`.
 *   - Publication status: created rows are PUBLISHED. Existing rows are
 *     NEVER republished — `status` is intentionally absent from every
 *     update object, so an admin's DRAFT/ARCHIVED decision survives
 *     a re-import.
 *   - Admin-managed `image`, `seoTitle` and `seoDescription` are synced
 *     only when the source defines them (the current static catalog
 *     defines none); otherwise existing CMS values are left untouched.
 *   - Content fields (name, copy, arrays, ordering) are synced from
 *     source on every run. Re-running overwrites only the catalog rows
 *     themselves, never other tables or unrelated rows.
 *
 * Usage (from the `web/` directory):
 *
 *   npx tsx scripts/import-services.ts            # dry run, prints plan, writes nothing
 *   npx tsx scripts/import-services.ts --apply    # performs the upserts, then verifies counts
 *
 * Requires the pending migration `20261104165000_services_cms_metadata`
 * to be applied first (`ServiceCategory.image`, `Service.seoTitle`,
 * `Service.seoDescription`); otherwise the upserts fail with Prisma P2022.
 */

const APPLY = process.argv.includes("--apply");

const EXPECTED_CATEGORY_COUNT = 4;
const EXPECTED_SERVICE_COUNT = 24;

type ServiceRow = Service & { slug: string };

function categoryOrder(index: number) {
  return (index + 1) * 10;
}

function serviceOrder(services: Service[], index: number) {
  return (index + 1) * 10;
}

/**
 * Content shared by create and update. `status` is deliberately NOT
 * part of this object: creates set it explicitly on their own object,
 * and updates never carry a status, so a re-import cannot republish
 * an existing DRAFT/ARCHIVED row.
 */
function serviceContent(service: ServiceRow) {
  return {
    name: service.name,
    summary: service.summary,
    icon: service.icon,
    overview: service.overview,
    provides: service.provides,
    capabilities: service.capabilities,
    benefits: service.benefits,
    useCases: service.useCases ?? [],
    technologies: service.technologies ?? [],
  };
}

function categoryContent(category: ServiceCategory) {
  return {
    name: category.name,
    num: category.num,
    tagline: category.tagline,
    description: category.description,
    icon: category.icon,
    accent: category.accent,
  };
}

/**
 * Fields where an absent source value must NOT erase what the CMS
 * holds. Only fields actually defined in the source are returned.
 */
function optionalSourceFields<T extends Service | ServiceCategory>(row: T) {
  const data: Record<string, unknown> = {};
  if (row.image !== undefined) data.image = row.image;
  if ("seoTitle" in row && row.seoTitle !== undefined) data.seoTitle = row.seoTitle;
  if ("seoDescription" in row && row.seoDescription !== undefined) {
    data.seoDescription = row.seoDescription;
  }
  return data;
}

async function main() {
  // Pure data module; no env required. Safe to load for the dry run.
  const { serviceCategories } = await import("../lib/services");

  const sourceCategories: ServiceCategory[] = serviceCategories;
  const sourceServiceCount = sourceCategories.reduce(
    (sum, category) => sum + category.services.length,
    0,
  );

  console.log(
    `source catalog: ${sourceCategories.length} categories, ${sourceServiceCount} services`,
  );

  if (
    sourceCategories.length !== EXPECTED_CATEGORY_COUNT ||
    sourceServiceCount !== EXPECTED_SERVICE_COUNT
  ) {
    console.error(
      `ABORT: expected ${EXPECTED_CATEGORY_COUNT} categories / ${EXPECTED_SERVICE_COUNT} services from lib/services.ts, found ${sourceCategories.length} / ${sourceServiceCount}. The source changed; review before importing.`,
    );
    process.exitCode = 1;
    return;
  }

  if (!APPLY) {
    console.log("\nDRY RUN (no --apply flag). Planned writes:\n");
    for (const [index, category] of sourceCategories.entries()) {
      console.log(
        `upsert category [order ${categoryOrder(index)}] slug=${category.slug} (${category.services.length} services, create-as PUBLISHED, existing rows keep status)`,
      );
      for (const [serviceIndex, service] of category.services.entries()) {
        console.log(
          `  upsert service  [order ${serviceOrder(category.services, serviceIndex)}] slug=${service.slug} (create-as PUBLISHED, existing rows keep status)`,
        );
      }
    }
    console.log(
      "\nNothing was written. Re-run with --apply to perform the import.",
    );
    return;
  }

  // Imported here — after loadEnvConfig AND after the dry-run bail-out —
  // so PrismaClient sees the environment. Do not hoist into static imports.
  const { prisma } = await import("../lib/prisma");

  let categoryCount = 0;
  let serviceCount = 0;

  for (const [index, category] of sourceCategories.entries()) {
    const order = categoryOrder(index);

    await prisma.$transaction(async (tx) => {
      const savedCategory = await tx.serviceCategory.upsert({
        where: { slug: category.slug },
        create: {
          slug: category.slug,
          ...categoryContent(category),
          image: category.image ?? null,
          order,
          status: "PUBLISHED",
        },
        update: {
          ...categoryContent(category),
          ...optionalSourceFields(category),
          order,
          // status intentionally absent — existing publication state is preserved
        },
      });
      categoryCount += 1;

      for (const [serviceIndex, service] of category.services.entries()) {
        const serviceOrderValue = serviceOrder(category.services, serviceIndex);
        await tx.service.upsert({
          where: {
            categoryId_slug: { categoryId: savedCategory.id, slug: service.slug },
          },
          create: {
            categoryId: savedCategory.id,
            slug: service.slug,
            ...serviceContent(service),
            image: service.image ?? null,
            seoTitle: service.seoTitle ?? null,
            seoDescription: service.seoDescription ?? null,
            order: serviceOrderValue,
            status: "PUBLISHED",
          },
          update: {
            ...serviceContent(service),
            ...optionalSourceFields(service),
            order: serviceOrderValue,
            // status intentionally absent — existing publication state is preserved
          },
        });
        serviceCount += 1;
      }
    });
  }

  console.log(`\nupserted ${categoryCount} categories, ${serviceCount} services`);

  // Read-only verification scoped to the rows this script manages.
  const slugs = sourceCategories.map((category) => category.slug);
  const storedCategories = await prisma.serviceCategory.count({
    where: { slug: { in: slugs } },
  });
  const storedServices = await prisma.service.count({
    where: { category: { slug: { in: slugs } } },
  });
  const publishedServices = await prisma.service.count({
    where: {
      status: "PUBLISHED",
      category: { slug: { in: slugs }, status: "PUBLISHED" },
    },
  });
  const totalCategories = await prisma.serviceCategory.count();
  const totalServices = await prisma.service.count();

  console.log("verification (read-only):");
  console.log(
    `  categories with source slugs: ${storedCategories}/${sourceCategories.length}`,
  );
  console.log(
    `  services under those categories: ${storedServices}/${sourceServiceCount}`,
  );
  console.log(
    `  of which PUBLISHED (service + parent category): ${publishedServices}/${sourceServiceCount}`,
  );
  console.log(`  table totals (incl. any admin-created rows): categories ${totalCategories}, services ${totalServices}`);
  console.log(
    "  industries, admin, homepage, blog, testimonials and settings were not touched",
  );

  if (
    storedCategories !== sourceCategories.length ||
    storedServices !== sourceServiceCount
  ) {
    console.error(
      "VERIFICATION FAILED: stored counts do not match the source catalog. Inspect the database before retrying.",
    );
    process.exitCode = 1;
  } else {
    console.log("verification passed");
  }
}

main()
  .catch((error) => {
    const err = error as { code?: string; message?: string };
    console.error(
      "import failed:",
      err?.code ?? "unknown",
      String(err?.message ?? error).slice(0, 600),
    );
    if (err?.code === "P2022") {
      console.error(
        "hint: the pending migration 20261104165000_services_cms_metadata has not been applied yet.",
      );
    }
    process.exit(1);
  })
  .finally(async () => {
    try {
      const { prisma } = await import("../lib/prisma");
      await prisma.$disconnect();
    } catch {
      // client was never created — nothing to disconnect
    }
  });
