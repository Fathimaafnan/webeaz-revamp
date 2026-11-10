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

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const services = await prisma.service.findMany({
      orderBy: [{ category: { order: "asc" } }, { order: "asc" }, { id: "asc" }],
      select: SERVICE_SELECT,
    });
    return successJson({ services });
  } catch (error) {
    console.error("admin services read failed:", error);
    return errorJson("Could not load services.", 500);
  }
}

function isCompletePayload(body: Record<string, unknown>): boolean {
  return (
    hasOnlyKeys(body, SERVICE_FIELDS) &&
    SERVICE_FIELDS.every((field) => field in body)
  );
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (!isCompletePayload(parsed.value)) {
    return errorJson("Provide all supported service fields.", 400);
  }

  const result = await parseServicePayload(parsed.value);
  if (result.error !== null) return errorJson(result.error, 400);

  try {
    const service = await prisma.$transaction(
      (transaction) =>
        transaction.service.create({
          data: result.data,
          select: SERVICE_SELECT,
        }),
      { isolationLevel: "Serializable" },
    );
    revalidateServiceRoutes(
      { categorySlug: service.category.slug, serviceSlug: service.slug },
    );
    return successJson({ service }, 201);
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("A service with that slug already exists in this category.", 409);
    }
    if (isPrismaTransactionConflict(error)) {
      return errorJson("A conflicting service change was detected. Reload and try again.", 409);
    }
    console.error("admin service creation failed:", error);
    return errorJson("Could not create service.", 500);
  }
}
