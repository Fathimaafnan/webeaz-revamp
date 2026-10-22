import Reveal from "@/components/ui/Reveal";

export default function TrustStats() {
  const stats = [
    { value: "10+", unit: "Years", label: "WebEaz Experience" },
    { value: "22+", unit: "Years", label: "Founder Experience" },
  ];
  return (
    <section className="sec-mist theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      {/* Blue-dominant with soft orange glow */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift absolute -left-[15%] top-[5%] h-[30rem] w-[30rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow absolute -right-[12%] bottom-[10%] h-[22rem] w-[22rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift absolute -top-24 right-[-8rem] h-64 w-64"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow absolute -bottom-24 left-[-8rem] h-64 w-64"
      />
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange-strong">
            Credibility
          </p>
          <h2 className="mt-4 text-h2 font-bold text-ink">
            Experience that moves business forward.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted">
            Two decades of helping businesses build, transform, automate and
            grow with technology.
          </p>
        </Reveal>
        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-line pt-14 sm:grid-cols-2 sm:gap-16">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120}>
              <div>
                <p className="text-5xl font-semibold tracking-tight sm:text-6xl">
                  <span className="text-brand-orange-strong">{s.value}</span>{" "}
                  <span className="text-brand-blue">{s.unit}</span>
                </p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
