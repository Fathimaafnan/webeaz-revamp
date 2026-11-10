import { errorJson, readJsonRecord, successJson } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  BlogWorkflowError,
  isUniqueViolation,
  withTransactionRetry,
} from "@/lib/blog-workflow";
import { revalidateBlogRoutes } from "@/lib/blog-revalidation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

async function loadPendingForAdmin(revisionId: number) {
  return prisma.blogPostRevision.findFirst({
    where: { id: revisionId, reviewStage: "SUBMITTED" },
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
        },
      },
    },
  });
}

function readId(raw: string): number | null {
  return /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw))
    ? Number(raw)
    : null;
}

async function handleApprove(request: Request, rawId: string) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;
  const adminId = Number(guard.user.id);
  const revisionId = readId(rawId);
  if (!revisionId) return errorJson("Invalid revision id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;

  const proposedSlug =
    parsed.value.slugChange === undefined || parsed.value.slugChange === null
      ? null
      : typeof parsed.value.slugChange === "string"
        ? parsed.value.slugChange.trim().toLowerCase()
        : "";
  if (proposedSlug === "") {
    return errorJson("A new slug must be lowercase letters, numbers and dashes.", 400);
  }

  try {
    const revision = await loadPendingForAdmin(revisionId);
    if (!revision) return errorJson("Submission not found or already reviewed.", 404);

    const now = new Date();
    const published = revision.blogPost.status === "PUBLISHED";
    const oldSlug = revision.blogPost.slug;
    const newSlug = proposedSlug ?? oldSlug;
    const slugChange = newSlug !== oldSlug;

    if (slugChange) {
      const dupe = await prisma.blogPost.findUnique({ where: { slug: newSlug } });
      if (dupe && dupe.id !== revision.blogPostId) {
        return errorJson("That slug is already used by another blog.", 409);
      }
      const clash = await prisma.blogSlugRedirect.findUnique({
        where: { oldSlug: newSlug },
      });
      if (clash && clash.blogPostId !== revision.blogPostId) {
        return errorJson("That slug was previously used by another blog.", 409);
      }
      const clashRev = await prisma.blogPostRevision.findFirst({
        where: {
          slug: newSlug,
          blogPostId: { not: revision.blogPostId },
          reviewStage: { not: "APPROVED" },
        },
      });
      if (clashRev) {
        return errorJson("Another pending proposal already uses that slug.", 409);
      }
    }

    const result = await withTransactionRetry(prisma, async (tx) => {
      const fresh = await tx.blogPostRevision.findUnique({
        where: { id: revisionId },
        include: { blogPost: true },
      });
      if (!fresh || fresh.reviewStage !== "SUBMITTED") {
        throw new BlogWorkflowError(409, "This submission was already reviewed. Reload and try again.");
      }

      if (slugChange) {
        await tx.blogSlugRedirect.create({
          data: { oldSlug, blogPostId: fresh.blogPostId },
        });
      }

      const updatedPost = await tx.blogPost.update({
        where: { id: fresh.blogPostId },
        data: {
          slug: newSlug,
          title: fresh.title,
          excerpt: fresh.excerpt,
          content: fresh.content,
          category: fresh.category,
          coverImage: fresh.coverImage,
          author: fresh.author,
          seoTitle: fresh.seoTitle,
          seoDescription: fresh.seoDescription,
          status: "PUBLISHED",
          reviewStage: "APPROVED",
          rejectionReason: null,
          reviewedBy: adminId,
          reviewedAt: now,
          publishedAt: now,
        },
      });

      await tx.blogPostRevision.update({
        where: { id: fresh.id },
        data: {
          reviewStage: "APPROVED",
          reviewedBy: adminId,
          reviewedAt: now,
          ...(slugChange ? { slug: newSlug } : {}),
        },
      });

      await tx.blogPostAudit.create({
        data: {
          blogPostId: fresh.blogPostId,
          adminId,
          action: slugChange ? "SLUG_CHANGED" : "APPROVED",
          detail: slugChange
            ? JSON.stringify({ from: oldSlug, to: newSlug })
            : JSON.stringify({ revisionId: fresh.id, firstPublish: !published }),
        },
      });

      return { updatedPost, newSlug };
    });

    revalidateBlogRoutes(result.newSlug);
    return successJson({
      blogPostId: result.updatedPost.id,
      slug: result.newSlug,
      publishedAt: result.updatedPost.publishedAt,
    });
  } catch (error) {
    if (error instanceof BlogWorkflowError) {
      return errorJson(error.message, error.status);
    }
    if (isUniqueViolation(error)) {
      return errorJson("A concurrent change conflicts with this approval. Reload and try again.", 409);
    }
    console.error("admin blog approve failed:", error);
    return errorJson("Could not approve the submission.", 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleApprove(request, id);
}
