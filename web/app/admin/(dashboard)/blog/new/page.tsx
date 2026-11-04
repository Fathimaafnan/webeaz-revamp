import Link from "next/link";
import { getAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import BlogEditor from "@/components/admin/BlogEditor";
import { secondaryButton } from "@/components/admin/api";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  const user = await getAdmin();
  if (!user) return null;

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
        <h1 className="text-3xl font-bold text-white">New post</h1>
        <p className="text-sm text-white/70">
          Drafts stay hidden from the public site until you publish them.
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
          slug: "",
          title: "",
          excerpt: "",
          content: "",
          category: "Insights",
          coverImage: null,
          author: "WebEaz Technologies",
          publishedAt: "",
          seoTitle: "",
          seoDescription: "",
          status: "DRAFT",
        }}
      />
    </>
  );
}
