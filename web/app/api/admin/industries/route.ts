import { revalidatePath } from "next/cache";
import { errorJson, isPrismaUniqueError, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const industries = await prisma.industry.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, name: true, order: true, status: true },
    });
    return successJson({ industries });
  } catch (error) {
    console.error("admin industries read failed:", error);
    return errorJson("Could not load industries.", 500);
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (
    Object.keys(parsed.value).some((key) => key !== "name") ||
    typeof parsed.value.name !== "string"
  ) {
    return errorJson("Provide an industry name.", 400);
  }
  const name = parsed.value.name.trim();
  if (!name || name.length > 80) {
    return errorJson("Industry name must be between 1 and 80 characters.", 400);
  }

  try {
    const industry = await prisma.$transaction(async (transaction) => {
      const existing = await transaction.industry.findMany({
        select: { name: true },
      });
      if (existing.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
        return null;
      }

      const last = await transaction.industry.findFirst({
        orderBy: [{ order: "desc" }, { id: "desc" }],
        select: { order: true },
      });
      return transaction.industry.create({
        data: {
          name,
          order: (last?.order ?? 0) + 10,
          status: "DRAFT",
        },
        select: { id: true, name: true, order: true, status: true },
      });
    });

    if (!industry) return errorJson("An industry with that name already exists.", 409);
    revalidatePath("/");
    revalidatePath("/industries");
    return successJson({ industry }, 201);
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("An industry with that name already exists.", 409);
    }
    console.error("admin industry creation failed:", error);
    return errorJson("Could not create industry.", 500);
  }
}
