import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin-auth";
import BlogEditor from "@/components/user/BlogEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
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
      author: true,
      seoTitle: true,
      seoDescription: true,
      status: true,
      reviewStage: true,
      revisions: {
        where: { reviewStage: { not: "APPROVED" } },
        orderBy: [{ createdAt: "desc" }],
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
        },
      },
    },
  });

  if (!post) redirect("/user/blogs");

  const published = post.status === "PUBLISHED";
  const pending = post.revisions[0] ?? null;
  const underReview =
    pending?.reviewStage === "SUBMITTED" || post.reviewStage === "SUBMITTED";

  // Published posts are edited through their pending revision: the form
  // edits the proposal, never the live blog. Returned revisions keep
  // their reason so the author can correct and resubmit.
  const editing = published && pending
    ? {
        title: pending.title,
        slug: pending.slug,
        excerpt: pending.excerpt,
        content: pending.content,
        category: pending.category,
        coverImage: pending.coverImage,
        author: pending.author,
        seoTitle: pending.seoTitle,
        seoDescription: pending.seoDescription,
      }
    : {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        coverImage: post.coverImage,
        author: post.author,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
      };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          WebEaz Blog Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Edit blog</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          {published
            ? "This blog is live. Your edits are saved as a private proposal and will only replace the public version if an administrator approves them."
            : "Changes save to your private draft until you submit them for review."}
        </p>
      </header>

      {pending ? (
        <p role="status" className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          Proposal stage: <strong className="text-white">{pending.reviewStage}</strong>
          {" · "}
          <Link href={`/user/blogs/${post.id}`} className="font-semibold text-brand-orange-light underline underline-offset-4">
            View details and submission actions
          </Link>
        </p>
      ) : null}

      <BlogEditor
        initial={{ id: post.id, ...editing }}
        slugLocked={published}
        locked={Boolean(underReview)}
        lockedMessage="This blog is under review. Withdraw the submission before editing."
      />
    </div>
  );
}
