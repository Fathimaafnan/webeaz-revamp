import { revalidatePath } from "next/cache";
import { errorJson, isPrismaUniqueError, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { getCollection, validatePayload } from "@/lib/admin-content";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ collection: string; id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { collection, id } = await params;
  const config = getCollection(collection);
  if (!config) return errorJson("Unknown content collection.", 404);
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) return errorJson("Invalid item id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  const checked = validatePayload(config, parsed.value);
  if (!checked.ok) return errorJson(checked.error, 400);

  try {
    const current = await (config.model as any).findUnique({ where: { id: itemId } });
    if (!current) return errorJson("Item not found.", 404);

    const uniqueWhere: Record<string, unknown> = { [config.uniqueBy]: checked.data[config.uniqueBy] };
    if (config.groupField) uniqueWhere[config.groupField] = checked.data[config.groupField];
    const clash = await (config.model as any).findFirst({ where: uniqueWhere });
    if (clash && clash.id !== itemId) return errorJson("An item with this name already exists.", 409);

    const item = await (config.model as any).update({ where: { id: itemId }, data: checked.data });
    revalidatePath("/");
    return successJson({ item });
  } catch (error) {
    if (isPrismaUniqueError(error)) return errorJson("An item with this name already exists.", 409);
    console.error("content update failed:", error);
    return errorJson("Could not update content.", 500);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { collection, id } = await params;
  const config = getCollection(collection);
  if (!config) return errorJson("Unknown content collection.", 404);
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) return errorJson("Invalid item id.", 400);

  try {
    const current = await (config.model as any).findUnique({ where: { id: itemId } });
    if (!current) return errorJson("Item not found.", 404);
    await (config.model as any).delete({ where: { id: itemId } });
    revalidatePath("/");
    return successJson({ deleted: itemId });
  } catch (error) {
    console.error("content delete failed:", error);
    return errorJson("Could not delete content.", 500);
  }
}
