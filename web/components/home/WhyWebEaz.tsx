import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const points = [
  { big: "10+", small: "years of WebEaz experience" },
  { big: "22+", small: "years of founder experience" },
  { big: "T + G", small: "Technology + Digital Growth" },
  { big: "A + AI", small: "Automation + AI capability" },
  { big: "IP", small: "Proprietary products — ERPEaz, DGVerse" },
  { big: "ROI", small: "Business-focused approach" },
  { big: "∞", small: "Long-term technology partnership" },
];

/**
 * "Why us" — the same seven proof points as feature cards. The
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
 * On hover the card's own copy warms to the brand's light orange —
 * `--color-brand-orange-light`, the same tint of the logo's
 * #f79522 the rest of the site uses for a small warm accent — and
 * returns when the pointer leaves.
 */
export default function WhyWebEaz() {
  return (
    <section className="sec-sky why-cards relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
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
          <SectionHeading eyebrow="Why us" title="Why WebEaz?" />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.small} delay={(i % 3) * 70}>
              <div className="card-accent-dark group flex h-full flex-col overflow-hidden">
                <span aria-hidden="true" className="card-seam" />

                {/* Figure anchor with ambient brand bloom */}
                <div className="relative flex items-center justify-center px-6 py-8 bg-[radial-gradient(ellipse_90%_120%_at_22%_0%,rgba(16,118,188,0.18),transparent_62%)]">
                  <span
                    className="text-4xl font-semibold tracking-tight transition-colors duration-300 sm:text-5xl text-brand-blue-light group-hover:text-brand-orange-light"
                  >
                    {p.big}
                  </span>
                  {/* Depth wash */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/15 to-transparent"
                  />
                </div>

                <div className="flex flex-1 items-end p-6">
                  <p className="text-base font-medium leading-6 text-white/65 transition-colors duration-300 group-hover:text-brand-orange-light">
                    {p.small}
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
