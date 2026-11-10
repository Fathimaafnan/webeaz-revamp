import { revalidateServiceRoutes } from "@/lib/service-revalidation";
import { parseServiceCategoryPayload } from "@/lib/cms";
import {
  errorJson,
  hasOnlyKeys,
  isPrismaTransactionConflict,
  isPrismaUniqueError,
  readJsonRecord,
  successJson,
} from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };
const CATEGORY_FIELDS = [
  "slug",
  "name",
  "num",
  "tagline",
  "description",
  "image",
  "icon",
  "accent",
  "order",
  "status",
] as const;

async function readId(context: RouteContext): Promise<number | null> {
  const { id } = await context.params;
  if (!/^[1-9]\d*$/.test(id)) return null;
  const value = Number(id);
  return Number.isSafeInteger(value) ? value : null;
}

export async function PUT(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const id = await readId(context);
  if (!id) return errorJson("Invalid service category id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (
    !hasOnlyKeys(parsed.value, CATEGORY_FIELDS) ||
    CATEGORY_FIELDS.some((field) => !(field in parsed.value))
  ) {
    return errorJson("Provide all supported service category fields.", 400);
  }
  const result = parseServiceCategoryPayload(parsed.value);
  if (result.error !== null) return errorJson(result.error, 400);

  try {
    const outcome = await prisma.$transaction(
      async (transaction) => {
        const existing = await transaction.serviceCategory.findUnique({
          where: { id },
          select: {
            slug: true,
            services: { select: { slug: true } },
          },
        });
        if (!existing) return { error: "not-found" as const };

        const duplicate = await transaction.serviceCategory.findFirst({
          where: {
            id: { not: id },
            name: { equals: result.data.name, mode: "insensitive" },
          },
          select: { id: true },
        });
        if (duplicate) return { error: "duplicate" as const };

        const category = await transaction.serviceCategory.update({
          where: { id },
          data: result.data,
          select: {
            id: true,
            slug: true,
            name: true,
            num: true,
            tagline: true,
            description: true,
            image: true,
            icon: true,
            accent: true,
            order: true,
            status: true,
          },
        });
        return { error: null, category, existing };
      },
      { isolationLevel: "Serializable" },
    );
    if (outcome.error === "not-found") {
      return errorJson("Service category not found.", 404);
    }
    if (outcome.error === "duplicate") {
      return errorJson("A category with that name already exists.", 409);
    }
    const { existing, category } = outcome;
    revalidateServiceRoutes(
      { categorySlug: existing.slug },
      { categorySlug: category.slug },
      ...existing.services.flatMap((service) => [
        { categorySlug: existing.slug, serviceSlug: service.slug },
        { categorySlug: category.slug, serviceSlug: service.slug },
      ]),
    );
    return successJson({ category });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("A category with that slug already exists.", 409);
    }
    if (isPrismaTransactionConflict(error)) {
      return errorJson("A conflicting category change was detected. Reload and try again.", 409);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return errorJson("Service category not found.", 404);
    }
    console.error("admin service category update failed:", error);
    return errorJson("Could not update service category.", 500);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const id = await readId(context);
  if (!id) return errorJson("Invalid service category id.", 400);

  try {
    const category = await prisma.$transaction(
      async (transaction) => {
        const existing = await transaction.serviceCategory.findUnique({
          where: { id },
          select: {
            slug: true,
            _count: { select: { services: true } },
          },
        });
        if (!existing) return { error: "not-found" as const };
        if (existing._count.services > 0) return { error: "has-services" as const };

        await transaction.serviceCategory.delete({ where: { id } });
        return { error: null, slug: existing.slug };
      },
      { isolationLevel: "Serializable" },
    );
    if (category.error === "not-found") {
      return errorJson("Service category not found.", 404);
    }
    if (category.error === "has-services") {
      return errorJson("Move or delete its services before deleting this category.", 409);
    }

    revalidateServiceRoutes({ categorySlug: category.slug });
    return successJson({ id });
  } catch (error) {
    if (isPrismaTransactionConflict(error)) {
      return errorJson("A service was added concurrently. Refresh and try again.", 409);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return errorJson("Service category not found.", 404);
    }
    console.error("admin service category deletion failed:", error);
    return errorJson("Could not delete service category.", 500);
  }
}
