import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_HOME, DEFAULT_SECTIONS, DEFAULT_STATS } from "@/lib/defaults";
import HomepageEditor from "@/components/admin/HomepageEditor";

import type { HomeStat } from "@/lib/defaults";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  const user = await getAdmin();
  if (!user) return null;

  let home = DEFAULT_HOME;
  let sections = DEFAULT_SECTIONS;
  let stats: { trust: HomeStat[]; why: HomeStat[] } = { trust: [], why: [] };
  let industries: Array<{ id: number; name: string; order: number; status: string }> = [];
  let media: Array<{ id: number; url: string; originalName: string; alt: string }> = [];
  let dbOk = false;

  try {
    const [homeRow, sectionRows, statRows, industryRows, mediaRows] = await Promise.all([
      prisma.homepageContent.findFirst(),
      prisma.homepageSection.findMany({ orderBy: { order: "asc" } }),
      prisma.homepageStat.findMany({ orderBy: { order: "asc" } }),
      prisma.industry.findMany({ orderBy: { order: "asc" } }),
      prisma.mediaAsset.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: { id: true, url: true, originalName: true, alt: true },
      }),
    ]);
    dbOk = true;

    if (homeRow) {
      const { id: _id, updatedAt: _u, ...rest } = homeRow;
      home = { ...DEFAULT_HOME, ...rest, heroImage: homeRow.heroImage ?? "" };
    }

    if (sectionRows.length > 0) {
      const byKey = new Map(sectionRows.map((s) => [s.key, s]));
      sections = DEFAULT_SECTIONS.map(
        (d) =>
          byKey.get(d.key) ?? {
            key: d.key,
            eyebrow: d.eyebrow,
            title: d.title,
            description: d.description,
            visible: d.visible,
            order: d.order,
          },
      ).sort((a, b) => a.order - b.order);
    } else {
      sections = DEFAULT_SECTIONS;
    }

    stats = {
      trust: statRows
        .filter((s) => s.group === "trust")
        .map((s) => ({
          id: s.id,
          group: "trust" as const,
          value: s.value,
          unit: s.unit,
          label: s.label,
          order: s.order,
          visible: s.visible,
        })),
      why: statRows
        .filter((s) => s.group === "why")
        .map((s) => ({
          id: s.id,
          group: "why" as const,
          value: s.value,
          unit: s.unit,
          label: s.label,
          order: s.order,
          visible: s.visible,
        })),
    };

    // If nothing has been seeded yet the editors still need rows to
    // work with, so hand the defaults over as unsaved drafts (no id,
    // so the first save creates them in the database).
    if (statRows.length === 0) {
      stats = {
        trust: DEFAULT_STATS.filter((s) => s.group === "trust").map((s) => ({ ...s })),
        why: DEFAULT_STATS.filter((s) => s.group === "why").map((s) => ({ ...s })),
      };
    }

    industries = industryRows.map((i) => ({
      id: i.id,
      name: i.name,
      order: i.order,
      status: i.status,
    }));
    media = mediaRows;
  } catch {
    dbOk = false;
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-blue-light">
          Homepage management
        </p>
        <h1 className="text-3xl font-bold text-white">Homepage content</h1>
        <p className="text-sm text-white/70">
          Hero, section headings, statistics, industries and visibility. Published
          changes appear on the homepage immediately.
        </p>
        {!dbOk ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            The database is unreachable, so changes cannot be saved right now.
          </p>
        ) : null}
      </div>

      <HomepageEditor
        initialHome={home}
        initialSections={sections}
        initialStats={stats}
        initialIndustries={industries}
        initialMedia={media}
        canSave={dbOk}
      />
    </>
  );
}
