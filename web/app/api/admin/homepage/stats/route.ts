import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";

/**
 * PUT /api/admin/homepage/stats
 * Body: { group: "trust" | "why", stats: [{ id?, value, unit, label,
 * order, visible }] }
 *
 * Replaces the whole group: rows that are sent are created or updated,
 * rows that are absent are deleted, so removing a stat in the UI really
 * removes it from the page.
 */
export async function PUT(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const group = body?.group;
    const stats = Array.isArray(body?.stats) ? body.stats : null;

    if (group !== "trust" && group !== "why") {
      return badRequest('Group must be "trust" or "why".');
    }
    if (!stats) return badRequest("Expected { group, stats: [...] }.");
    if (stats.length > 20) return badRequest("Too many statistics.");

    const keptIds: number[] = [];

    for (const stat of stats) {
      if (!stat || typeof stat !== "object") return badRequest("Invalid statistic.");
      if (typeof stat.value !== "string" || !stat.value.trim()) {
        return badRequest("Every statistic needs a value.");
      }
      if (typeof stat.label !== "string" || !stat.label.trim()) {
        return badRequest("Every statistic needs a label.");
      }
      const unit = stat.unit === undefined ? "" : stat.unit;
      if (typeof unit !== "string") return badRequest("Unit must be text.");
      if (typeof stat.order !== "number" || typeof stat.visible !== "boolean") {
        return badRequest("Statistic order/visibility is invalid.");
      }

      const data = {
        group,
        value: stat.value.trim(),
        unit: unit.trim(),
        label: stat.label.trim(),
        order: stat.order,
        visible: stat.visible,
      };

      if (typeof stat.id === "number") {
        const updated = await prisma.homepageStat.updateMany({
          where: { id: stat.id, group },
          data,
        });
        if (updated.count === 0) return badRequest("Statistic no longer exists.");
        keptIds.push(stat.id);
      } else {
        const created = await prisma.homepageStat.create({ data });
        keptIds.push(created.id);
      }
    }

    await prisma.homepageStat.deleteMany({
      where: { group, id: { notIn: keptIds } },
    });

    revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("stats PUT failed:", error);
    return serverError("Could not save statistics.");
  }
}
