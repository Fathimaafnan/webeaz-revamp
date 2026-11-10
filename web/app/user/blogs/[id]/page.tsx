import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import BlogWorkflowActions from "@/components/user/BlogWorkflowActions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDate(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(value)
    : "—";
}

export default async function BlogDetailPage({ params }: Props) {
  const current = await getCurrentUser();

  if (!current) {
    redirect("/user/login");
  }
  if (current.kind === "admin") {
    redirect("/admin");
  }

  const { id: rawId } = await params;
  if (!/^[1-9]\d*$/.test(rawId)) redirect("/user/blogs");
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) redirect("/user/blogs");

  const post = await prisma.blogPost.findFirst({
    where: { id, ownerId: Number(current.id) },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      category: true,
      coverImage: true,
      status: true,
      reviewStage: true,
      rejectionReason: true,
      publishedAt: true,
      submittedAt: true,
      reviewedAt: true,
      createdAt: true,
      updatedAt: true,
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
    },
  });

  if (!post) redirect("/user/blogs");

  const pending = post.revisions.find((r) => r.reviewStage !== "APPROVED") ?? null;
  // The return reason is recorded on the revision (and audit), never on
  // the post itself. Show the latest returned reason only while the blog
  // is actually awaiting correction; it disappears once resubmitted.
  const returnedReason =
    pending?.reviewStage === "RETURNED" && pending.rejectionReason
      ? pending.rejectionReason
      : null;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          WebEaz Blog Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{post.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          Public status: <strong className="text-white">{post.status}</strong>
          {" · "}Review: <strong className="text-white">{post.reviewStage}</strong>
          {post.publishedAt ? ` · Published ${formatDate(post.publishedAt)}` : ""}
        </p>
      </header>

      {returnedReason ? (
        <p role="alert" className="rounded-xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">
          <strong>Returned for correction:</strong> {returnedReason}. Edit the blog and resubmit when ready.
        </p>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-semibold text-white">Content</h2>
        <p className="mt-3 text-sm text-white/70">/{post.slug} · {post.category}</p>
        {post.coverImage ? (
          <div className="mt-4 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt="" className="max-h-64 w-full object-cover" />
          </div>
        ) : null}
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/80">
          {post.content || "No content yet."}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-semibold text-white">Workflow</h2>
        <dl className="mt-3 grid gap-2 text-sm text-white/70 sm:grid-cols-2">
          <div><dt className="text-white/45">Submitted</dt><dd>{formatDate(post.submittedAt)}</dd></div>
          <div><dt className="text-white/45">Reviewed</dt><dd>{formatDate(post.reviewedAt)}</dd></div>
          <div><dt className="text-white/45">Created</dt><dd>{formatDate(post.createdAt)}</dd></div>
          <div><dt className="text-white/45">Last updated</dt><dd>{formatDate(post.updatedAt)}</dd></div>
        </dl>
        <div className="mt-5">
          <BlogWorkflowActions blogId={post.id} />
        </div>
      </div>

      {post.revisions.length > 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-semibold text-white">Revision history</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {post.revisions.map((rev) => (
              <li key={rev.id}>
                <span className="text-white">{rev.title || "(untitled)"}</span>
                {" · "}{rev.reviewStage}
                {" · "}{formatDate(rev.submittedAt)}
                {rev.rejectionReason ? ` — ${rev.rejectionReason}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link href={`/user/blogs/${post.id}/edit`} className="text-sm font-semibold text-brand-orange-light underline underline-offset-4">
        Edit this blog
      </Link>
    </div>
  );
}
