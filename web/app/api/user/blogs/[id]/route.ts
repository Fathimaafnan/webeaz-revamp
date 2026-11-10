import { parseBlogUserContentPayload } from "@/lib/cms";
import type { Prisma } from "@prisma/client";
import {
  errorJson,
  hasOnlyKeys,
  isPrismaUniqueError,
  readJsonRecord,
  successJson,
} from "@/lib/admin-api";
import { requireBlogUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  BlogWorkflowError,
  findPendingRevision,
  withTransactionRetry,
} from "@/lib/blog-workflow";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function readId(raw: string): number | null {
  return /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw))
    ? Number(raw)
    : null;
}

const FULL_SELECT: Prisma.BlogPostSelect = {
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
  rejectionReason: true,
  publishedAt: true,
  submittedAt: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
  revisions: {
    orderBy: [{ createdAt: "desc" as const }, { id: "desc" as const }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      category: true,
      coverImage: true,
      author: true,
      seoTitle: true,
      seoDescription: true,
      reviewStage: true,
      rejectionReason: true,
      submittedAt: true,
      reviewedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;

async function loadOwnPost(id: number, ownerId: number) {
  return prisma.blogPost.findFirst({
    where: { id, ownerId },
    select: FULL_SELECT,
  });
}

export async function GET(request: Request, context: RouteContext) {
  const guard = await requireBlogUser(request);
  if (!guard.ok) return guard.response;

  const { id: rawId } = await context.params;
  const id = readId(rawId);
  if (!id) return errorJson("Invalid blog id.", 400);

  try {
    const post = await loadOwnPost(id, Number(guard.user.id));
    if (!post) return errorJson("Blog not found.", 404);
    return successJson({ post });
  } catch (error) {
    console.error("user blog read failed:", error);
    return errorJson("Could not load the blog.", 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireBlogUser(request);
  if (!guard.ok) return guard.response;
  const ownerId = Number(guard.user.id);

  const { id: rawId } = await context.params;
  const id = readId(rawId);
  if (!id) return errorJson("Invalid blog id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;

  const allowed = [
    "title",
    "slug",
    "excerpt",
    "content",
    "category",
    "coverImage",
    "author",
    "seoTitle",
    "seoDescription",
  ];
  if (!hasOnlyKeys(parsed.value, allowed)) {
    return errorJson("Request contains fields blog authors cannot set.", 400);
  }

  try {
    const post = await loadOwnPost(id, ownerId);
    if (!post) return errorJson("Blog not found.", 404);

    const published = post.status === "PUBLISHED";

    if (published) {
      // Published posts are edited only through their pending revision.
      // Slug changes are forbidden here entirely (immutable by design).
      if ("slug" in parsed.value) {
        return errorJson(
          "The slug of a published blog cannot be changed. Ask an administrator for a slug change.",
          400,
        );
      }

      const revisionFields = parseBlogUserContentPayload(
        { ...parsed.value, slug: post.slug },
        { existingSlug: post.slug },
      );
      if (revisionFields.error !== null) return errorJson(revisionFields.error, 400);

      const saved = await withTransactionRetry(prisma, async (tx) => {
        const pending = await findPendingRevision(tx, id);
        if (pending) {
          if (
            pending.reviewStage === "SUBMITTED" ||
            !["DRAFT", "RETURNED"].includes(pending.reviewStage)
          ) {
            throw new BlogWorkflowError(
              422,
              "This proposal is under review. Withdraw it before editing.",
            );
          }
          await tx.blogPostRevision.update({
            where: { id: pending.id },
            data: { ...revisionFields.data, reviewStage: "DRAFT" },
          });
          await tx.blogPost.update({
            where: { id },
            data: { reviewStage: "DRAFT" },
          });
          return tx.blogPost.findFirst({
            where: { id },
            select: FULL_SELECT,
          });
        }

        await tx.blogPostRevision.create({
          data: {
            blogPostId: id,
            ...revisionFields.data,
            reviewStage: "DRAFT",
          },
        });
        await tx.blogPost.update({
          where: { id },
          data: { reviewStage: "DRAFT" },
        });
        return tx.blogPost.findFirst({
          where: { id },
          select: FULL_SELECT,
        });
      });

      return successJson({ post: saved, via: "revision" });
    }

    const result = parseBlogUserContentPayload(parsed.value, {
      existingSlug: post.slug,
    });
    if (result.error !== null) return errorJson(result.error, 400);

    if (
      post.reviewStage === "SUBMITTED" ||
      (post.revisions.some((r) => r.reviewStage === "SUBMITTED"))
    ) {
      return errorJson(
        "This blog is under review. Withdraw it before editing.",
        422,
      );
    }

    const saved = await withTransactionRetry(prisma, (tx) =>
      tx.blogPost.update({
        where: { id },
        data: { ...result.data, reviewStage: "DRAFT" },
        select: FULL_SELECT,
      }),
    );
    return successJson({ post: saved, via: "direct" });
  } catch (error) {
    if (error instanceof BlogWorkflowError) {
      return errorJson(error.message, error.status);
    }
    if (isPrismaUniqueError(error)) {
      return errorJson("That URL slug is already in use.", 409);
    }
    console.error("user blog update failed:", error);
    return errorJson("Could not update the blog.", 500);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const guard = await requireBlogUser(request);
  if (!guard.ok) return guard.response;

  const { id: rawId } = await context.params;
  const id = readId(rawId);
  if (!id) return errorJson("Invalid blog id.", 400);

  try {
    const post = await loadOwnPost(id, Number(guard.user.id));
    if (!post) return errorJson("Blog not found.", 404);
    if (post.status === "PUBLISHED") {
      return errorJson("Published blogs cannot be deleted.", 422);
    }

    await prisma.blogPost.delete({ where: { id } });
    return successJson({ id });
  } catch (error) {
    console.error("user blog delete failed:", error);
    return errorJson("Could not delete the blog.", 500);
  }
}
