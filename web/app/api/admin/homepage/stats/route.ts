import { revalidatePath } from "next/cache";
import { DEFAULT_STATS } from "@/lib/defaults";
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

const STAT_FIELDS = ["id", "value", "unit", "label", "order", "visible"] as const;
type Group = "trust" | "why";

function isGroup(value: unknown): value is Group {
  return value === "trust" || value === "why";
}

function isOrder(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 0 && value <= 1_000_000;
}

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const groupValue = new URL(request.url).searchParams.get("group");
  if (groupValue !== null && !isGroup(groupValue)) {
    return errorJson("Statistic group must be trust or why.", 400);
  }

  try {
    const [stats, total] = await Promise.all([
      prisma.homepageStat.findMany({
        where: groupValue ? { group: groupValue } : undefined,
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
      prisma.homepageStat.count(),
    ]);
    if (total === 0) {
      return successJson({
        stats: DEFAULT_STATS.filter(
          (stat) => !groupValue || stat.group === groupValue,
        ),
      });
    }
    return successJson({ stats });
  } catch (error) {
    console.error("admin homepage statistics read failed:", error);
    return errorJson("Could not load homepage statistics.", 500);
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (!hasOnlyKeys(parsed.value, ["group", "stats"])) {
    return errorJson("Request contains unsupported fields.", 400);
  }
  const { group, stats: submitted } = parsed.value;
  if (!isGroup(group) || !Array.isArray(submitted) || submitted.length > 100) {
    return errorJson("Provide a valid statistic group and statistics list.", 400);
  }

  const stats: Array<{
    id?: number;
    value: string;
    unit: string;
    label: string;
    order: number;
    visible: boolean;
  }> = [];
  const submittedIds = new Set<number>();

  for (const item of submitted) {
    if (!isRecord(item) || Object.keys(item).some((key) => !STAT_FIELDS.includes(key as (typeof STAT_FIELDS)[number]))) {
      return errorJson("Each statistic must contain only supported fields.", 400);
    }
    const { id, value, unit, label, order, visible } = item;
    if (
      (id !== undefined &&
        (typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0)) ||
      typeof value !== "string" ||
      !value.trim() ||
      value.length > 24 ||
      typeof unit !== "string" ||
      unit.length > 32 ||
      typeof label !== "string" ||
      !label.trim() ||
      label.length > 140 ||
      !isOrder(order) ||
      typeof visible !== "boolean" ||
      (typeof id === "number" && submittedIds.has(id))
    ) {
      return errorJson("A statistic has invalid, missing, or duplicate fields.", 400);
    }
    if (typeof id === "number") submittedIds.add(id);
    stats.push({
      ...(typeof id === "number" ? { id } : {}),
      value,
      unit,
      label,
      order,
      visible,
    });
  }

  try {
    const persistedStats = await prisma.$transaction(async (transaction) => {
      const total = await transaction.homepageStat.count();
      if (total === 0) {
        // Keep the unedited group’s visible fallback intact after the first save.
        await transaction.homepageStat.createMany({
          data: DEFAULT_STATS.filter((stat) => stat.group !== group).map(
            ({ group: fallbackGroup, value, unit, label, order, visible }) => ({
              group: fallbackGroup,
              value,
              unit,
              label,
              order,
              visible,
            }),
          ),
        });
      }

      const current = await transaction.homepageStat.findMany({
        where: { group },
        select: { id: true },
      });
      const currentIds = new Set(current.map((stat) => stat.id));
      if (stats.some((stat) => stat.id !== undefined && !currentIds.has(stat.id))) {
        throw new Error("Statistic id does not belong to the requested group.");
      }

      const saved = [];
      for (const stat of stats) {
        const { id, ...data } = stat;
        saved.push(
          id === undefined
            ? await transaction.homepageStat.create({
                data: { ...data, group },
                select: {
                  id: true,
                  group: true,
                  value: true,
                  unit: true,
                  label: true,
                  order: true,
                  visible: true,
                },
              })
            : await transaction.homepageStat.update({
                where: { id },
                data,
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
        );
      }
      const savedIds = saved.map((stat) => stat.id);
      await transaction.homepageStat.deleteMany({
        where: {
          group,
          ...(savedIds.length ? { id: { notIn: savedIds } } : {}),
        },
      });
      return saved;
    });

    revalidatePath("/");
    return successJson({ stats: persistedStats });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Statistic id does not belong to the requested group."
    ) {
      return errorJson("A statistic does not belong to the requested group.", 400);
    }
    console.error("admin homepage statistics save failed:", error);
    return errorJson("Could not save homepage statistics.", 500);
  }
}
