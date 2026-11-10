import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import BlogReviewActions from "@/components/admin/BlogReviewActions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function Snapshot({
  label,
  title,
  slug,
  excerpt,
  content,
  category,
  coverImage,
  seoTitle,
  seoDescription,
}: {
  label: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}) {
  return (
    <section aria-label={label} className="rounded-xl border border-white/10 bg-black/10 p-4">
      <h3 className="font-semibold text-white">{label}</h3>
      <p className="mt-1 text-xs text-white/50">/{slug}</p>
      <p className="mt-3 font-bold text-white">{title}</p>
      <p className="mt-1 text-xs text-white/45">{category}</p>
      {coverImage ? (
        <div className="mt-3 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt="" className="max-h-40 w-full object-cover" />
        </div>
      ) : null}
      <p className="mt-3 text-sm leading-6 text-white/75">{excerpt || "No excerpt."}</p>
      <div className="mt-3 max-h-72 overflow-y-auto rounded-lg bg-black/20 p-3 text-sm leading-6 text-white/70">
        <p className="whitespace-pre-wrap">{content || "No content."}</p>
      </div>
      <p className="mt-3 text-xs text-white/45">SEO title: {seoTitle ?? "—"}</p>
      <p className="text-xs text-white/45">SEO description: {seoDescription ?? "—"}</p>
    </section>
  );
}

export default async function AdminBlogReviewDetailPage({ params }: Props) {
  const user = await getAdmin();
  if (!user) {
    redirect("/admin/login");
  }

  const { id: rawId } = await params;
  if (!/^[1-9]\d*$/.test(rawId)) redirect("/admin/blog-reviews");
  const revisionId = Number(rawId);
  if (!Number.isSafeInteger(revisionId)) redirect("/admin/blog-reviews");

  const revision = await prisma.blogPostRevision.findUnique({
    where: { id: revisionId },
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
          owner: { select: { id: true, name: true, email: true } },
          reviewer: { select: { id: true, name: true, email: true } },
          revisions: {
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            select: {
              id: true,
              title: true,
              slug: true,
              reviewStage: true,
              rejectionReason: true,
              submittedAt: true,
              reviewedAt: true,
              createdAt: true,
            },
          },
          audits: {
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            select: {
              id: true,
              action: true,
              detail: true,
              createdAt: true,
              admin: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
    },
  });

  if (!revision) redirect("/admin/blog-reviews");

  const post = revision.blogPost;
  const isPending = revision.reviewStage === "SUBMITTED";

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          Content Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Review: {revision.title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/70">
          Stage <strong className="text-white">{revision.reviewStage}</strong>
          {" · "}Blog status <strong className="text-white">{post.status}</strong>
          {" · "}Author: {post.owner?.name ?? "Unassigned"} ({post.owner?.email ?? "—"})
          {" · "}Submitted: {revision.submittedAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(revision.submittedAt) : "—"}
        </p>
      </header>

      {revision.rejectionReason ? (
        <p role="alert" className="rounded-xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">
          <strong>Previous return reason:</strong> {revision.rejectionReason}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Snapshot
          label="Currently live"
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          content={post.content}
          category={post.category}
          coverImage={post.coverImage}
          seoTitle={post.seoTitle}
          seoDescription={post.seoDescription}
        />
        <Snapshot
          label="Proposed"
          title={revision.title}
          slug={revision.slug}
          excerpt={revision.excerpt}
          content={revision.content}
          category={revision.category}
          coverImage={revision.coverImage}
          seoTitle={revision.seoTitle}
          seoDescription={revision.seoDescription}
        />
      </div>

      {isPending ? (
        <BlogReviewActions revisionId={revision.id} proposedSlug={revision.slug} />
      ) : (
        <p role="status" className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
          This revision is {revision.reviewStage}. It can no longer be approved or returned.
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-semibold text-white">Revision history</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {post.revisions.map((r) => (
              <li key={r.id}>
                <span className="text-white">{r.title || "(untitled)"}</span>
                {" · "}{r.reviewStage}
                {" · "}{r.submittedAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(r.submittedAt) : "—"}
                {r.rejectionReason ? ` — ${r.rejectionReason}` : ""}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-semibold text-white">Audit trail</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {post.audits.map((a) => (
              <li key={a.id}>
                <span className="text-white">{a.action}</span>
                {" · "}{a.admin?.email ?? "system"}
                {" · "}{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(a.createdAt)}
                {a.detail ? ` — ${a.detail}` : ""}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
