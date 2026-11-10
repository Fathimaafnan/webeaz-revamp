import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBlogReviewsPage() {
  const user = await getAdmin();
  if (!user) {
    redirect("/admin/login");
  }

  const reviews = await prisma.blogPostRevision.findMany({
    where: { reviewStage: "SUBMITTED" },
    orderBy: [{ submittedAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      submittedAt: true,
      blogPost: {
        select: {
          id: true,
          slug: true,
          title: true,
          status: true,
          owner: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          Content Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Blog Reviews</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
          Submissions waiting for approval. Approving publishes the proposal to
          the live Insights site; returning sends it back with your reason.
        </p>
      </header>

      {reviews.length === 0 ? (
        <p role="status" className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          No submissions are waiting for review.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-black/20 text-xs uppercase tracking-wide text-white/55">
              <tr>
                <th scope="col" className="px-4 py-3">Proposal</th>
                <th scope="col" className="px-4 py-3">Blog</th>
                <th scope="col" className="px-4 py-3">Author</th>
                <th scope="col" className="px-4 py-3">Submitted</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reviews.map((rev) => (
                <tr key={rev.id} className="text-white/80">
                  <td className="px-4 py-3">
                    <span className="block font-semibold text-white">{rev.title}</span>
                    <span className="text-xs text-white/45">/{rev.slug}</span>
                  </td>
                  <td className="px-4 py-3">
                    {rev.blogPost.title}
                    <span className="ml-2 text-xs text-white/45">{rev.blogPost.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {rev.blogPost.owner?.name ?? "—"}
                    <span className="block text-xs text-white/45">{rev.blogPost.owner?.email ?? ""}</span>
                  </td>
                  <td className="px-4 py-3">
                    {rev.submittedAt
                      ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(rev.submittedAt)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog-reviews/${rev.id}`}
                      className="rounded-lg border border-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/5"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
