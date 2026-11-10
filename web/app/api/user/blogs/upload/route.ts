import { errorJson, successJson } from "@/lib/admin-api";
import { requireBlogUser } from "@/lib/admin-auth";
import {
  getMediaStorageStatus,
  uploadMediaObject,
} from "@/lib/media-storage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeFileName(raw: string): string {
  const base = raw.split(/[\\/]/).pop() ?? "image.bin";
  const cleaned = base.replace(/[^A-Za-z0-9._-]/g, "-").replace(/-+/g, "-");
  return cleaned.length > 0 ? cleaned.slice(0, 100) : "image.bin";
}

function sniffImageMime(header: Uint8Array): string | null {
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    header.length >= 8 &&
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    header.length >= 12 &&
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  ) {
    return "image/webp";
  }
  if (header.length >= 6 && ["GIF87a", "GIF89a"].includes(new TextDecoder("latin1").decode(header.slice(0, 6)))) {
    return "image/gif";
  }
  return null;
}

/**
 * Blog cover-image upload (BlogUser only). Authorized against the
 * session; stores the bytes ONLY in object storage (never in
 * PostgreSQL) and records a MediaAsset row. When object storage is not
 * configured the endpoint is unavailable (503) rather than failing
 * silently — forms then keep working with pasted HTTPS URLs.
 */
export async function POST(request: Request) {
  const guard = await requireBlogUser(request);
  if (!guard.ok) return guard.response;
  const ownerId = Number(guard.user.id);

  const status = getMediaStorageStatus();
  if (!status.configured) {
    return errorJson(
      `Image upload is unavailable. Paste an HTTPS image URL instead. Missing: ${status.missing.join(", ")}.`,
      503,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorJson("Request must be multipart form data.", 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return errorJson("Choose an image file to upload.", 400);
  }

  if (file.size === 0 || file.size > MAX_BYTES) {
    return errorJson("Image must be between 1 byte and 5 MB.", 400);
  }

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const sniffed = sniffImageMime(header);
  if (!sniffed || !ALLOWED_TYPES.has(file.type) || sniffed !== file.type) {
    return errorJson("Only JPEG, PNG, WebP or GIF images are allowed.", 400);
  }

  const body = new Uint8Array(await file.arrayBuffer());
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const key = `blog-covers/${ownerId}/${stamp}-${safeFileName(file.name)}`;

  try {
    const uploaded = await uploadMediaObject(key, body, sniffed);
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: safeFileName(file.name),
        originalName: file.name,
        url: uploaded.url,
        storageKey: uploaded.storageKey,
        mimeType: sniffed,
        size: file.size,
      },
    });
    return successJson(
      { url: uploaded.url, assetId: asset.id, mimeType: sniffed },
      201,
    );
  } catch (error) {
    console.error("cover upload failed:", error);
    return errorJson("Could not upload the image. Try again.", 500);
  }
}
