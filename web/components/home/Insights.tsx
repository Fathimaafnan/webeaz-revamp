import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import CardIcon from "@/components/ui/CardIcon";
import Reveal from "@/components/ui/Reveal";
import type { PublishedBlogPost } from "@/lib/content";
import type { HomeSection, HomepageBlogSettings } from "@/lib/defaults";
import Image from "next/image";

/**
 * Abstract editorial cover art. The articles are placeholders
 * with no photography, so each card gets a generated,
 * brand-tinted cover keyed to its category rather than invented
 * stock imagery. Decorative only.
 */
function InsightCover({ index, category, image }: { index: number; category: string; image?: string }) {
  return (
    <div
      className={`card-media card-media-grid card-editorial-media relative h-[180px] overflow-hidden rounded-2xl bg-gray-50/50 ${index % 2 === 1 ? "card-media-warm" : ""}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-brand-orange/10 blur-3xl"
      />
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            className="relative block w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-103"
            fill
            sizes="(min-width: 640px) 560px, 100vw"
            aspect-ratio="4/3"
          />
          {/* Readability scrim: the category label below is dark
              (#414b58), so photo covers need a light fade — not a
              dark one — for the label to stay legible. Sits only
              behind the label band; pointer-events-none keeps the
              card link interactive. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/95 via-white/75 to-transparent transition-colors duration-300 hover:from-white/100 hover:via-white/80 hover:to-transparent"
          />
        </>
      ) : (
        <div
          className="relative h-[180px] flex items-center justify-center border-2 border-dashed border-gray-300/50 
rounded-2xl flex items-center justify-center text-muted/30"
        >
          <svg
            viewBox="0 0 280 160"
            className="relative h-full w-full opacity-50"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
          </svg>
        </div>
      )}
      <span className="absolute bottom-4 left-5 flex items-center gap-2">
        <CardIcon name="insight" className="h-4 w-4 text-brand-blue/70" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {category}
        </span>
      </span>
    </div>
  );
}

/**
 * "Blogs" — up to 3 CMS-selected featured BlogPost cards.
 * Heading, subtitle, Explore More and contributor CTA come from the
 * Admin Homepage Section (key "blogs") + homepage blog settings.
 * The section itself is gated by section.visible in the homepage;
 * a missing section prop falls back to CMS defaults.
 *
 * Cards always read live BlogPost fields (cover, title, slug, category,
 * excerpt, date) — no duplicated content is stored in homepage settings.
 * Posts are pre-filtered to eligible (PUBLISHED + APPROVED) only.
 */
export default function Insights({
  posts,
  section,
  settings,
}: {
  posts: PublishedBlogPost[];
  section: HomeSection;
  settings: HomepageBlogSettings;
}) {
  return (
    <section className="sec-mist theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      {/* Orange radial with blue atmospheric lighting */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift absolute -left-[15%] top-[8%] h-[28rem] w-[28rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift-slow absolute -right-[12%] bottom-[15%] h-[30rem] w-[30rem]"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:mt-16 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => {
            const date = post.publishedAt
              ? new Intl.DateTimeFormat("en", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(post.publishedAt)
              : "Coming soon";
            const card = (
              <article
                key={post.id}
                className="card-editorial group relative overflow-hidden rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-1 duration-300"
              >
                <InsightCover index={i} category={post.category} image={post.coverImage ?? undefined} />
                <div className="flex flex-1 flex-col p-8 sm:p-9">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="rounded-full bg-brand-blue-soft/30 px-3.5 py-1 font-medium uppercase tracking-wider text-brand-blue-600 border border-brand-blue-soft/20">
                      {post.category}
                    </span>
                    <span className="shrink-0 text-muted/70 text-xs font-medium tracking-wider">
                      {date}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink sm:text-xl line-clamp-2">
                    {post.title}
                  </h3>
                  <span aria-hidden="true" className="card-editorial-rule" />
                  <p className="mt-3 text-sm leading-relaxed text-muted/90 sm:text-base line-clamp-3">
                    {post.excerpt}
                  </p>
                  {post.slug && post.content.trim() ? (
                    <span className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-orange-600 transition-colors hover:text-brand-orange-400">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                      Read article
                    </span>
                  ) : null}
                </div>
              </article>
            );

            return (
              <Reveal key={post.id} delay={i * 60}>
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

        <Reveal delay={150}>
          <div className="mt-12 flex justify-center">
            <Link
              href={settings.exploreHref}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue-deep hover:text-brand-blue"
            >
              {settings.exploreLabel} →
            </Link>
          </div>
        </Reveal>

        {/* Become a Contributor — compact promo banner inside the Blogs
            section. Distinct from the blog cards; not a modal. */}
        {settings.ctaVisible ? (
          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-blue/20 bg-brand-blue-soft p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {settings.ctaHeading}
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted">
                {settings.ctaDescription}
              </p>
            </div>
            <Link
              href={settings.ctaHref}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep"
            >
              {settings.ctaLabel} →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}