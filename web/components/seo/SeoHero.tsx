import Link from "next/link";
import ServiceIcon from "@/components/services/ServiceIcon";
import { heroLabels, seoAnchors } from "@/lib/seo-page-content";

/**
 * SEO page hero.
 *
 * The right-hand visual is an abstract "search workspace" built from
 * real interface structure — a search field, a featured-answer block,
 * result rows and a topic cluster. It deliberately shows NO traffic
 * numbers, ranking positions or growth percentages, because those
 * would be fabricated performance figures.
 */
export default function SeoHero() {
  return (
    <section className="marketing-hero relative overflow-hidden px-5 pb-16 pt-24 text-white sm:px-8 sm:pb-20 sm:pt-32">
      {/* Brand-tinted atmosphere drawn from the logo colours. The blue
          orb is the bright brand blue rather than the base one, which
          would disappear into the blue field behind it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[18%] -top-[22%] h-[36rem] w-[36rem] rounded-full bg-brand-blue-bright/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[14%] top-[6%] h-[28rem] w-[28rem] rounded-full bg-brand-orange/18 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-8 lg:gap-12">
        {/* ---------------- Copy ---------------- */}
        <div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-orange-light backdrop-blur-sm">
              SEO Services
            </span>
          </div>

          <h1 className="mt-8 text-h1 font-bold leading-[1.1] tracking-tight text-white">
            Get Found.{" "}
            <span className="text-brand-orange">Earn Trust.</span>{" "}
            Grow with Search.
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-white/90 sm:text-xl">
            Search visibility that connects your business with the right audience
            at the right moment.
          </p>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/65">
            Turn your website into a stronger source of organic traffic, qualified
            leads, and business opportunities with strategic SEO built for modern
            search.
          </p>
          <p className="mt-3 max-w-xl text-base leading-7 text-white/65">
            From technical optimization and search-focused content to local SEO and
            AI-assisted insights, WebEaz helps your business become easier to
            discover when customers are looking for solutions like yours.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`#${seoAnchors.enquiry}`}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Get Your SEO Audit
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href={`#${seoAnchors.process}`}
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-transparent px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-brand-orange-on-dark hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore Our SEO Approach
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2">
            {heroLabels.map((l, i) => (
              <li key={l} className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-white/75">
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${i === 1 ? "bg-brand-orange" : "bg-brand-blue-light"}`}
                  />
                  {l}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Search workspace visual ---------------- */}
        <div className="relative" aria-hidden="true">
          <div className="relative rounded-3xl border border-white/12 bg-white/[0.045] p-4 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5">
            {/* Search field */}
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-brand-blue-deep px-4 py-3">
              <ServiceIcon name="seo" className="h-4 w-4 shrink-0 text-brand-orange-light" />
              <span className="h-2.5 flex-1 rounded-full bg-white/12" />
              <span className="hidden h-2 w-10 rounded-full bg-brand-blue/40 sm:block" />
            </div>

            {/* Featured answer block */}
            <div className="mt-3 rounded-xl border border-brand-blue/25 bg-brand-blue/10 p-4">
              <div className="flex items-center gap-2">
                <ServiceIcon name="ai-consulting" className="h-3.5 w-3.5 text-brand-blue-light" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-blue-light">
                  AI-assisted answer
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-white/15" />
                <div className="h-2 w-[88%] rounded-full bg-white/12" />
                <div className="h-2 w-[64%] rounded-full bg-brand-orange/35" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="h-2 w-14 rounded-full bg-brand-blue/35" />
                <span className="h-2 w-10 rounded-full bg-brand-orange/30" />
              </div>
            </div>

            {/* Result rows */}
            <div className="mt-3 space-y-2.5">
              {[0, 1, 2].map((r) => (
                <div
                  key={r}
                  className={`rounded-xl border p-3.5 transition-colors duration-300 ${
                    r === 0
                      ? "border-brand-orange/30 bg-brand-orange/[0.07]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-5 w-5 shrink-0 rounded-md ${
                        r === 0 ? "bg-brand-orange/45" : "bg-white/10"
                      }`}
                    />
                    <span className="h-2 w-[38%] rounded-full bg-white/16" />
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    <div className="h-1.5 w-[86%] rounded-full bg-white/10" />
                    <div className="h-1.5 w-[62%] rounded-full bg-white/[0.07]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Topic cluster strip */}
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Topic clusters
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2.5 py-1 text-[10px] font-medium text-brand-orange-light">
                  Core topic
                </span>
                <span className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-white">
                  Supporting
                </span>
                <span className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-white">
                  Long-tail
                </span>
                <span className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-white">
                  FAQ
                </span>
                <span className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-1 text-[10px] font-medium text-brand-blue-light">
                  Local
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.14em] text-white/35">
              Illustrative interface — not live performance data
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}