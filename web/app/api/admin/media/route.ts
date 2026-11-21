import { errorJson, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { getMediaStorageStatus, uploadMediaObject } from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);

export async function GET(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  try {
    const assets = await prisma.mediaAsset.findMany({ orderBy: { id: "desc" }, take: 200 });
    return successJson({ assets, storage: getMediaStorageStatus() });
  } catch (error) {
    console.error("media list failed:", error);
    return errorJson("Could not load media.", 500);
  }
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const status = getMediaStorageStatus();
  if (!status.configured) {
    return errorJson(`Media storage is not configured (missing: ${status.missing.join(", ")}).`, 503);
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return errorJson("No file supplied.", 400);
    if (!ALLOWED.has(file.type)) return errorJson("Unsupported file type.", 400);
    if (file.size > MAX_BYTES) return errorJson("File is too large (8 MB maximum).", 400);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
    const key = `cms/${Date.now()}-${safeName}`;
    const body = new Uint8Array(await file.arrayBuffer());
    const { url, storageKey } = await uploadMediaObject(key, body, file.type);

    const asset = await prisma.mediaAsset.create({
      data: {
        filename: safeName,
        originalName: file.name,
        url,
        storageKey,
        mimeType: file.type,
        size: file.size,
        alt: typeof form.get("alt") === "string" ? String(form.get("alt")).slice(0, 300) : "",
      },
    });
    return successJson({ asset }, 201);
  } catch (error) {
    console.error("media upload failed:", error);
    return errorJson("Could not upload media.", 500);
  }
}
