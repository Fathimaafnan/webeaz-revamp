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

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
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
        _count: { select: { services: true } },
      },
    });
    return successJson({
      categories: categories.map(({ _count, ...category }) => ({
        ...category,
        serviceCount: _count.services,
      })),
    });
  } catch (error) {
    console.error("admin service categories read failed:", error);
    return errorJson("Could not load service categories.", 500);
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

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
        const duplicate = await transaction.serviceCategory.findFirst({
          where: {
            name: { equals: result.data.name, mode: "insensitive" },
          },
          select: { id: true },
        });
        if (duplicate) return { error: "duplicate" as const };

        const category = await transaction.serviceCategory.create({
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
        return { error: null, category };
      },
      { isolationLevel: "Serializable" },
    );
    if (outcome.error === "duplicate") {
      return errorJson("A category with that name already exists.", 409);
    }
    const { category } = outcome;
    revalidateServiceRoutes({ categorySlug: category.slug });
    return successJson({ category }, 201);
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("A category with that slug already exists.", 409);
    }
    if (isPrismaTransactionConflict(error)) {
      return errorJson("A conflicting category change was detected. Reload and try again.", 409);
    }
    console.error("admin service category creation failed:", error);
    return errorJson("Could not create service category.", 500);
  }
}
