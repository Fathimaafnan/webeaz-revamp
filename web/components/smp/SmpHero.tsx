import Link from "next/link";
import ServiceIcon from "@/components/services/ServiceIcon";
import { smpAnchors } from "@/lib/smp-page-content";

/**
 * SMP hero.
 *
 * The right side is a layered social-content composition: a phone-like
 * post card, a reel card, a story card and an abstract analytics strip.
 * It contains NO follower counts, engagement rates or campaign figures,
 * and uses no platform logos or marks — only WebEaz brand colour and the
 * project's own icon set.
 */
export default function SmpHero() {
  return (
    <section className="marketing-hero relative overflow-hidden px-5 pb-16 pt-24 text-white sm:px-8 sm:pb-20 sm:pt-32">
      {/* Ambient brand lighting. The blue orbs use the bright brand
          blue so they still read against the blue field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[20%] -top-[24%] h-[38rem] w-[38rem] rounded-full bg-brand-blue-bright/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[16%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-brand-orange/18 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-8 lg:gap-12">
        {/* ---------------- Copy ---------------- */}
        <div>
          <div className="flex items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-orange-light backdrop-blur-sm">
              SMH Services
            </span>
          </div>

          <h1 className="mt-8 text-h1 font-bold leading-[1.1] tracking-tight text-white">
            Turn Social Media Attention Into{" "}
            <span className="text-brand-orange">Business Growth.</span>
          </h1>

          <p className="mt-6 text-lg font-medium leading-8 text-white/90">
            Creative campaigns. Smarter targeting. Meaningful engagement.
            Measurable results.
          </p>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
            We help brands build a powerful social presence through strategic
            content, AI-assisted insights, engaging creatives and
            performance-focused campaigns. From the first impression to the next
            customer enquiry, we make every interaction count.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`#${smpAnchors.enquiry}`}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Let&apos;s Grow Your Brand
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href={`#${smpAnchors.strategy}`}
              className="inline-flex items-center justify-center rounded-full border border-brand-blue-light/45 bg-brand-blue/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-brand-blue-light hover:bg-brand-blue/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Explore Our Strategy
            </Link>
          </div>
        </div>

        {/* ---------------- Layered social composition ---------------- */}
        <div className="relative" aria-hidden="true">
          {/* Back card — reel */}
          <div className="absolute -right-3 top-2 hidden w-44 rotate-6 rounded-2xl border border-white/12 bg-brand-blue-deep/90 p-3 shadow-2xl backdrop-blur-xl sm:block lg:-right-6 lg:top-4">
            <div className="flex h-24 items-center justify-center rounded-xl bg-[linear-gradient(150deg,#0b4b7d,#1076bc)]">
              <ServiceIcon name="mobile" className="h-7 w-7 text-white/85" />
            </div>
            <div className="mt-2.5 space-y-1.5">
              <span className="block h-1.5 w-3/4 rounded-full bg-white/18" />
              <span className="block h-1.5 w-1/2 rounded-full bg-white/10" />
            </div>
            <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-2 py-0.5 text-[9px] font-medium text-brand-orange-light">
              Short-form
            </span>
          </div>

          {/* Front card — main post */}
          <div className="relative w-full max-w-[19rem] rounded-3xl border border-white/12 bg-white/[0.05] p-4 shadow-[0_44px_100px_-44px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:max-w-[21rem] sm:p-5">
            {/* chrome */}
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3.5">
              <span className="h-7 w-7 shrink-0 rounded-full bg-[linear-gradient(135deg,#1076bc,#f79522)]" />
              <div className="min-w-0 flex-1">
                <span className="block h-2 w-24 rounded-full bg-white/20" />
                <span className="mt-1.5 block h-1.5 w-14 rounded-full bg-white/10" />
              </div>
              <span className="h-1.5 w-8 rounded-full bg-brand-orange/40" />
            </div>

            {/* creative */}
            <div className="relative mt-4 flex h-40 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#0b4b7d_0%,#1076bc_52%,#f79522_100%)]">
              <ServiceIcon name="content" className="relative h-10 w-10 text-white/90" />
              <span className="absolute inset-x-4 bottom-4 flex gap-1.5">
                <span className="h-1 flex-1 rounded-full bg-white/45" />
                <span className="h-1 w-8 rounded-full bg-white/25" />
              </span>
            </div>

            {/* engagement row — icons only, no counts */}
            <div className="mt-4 flex items-center gap-4">
              {["social", "ads", "content"].map((ic) => (
                <ServiceIcon
                  key={ic}
                  name={ic as "social"}
                  className="h-4 w-4 text-white/55"
                />
              ))}
              <span className="ml-auto h-1.5 w-10 rounded-full bg-white/12" />
            </div>

            {/* caption bars */}
            <div className="mt-3.5 space-y-2">
              <span className="block h-1.5 w-4/5 rounded-full bg-white/14" />
              <span className="block h-1.5 w-3/5 rounded-full bg-white/9" />
            </div>
          </div>

          {/* Bottom-left card — story */}
          <div className="absolute -left-3 bottom-4 hidden w-40 -rotate-6 rounded-2xl border border-white/12 bg-brand-blue-deep/90 p-3 shadow-2xl backdrop-blur-xl sm:block lg:-left-8">
            <div className="flex h-16 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#b45309,#f79522)]">
              <ServiceIcon name="ads" className="h-6 w-6 text-white/85" />
            </div>
            <p className="mt-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/55">
              Story format
            </p>
          </div>

          {/* Analytics strip */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-xl sm:absolute sm:-bottom-6 sm:right-4 sm:mt-0 sm:w-56">
            <ServiceIcon name="ai-automation" className="h-4 w-4 shrink-0 text-brand-orange-light" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Audience insight
              </p>
              <div className="mt-2 flex items-end gap-1">
                {[40, 62, 48, 74, 58, 82, 66].map((h, i) => (
                  <span
                    key={i}
                    className="w-full rounded-sm bg-white/16"
                    style={{ height: `${h * 0.11}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.14em] text-white/55 sm:absolute sm:-bottom-16 sm:left-0 sm:right-0 sm:mt-0">
            Illustrative composition — no real campaign data
          </p>
        </div>
      </div>
    </section>
  );
}