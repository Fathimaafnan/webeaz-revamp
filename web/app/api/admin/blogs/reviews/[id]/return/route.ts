import { errorJson, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
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
 * Return a submission for correction. Requires a reason. The live
 * published content (if any) and the post's status are never touched;
 * only the pending revision and the mirrored BlogPost stage change.
 */
export async function POST(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const adminId = Number(guard.user.id);

  const { id: rawId } = await context.params;
  const revisionId = readId(rawId);
  if (!revisionId) return errorJson("Invalid revision id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;

  const reason =
    typeof parsed.value.reason === "string" ? parsed.value.reason.trim() : "";
  if (!reason || reason.length > 2000) {
    return errorJson("A return reason is required (max 2000 characters).", 400);
  }

  try {
    return await withTransactionRetry(prisma, async (tx) => {
      const revision = await tx.blogPostRevision.findUnique({
        where: { id: revisionId },
        include: { blogPost: { select: { id: true, reviewStage: true } } },
      });
      if (!revision || revision.reviewStage !== "SUBMITTED") {
        return errorJson("Submission not found or already reviewed.", 404);
      }

      const now = new Date();
      await tx.blogPostRevision.update({
        where: { id: revisionId },
        data: {
          reviewStage: "RETURNED",
          rejectionReason: reason,
          reviewedBy: adminId,
          reviewedAt: now,
        },
      });
      await tx.blogPost.update({
        where: { id: revision.blogPostId },
        data: { reviewStage: "RETURNED" },
      });
      await tx.blogPostAudit.create({
        data: {
          blogPostId: revision.blogPostId,
          adminId,
          action: "RETURNED",
          detail: JSON.stringify({ revisionId, reason }),
        },
      });

      return successJson({ blogPostId: revision.blogPostId, reviewStage: "RETURNED" });
    });
  } catch (error) {
    console.error("admin blog return failed:", error);
    return errorJson("Could not return the submission.", 500);
  }
}
