import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import CardIcon from "@/components/ui/CardIcon";
import Reveal from "@/components/ui/Reveal";
import Carousel from "@/components/ui/Carousel";
import { capabilities } from "@/lib/capabilities";
import type { HomeSection } from "@/lib/defaults";

const icons = {
  "digital-transformation": "technology",
  "business-automation": "automation",
  "ai-solutions": "ai",
  "digital-growth": "digital-growth",
  "product-development": "work",
} as const;

/**
 * "What we do" — the five capabilities as a moving rail rather than
 * a static grid, matching the reference's service section: a centred
 * heading above a horizontal run of cards that shows one on a phone,
 * two from 640px and three from 1024px, with arrows and dots to move
 * through them. Every card keeps its original number, title, tags and
 * description.
 *
 * The cards are presentational only — they are not links and
 * have no click handler. `group` is kept on the card so every
 * `group-hover:` effect (icon colour, arrow nudge, brand bloom)
 * and the `.card-panel-hover` lift still work on a plain element.
 */
export default function Capabilities({ section }: { section: HomeSection }) {
  return (
    <section className="sec-white theme-light relative overflow-hidden px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:py-[var(--section-padding)]">
      {/* Orange-dominant with soft blue glow */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift absolute -right-[12%] top-[10%] h-[28rem] w-[28rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift-slow absolute -left-[10%] bottom-[8%] h-[24rem] w-[24rem]"
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

        <div className="mt-14 sm:mt-16">

          <Carousel
            label="Capabilities"
            mode="pingpong"
            loop
            controls
            pauseOnHover
            secondsPerCard={8}
            slideClassName="w-[86%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            {capabilities.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                aria-label={`Visit ${c.title} service page`}
                className={`
                  card-orb group flex h-full flex-col p-6 sm:p-7
                  rounded-xl border border-transparent
                  transition-all duration-300 ease-out
                  hover:-translate-y-2
                  hover:shadow-lg hover:shadow-brand-blue/25
                  hover:border-brand-blue/30
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-brand-blue
                `}
              >
                {/* The reference's service items lead with a round icon
                    disc that swells on hover, rather than a media
                    header. The disc is what moves — the card's own text
                    stays put under the cursor. */}
                <div className="flex items-start justify-between gap-4">
                  <span className="card-orb-disc">
                    <CardIcon
                      name={icons[c.slug as keyof typeof icons]}
                      className="card-orb-glyph h-8 w-8 text-brand-blue group-hover:text-brand-orange-strong"
                    />
                  </span>
                  <span className="font-mono text-xs tracking-widest text-muted">
                    {c.num}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  {c.title}
                </h3>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {c.tagList.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-blue-deep"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-6 text-muted">
                  {c.description}
                </p>

                {/* Arrow indicator — visual navigation cue inside the card link */}
                <span
                  aria-hidden="true"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange-strong transition-colors duration-300 group-hover:text-brand-orange-strong"
                >
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                  {c.title}
                </span>
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}