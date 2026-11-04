import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { parseServicePayload } from "@/lib/cms";

type Params = { params: Promise<{ id: string }> };

/** PUT /api/admin/services/[id] — edit a service (content, category, status). */
export async function PUT(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid service id.");

    const body = await request.json();
    const parsed = await parseServicePayload(body ?? {});
    if (parsed.error !== null) return badRequest(parsed.error);

    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) return badRequest("Service not found.");

    const clash = await prisma.service.findFirst({
      where: {
        categoryId: parsed.data.categoryId,
        slug: parsed.data.slug,
        id: { not: id },
      },
    });
    if (clash) return badRequest("Another service in this category already uses that slug.");

    await prisma.service.update({ where: { id }, data: parsed.data });

    revalidatePath("/", "layout");
    revalidatePath("/services");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("services PUT failed:", error);
    return serverError("Could not update the service.");
  }
}

/** DELETE /api/admin/services/[id] — permanent removal (confirmed in UI). */
export async function DELETE(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid service id.");

    const deleted = await prisma.service.deleteMany({ where: { id } });
    if (deleted.count === 0) return badRequest("Service not found.");

    revalidatePath("/", "layout");
    revalidatePath("/services");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("services DELETE failed:", error);
    return serverError("Could not delete the service.");
  }
}
