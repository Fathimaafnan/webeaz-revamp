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
import { withTransactionRetry } from "@/lib/blog-workflow";

export const dynamic = "force-dynamic";

const SELECT: Prisma.BlogPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  coverImage: true,
  author: true,
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
      reviewStage: true,
      rejectionReason: true,
      submittedAt: true,
      reviewedAt: true,
      createdAt: true,
    },
    take: 1,
  },
} as const;

export async function GET(request: Request) {
  const guard = await requireBlogUser(request);
  if (!guard.ok) return guard.response;
  const ownerId = Number(guard.user.id);

  try {
    const posts = await prisma.blogPost.findMany({
      where: { ownerId },
      orderBy: [{ updatedAt: "desc" }],
      select: SELECT,
    });
    return successJson({ posts });
  } catch (error) {
    console.error("user blog list failed:", error);
    return errorJson("Could not load your blogs.", 500);
  }
}

export async function POST(request: Request) {
  const guard = await requireBlogUser(request);
  if (!guard.ok) return guard.response;
  const ownerId = Number(guard.user.id);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  if (!hasOnlyKeys(parsed.value, [
    "title",
    "slug",
    "excerpt",
    "content",
    "category",
    "coverImage",
    "author",
    "seoTitle",
    "seoDescription",
  ])) {
    return errorJson("Request contains fields blog authors cannot set.", 400);
  }

  const result = parseBlogUserContentPayload(parsed.value, {});
  if (result.error !== null) return errorJson(result.error, 400);

  try {
    const post = await withTransactionRetry(prisma, (tx) =>
      tx.blogPost.create({
        data: {
          ...result.data,
          ownerId,
          status: "DRAFT",
          reviewStage: "DRAFT",
        },
        select: SELECT,
      }),
    );
    return successJson({ post }, 201);
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return errorJson("That URL slug is already in use.", 409);
    }
    console.error("user blog create failed:", error);
    return errorJson("Could not create the blog.", 500);
  }
}
