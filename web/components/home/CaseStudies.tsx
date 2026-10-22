import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import CardIcon from "@/components/ui/CardIcon";
import Reveal from "@/components/ui/Reveal";
import { caseStudies, type CaseStudy } from "@/lib/case-studies";

/**
 * Abstract, brand-tinted media panels. The case studies are
 * under NDA and carry no photography, so rather than invent
 * imagery each card gets a generated technical visual keyed to
 * its industry — a window frame plus an industry-specific
 * motif. Decorative only.
 */
function ProjectVisual({ index, industry }: { index: number; industry: string }) {
  const warm = index % 2 === 1;
  const bars = [42, 68, 52, 84, 60, 74];
  const cols = [0, 1, 2];

  return (
    <div
      className={`card-media card-media-grid relative h-44 ${warm ? "card-media-warm" : ""}`}
    >
      {/* Soft brand bloom */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 h-44 w-44 rounded-full bg-brand-blue/20 blur-3xl"
      />

      <svg
        viewBox="0 0 320 176"
        className="relative h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`pg-${index}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5cb3ee" />
            <stop offset="100%" stopColor="#f79522" />
          </linearGradient>
        </defs>

        {/* Window frame */}
        <rect
          x="34"
          y="26"
          width="252"
          height="124"
          rx="10"
          fill="rgba(255,255,255,0.03)"
          stroke="rgba(255,255,255,0.12)"
        />
        <path d="M34 48h252" stroke="rgba(255,255,255,0.12)" />
        <circle cx="50" cy="37" r="3" fill="rgba(255,255,255,0.22)" />
        <circle cx="62" cy="37" r="3" fill="rgba(255,255,255,0.16)" />
        <circle cx="74" cy="37" r="3" fill="rgba(255,255,255,0.12)" />

        {/* Industry motif — varies by project */}
        {industry === "Education" ? (
          <>
            <path
              d="M160 68l52 20-52 20-52-20 52-20z"
              fill="none"
              stroke={`url(#pg-${index})`}
              strokeWidth="2"
            />
            <path d="M132 100v12c0 7 13 12 28 12s28-5 28-12v-12" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
          </>
        ) : industry === "Retail" ? (
          <>
            {bars.map((h, n) => (
              <rect
                key={n}
                x={76 + n * 30}
                y={132 - h}
                width="14"
                height={h}
                rx="3"
                fill={n === 3 ? "#f79522" : "rgba(92,179,238,0.32)"}
              />
            ))}
          </>
        ) : (
          <>
            {cols.map((c) => (
              <rect
                key={c}
                x={96 + c * 52}
                y="62"
                width="40"
                height="70"
                rx="6"
                fill="none"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="2"
              />
            ))}
            <path d="M96 96h40M148 96h40M200 96h40" stroke={`url(#pg-${index})`} strokeWidth="2" />
          </>
        )}
      </svg>

      <span className="absolute bottom-4 left-5 flex items-center gap-2">
        <CardIcon name="work" className="h-4 w-4 text-muted" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {industry}
        </span>
      </span>
    </div>
  );
}

function ProjectCard({ c, i }: { c: CaseStudy; i: number }) {
  return (
    <article className="card-project group flex h-full flex-col">
      {/* Held slightly zoomed and settling on hover, as the reference's
          project frames do. The wash only appears on hover, and the
          technology line rises over it — it stays in the accessibility
          tree and is readable without hover. */}
      <div className="card-media card-media-grid card-project-media h-56">
        <ProjectVisual index={i} industry={c.industry} />
        <span className="absolute bottom-4 left-5 z-10 flex items-center gap-2">
          <CardIcon name="work" className="h-4 w-4 text-white/90" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/90">
            {c.industry}
          </span>
        </span>
        <p className="card-project-meta absolute bottom-4 right-5 z-10 font-mono text-[11px] tracking-wide text-white/85">
          {c.technology}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-xl font-bold tracking-tight text-ink">
          {c.client}
        </h3>

        <dl className="mt-5 flex-1 space-y-3.5">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">
              Challenge
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-muted">{c.challenge}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">
              Solution
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-muted">{c.solution}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">
              Result
            </dt>
            <dd className="mt-1.5 text-sm leading-6 text-muted">{c.result}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

/**
 * "Our work" — the same case studies presented as image-led
 * project cards. Challenge, solution, result, technology and
 * client name are unchanged; the "View All Work" link is kept.
 */
export default function CaseStudies() {
  return (
    <section className="sec-sky-deep theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      {/* Orange radial with blue atmospheric lighting */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift absolute -left-[12%] top-[12%] h-[30rem] w-[30rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift-slow absolute -right-[10%] bottom-[10%] h-[26rem] w-[26rem]"
      />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Our work"
            title="What we've built."
            description="Explore selected digital products, platforms and transformation projects delivered by WebEaz."
      />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal key={c.client} delay={i * 80}>
              <ProjectCard c={c} i={i} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <Link
            href="/our-work"
            className="mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue-deep hover:text-brand-blue"
          >
            View All Work →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}