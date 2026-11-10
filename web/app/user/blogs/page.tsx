import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted for Review",
  RETURNED: "Returned",
  APPROVED: "Approved",
};

export default async function UserBlogsPage() {
  const current = await getCurrentUser();

  if (!current) {
    redirect("/user/login");
  }
  if (current.kind === "admin") {
    redirect("/admin");
  }

  const ownerId = Number(current.id);

  const posts = await prisma.blogPost.findMany({
    where: { ownerId },
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      status: true,
      reviewStage: true,
      rejectionReason: true,
      publishedAt: true,
      submittedAt: true,
      updatedAt: true,
      revisions: {
        where: { reviewStage: { not: "APPROVED" } },
        orderBy: [{ createdAt: "desc" }],
        select: { id: true, reviewStage: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
            WebEaz Blog Portal
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">My Blogs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
            Drafts, submissions and their review status. Only approved blogs appear
            on the public Insights site.
          </p>
        </div>
        <Link
          href="/user/blogs/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-brand-orange-deep"
        >
          New blog draft
        </Link>
      </header>

      {posts.length === 0 ? (
        <p role="status" className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          You have no blogs yet. Create your first draft to get started.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-black/20 text-xs uppercase tracking-wide text-white/55">
              <tr>
                <th scope="col" className="px-4 py-3">Title</th>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3">Public</th>
                <th scope="col" className="px-4 py-3">Review</th>
                <th scope="col" className="px-4 py-3">Updated</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {posts.map((post) => {
                const pending = post.revisions[0] ?? null;
                const stage = pending?.reviewStage ?? post.reviewStage;
                return (
                  <tr key={post.id} className="text-white/80">
                    <td className="px-4 py-3">
                      <span className="block font-semibold text-white">{post.title}</span>
                      <span className="text-xs text-white/45">/{post.slug}</span>
                    </td>
                    <td className="px-4 py-3">{post.category}</td>
                    <td className="px-4 py-3">{post.status}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold">
                        {STAGE_LABELS[stage] ?? stage}
                      </span>
                      {pending ? (
                        <span className="ml-2 text-xs text-white/45">edit pending</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(post.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/user/blogs/${post.id}`} className="rounded-lg border border-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/5">
                          View
                        </Link>
                        <Link href={`/user/blogs/${post.id}/edit`} className="rounded-lg border border-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/5">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
