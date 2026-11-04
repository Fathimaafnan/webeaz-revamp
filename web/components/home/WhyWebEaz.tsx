import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import type { HomeSection, HomeStat } from "@/lib/defaults";

/**
 * "Why us" — two proof points as feature cards. The
 * large figure becomes the card's visual anchor behind a soft
 * brand bloom, with the supporting line beneath.
 *
 * The cards carry the brand's own blue — the exact #1076bc of
 * WebEaz's mark, running down through its deeper shades in a
 * gradient that drifts slowly across the card. That treatment lives
 * in `.why-cards .card-accent-dark` in globals.css, scoped to this
 * section so the shared card classes the Services and enquiry-form
 * components use are never reached. The hover lift, border and
 * shadow are unchanged.
 *
 * The warm, near-white orange tint keeps the figures and supporting
 * copy legible against every stop of the moving blue gradient.
 */
export default function WhyWebEaz({
  section,
  stats,
}: {
  section: HomeSection;
  stats: HomeStat[];
}) {
  return (
    <section className="sec-sky why-cards relative overflow-hidden px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:py-[var(--section-padding)]">
      {/* Blue-dominant with soft orange accent glow */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift absolute -right-[15%] top-[10%] h-[28rem] w-[28rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow absolute -left-[10%] bottom-[5%] h-[22rem] w-[22rem]"
      />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((p, i) => (
            <Reveal key={p.id ?? p.label} delay={(i % 3) * 70}>
              <div className="card-accent-dark group flex h-full flex-col overflow-hidden">
                <span aria-hidden="true" className="card-seam" />

                {/* Figure anchor with ambient brand bloom */}
                <div className="relative flex items-center justify-center px-6 py-8 bg-[radial-gradient(ellipse_90%_120%_at_22%_0%,rgba(16,118,188,0.18),transparent_62%)]">
                  <span
                    className="text-4xl font-semibold tracking-tight transition-colors duration-300 sm:text-5xl text-brand-orange-on-dark group-hover:text-brand-orange-on-dark"
                  >
                    {p.value}
                  </span>
                  {/* Depth wash */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/15 to-transparent"
                  />
                </div>

                <div className="flex flex-1 items-end p-6">
                  <p className="text-base font-medium leading-6 text-white transition-colors duration-300 group-hover:text-brand-orange-on-dark">
                    {p.label}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
