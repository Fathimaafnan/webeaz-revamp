import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import BlogUsersManager, { type BlogUserRow } from "@/components/admin/BlogUsersManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogUsersPage() {
  const user = await getAdmin();
  if (!user) {
    redirect("/admin/login");
  }

  let users: BlogUserRow[] = [];
  let loadError: string | null = null;

  try {
    const rows = await prisma.blogUser.findMany({
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        applicationId: true,
        invitations: {
          select: {
            id: true,
            expiresAt: true,
            usedAt: true,
            revokedAt: true,
            sentStatus: true,
            sentAt: true,
            deliveryError: true,
          },
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { posts: true } },
      },
    });
    users = rows.map(({ _count, invitations, ...row }) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      postCount: _count.posts,
      applicationId: row.applicationId,
      latestInvitation: invitations[0]
        ? {
            ...invitations[0],
            expiresAt: invitations[0].expiresAt.toISOString(),
            sentAt: invitations[0].sentAt ? invitations[0].sentAt.toISOString() : null,
            usedAt: invitations[0].usedAt ? invitations[0].usedAt.toISOString() : null,
            revokedAt: invitations[0].revokedAt ? invitations[0].revokedAt.toISOString() : null,
          }
        : null,
    }));
  } catch (error) {
    console.error("admin blog users load failed:", error);
    loadError = "Account data is unavailable. The public website is unaffected.";
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          Content Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Blog Users</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
          Create contributor accounts, activate or deactivate them, and reset
          their passwords. Blog users can only write; all publishing still goes
          through blog review.
        </p>
      </header>

      {loadError ? (
        <p role="alert" className="rounded-xl border border-amber-300/20 bg-amber-500/5 p-4 text-sm text-amber-100">
          {loadError}
        </p>
      ) : null}

      <BlogUsersManager initialUsers={users} />
    </div>
  );
}
