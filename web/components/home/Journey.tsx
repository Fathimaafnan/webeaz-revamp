import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const stages = ["Technology", "Digital", "Digital Growth", "Business Technology", "Automation", "AI", "What's Next?"];

export default function Journey() {
  return (
    <section className="sec-sand theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      {/* Blue radial with orange lighting */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift absolute -left-[12%] top-[15%] h-[30rem] w-[30rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow absolute -right-[8%] bottom-[10%] h-[24rem] w-[24rem]"
      />
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            eyebrow="Journey"
            title="From technology to what's next."
            description="How WebEaz has evolved — and where we're heading."
            align="center"
      />
        </Reveal>
        <div className="mt-16 sm:mt-20" role="list">
          {stages.map((s, i) => (
            <Reveal key={s} delay={i * 60}>
              <div
                role="listitem"
                className="relative flex items-center gap-6 pb-12 last:pb-0 sm:gap-8"
              >
                {i < stages.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-[1.125rem] top-10 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-brand-blue-light/50 via-brand-orange/50 to-brand-blue-light/50"
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                    i === stages.length - 1
                      ? "border-brand-orange bg-brand-orange text-ink shadow-[0_0_24px_rgba(247,149,34,0.45)]"
                      : "border-brand-blue-light bg-surface text-brand-blue"
                  }`}
                >
                  {i + 1}
                </span>
                {/* Both branches were `text-white`, which was correct on
                    the old blue canvas and is 1.1:1 against this
                    section's sand ground. The final stage now carries
                    the brand blue the ternary was clearly reaching for,
                    at 6.36:1 on the sand; the rest use ink at 16.34:1. */}
                <p
                  className={`text-xl font-semibold tracking-tight sm:text-2xl ${
                    i === stages.length - 1
                      ? "text-brand-blue-deep"
                      : "text-ink"
                  }`}
                >
                  {s}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
