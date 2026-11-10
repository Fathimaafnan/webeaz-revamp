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

function formatDate(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(value)
    : "—";
}

export default async function UserDashboardPage() {
  // Defense in depth: the layout already guards; this re-check keeps
  // the data fetch safe even if the page is ever moved. Every query
  // below is scoped to the authenticated BlogUser's database ID.
  const current = await getCurrentUser();

  if (!current) {
    redirect("/user/login");
  }
  if (current.kind === "admin") {
    redirect("/admin");
  }

  const ownerId = Number(current.id);

  const [total, byStage, posts] = await Promise.all([
    prisma.blogPost.count({ where: { ownerId } }),
    prisma.blogPost.groupBy({
      where: { ownerId },
      by: ["reviewStage"],
      _count: { _all: true },
    }),
    prisma.blogPost.findMany({
      where: { ownerId },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        title: true,
        category: true,
        reviewStage: true,
        updatedAt: true,
      },
    }),
  ]);

  const stageCount = (stage: string) =>
    byStage.find((row) => row.reviewStage === stage)?._count._all ?? 0;

  const cards = [
    { label: "Total Blogs", value: total },
    { label: "Drafts", value: stageCount("DRAFT") },
    { label: "Submitted for Review", value: stageCount("SUBMITTED") },
    { label: "Returned", value: stageCount("RETURNED") },
    { label: "Approved", value: stageCount("APPROVED") },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          WebEaz Blog Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Welcome, {current.name ?? "Contributor"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          This portal is for managing your blog content. Create drafts,
          submit them for Admin review and track their status. Only
          approved blogs are published to the public Insights site.
        </p>
      </header>

      <section aria-label="Blog statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-white/10 bg-brand-blue-deep/40 p-4">
            <p className="text-xs text-white/60">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <section aria-label="My blogs" className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-bold text-white">My Blogs</h2>

        {posts.length === 0 ? (
          <p role="status" className="mt-4 rounded-lg border border-white/10 bg-black/25 px-4 py-6 text-sm text-white/60">
            You have no blogs yet. When you create one, it will appear here
            with its review status so you can track it from draft to approval.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-black/20 text-xs uppercase tracking-wide text-white/55">
                <tr>
                  <th scope="col" className="px-4 py-3">Title</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Review Status</th>
                  <th scope="col" className="px-4 py-3">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {posts.map((post) => (
                  <tr key={post.id} className="text-white/80">
                    <td className="px-4 py-3 font-semibold text-white">{post.title}</td>
                    <td className="px-4 py-3">{post.category}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold">
                        {STAGE_LABELS[post.reviewStage] ?? post.reviewStage}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(post.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
