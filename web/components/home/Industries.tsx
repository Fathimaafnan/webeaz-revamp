import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import CardIcon from "@/components/ui/CardIcon";
import Reveal from "@/components/ui/Reveal";
import type { HomeSection } from "@/lib/defaults";

/**
 * "Industries" — the same nine industries as cards. Compositions
 * deliberately alternate (wide / tall / standard, warm / cool
 * media) so the grid has rhythm, while every card shares the
 * same panel, seam and icon language.
 */
export default function Industries({
  industries,
  section,
}: {
  industries: string[];
  section: HomeSection;
}) {
  return (
    <section className="sec-white theme-light relative overflow-hidden px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:py-[var(--section-padding)]">
      {/* Subtle blue/orange blended gradient */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift absolute -right-[10%] top-[8%] h-[26rem] w-[26rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow absolute -left-[12%] bottom-[12%] h-[28rem] w-[28rem]"
      />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
      />
        </Reveal>

        <ul className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => {
            const warm = i % 2 === 1;
            const wide = i % 4 === 0;
            return (
              <li
                key={ind}
                className={wide ? "sm:col-span-2 lg:col-span-1" : undefined}
              >
                <Reveal delay={(i % 3) * 70}>
                  <div className="card-accent group flex h-full items-center gap-5 p-6">
                    {/* Icon tile — warm/cool alternating */}
                    <span
                      aria-hidden="true"
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                        warm
                          ? "border-brand-orange/30 bg-brand-orange-soft"
                          : "border-brand-blue/25 bg-brand-blue-soft"
                      }`}
                    >
                      <CardIcon
                        name="industry"
                        className={`h-6 w-6 transition-colors duration-300 ${
                          warm
                            ? "text-brand-orange-strong group-hover:text-brand-orange-strong"
                            : "text-brand-blue group-hover:text-brand-orange-strong"
                        }`}
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-brand-orange-strong sm:text-xl">
                        {ind}
                      </span>
                      {/* Thin brand rule, width varies with index */}
                      <span
                        aria-hidden="true"
                        className={`mt-2.5 block h-px transition-all duration-400 ${
                          warm ? "bg-brand-orange/60" : "bg-brand-blue/60"
                        } ${i % 3 === 0 ? "w-16" : i % 3 === 1 ? "w-10" : "w-24"}`}
                      />
                    </span>

                    <span
                      aria-hidden="true"
                      className="shrink-0 text-brand-orange-strong opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal delay={150}>
          <Link
            href="/industries"
            className="mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue-deep hover:text-brand-blue"
          >
            Explore Industries →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}