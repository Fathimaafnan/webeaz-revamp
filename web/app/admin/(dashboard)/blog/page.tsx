import Link from "next/link";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import BlogList from "@/components/admin/BlogList";
import { primaryButton } from "@/components/admin/api";

export const dynamic = "force-dynamic";

type PostRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string;
  status: string;
  publishedAt: Date | null;
  updatedAt: Date;
};

export default async function AdminBlogPage() {
  const user = await getAdmin();
  if (!user) return null;

  let posts: PostRow[] = [];
  let dbOk = false;

  try {
    const rows = await prisma.blogPost.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        author: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
    dbOk = true;
    posts = rows;
  } catch {
    dbOk = false;
  }

  const published = posts.filter((p) => p.status === "PUBLISHED").length;
  const drafts = posts.filter((p) => p.status === "DRAFT").length;
  const archived = posts.filter((p) => p.status === "ARCHIVED").length;

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-blue-light">
          Blog management
        </p>
        <h1 className="text-3xl font-bold text-white">Blog posts</h1>
        <p className="text-sm text-white/70">
          {published} published · {drafts} draft · {archived} archived. Only published
          posts appear on the public /insights page.
        </p>
        {!dbOk ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            The database is unreachable, so posts cannot be edited right now.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-white/60">
          {posts.length} post{posts.length === 1 ? "" : "s"} total
        </span>
        <Link href="/admin/blog/new" className={primaryButton}>
          New post
        </Link>
      </div>

      <BlogList posts={posts} canSave={dbOk} />
    </>
  );
}
