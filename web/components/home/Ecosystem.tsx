import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const layers = [
  { label: "Technology", note: "Web, mobile, ecommerce, software, cloud" },
  { label: "Digital Growth", note: "SEO, marketing and lead generation" },
  { label: "Automation", note: "CRM, workflow and WhatsApp" },
  { label: "AI", note: "Strategy, integration and agents" },
  { label: "Business", note: "Outcomes that matter to you" },
];

export default function Ecosystem() {
  return (
    <section className="sec-mist theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift -top-48 right-[-14rem] h-[38rem] w-[38rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow -bottom-52 left-[-14rem] h-[34rem] w-[34rem]"
      />
      <div
        aria-hidden="true"
        className="animate-pulse-soft absolute left-[18%] top-[22%] h-1 w-1 rounded-full bg-brand-blue/60"
      />
      <div
        aria-hidden="true"
        className="animate-pulse-soft absolute right-[24%] top-[48%] h-1 w-1 rounded-full bg-brand-orange/70 [animation-delay:1.2s]"
      />
      <div
        aria-hidden="true"
        className="animate-pulse-soft absolute bottom-[26%] left-[38%] h-1 w-1 rounded-full bg-white/50 [animation-delay:2.4s]"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Ecosystem"
            title="One ecosystem. Every layer of your business."
            description="WebEaz works across the technology and business layers that drive growth — from the digital foundation to AI."
            align="center"
      />
        </Reveal>
        <div className="mt-16 flex flex-col items-stretch sm:mt-20">
          {layers.map((l, i) => (
            <Reveal key={l.label} delay={i * 90}>
              <div className="flex flex-col items-center">
                <div
                  className={`eco-flow-card w-full rounded-2xl px-7 py-6 transition-all duration-500 sm:px-10 sm:py-7 ${
                    i === layers.length - 1
                      ? "eco-flow-card-final"
                      : "hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:text-left">
                    <span className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                      {l.label}
                    </span>
                    <span className="text-sm text-ink/80">{l.note}</span>
                  </div>
                </div>
                {i < layers.length - 1 ? (
                  <svg
                    width="2"
                    height="36"
                    aria-hidden="true"
                    className="my-0"
                  >
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="36"
                      stroke={i % 2 === 0 ? "#f79522" : "#5cb3ee"}
                      strokeWidth="2"
                      strokeDasharray="4 5"
                      className="animate-flow"
                    />
                  </svg>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
