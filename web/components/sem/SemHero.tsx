import Link from "next/link";
import ServiceIcon from "@/components/services/ServiceIcon";
import { heroMicrocopy, semAnchors } from "@/lib/sem-page-content";

/**
 * SEM page hero.
 *
 * The right-hand visual is an abstract campaign workspace: a search
 * field, sponsored result rows, intent chips, bidding controls and an
 * AI-assist panel. It carries NO metrics, spend figures, ROAS or
 * conversion percentages, and it uses no third-party logo — nothing
 * on it can be read as a real WebEaz result or as an official
 * partnership with any advertising platform.
 */
export default function SemHero() {
  return (
    <section className="marketing-hero relative overflow-hidden px-5 pb-16 pt-24 text-white sm:px-8 sm:pb-20 sm:pt-32">
      {/* The blue orb uses the bright brand blue so it stays visible
          against the blue field, and the orange stays restrained. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[18%] -top-[22%] h-[36rem] w-[36rem] rounded-full bg-brand-blue-bright/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[14%] top-[4%] h-[28rem] w-[28rem] rounded-full bg-brand-orange/18 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-8 lg:gap-12">
        {/* ---------------- Copy ---------------- */}
        <div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-orange-light backdrop-blur-sm">
              SEM Services
            </span>
          </div>

          <h1 className="mt-8 text-h1 font-bold leading-[1.1] tracking-tight text-white">
            Turn High-Intent Searches Into{" "}
            <span className="text-brand-orange">Real Business Growth</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/75 sm:text-lg">
            Be there when your next customer is searching. WebEaz combines
            intelligent search advertising, AI-assisted campaign optimization,
            and conversion-focused strategies to help your business attract the
            right audience and turn clicks into meaningful opportunities.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Get Your SEM Strategy
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href={`#${semAnchors.process}`}
              className="inline-flex items-center justify-center rounded-full border border-brand-blue-light/45 bg-brand-blue/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-brand-blue-light hover:bg-brand-blue/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Explore Our Approach
            </Link>
          </div>

          <p className="mt-7 max-w-lg border-l-2 border-brand-orange/60 pl-4 text-sm leading-6 text-white/70">
            {heroMicrocopy}
          </p>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/50">
            From your first campaign to your next stage of growth, every decision
            starts with your objectives.
          </p>
        </div>

        {/* ---------------- Campaign workspace ---------------- */}
        <div className="relative" aria-hidden="true">
          <div className="relative rounded-3xl border border-white/12 bg-white/[0.045] p-4 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-5">
            {/* Search field */}
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-brand-blue-deep px-4 py-3">
              <ServiceIcon name="ads" className="h-4 w-4 shrink-0 text-brand-orange-light" />
              <span className="h-2.5 flex-1 rounded-full bg-white/12" />
              <span className="hidden h-2 w-12 rounded-full bg-brand-blue/45 sm:block" />
            </div>

            {/* Sponsored result rows */}
            <div className="mt-3 space-y-2.5">
              {[0, 1, 2].map((r) => (
                <div
                  key={r}
                  className={`rounded-xl border p-3.5 ${
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
                    <span className="h-2 w-[34%] rounded-full bg-white/16" />
                    <span className="ml-auto h-2 w-12 rounded-full border border-brand-blue/35 px-1" />
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    <div className="h-1.5 w-[84%] rounded-full bg-white/10" />
                    <div className="h-1.5 w-[58%] rounded-full bg-white/[0.07]" />
                  </div>
                  <div className="mt-2.5 flex gap-1.5">
                    <span className="h-1.5 w-8 rounded-full bg-white/[0.08]" />
                    <span className="h-1.5 w-6 rounded-full bg-white/[0.06]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Intent chips */}
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Search intent
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2.5 py-1 text-[10px] font-medium text-brand-orange-light">
                  Transactional
                </span>
                <span className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-white/60">
                  Commercial
                </span>
                <span className="rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-white/60">
                  Informational
                </span>
                <span className="rounded-full border border-brand-blue/30 bg-brand-blue/10 px-2.5 py-1 text-[10px] font-medium text-brand-blue-light">
                  High intent
                </span>
              </div>
            </div>

            {/* AI assist panel */}
            <div className="mt-3 rounded-xl border border-brand-blue/25 bg-brand-blue/10 p-4">
              <div className="flex items-center gap-2">
                <ServiceIcon name="ai-automation" className="h-3.5 w-3.5 text-brand-blue-light" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-blue-light">
                  AI-assisted optimization
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                  <span className="h-1.5 flex-1 rounded-full bg-white/12" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue-light" />
                  <span className="h-1.5 w-[78%] rounded-full bg-white/10" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue-light" />
                  <span className="h-1.5 w-[52%] rounded-full bg-white/[0.08]" />
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.14em] text-white/55">
              Illustrative interface — not live campaign data
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}