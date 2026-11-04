import { loadEnvConfig } from "@next/env";
import { prisma } from "../lib/prisma";
import {
  DEFAULT_HOME,
  DEFAULT_SECTIONS,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  DEFAULT_TESTIMONIALS,
} from "../lib/defaults";
import { insights } from "../lib/insights";
import { industries } from "../lib/industries";
import { serviceCategories } from "../lib/services";

loadEnvConfig(process.cwd());

/**
 * Content migration / seed.
 *
 * Copies every piece of pre-CMS content into the database exactly once
 * (each table is only seeded while empty, so re-running the script
 * never overwrites edits made through the admin). Run with:
 *
 *   npm run db:seed
 */

async function seedIfEmpty<T extends { count: () => Promise<number> }>(
  label: string,
  table: T,
  insert: () => Promise<unknown>,
) {
  const count = await table.count();
  if (count > 0) {
    console.log(`skip    ${label} (${count} rows already present)`);
    return;
  }
  await insert();
  console.log(`seeded  ${label}`);
}

async function main() {
  await seedIfEmpty("homepage content", prisma.homepageContent, () =>
    prisma.homepageContent.create({ data: { ...DEFAULT_HOME } }),
  );

  await seedIfEmpty("homepage sections", prisma.homepageSection, () =>
    prisma.homepageSection.createMany({
      data: DEFAULT_SECTIONS.map((s) => ({
        key: s.key,
        eyebrow: s.eyebrow,
        title: s.title,
        description: s.description,
        visible: s.visible,
        order: s.order,
      })),
    }),
  );

  await seedIfEmpty("homepage stats", prisma.homepageStat, () =>
    prisma.homepageStat.createMany({
      data: DEFAULT_STATS.map((s) => ({
        group: s.group,
        value: s.value,
        unit: s.unit,
        label: s.label,
        order: s.order,
        visible: s.visible,
      })),
    }),
  );

  await seedIfEmpty("industries", prisma.industry, () =>
    prisma.industry.createMany({
      data: industries.map((name, index) => ({
        name,
        order: (index + 1) * 10,
        status: "PUBLISHED" as const,
      })),
    }),
  );

  await seedIfEmpty("service categories + services", prisma.serviceCategory, async () => {
    for (const [index, category] of serviceCategories.entries()) {
      await prisma.serviceCategory.create({
        data: {
          slug: category.slug,
          name: category.name,
          num: category.num,
          tagline: category.tagline,
          description: category.description,
          icon: category.icon,
          accent: category.accent,
          order: (index + 1) * 10,
          status: "PUBLISHED",
          services: {
            create: category.services.map((service, serviceIndex) => ({
              slug: service.slug,
              name: service.name,
              summary: service.summary,
              icon: service.icon,
              image: service.image ?? null,
              overview: service.overview,
              provides: service.provides,
              capabilities: service.capabilities,
              benefits: service.benefits,
              useCases: service.useCases,
              technologies: service.technologies ?? [],
              order: (serviceIndex + 1) * 10,
              status: "PUBLISHED" as const,
            })),
          },
        },
      });
    }
  });

  await seedIfEmpty("blog posts", prisma.blogPost, () =>
    prisma.blogPost.createMany({
      // The four editorial placeholders keep their current public
      // appearance: they stay published with no date, which the
      // insights page renders as "Coming soon" exactly as before.
      data: insights.map((insight) => ({
        slug: insight.title
          .toLowerCase()
          .replace(/^topic:\s*/, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        title: insight.title,
        excerpt: insight.description,
        content: "",
        category: insight.category,
        coverImage: insight.image ?? null,
        author: "WebEaz Technologies",
        publishedAt: null,
        status: "PUBLISHED" as const,
      })),
    }),
  );

  await seedIfEmpty("testimonials", prisma.testimonial, () =>
    prisma.testimonial.createMany({
      data: DEFAULT_TESTIMONIALS.map((t) => ({
        name: t.name,
        role: t.role,
        company: t.company,
        companyLogo: t.companyLogo ?? null,
        image: t.image,
        quote: t.quote,
        rating: t.rating ?? null,
        order: t.order,
        status: "PUBLISHED" as const,
      })),
    }),
  );

  await seedIfEmpty("site settings", prisma.siteSetting, () =>
    prisma.siteSetting.createMany({
      data: Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value })),
    }),
  );

  console.log("Content seed complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
