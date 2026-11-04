import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { deleteMediaObject } from "@/lib/media-storage";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/media/[id] — set or clear the alt text. */
export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid media id.");

    const body = await request.json();
    if (typeof body?.alt !== "string") return badRequest("alt must be text.");

    const updated = await prisma.mediaAsset.updateMany({
      where: { id },
      data: { alt: body.alt.trim().slice(0, 200) },
    });
    if (updated.count === 0) return badRequest("Media item not found.");

    return Response.json({ ok: true });
  } catch (error) {
    console.error("media PATCH failed:", error);
    return serverError("Could not update the image.");
  }
}

/** DELETE /api/admin/media/[id] — delete the file and its row, but
 *  only when no content still references it. */
export async function DELETE(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid media id.");

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return badRequest("Media item not found.");

    const [usedByService, usedByPost, usedByTestimonial, usedByHomepage] = await Promise.all([
      prisma.service.findFirst({ where: { image: asset.url }, select: { name: true } }),
      prisma.blogPost.findFirst({ where: { coverImage: asset.url }, select: { title: true } }),
      prisma.testimonial.findFirst({
        where: { OR: [{ image: asset.url }, { companyLogo: asset.url }] },
        select: { name: true },
      }),
      prisma.homepageContent.findFirst({
        where: { heroImage: asset.url },
        select: { id: true },
      }),
    ]);

    const usedIn = [
      usedByService ? `service “${usedByService.name}”` : null,
      usedByPost ? `post “${usedByPost.title}”` : null,
      usedByTestimonial ? `testimonial from “${usedByTestimonial.name}”` : null,
      usedByHomepage ? "homepage hero" : null,
    ].filter(Boolean);

    if (usedIn.length > 0) {
      return Response.json(
        { error: `This image is still used by ${usedIn.join(", ")}.` },
        { status: 409 },
      );
    }

    if (asset.storageKey) {
      await deleteMediaObject(asset.storageKey);
    } else if (asset.url.startsWith("/uploads/")) {
      const uploadsRoot = path.resolve(process.cwd(), "public", "uploads");
      const resolved = path.resolve(process.cwd(), "public", asset.url.slice(1));
      const relative = path.relative(uploadsRoot, resolved);
      if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
        try {
          await fs.unlink(resolved);
        } catch (error) {
          if (
            !(
              error instanceof Error &&
              "code" in error &&
              error.code === "ENOENT"
            )
          ) {
            throw error;
          }
        }
      }
    }

    await prisma.mediaAsset.deleteMany({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("media DELETE failed:", error);
    return serverError("Could not delete the image.");
  }
}
