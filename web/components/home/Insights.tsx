import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import CardIcon from "@/components/ui/CardIcon";
import Reveal from "@/components/ui/Reveal";
import { insights } from "@/lib/insights";

/**
 * Abstract editorial cover art. The articles are placeholders
 * with no photography, so each card gets a generated,
 * brand-tinted cover keyed to its category rather than invented
 * stock imagery. Decorative only.
 */
function InsightCover({ index, category }: { index: number; category: string }) {
  const shapes = [
    <circle key="c" cx="210" cy="58" r="46" fill="none" stroke="rgba(16,118,188,0.4)" strokeWidth="2" />,
    <circle key="c2" cx="210" cy="58" r="28" fill="rgba(247,149,34,0.16)" />,
    <path key="p" d="M60 120l34-34 26 26 44-50" fill="none" stroke="rgba(16,118,188,0.3)" strokeWidth="2.5" strokeLinecap="round" />,
    <rect key="r" x="52" y="34" width="112" height="12" rx="6" fill="rgba(16,118,188,0.16)" />,
    <rect key="r2" x="52" y="58" width="72" height="12" rx="6" fill="rgba(16,20,24,0.08)" />,
  ];

  return (
    <div
      className={`card-media card-media-grid card-editorial-media relative h-52 sm:h-60 ${
        index % 2 === 1 ? "card-media-warm" : ""
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-brand-orange/10 blur-3xl"
      />
      <svg
        viewBox="0 0 280 160"
        className="relative h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {shapes}
      </svg>
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
 * "Insights" — the same four articles as image-based cards in the
 * reference's article rail: a centred heading above a horizontal
 * run of cards.
 *
 * This used to be a moving rail. The cards drifted across on their
 * own, wrapped, and came round again, with a pair of chevron buttons
 * underneath to push them along by hand. That made the section hard
 * to read — a card was never still long enough to take in, and half
 * of each one was always cut off at the edge of the frame.
 *
 * It is now a plain grid. The four articles sit where they are and
 * stay there: one per row on a phone, two per row from 1024px, and
 * every card fully visible at once. The cards are larger for it — a
 * taller cover, more room inside, and larger title and body type —
 * and the chevrons are gone, because there is nothing left for them
 * to steer.
 *
 * Titles, descriptions, dates, categories and links are all
 * unchanged, and every article stays in the DOM and reachable.
 */
export default function Insights() {
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
            eyebrow="Insights"
            title="Ideas. Insights. What's next."
            description="Perspectives on technology, AI, digital growth and automation from the WebEaz team."
            align="center"
      />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:mt-16 sm:gap-7 lg:grid-cols-2">
          {insights.map((a, i) => (
            <article
              key={a.title}
              className="card-editorial group flex h-full flex-col"
            >
              <InsightCover index={i} category={a.category} />
              <div className="flex flex-1 flex-col p-7 sm:p-8">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="rounded-full bg-brand-blue-soft px-3 py-1 font-semibold uppercase tracking-wider text-brand-blue-deep">
                    {a.category}
                  </span>
                  <span className="shrink-0 text-muted">{a.date}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  {a.title}
                </h3>
                <span aria-hidden="true" className="card-editorial-rule" />
                <p className="mt-3.5 flex-1 text-[15px] leading-7 text-muted sm:text-base sm:leading-7">
                  {a.description}
                </p>
                <Link
                  href="/insights"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange-strong transition-colors hover:text-brand-orange-deep hover:underline"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue-deep hover:text-brand-blue"
            >
              Explore Insights →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
