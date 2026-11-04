import "server-only";

import { prisma } from "@/lib/prisma";
import {
  DEFAULT_HOME,
  DEFAULT_SECTIONS,
  DEFAULT_SETTINGS,
  DEFAULT_STATS,
  DEFAULT_TESTIMONIALS,
  type HomeContent,
  type HomeSection,
  type HomeStat,
  type SiteSettings,
  type TestimonialItem,
} from "@/lib/defaults";
import { insights, type Insight } from "@/lib/insights";
import { industries as defaultIndustries } from "@/lib/industries";
import {
  serviceCategories as defaultServiceCategories,
  type Service,
  type ServiceCategory,
} from "@/lib/services";

/**
 * Public content accessors.
 *
 * Each function reads published rows from the CMS database and falls
 * back to the pre-CMS defaults when the table is empty or the database
 * cannot be reached. That guarantees three things at once:
 *
 *   1. published CMS content is what visitors see,
 *   2. an unseeded or unreachable database never blanks the site,
 *   3. existing copy is preserved exactly during migration.
 *
 * Every accessor swallows database errors on purpose — the public site
 * must stay up when PostgreSQL is down; the admin dashboard reports the
 * connection state instead.
 */

function sectionMap(rows: HomeSection[]): Map<string, HomeSection> {
  return new Map(rows.map((s) => [s.key, s]));
}

/** Merge DB sections over the defaults so a partially seeded table
 *  still renders every section in its published state. */
function mergeSections(rows: HomeSection[]): HomeSection[] {
  const byKey = sectionMap(rows);
  const merged = DEFAULT_SECTIONS.map((d) => byKey.get(d.key) ?? d);
  for (const row of rows) {
    if (!DEFAULT_SECTIONS.some((d) => d.key === row.key)) merged.push(row);
  }
  return merged.sort((a, b) => a.order - b.order);
}

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const row = await prisma.homepageContent.findFirst();
    if (row) {
      return {
        heroEyebrow: row.heroEyebrow,
        heroTitle: row.heroTitle,
        heroDescription: row.heroDescription,
        heroPrimaryLabel: row.heroPrimaryLabel,
        heroPrimaryHref: row.heroPrimaryHref,
        heroSecondaryLabel: row.heroSecondaryLabel,
        heroSecondaryHref: row.heroSecondaryHref,
        heroImage: row.heroImage ?? "",
        ctaEyebrow: row.ctaEyebrow,
        ctaTitle: row.ctaTitle,
        ctaDescription: row.ctaDescription,
        ctaLabel: row.ctaLabel,
        ctaHref: row.ctaHref,
      };
    }
  } catch {
    // database unavailable — fall through to defaults
  }
  return DEFAULT_HOME;
}

export async function getHomeSections(): Promise<HomeSection[]> {
  try {
    const rows = await prisma.homepageSection.findMany({ orderBy: { order: "asc" } });
    if (rows.length > 0) return mergeSections(rows);
  } catch {
    // fall through
  }
  return DEFAULT_SECTIONS;
}

export async function getHomeStats(group?: "trust" | "why"): Promise<HomeStat[]> {
  try {
    const rows = await prisma.homepageStat.findMany({
      where: group ? { group } : undefined,
      orderBy: { order: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        group: r.group as "trust" | "why",
        value: r.value,
        unit: r.unit,
        label: r.label,
        order: r.order,
        visible: r.visible,
      })).filter((stat) => stat.visible);
    }
  } catch {
    // fall through
  }
  return DEFAULT_STATS.filter((s) => (group ? s.group === group : true));
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const [rows, total] = await Promise.all([
      prisma.testimonial.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
      }),
      prisma.testimonial.count(),
    ]);
    if (total > 0) {
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        company: r.company,
        companyLogo: r.companyLogo,
        image: r.image,
        quote: r.quote,
        rating: r.rating,
        order: r.order,
        visible: true,
      }));
    }
  } catch {
    // fall through
  }
  return DEFAULT_TESTIMONIALS;
}

export type PublishedBlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  author: string;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

function toPublishedPost(row: {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  author: string;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
}): PublishedBlogPost {
  return { ...row };
}

export async function getPublishedPosts(): Promise<PublishedBlogPost[]> {
  try {
    const [rows, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      }),
      prisma.blogPost.count(),
    ]);
    if (total > 0) return rows.map(toPublishedPost);
  } catch {
    // fall through
  }
  // Fallback keeps the pre-CMS insights page rendering identically.
  return insights.map((i, idx) => ({
    id: -(idx + 1),
    slug: "",
    title: i.title,
    excerpt: i.description,
    content: "",
    category: i.category,
    coverImage: i.image ?? null,
    author: "WebEaz Technologies",
    publishedAt: null,
    seoTitle: null,
    seoDescription: null,
  }));
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<PublishedBlogPost | null> {
  if (!slug) return null;
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    if (row && row.status === "PUBLISHED") return toPublishedPost(row);
    return null;
  } catch {
    return null;
  }
}

/** Fallback shape so /insights can keep rendering when the DB is down. */
export type InsightFallback = Insight;

export async function getIndustries(): Promise<string[]> {
  try {
    const [rows, total] = await Promise.all([
      prisma.industry.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
      }),
      prisma.industry.count(),
    ]);
    if (total > 0) return rows.map((r) => r.name);
  } catch {
    // fall through
  }
  return defaultIndustries;
}

export type ServiceTree = {
  categories: ServiceCategory[];
  allServices: Array<{ category: ServiceCategory; service: Service }>;
};

function mapCategory(row: {
  slug: string;
  name: string;
  num: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  order: number;
  services: Array<{
    slug: string;
    name: string;
    summary: string;
    icon: string;
    image: string | null;
    overview: string;
    provides: string[];
    capabilities: string[];
    benefits: string[];
    useCases: string[];
    technologies: string[];
    order: number;
  }>;
}): ServiceCategory {
  return {
    slug: row.slug,
    name: row.name,
    num: row.num,
    tagline: row.tagline,
    description: row.description,
    icon: row.icon as ServiceCategory["icon"],
    accent: row.accent as ServiceCategory["accent"],
    services: row.services.map((s) => ({
      slug: s.slug,
      name: s.name,
      summary: s.summary,
      icon: s.icon as Service["icon"],
      overview: s.overview,
      provides: s.provides,
      capabilities: s.capabilities,
      benefits: s.benefits,
      useCases: s.useCases,
      technologies: s.technologies.length > 0 ? s.technologies : undefined,
      image: s.image ?? undefined,
    })),
  };
}

/**
 * Service tree for the public site: published categories and their
 * published services, ordered exactly like the static data. Falls back
 * to `lib/services.ts` when the database has no rows or is unreachable.
 */
export async function getServiceTree(): Promise<ServiceTree> {
  try {
    const [rows, total] = await Promise.all([
      prisma.serviceCategory.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
        include: {
          services: {
            where: { status: "PUBLISHED" },
            orderBy: { order: "asc" },
          },
        },
      }),
      prisma.serviceCategory.count(),
    ]);
    if (total > 0) {
      const categories = rows.map(mapCategory);
      return {
        categories,
        allServices: categories.flatMap((category) =>
          category.services.map((service) => ({ category, service })),
        ),
      };
    }
  } catch {
    // fall through
  }
  return {
    categories: defaultServiceCategories,
    allServices: defaultServiceCategories.flatMap((category) =>
      category.services.map((service) => ({ category, service })),
    ),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    if (rows.length > 0) {
      const map = new Map(rows.map((r) => [r.key, r.value]));
      return {
        siteName: map.get("siteName") ?? DEFAULT_SETTINGS.siteName,
        siteDescription: map.get("siteDescription") ?? DEFAULT_SETTINGS.siteDescription,
        footerTagline: map.get("footerTagline") ?? DEFAULT_SETTINGS.footerTagline,
        footerBlurb: map.get("footerBlurb") ?? DEFAULT_SETTINGS.footerBlurb,
        footerNote: map.get("footerNote") ?? DEFAULT_SETTINGS.footerNote,
      };
    }
  } catch {
    // fall through
  }
  return DEFAULT_SETTINGS;
}
