import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { getPublishedPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Ideas, insights and perspectives on technology, AI, digital growth and automation from the WebEaz team.",
  alternates: { canonical: "/insights" },
};

function publicationDate(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(value)
    : "Coming soon";
}

export default async function InsightsPage() {
  const posts = await getPublishedPosts();

  return (
    <PageShell
      eyebrow="Insights"
      title="Ideas. Insights. What's next."
      description="Perspectives on technology, AI, digital growth and automation from the WebEaz team. New articles are published regularly."
    >
      {posts.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {posts.map((post, index) => {            const card = (
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-lg hover:shadow-brand-blue/5">
                {post.coverImage ? (
                  <div className="relative h-52 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="rounded-full bg-brand-blue-soft px-3 py-1 font-semibold uppercase tracking-wider text-brand-blue-deep">
                      {post.category}
                    </span>
                    <span className="text-muted">
                      {publicationDate(post.publishedAt)}
                    </span>
                  </div>
                  <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                    {post.excerpt}
                  </p>
                  <p className="mt-5 text-xs text-muted">By {post.author}</p>
                  {post.slug && post.content.trim() ? (
                    <span className="mt-5 text-sm font-semibold text-brand-blue-deep">
                      Read article →
                    </span>
                  ) : null}
                </div>
              </article>
            );

            return (
              <Reveal key={post.id} delay={index * 60}>
                {post.slug && post.content.trim() ? (
                  <Link
                    href={`/insights/${post.slug}`}
                    className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
                    aria-label={`Read ${post.title}`}
                  >
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </Reveal>
            );
          })}
        </div>
      ) : (
        <p className="mt-10 rounded-xl border border-line bg-white p-6 text-sm text-muted">
          No articles are currently published.
        </p>
      )}

      <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-blue/20 bg-brand-blue-soft p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">
            Write for WebEaz
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
            Are you a developer, technology professional, or industry
            enthusiast? Share your expertise with our community.
          </p>
        </div>
        <Link
          href="/blog/become-a-contributor"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep"
        >
          Apply to Become a Contributor
        </Link>
      </div>
    </PageShell>
  );
}
