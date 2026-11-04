import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";

type Params = { params: Promise<{ id: string }> };

/** PUT /api/admin/industries/[id] — rename, reorder or change status. */
export async function PUT(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid industry id.");

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body?.name !== undefined) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name) return badRequest("Industry name is required.");
      data.name = name;
    }
    if (body?.order !== undefined) {
      if (typeof body.order !== "number") return badRequest("Order must be a number.");
      data.order = body.order;
    }
    if (body?.status !== undefined) {
      if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(body.status)) {
        return badRequest("Invalid status.");
      }
      data.status = body.status;
    }
    if (Object.keys(data).length === 0) return badRequest("Nothing to update.");

    const updated = await prisma.industry.updateMany({ where: { id }, data });
    if (updated.count === 0) return badRequest("Industry not found.");

    revalidatePath("/", "layout");
    revalidatePath("/industries");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("industries PUT failed:", error);
    return serverError("Could not update the industry.");
  }
}

/** DELETE /api/admin/industries/[id] — permanent removal (confirmed in UI). */
export async function DELETE(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid industry id.");

    const deleted = await prisma.industry.deleteMany({ where: { id } });
    if (deleted.count === 0) return badRequest("Industry not found.");

    revalidatePath("/", "layout");
    revalidatePath("/industries");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("industries DELETE failed:", error);
    return serverError("Could not delete the industry.");
  }
}
