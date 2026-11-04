import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";

/** POST /api/admin/industries — add an industry to the published list. */
export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    if (!name) return badRequest("Industry name is required.");
    if (name.length > 80) return badRequest("Industry name is too long.");

    const existing = await prisma.industry.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existing) return badRequest("That industry already exists.");

    const lowest = await prisma.industry.aggregate({ _min: { order: true } });
    const industry = await prisma.industry.create({
      data: { name, order: (lowest._min.order ?? 0) - 10 },
    });

    revalidatePath("/", "layout");
    revalidatePath("/industries");
    return Response.json({ ok: true, id: industry.id });
  } catch (error) {
    console.error("industries POST failed:", error);
    return serverError("Could not add the industry.");
  }
}
