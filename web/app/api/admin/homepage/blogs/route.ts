import { revalidatePath } from "next/cache";
import { HOMEPAGE_BLOG_SETTING_KEYS } from "@/lib/defaults";
import { errorJson, hasOnlyKeys, isRecord, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getHomepageBlogSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

const TX_OPTIONS = { maxWait: 20_000, timeout: 60_000 } as const;

function isTxConflict(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2034";
}

function isInternalPath(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && value.length <= 200;
}

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const [settings, eligible] = await Promise.all([
      getHomepageBlogSettings(),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED", reviewStage: "APPROVED" },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        select: { id: true, slug: true, title: true, excerpt: true, category: true, coverImage: true, publishedAt: true, status: true, reviewStage: true },
      }),
    ]);
    return successJson({ settings, eligible });
  } catch (error) {
    console.error("admin homepage blogs read failed:", error);
    return errorJson("Could not load homepage blog settings.", 500);
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (!hasOnlyKeys(parsed.value, ["settings"])) {
    return errorJson("Request contains unsupported fields.", 400);
  }
  const settings = parsed.value.settings;
  if (!isRecord(settings)) return errorJson("Settings must be an object.", 400);

  const ALLOWED = ["exploreLabel", "exploreHref", "featuredIds", "ctaVisible", "ctaHeading", "ctaDescription", "ctaLabel", "ctaHref"] as const;
  if (Object.keys(settings).some((k) => !ALLOWED.includes(k as (typeof ALLOWED)[number]))) {
    return errorJson("Settings contain unsupported fields.", 400);
  }

  const { exploreLabel, exploreHref, featuredIds, ctaVisible, ctaHeading, ctaDescription, ctaLabel, ctaHref } = settings;

  if (typeof exploreLabel !== "string" || !exploreLabel.trim() || exploreLabel.length > 80) {
    return errorJson("Explore label is required (max 80 characters).", 400);
  }
  if (!isInternalPath(exploreHref)) {
    return errorJson("Explore destination must be an internal path starting with /.", 400);
  }
  if (!Array.isArray(featuredIds) || featuredIds.length > 3 || !featuredIds.every((v) => Number.isInteger(v) && typeof v === "number" && v > 0)) {
    return errorJson("Featured blogs must be an array of up to 3 valid blog IDs.", 400);
  }
  if (new Set(featuredIds).size !== featuredIds.length) {
    return errorJson("Featured blogs contain duplicates.", 400);
  }
  if (typeof ctaVisible !== "boolean") {
    return errorJson("CTA visibility must be true or false.", 400);
  }
  if (typeof ctaHeading !== "string" || !ctaHeading.trim() || ctaHeading.length > 200) {
    return errorJson("CTA heading is required (max 200 characters).", 400);
  }
  if (typeof ctaDescription !== "string" || ctaDescription.length > 600) {
    return errorJson("CTA description is too long (max 600 characters).", 400);
  }
  if (typeof ctaLabel !== "string" || !ctaLabel.trim() || ctaLabel.length > 80) {
    return errorJson("CTA button label is required (max 80 characters).", 400);
  }
  if (!isInternalPath(ctaHref)) {
    return errorJson("CTA destination must be an internal path starting with /.", 400);
  }

  try {
    if (featuredIds.length > 0) {
      const eligible = await prisma.blogPost.findMany({
        where: { id: { in: featuredIds }, status: "PUBLISHED", reviewStage: "APPROVED" },
        select: { id: true },
      });
      if (eligible.length !== featuredIds.length) {
        return errorJson("One or more selected blogs are not eligible (must be PUBLISHED and APPROVED).", 400);
      }
    }

    const rows = [
      { key: HOMEPAGE_BLOG_SETTING_KEYS.exploreLabel, value: exploreLabel.trim() },
      { key: HOMEPAGE_BLOG_SETTING_KEYS.exploreHref, value: exploreHref },
      { key: HOMEPAGE_BLOG_SETTING_KEYS.featuredIds, value: JSON.stringify(featuredIds) },
      { key: HOMEPAGE_BLOG_SETTING_KEYS.ctaVisible, value: ctaVisible ? "true" : "false" },
      { key: HOMEPAGE_BLOG_SETTING_KEYS.ctaHeading, value: ctaHeading.trim() },
      { key: HOMEPAGE_BLOG_SETTING_KEYS.ctaDescription, value: ctaDescription },
      { key: HOMEPAGE_BLOG_SETTING_KEYS.ctaLabel, value: ctaLabel.trim() },
      { key: HOMEPAGE_BLOG_SETTING_KEYS.ctaHref, value: ctaHref },
    ];

    const run = () =>
      prisma.$transaction(
        async (tx) => {
          for (const row of rows) {
            await tx.siteSetting.upsert({ where: { key: row.key }, create: row, update: { value: row.value } });
          }
        },
        TX_OPTIONS,
      );

    try {
      await run();
    } catch (error) {
      if (!isTxConflict(error)) throw error;
      await run();
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/insights");
    return successJson({ updated: true });
  } catch (error) {
    console.error("admin homepage blogs save failed:", error);
    return errorJson("Could not save homepage blog settings.", 500);
  }
}
