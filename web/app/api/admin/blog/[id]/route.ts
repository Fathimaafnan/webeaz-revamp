import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { parseBlogPayload } from "@/lib/cms";

type Params = { params: Promise<{ id: string }> };

/** PUT /api/admin/blog/[id] — edit a post, change status or publish/unpublish. */
export async function PUT(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid post id.");

    const body = await request.json();

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return badRequest("Post not found.");

    // Partial updates are allowed: any field not sent keeps its stored
    // value, so quick status changes from the list work without
    // resending the whole article.
    const merged = {
      slug: body?.slug ?? existing.slug,
      title: body?.title ?? existing.title,
      excerpt: body?.excerpt ?? existing.excerpt,
      content: body?.content ?? existing.content,
      category: body?.category ?? existing.category,
      coverImage: body?.coverImage ?? existing.coverImage ?? undefined,
      author: body?.author ?? existing.author,
      publishedAt:
        body?.publishedAt ??
        (existing.publishedAt ? existing.publishedAt.toISOString() : undefined),
      seoTitle: body?.seoTitle ?? existing.seoTitle ?? undefined,
      seoDescription: body?.seoDescription ?? existing.seoDescription ?? undefined,
      status: body?.status ?? existing.status,
    };

    const parsed = parseBlogPayload(merged);
    if (parsed.error !== null) return badRequest(parsed.error);

    const clash = await prisma.blogPost.findUnique({
      where: { slug: parsed.data.slug },
    });
    if (clash && clash.id !== id) {
      return badRequest("Another post already uses that slug.");
    }

    await prisma.blogPost.update({ where: { id }, data: parsed.data });

    revalidatePath("/", "layout");
    revalidatePath("/insights");
    if (parsed.data.status === "PUBLISHED") {
      revalidatePath(`/insights/${parsed.data.slug}`);
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("blog PUT failed:", error);
    return serverError("Could not update the post.");
  }
}

/** DELETE /api/admin/blog/[id] — permanent removal (confirmed in UI). */
export async function DELETE(request: Request, { params }: Params) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    if (!Number.isInteger(id)) return badRequest("Invalid post id.");

    const deleted = await prisma.blogPost.deleteMany({ where: { id } });
    if (deleted.count === 0) return badRequest("Post not found.");

    revalidatePath("/", "layout");
    revalidatePath("/insights");
    return Response.json({ ok: true });
  } catch (error) {
    console.error("blog DELETE failed:", error);
    return serverError("Could not delete the post.");
  }
}
