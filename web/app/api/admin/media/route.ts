import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import {
  deleteMediaObject,
  MediaStorageConfigurationError,
  uploadMediaObject,
} from "@/lib/media-storage";

/**
 * POST /api/admin/media — upload an image to configured object storage.
 * Only its metadata and object key are stored in PostgreSQL.
 */

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function hasExpectedSignature(type: string, bytes: Uint8Array): boolean {
  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }
  if (type === "image/gif") {
    const signature = new TextDecoder().decode(bytes.slice(0, 6));
    return signature === "GIF87a" || signature === "GIF89a";
  }
  if (type === "image/webp") {
    return (
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    );
  }
  return false;
}

export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return badRequest("Choose an image to upload.");
    }
    if (!ALLOWED_TYPES[file.type]) {
      return badRequest("Only JPEG, PNG, WebP or GIF images are allowed.");
    }
    if (file.size === 0) return badRequest("The selected file is empty.");
    if (file.size > MAX_BYTES) {
      return badRequest("File is larger than the 5 MB limit.");
    }

    const alt =
      typeof form.get("alt") === "string" ? String(form.get("alt")).trim().slice(0, 200) : "";

    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const ext = ALLOWED_TYPES[file.type];
    const filename = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!hasExpectedSignature(file.type, buffer)) {
      return badRequest("The file contents do not match the selected image type.");
    }

    const storageKey = `webeaz/${year}/${month}/${filename}`;
    const originalName = file.name.replace(/[^\w.\- ]/g, "_").slice(0, 120) || filename;
    const stored = await uploadMediaObject(storageKey, buffer, file.type);

    try {
      const asset = await prisma.mediaAsset.create({
        data: {
          filename,
          originalName,
          url: stored.url,
          storageKey: stored.storageKey,
          mimeType: file.type,
          size: file.size,
          alt,
        },
        select: {
          id: true,
          filename: true,
          originalName: true,
          url: true,
          mimeType: true,
          size: true,
          alt: true,
          createdAt: true,
        },
      });

      return Response.json({ ok: true, asset });
    } catch (error) {
      await deleteMediaObject(stored.storageKey).catch((cleanupError) => {
        console.error("media upload rollback failed:", cleanupError);
      });
      throw error;
    }
  } catch (error) {
    console.error("media POST failed:", error);
    if (error instanceof MediaStorageConfigurationError) {
      return Response.json({ error: error.message }, { status: 503 });
    }
    return serverError("Could not upload the image.");
  }
}
