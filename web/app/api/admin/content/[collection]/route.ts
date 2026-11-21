import { revalidatePath } from "next/cache";
import { errorJson, isPrismaUniqueError, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { getCollection, validatePayload } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ collection: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { collection } = await params;
  const config = getCollection(collection);
  if (!config) return errorJson("Unknown content collection.", 404);

  try {
    const group = new URL(request.url).searchParams.get("group");
    const where = config.groupField && group ? { [config.groupField]: group } : {};
    const items = await (config.model as any).findMany({
      where,
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    return successJson({ items });
  } catch (error) {
    console.error("content list failed:", error);
    return errorJson("Could not load content.", 500);
  }
}

export async function POST(request: Request, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { collection } = await params;
  const config = getCollection(collection);
  if (!config) return errorJson("Unknown content collection.", 404);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  const checked = validatePayload(config, parsed.value);
  if (!checked.ok) return errorJson(checked.error, 400);

  try {
    const uniqueWhere: Record<string, unknown> = {
      [config.uniqueBy]: checked.data[config.uniqueBy],
    };
    if (config.groupField) uniqueWhere[config.groupField] = checked.data[config.groupField];
    const existing = await (config.model as any).findFirst({ where: uniqueWhere });
    if (existing) return errorJson("An item with this name already exists.", 409);

    const item = await (config.model as any).create({ data: checked.data });
    revalidatePath("/");
    return successJson({ item }, 201);
  } catch (error) {
    if (isPrismaUniqueError(error)) return errorJson("An item with this name already exists.", 409);
    console.error("content create failed:", error);
    return errorJson("Could not create content.", 500);
  }
}
