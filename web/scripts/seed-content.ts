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
import {
  DEFAULT_CAPABILITIES,
  DEFAULT_CASE_STUDIES,
  DEFAULT_CLIENT_LOGOS,
  DEFAULT_FOOTER_LINKS,
  DEFAULT_FAQS,
  DEFAULT_FOOTER_SETTINGS,
  DEFAULT_OFFICES,
  DEFAULT_PARTNER_LOGOS,
  DEFAULT_PRODUCTS,
} from "../lib/fallback-content";

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

  // --- New homepage collections (additive; seeded only when empty) ---
  await seedIfEmpty("office locations", prisma.officeLocation, () =>
    prisma.officeLocation.createMany({
      data: DEFAULT_OFFICES.map((o) => ({ ...o, status: "PUBLISHED" as const })),
    }),
  );

  await seedIfEmpty("products", prisma.product, () =>
    prisma.product.createMany({
      data: DEFAULT_PRODUCTS.map((p) => ({ ...p, status: "PUBLISHED" as const })),
    }),
  );

  await seedIfEmpty("partner logos", prisma.homepageLogo, () =>
    prisma.homepageLogo.createMany({
      data: DEFAULT_PARTNER_LOGOS.map((l) => ({
        group: "PARTNER" as const,
        name: l.name,
        alt: l.alt,
        imageUrl: l.imageUrl,
        href: l.href ?? null,
        order: l.order,
        status: "PUBLISHED" as const,
      })),
    }),
  );

  // Logos are shared by two groups, so seed clients per group only.
  const clientCount = await prisma.homepageLogo.count({ where: { group: "CLIENT" } });
  if (clientCount === 0) {
    await prisma.homepageLogo.createMany({
      data: DEFAULT_CLIENT_LOGOS.map((l) => ({
        group: "CLIENT" as const,
        name: l.name,
        alt: l.alt,
        imageUrl: l.imageUrl,
        href: l.href ?? null,
        order: l.order,
        status: "PUBLISHED" as const,
      })),
    });
    console.log("seeded  client logos");
  } else {
    console.log(`skip    client logos (${clientCount} rows already present)`);
  }

  const capabilityCount = await prisma.capabilityCard.count();
  if (capabilityCount === 0) {
    await prisma.capabilityCard.createMany({
      data: DEFAULT_CAPABILITIES.map((c) => ({
        ...c,
        iconKey: c.slug,
        status: "PUBLISHED" as const,
      })),
    });
    console.log("seeded  capability cards");
  } else {
    console.log(`skip    capability cards (${capabilityCount} rows already present)`);
  }

  await seedIfEmpty("case studies", prisma.caseStudy, () =>
    prisma.caseStudy.createMany({
      data: DEFAULT_CASE_STUDIES.map((c) => ({ ...c, status: "PUBLISHED" as const })),
    }),
  );

  const footerLinkCount = await prisma.footerLink.count();
  if (footerLinkCount === 0) {
    await prisma.footerLink.createMany({
      data: DEFAULT_FOOTER_LINKS.map((l) => ({ ...l, status: "PUBLISHED" as const })),
    });
    console.log("seeded  footer links");
  } else {
    console.log(`skip    footer links (${footerLinkCount} rows already present)`);
  }

  await seedIfEmpty("faq items", prisma.faq, () =>
    prisma.faq.createMany({
      data: DEFAULT_FAQS.map((f) => ({
        question: f.question,
        answer: f.answer,
        order: f.order,
        status: "PUBLISHED" as const,
      })),
    }),
  );

  // Footer settings: upsert only keys that are missing, never overwrite edits.
  for (const [key, value] of Object.entries(DEFAULT_FOOTER_SETTINGS)) {
    const existing = await prisma.siteSetting.findUnique({ where: { key } });
    if (!existing) {
      await prisma.siteSetting.create({ data: { key, value } });
      console.log(`seeded  siteSetting ${key}`);
    }
  }

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
