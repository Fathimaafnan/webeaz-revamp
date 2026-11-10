import { parseBlogSubmitPayload } from "@/lib/cms";
import {
  errorJson,
  isPrismaUniqueError,
  readJsonRecord,
  successJson,
} from "@/lib/admin-api";
import { requireBlogUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { withTransactionRetry } from "@/lib/blog-workflow";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function readId(raw: string): number | null {
  return /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw))
    ? Number(raw)
    : null;
}

/**
 * Submit a blog (or its pending revision) for Admin review.
 *
 *   - Never-published blogs: the live draft is snapshotted into a
 *     SUBMITTED revision and BlogPost.reviewStage mirrors it.
 *   - Published blogs: the existing pending revision (DRAFT/RETURNED)
 *     is stamped SUBMITTED; live fields stay frozen.
 *
 * Completeness is required at submission (title/slug already exist on
 * the draft; a body is required). No status/reviewStage is accepted
 * from the client — the transition is server-driven only.
 */
export async function POST(request: Request, context: RouteContext) {
  const guard = await requireBlogUser(request);
  if (!guard.ok) return guard.response;
  const ownerId = Number(guard.user.id);

  const { id: rawId } = await context.params;
  const id = readId(rawId);
  if (!id) return errorJson("Invalid blog id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  const submitted = parseBlogSubmitPayload(parsed.value);
  if (submitted.error !== null) return errorJson(submitted.error, 400);

  try {
    const post = await prisma.blogPost.findFirst({
      where: { id, ownerId },
      select: {
        id: true,
        status: true,
        reviewStage: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        category: true,
        revisions: {
          where: { reviewStage: { not: "APPROVED" } },
          orderBy: [{ createdAt: "desc" }],
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            category: true,
            reviewStage: true,
          },
        },
      },
    });
    if (!post) return errorJson("Blog not found.", 404);

    const pending = post.revisions[0] ?? null;
    const stage = pending
      ? pending.reviewStage
      : post.reviewStage;

    if (stage === "SUBMITTED") {
      return errorJson("This blog is already under review.", 422);
    }
    if (stage === "APPROVED") {
      return errorJson("This blog is already approved. Edit it first to propose changes.", 422);
    }

    const now = new Date();
    const snapshot = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
    };

    if (!snapshot.title.trim() || !snapshot.content.trim()) {
      return errorJson("Add a title and body content before submitting.", 422);
    }

    const result = await withTransactionRetry(prisma, async (tx) => {
      if (pending) {
        const published = post.status === "PUBLISHED";
        await tx.blogPostRevision.update({
          where: { id: pending.id },
          data: {
            reviewStage: "SUBMITTED",
            submittedAt: now,
            rejectionReason: null,
            // Unpublished drafts are corrected on the live BlogPost, so
            // resubmission syncs those corrections into the returned
            // revision. Published revisions already hold the proposal.
            ...(!published
              ? {
                  title: snapshot.title,
                  slug: snapshot.slug,
                  excerpt: snapshot.excerpt,
                  content: snapshot.content,
                  category: snapshot.category,
                }
              : {}),
          },
        });
        await tx.blogPost.update({
          where: { id },
          data: { reviewStage: "SUBMITTED", submittedAt: now, rejectionReason: null },
        });
        return { revision: pending, blogPostStage: "SUBMITTED" };
      }

      const revision = await tx.blogPostRevision.create({
        data: {
          blogPostId: id,
          title: snapshot.title,
          slug: snapshot.slug,
          excerpt: snapshot.excerpt,
          content: snapshot.content,
          category: snapshot.category,
          reviewStage: "SUBMITTED",
          submittedAt: now,
        },
      });
      await tx.blogPost.update({
        where: { id },
        data: { reviewStage: "SUBMITTED", submittedAt: now, rejectionReason: null },
      });
      return { revision, blogPostStage: "SUBMITTED" };
    });

    return successJson({
      blogPostId: id,
      reviewStage: result.blogPostStage,
      revisionId: result.revision.id,
    });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson(
        "A different pending proposal already exists for this blog. Open it instead of submitting another.",
        409,
      );
    }
    console.error("user blog submit failed:", error);
    return errorJson("Could not submit the blog.", 500);
  }
}
