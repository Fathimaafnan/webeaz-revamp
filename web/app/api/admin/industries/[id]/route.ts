import { revalidatePath } from "next/cache";
import { errorJson, hasOnlyKeys, isPrismaUniqueError, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import type { ContentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const EDIT_FIELDS = ["name", "status", "order", "move"] as const;

function isStatus(value: unknown): value is ContentStatus {
  return (
    value === "DRAFT" ||
    value === "PUBLISHED" ||
    value === "ARCHIVED"
  );
}

async function readId(context: RouteContext): Promise<number | null> {
  const { id } = await context.params;
  if (!/^[1-9]\d*$/.test(id)) return null;
  const parsed = Number(id);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function isOrder(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value >= 0 && value <= 1_000_000;
}

async function ensureUniqueName(name: string, exceptId: number) {
  const industries = await prisma.industry.findMany({
    where: { id: { not: exceptId } },
    select: { name: true },
  });
  return !industries.some(
    (industry) => industry.name.toLowerCase() === name.toLowerCase(),
  );
}

export async function PUT(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const id = await readId(context);
  if (!id) return errorJson("Invalid industry id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;
  if (
    !Object.keys(body).length ||
    !hasOnlyKeys(body, EDIT_FIELDS) ||
    (body.move !== undefined && Object.keys(body).length !== 1)
  ) {
    return errorJson("Request contains missing or unsupported industry fields.", 400);
  }

  try {
    if (body.move !== undefined) {
      if (body.move !== "up" && body.move !== "down") {
        return errorJson("Move must be up or down.", 400);
      }
      const result = await prisma.$transaction(async (transaction) => {
        const rows = await transaction.industry.findMany({
          orderBy: [{ order: "asc" }, { id: "asc" }],
          select: { id: true, order: true },
        });
        const index = rows.findIndex((row) => row.id === id);
        if (index < 0) return null;
        const target = body.move === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= rows.length) return rows[index];
        const current = rows[index];
        const other = rows[target];
        await transaction.industry.update({
          where: { id: current.id },
          data: { order: other.order },
        });
        await transaction.industry.update({
          where: { id: other.id },
          data: { order: current.order },
        });
        return { ...current, order: other.order };
      });
      if (!result) return errorJson("Industry not found.", 404);
      revalidatePath("/");
      revalidatePath("/industries");
      return successJson({ industry: result });
    }

    const data: {
      name?: string;
      status?: ContentStatus;
      order?: number;
    } = {};
    if (body.name !== undefined) {
      if (typeof body.name !== "string") {
        return errorJson("Industry name must be a string.", 400);
      }
      const name = body.name.trim();
      if (!name || name.length > 80) {
        return errorJson("Industry name must be between 1 and 80 characters.", 400);
      }
      if (!(await ensureUniqueName(name, id))) {
        return errorJson("An industry with that name already exists.", 409);
      }
      data.name = name;
    }
    if (body.status !== undefined) {
      if (!isStatus(body.status)) {
        return errorJson("Status must be DRAFT, PUBLISHED, or ARCHIVED.", 400);
      }
      data.status = body.status;
    }
    if (body.order !== undefined) {
      if (!isOrder(body.order)) return errorJson("Display order is invalid.", 400);
      data.order = body.order;
    }

    const industry = await prisma.industry.update({
      where: { id },
      data,
      select: { id: true, name: true, order: true, status: true },
    });
    revalidatePath("/");
    revalidatePath("/industries");
    return successJson({ industry });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("An industry with that name already exists.", 409);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return errorJson("Industry not found.", 404);
    }
    console.error("admin industry update failed:", error);
    return errorJson("Could not update industry.", 500);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const id = await readId(context);
  if (!id) return errorJson("Invalid industry id.", 400);

  try {
    await prisma.industry.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/industries");
    return successJson({ id });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return errorJson("Industry not found.", 404);
    }
    console.error("admin industry deletion failed:", error);
    return errorJson("Could not delete industry.", 500);
  }
}
