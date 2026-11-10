import "server-only";

import type { Prisma, PrismaClient } from "@prisma/client";

/**
 * Blog review workflow — the single source of truth for every
 * BlogUser and Admin blog mutation. The public site never reads this
 * module; it keeps filtering on `BlogPost.status = 'PUBLISHED'` only.
 *
 * Two axes, never merged:
 *   `BlogPost.status`       (ContentStatus)  — public visibility
 *   `BlogPost.reviewStage`  (BlogReviewStage) — editorial workflow
 *   `BlogPostRevision.reviewStage`           — per-proposal workflow
 *
 * Invariants (enforced here, not by clients):
 *   - Only a blog's owner (matched against the session) can edit it.
 *   - A published post is edited only through a pending revision;
 *     live fields are never written before approval.
 *   - Exactly one pending (non-APPROVED) revision per post, enforced
 *     by the partial unique index and by `assertNoPendingRevision`.
 *   - Approved revision history is immutable (never updated/deleted).
 */

export type ReviewStage = "DRAFT" | "SUBMITTED" | "RETURNED" | "APPROVED";

export function isReviewStage(value: unknown): value is ReviewStage {
  return (
    value === "DRAFT" ||
    value === "SUBMITTED" ||
    value === "RETURNED" ||
    value === "APPROVED"
  );
}

export function isPendingStage(stage: ReviewStage): boolean {
  return stage !== "APPROVED";
}

/** Client-settable blog content fields (everything else is server-set). */
export const BLOG_CONTENT_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "content",
  "category",
  "coverImage",
  "author",
  "seoTitle",
  "seoDescription",
] as const;

export type BlogContentFields = (typeof BLOG_CONTENT_FIELDS)[number];

/** Fields a BlogUser body may never include (mass-assignment blocklist). */
export const BLOG_FORBIDDEN_CLIENT_FIELDS = [
  "id",
  "ownerId",
  "status",
  "reviewStage",
  "rejectionReason",
  "reviewedBy",
  "reviewedAt",
  "publishedAt",
  "submittedAt",
  "createdAt",
  "updatedAt",
] as const;

export class BlogWorkflowError extends Error {
  readonly status: 409 | 422;

  constructor(status: 409 | 422, message: string) {
    super(message);
    this.name = "BlogWorkflowError";
    this.status = status;
  }
}

/** Run `fn` inside a serializable transaction, retrying Prisma
 *  serialization conflicts (P2034) exactly once with a fresh read.
 *  A second conflict is a 409, never an anonymous 500. */
type Client = InstanceType<typeof PrismaClient>;

export async function withTransactionRetry<T>(
  prisma: Client,
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  attempts = 2,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await prisma.$transaction(async (tx) => fn(tx), {
        isolationLevel: "Serializable",
      });
    } catch (error) {
      lastError = error;
      if (!isTransactionConflict(error)) break;
    }
  }
  throw lastError;
}

export function isTransactionConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    ((error as { code?: unknown }).code === "P2034" ||
      // Neon serverless occasionally fails to START a transaction in
      // time; that is the same transient conflict class as P2034.
      (error as { code?: unknown }).code === "P2028")
  );
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

/** The pending-revision slot for a post, or null. */
export type PendingRevision = {
  id: number;
  reviewStage: ReviewStage;
};

export async function findPendingRevision(
  tx: Prisma.TransactionClient,
  blogPostId: number,
): Promise<PendingRevision | null> {
  return tx.blogPostRevision.findFirst({
    where: { blogPostId, reviewStage: { not: "APPROVED" } },
    select: { id: true, reviewStage: true },
  });
}

/** Throws once a pending revision already exists (submit/edit path must
 *  reuse it instead of creating a second one). */
export async function assertNoPendingRevision(
  tx: Prisma.TransactionClient,
  blogPostId: number,
): Promise<void> {
  const existing = await findPendingRevision(tx, blogPostId);
  if (existing) {
    throw new BlogWorkflowError(
      409,
      "A different pending proposal already exists for this blog. Open it instead of creating another.",
    );
  }
}
