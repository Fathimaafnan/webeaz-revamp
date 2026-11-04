import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import BlogEditor from "@/components/admin/BlogEditor";
import { secondaryButton } from "@/components/admin/api";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditPostPage({ params }: Props) {
  const user = await getAdmin();
  if (!user) return null;

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) notFound();

  const post = await prisma.blogPost.findUnique({ where: { id } }).catch(() => null);
  if (!post) notFound();

  let media: Array<{ id: number; url: string; originalName: string; alt: string }> = [];
  try {
    media = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, url: true, originalName: true, alt: true },
    });
  } catch {
    media = [];
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-brand-blue-light">
          Blog management
        </p>
        <h1 className="text-3xl font-bold text-white">Edit post</h1>
        <p className="text-sm text-white/70">
          Last updated {post.updatedAt.toLocaleString("en-IN")}.
        </p>
      </div>

      <div>
        <Link href="/admin/blog" className={secondaryButton}>
          ← Back to posts
        </Link>
      </div>

      <BlogEditor
        media={media}
        initial={{
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          coverImage: post.coverImage,
          author: post.author,
          publishedAt: post.publishedAt ? post.publishedAt.toISOString() : "",
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
          status: post.status,
        }}
      />
    </>
  );
}
