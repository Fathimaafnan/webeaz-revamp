import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import { getPublishedPostBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function InsightPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post || !post.content.trim()) notFound();

  const date = post.publishedAt
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(post.publishedAt)
    : null;

  return (
    <PageShell eyebrow={post.category} title={post.title} description={post.excerpt}>
      <article className="mx-auto mt-8 max-w-3xl">
        <p className="text-sm text-muted">
          By {post.author}
          {date ? ` · ${date}` : ""}
        </p>
        {post.coverImage ? (
          <div className="mt-8 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              className="max-h-[34rem] w-full object-cover"
            />
          </div>
        ) : null}
        <div className="prose-webeaz mt-10 space-y-5 text-base leading-8 text-muted">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 className="mt-10 text-2xl font-bold text-ink">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-8 text-xl font-bold text-ink">{children}</h3>
              ),
              p: ({ children }) => <p className="leading-8">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc space-y-2 pl-6">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal space-y-2 pl-6">{children}</ol>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="font-semibold text-brand-blue-deep underline underline-offset-4"
                  rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-brand-orange pl-5 italic text-ink">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="rounded bg-brand-blue-soft px-1.5 py-0.5 text-sm text-brand-blue-deep">
                  {children}
                </code>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        <Link
          href="/insights"
          className="mt-12 inline-flex text-sm font-semibold text-brand-blue-deep underline underline-offset-4"
        >
          ← All insights
        </Link>
      </article>
    </PageShell>
  );
}
