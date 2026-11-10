import { revalidateServiceRoutes } from "@/lib/service-revalidation";
import { parseServicePayload } from "@/lib/cms";
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
const SERVICE_FIELDS = [
  "categorySlug",
  "slug",
  "name",
  "summary",
  "icon",
  "image",
  "seoTitle",
  "seoDescription",
  "overview",
  "provides",
  "capabilities",
  "benefits",
  "useCases",
  "technologies",
  "order",
  "status",
] as const;

const SERVICE_SELECT = {
  id: true,
  categoryId: true,
  slug: true,
  name: true,
  summary: true,
  icon: true,
  image: true,
  seoTitle: true,
  seoDescription: true,
  overview: true,
  provides: true,
  capabilities: true,
  benefits: true,
  useCases: true,
  technologies: true,
  order: true,
  status: true,
  category: { select: { id: true, slug: true, name: true } },
} as const;

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
  if (!id) return errorJson("Invalid service id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (
    !hasOnlyKeys(parsed.value, SERVICE_FIELDS) ||
    SERVICE_FIELDS.some((field) => !(field in parsed.value))
  ) {
    return errorJson("Provide all supported service fields.", 400);
  }

  const result = await parseServicePayload(parsed.value);
  if (result.error !== null) return errorJson(result.error, 400);

  try {
    const existing = await prisma.service.findUnique({
      where: { id },
      select: { slug: true, category: { select: { slug: true } } },
    });
    if (!existing) return errorJson("Service not found.", 404);

    const service = await prisma.$transaction(
      (transaction) =>
        transaction.service.update({
          where: { id },
          data: result.data,
          select: SERVICE_SELECT,
        }),
      { isolationLevel: "Serializable" },
    );
    revalidateServiceRoutes(
      { categorySlug: existing.category.slug, serviceSlug: existing.slug },
      { categorySlug: service.category.slug, serviceSlug: service.slug },
    );
    return successJson({ service });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("A service with that slug already exists in this category.", 409);
    }
    if (isPrismaTransactionConflict(error)) {
      return errorJson("A conflicting service change was detected. Reload and try again.", 409);
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return errorJson("Service not found.", 404);
    }
    console.error("admin service update failed:", error);
    return errorJson("Could not update service.", 500);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const id = await readId(context);
  if (!id) return errorJson("Invalid service id.", 400);

  try {
    const service = await prisma.service.delete({
      where: { id },
      select: {
        id: true,
        slug: true,
        category: { select: { slug: true } },
      },
    });
    revalidateServiceRoutes({
      categorySlug: service.category.slug,
      serviceSlug: service.slug,
    });
    return successJson({ id: service.id });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return errorJson("Service not found.", 404);
    }
    console.error("admin service deletion failed:", error);
    return errorJson("Could not delete service.", 500);
  }
}
