import { parseBlogUserAccountUpdatePayload } from "@/lib/cms";
import type { Prisma } from "@prisma/client";
import {
  errorJson,
  readJsonRecord,
  successJson,
} from "@/lib/admin-api";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function readId(raw: string): number | null {
  return /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw))
    ? Number(raw)
    : null;
}

const SELECT = {
  id: true,
  name: true,
  email: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { posts: true } },
} satisfies Prisma.BlogUserSelect;

type SelectedUser = Prisma.BlogUserGetPayload<{ select: typeof SELECT }>;

function safeUser(user: SelectedUser) {
  const { _count, ...rest } = user;
  return { ...rest, postCount: _count.posts };
}

/**
 * Activate/deactivate (and rename) a BlogUser. Deactivation applies
 * immediately because every guarded request re-reads `isActive` from
 * the database — existing JWT sessions for deactivated users are
 * rejected on their very next request.
 */
export async function PATCH(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { id: rawId } = await context.params;
  const id = readId(rawId);
  if (!id) return errorJson("Invalid account id.", 400);

  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;

  const result = parseBlogUserAccountUpdatePayload(parsed.value);
  if (result.error !== null) return errorJson(result.error, 400);

  try {
    const existing = await prisma.blogUser.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return errorJson("Account not found.", 404);

    const updated = await prisma.blogUser.update({
      where: { id },
      data: result.data,
      select: SELECT,
    });
    return successJson({ user: safeUser(updated) });
  } catch (error) {
    console.error("admin blog user update failed:", error);
    return errorJson("Could not update the account.", 500);
  }
}

/**
 * Delete a BlogUser only when it is safe to do so.
 *
 * Guard: deletion is blocked (409) when the account owns published or
 * approved content — it must be reassigned first. Unpublished drafts
 * (and any reverted-but-never-published rows) do not block deletion;
 * their posts are removed in the same transaction so no orphan rows
 * survive. Approved revision/audit history is carried along by the
 * post cascade; no data is silently dropped.
 */
export async function DELETE(request: Request, context: RouteContext) {
  const guard = await requireAdmin(request);
  if (!guard.ok) return guard.response;

  const { id: rawId } = await context.params;
  const id = readId(rawId);
  if (!id) return errorJson("Invalid account id.", 400);

  try {
    const user = await prisma.blogUser.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
    if (!user) return errorJson("Account not found.", 404);

    const [publishedPosts, approvedRevisions] = await Promise.all([
      prisma.blogPost.count({ where: { ownerId: id, status: "PUBLISHED" } }),
      prisma.blogPostRevision.count({
        where: {
          blogPost: { ownerId: id },
          reviewStage: "APPROVED",
        },
      }),
    ]);

    if (publishedPosts > 0 || approvedRevisions > 0) {
      return errorJson(
        "This account owns published or approved content. Reassign that content to another account (or archive it) before deleting the account.",
        409,
      );
    }

    const outcome = await prisma.$transaction(
      async (transaction) => {
        const deletedPosts = await transaction.blogPost.deleteMany({
          where: { ownerId: id },
        });
        const deletedUser = await transaction.blogUser.delete({
          where: { id },
        });
        return { deletedPosts: deletedPosts.count, deletedUser: deletedUser.id };
      },
      { isolationLevel: "Serializable" },
    );

    return successJson({ id: outcome.deletedUser, deletedPosts: outcome.deletedPosts });
  } catch (error) {
    console.error("admin blog user delete failed:", error);
    return errorJson("Could not delete the account.", 500);
  }
}
