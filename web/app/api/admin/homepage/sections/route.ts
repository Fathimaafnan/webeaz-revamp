import { revalidatePath } from "next/cache";
import { DEFAULT_SECTIONS } from "@/lib/defaults";
import {
  errorJson,
  hasOnlyKeys,
  isRecord,
  readJsonRecord,
  successJson,
} from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SECTION_FIELDS = [
  "key",
  "eyebrow",
  "title",
  "description",
  "visible",
  "order",
] as const;
const TEXT_LIMITS = { eyebrow: 140, title: 200, description: 600 };

/**
 * Neon (pooled) can take several seconds to acquire a connection on a cold
 * request; the default 2s acquisition / 5s execution limits roll back
 * legitimate saves. Give the interactive transaction realistic headroom.
 */
const TX_OPTIONS = { maxWait: 20_000, timeout: 60_000 } as const;

/** Prisma reports a conflicting/rolled-back transaction with this code. */
function isTransactionConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "P2034"
  );
}

function isOrder(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 0 && value <= 1_000_000;
}

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: [{ order: "asc" }, { key: "asc" }],
      select: {
        key: true,
        eyebrow: true,
        title: true,
        description: true,
        visible: true,
        order: true,
        updatedAt: true,
      },
    });
    if (sections.length === 0) {
      return successJson({ sections: DEFAULT_SECTIONS });
    }

    const sectionByKey = new Map(sections.map((section) => [section.key, section]));
    const merged = DEFAULT_SECTIONS.map(
      (section) => sectionByKey.get(section.key) ?? section,
    );
    for (const section of sections) {
      if (!DEFAULT_SECTIONS.some((fallback) => fallback.key === section.key)) {
        merged.push(section);
      }
    }
    merged.sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
    return successJson({ sections: merged });
  } catch (error) {
    console.error("admin homepage sections read failed:", error);
    return errorJson("Could not load homepage sections.", 500);
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (!hasOnlyKeys(parsed.value, ["sections"])) {
    return errorJson("Request contains unsupported fields.", 400);
  }
  const submitted = parsed.value.sections;
  if (
    !Array.isArray(submitted) ||
    submitted.length === 0 ||
    submitted.length > 100
  ) {
    return errorJson("At least one existing homepage section is required.", 400);
  }

  const sections: Array<{
    key: string;
    eyebrow: string;
    title: string;
    description: string;
    visible: boolean;
    order: number;
  }> = [];
  const keys = new Set<string>();

  for (const item of submitted) {
    if (!isRecord(item) || Object.keys(item).some((key) => !SECTION_FIELDS.includes(key as (typeof SECTION_FIELDS)[number]))) {
      return errorJson("Each section must contain only supported fields.", 400);
    }

    const { key, eyebrow, title, description, visible, order } = item;
    if (
      typeof key !== "string" ||
      typeof eyebrow !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof visible !== "boolean" ||
      !isOrder(order) ||
      !key.trim() ||
      !title.trim() ||
      eyebrow.length > TEXT_LIMITS.eyebrow ||
      title.length > TEXT_LIMITS.title ||
      description.length > TEXT_LIMITS.description ||
      keys.has(key)
    ) {
      return errorJson("A section has invalid, missing, or duplicate fields.", 400);
    }
    keys.add(key);
    sections.push({ key, eyebrow, title, description, visible, order });
  }

  try {
    const existing = await prisma.homepageSection.findMany({
      select: { key: true },
    });
    const allowedKeys = new Set([
      ...DEFAULT_SECTIONS.map((section) => section.key),
      ...existing.map((section) => section.key),
    ]);
    if (sections.some((section) => !allowedKeys.has(section.key))) {
      return errorJson("Unknown homepage section key.", 400);
    }

    const runTransaction = () =>
      prisma.$transaction(async (transaction) => {
        for (const section of sections) {
          await transaction.homepageSection.upsert({
            where: { key: section.key },
            create: section,
            update: {
              eyebrow: section.eyebrow,
              title: section.title,
              description: section.description,
              visible: section.visible,
              order: section.order,
            },
          });
        }

        const finalCta = sections.find((section) => section.key === "final-cta");
        if (finalCta) {
          // The public CTA reads its title and description from this section record.
          const ctaData = {
            ctaEyebrow: finalCta.eyebrow,
            ctaTitle: finalCta.title,
            ctaDescription: finalCta.description,
          };
          const updated = await transaction.homepageContent.updateMany({
            data: ctaData,
          });
          if (updated.count === 0) {
            await transaction.homepageContent.create({ data: ctaData });
          }
        }
      }, TX_OPTIONS);

    try {
      await runTransaction();
    } catch (error) {
      // Pooled connections can surface a transient write conflict; retry once.
      if (!isTransactionConflict(error)) throw error;
      await runTransaction();
    }

    revalidatePath("/");
    return successJson({ updated: sections.length });
  } catch (error) {
    console.error("admin homepage sections save failed:", error);
    const code =
      error && typeof error === "object" && (error as { code?: unknown }).code
        ? String((error as { code?: unknown }).code)
        : "UNKNOWN";
    return errorJson(
      `Could not save homepage sections (database error ${code}). Please try again.`,
      500,
    );
  }
}
