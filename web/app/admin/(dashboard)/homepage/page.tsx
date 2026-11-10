import HomepageEditor from "@/components/admin/HomepageEditor";
import {
  DEFAULT_HOMEPAGE_BLOG_SETTINGS,
  DEFAULT_HOME,
  DEFAULT_SECTIONS,
  DEFAULT_STATS,
  type HomepageBlogSettings,
} from "@/lib/defaults";
import { getHomepageBlogSettings } from "@/lib/content";
import { industries as builtInIndustries } from "@/lib/industries";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomepageAdminPage() {
  let canSave = false;
  let loadError: string | null = null;
  let content = DEFAULT_HOME;
  let sections = DEFAULT_SECTIONS;
  let stats = DEFAULT_STATS;
  let industries: Array<{
    id: number;
    name: string;
    order: number;
    status: string;
  }> = [];
  let blogSettings: HomepageBlogSettings = DEFAULT_HOMEPAGE_BLOG_SETTINGS;
  let eligibleBlogs: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    coverImage: string | null;
    publishedAt: string | null;
  }> = [];

  try {
    const [contentRow, sectionRows, statRows, industryRows] = await Promise.all([
      prisma.homepageContent.findFirst({
        select: {
          heroEyebrow: true,
          heroTitle: true,
          heroDescription: true,
          heroPrimaryLabel: true,
          heroPrimaryHref: true,
          heroSecondaryLabel: true,
          heroSecondaryHref: true,
          heroImage: true,
          ctaEyebrow: true,
          ctaTitle: true,
          ctaDescription: true,
          ctaLabel: true,
          ctaHref: true,
        },
      }),
      prisma.homepageSection.findMany({
        orderBy: [{ order: "asc" }, { key: "asc" }],
        select: {
          key: true,
          eyebrow: true,
          title: true,
          description: true,
          visible: true,
          order: true,
        },
      }),
      prisma.homepageStat.findMany({
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: {
          id: true,
          group: true,
          value: true,
          unit: true,
          label: true,
          order: true,
          visible: true,
        },
      }),
      prisma.industry.findMany({
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: { id: true, name: true, order: true, status: true },
      }),
    ]);

    if (contentRow) {
      content = { ...contentRow, heroImage: contentRow.heroImage ?? "" };
    }

    const sectionsByKey = new Map(sectionRows.map((section) => [section.key, section]));
    const mergedSections = DEFAULT_SECTIONS.map(
      (section) => sectionsByKey.get(section.key) ?? section,
    );
    for (const section of sectionRows) {
      if (!DEFAULT_SECTIONS.some((fallback) => fallback.key === section.key)) {
        mergedSections.push(section);
      }
    }
    sections = mergedSections.sort(
      (a, b) => a.order - b.order || a.key.localeCompare(b.key),
    );

    if (statRows.length > 0) {
      stats = statRows.flatMap((stat) =>
        stat.group === "trust" || stat.group === "why"
          ? [{ ...stat, group: stat.group }]
          : [],
      );
    }
    industries = industryRows;
    blogSettings = await getHomepageBlogSettings();
    const eligibleRows = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", reviewStage: "APPROVED" },
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
      select: { id: true, slug: true, title: true, excerpt: true, category: true, coverImage: true, publishedAt: true },
    });
    eligibleBlogs = eligibleRows.map((r) => ({
      ...r,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
    }));
    canSave = true;
  } catch (error) {
    console.error("admin homepage content load failed:", error);
    loadError =
      "The database is currently unavailable. You can review fallback content, but saving is disabled.";
  }

  const groupedStats = {
    trust: stats.filter((stat) => stat.group === "trust"),
    why: stats.filter((stat) => stat.group === "why"),
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          Content Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Homepage CMS
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
          Manage existing homepage content and industries. Saved changes appear
          on the public site without changing its layout or design.
        </p>
      </header>

      {loadError ? (
        <p
          role="alert"
          className="rounded-xl border border-amber-300/20 bg-amber-500/5 p-4 text-sm text-amber-100"
        >
          {loadError}
        </p>
      ) : null}

      <HomepageEditor
        initialContent={content}
        initialSections={sections}
        initialStats={groupedStats}
        initialIndustries={industries}
        builtInIndustries={builtInIndustries}
        initialBlogSettings={blogSettings}
        initialEligibleBlogs={eligibleBlogs}
        canSave={canSave}
      />
    </div>
  );
}
