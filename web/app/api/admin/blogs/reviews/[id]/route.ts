import { errorJson, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/** Full review detail for one revision: the proposal, the live post,
 *  its owner, and the revision/audit history around it. */
export async function GET(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { id: rawId } = await context.params;
  if (!/^[1-9]\d*$/.test(rawId)) return errorJson("Invalid revision id.", 400);
  const revisionId = Number(rawId);
  if (!Number.isSafeInteger(revisionId)) return errorJson("Invalid revision id.", 400);

  try {
    const revision = await prisma.blogPostRevision.findUnique({
      where: { id: revisionId },
      include: {
        blogPost: {
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            content: true,
            category: true,
            coverImage: true,
            author: true,
            seoTitle: true,
            seoDescription: true,
            status: true,
            reviewStage: true,
            publishedAt: true,
            ownerId: true,
            owner: { select: { id: true, name: true, email: true } },
            reviewer: { select: { id: true, name: true, email: true } },
            revisions: {
              orderBy: [{ createdAt: "desc" }, { id: "desc" }],
              select: {
                id: true,
                title: true,
                slug: true,
                reviewStage: true,
                rejectionReason: true,
                submittedAt: true,
                reviewedAt: true,
                createdAt: true,
              },
            },
            audits: {
              orderBy: [{ createdAt: "desc" }, { id: "desc" }],
              select: {
                id: true,
                action: true,
                detail: true,
                createdAt: true,
                admin: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });
    if (!revision) return errorJson("Revision not found.", 404);

    return successJson({ revision });
  } catch (error) {
    console.error("admin blog review detail failed:", error);
    return errorJson("Could not load the review.", 500);
  }
}
