import { parseBlogSubmitPayload } from "@/lib/cms";
import { errorJson, readJsonRecord, successJson } from "@/lib/admin-api";
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
 * Withdraw a submission: SUBMITTED → DRAFT. Never touches live fields
 * or status; only the pending revision and the mirrored BlogPost
 * stage revert. Published posts are unaffected by withdrawal.
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
  const body = parseBlogSubmitPayload(parsed.value);
  if (body.error !== null) return errorJson(body.error, 400);

  try {
    const post = await prisma.blogPost.findFirst({
      where: { id, ownerId },
      select: {
        id: true,
        status: true,
        reviewStage: true,
        revisions: {
          where: { reviewStage: "SUBMITTED" },
          select: { id: true },
        },
      },
    });
    if (!post) return errorJson("Blog not found.", 404);

    const submitted = post.revisions[0] ?? null;
    if (!submitted && post.reviewStage !== "SUBMITTED") {
      return errorJson("This blog is not under review.", 422);
    }

    await withTransactionRetry(prisma, async (tx) => {
      if (submitted) {
        await tx.blogPostRevision.update({
          where: { id: submitted.id },
          data: { reviewStage: "DRAFT", submittedAt: null },
        });
      }
      await tx.blogPost.update({
        where: { id },
        data: { reviewStage: "DRAFT", submittedAt: null },
      });
    });

    return successJson({ blogPostId: id, reviewStage: "DRAFT" });
  } catch (error) {
    console.error("user blog withdraw failed:", error);
    return errorJson("Could not withdraw the submission.", 500);
  }
}
