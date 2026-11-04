import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { parseServicePayload } from "@/lib/cms";

/** POST /api/admin/services — create a service inside a category. */
export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const parsed = await parseServicePayload(body ?? {});
    if (parsed.error !== null) return badRequest(parsed.error);

    const clash = await prisma.service.findFirst({
      where: { categoryId: parsed.data.categoryId, slug: parsed.data.slug },
    });
    if (clash) return badRequest("A service with that slug already exists in this category.");

    const lowest = await prisma.service.aggregate({
      where: { categoryId: parsed.data.categoryId },
      _min: { order: true },
    });
    const service = await prisma.service.create({
      data: { ...parsed.data, order: (lowest._min.order ?? 0) - 10 },
    });

    revalidatePath("/", "layout");
    revalidatePath("/services");
    return Response.json({ ok: true, id: service.id });
  } catch (error) {
    console.error("services POST failed:", error);
    return serverError("Could not create the service.");
  }
}
