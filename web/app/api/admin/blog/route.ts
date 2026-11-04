import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { badRequest, requireAdmin, serverError } from "@/lib/admin-auth";
import { parseBlogPayload } from "@/lib/cms";

/** POST /api/admin/blog — create a post as draft or published. */
export async function POST(request: Request) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  try {
    const body = await request.json();
    const parsed = parseBlogPayload(body ?? {});
    if (parsed.error !== null) return badRequest(parsed.error);

    const clash = await prisma.blogPost.findUnique({ where: { slug: parsed.data.slug } });
    if (clash) return badRequest("A post with that slug already exists.");

    const post = await prisma.blogPost.create({ data: parsed.data });

    revalidatePath("/", "layout");
    revalidatePath("/insights");
    return Response.json({ ok: true, id: post.id });
  } catch (error) {
    console.error("blog POST failed:", error);
    return serverError("Could not create the post.");
  }
}
