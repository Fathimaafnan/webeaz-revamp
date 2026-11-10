import { revalidatePath } from "next/cache";
import { industries as defaultIndustries } from "@/lib/industries";
import { errorJson, successJson, isPrismaUniqueError } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/industries/import
 *
 * One-time import of the built-in industry list (defined in lib/industries.ts,
 * shown on the public site before the CMS took over) into the Industry table.
 *
 * Safety contract:
 * - Insert-only. Existing rows are never updated or deleted.
 * - Duplicate names are skipped, matched case-insensitively after trimming.
 * - New rows are created as PUBLISHED so the public appearance is unchanged.
 * - Display order follows the built-in list (10, 20, 30, ...) when those
 *   slots are free; otherwise appended after the current highest order.
 * - Idempotent: running it again creates nothing new.
 */
export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const existing = await transaction.industry.findMany({
        select: { name: true, order: true },
      });
      const existingNames = new Set(
        existing.map((row) => row.name.trim().toLowerCase()),
      );
      const usedOrders = new Set(existing.map((row) => row.order));
      let highestOrder = existing.reduce(
        (max, row) => Math.max(max, row.order),
        0,
      );

      const created: string[] = [];
      for (const [index, name] of defaultIndustries.entries()) {
        if (existingNames.has(name.trim().toLowerCase())) continue;

        const preferred = (index + 1) * 10;
        let order = preferred;
        if (usedOrders.has(order)) {
          highestOrder += 10;
          order = highestOrder;
        }
        usedOrders.add(order);

        await transaction.industry.create({
          data: { name, order, status: "PUBLISHED" },
        });
        created.push(name);
      }

      return { created, skipped: defaultIndustries.length - created.length };
    });

    revalidatePath("/");
    revalidatePath("/industries");
    return successJson({ created: result.created.length, skipped: result.skipped });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("An industry with one of those names already exists.", 409);
    }
    console.error("admin industry import failed:", error);
    return errorJson("Could not import built-in industries.", 500);
  }
}
