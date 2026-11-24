import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { TEAM } from "@/lib/reference-content";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Dedicated Professionals Driving Innovation and Excellence — meet the team behind Webeaz.",
  alternates: { canonical: "/our-teams" },
};

export default function OurTeamsPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-blue-deep px-5 pb-24 pt-32 text-white sm:px-8 sm:pb-32 sm:pt-40">
        {/* The same warm peach–ivory gradient image as the Home hero. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('/assets/hero/webeaz-hero-bg-warm-2026.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-orange-strong">{TEAM.title}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-brand-blue-deep sm:text-4xl lg:text-5xl">
            {TEAM.subtitle}
          </h1>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-brand-blue-soft/20 shadow-lg">
              <Image src="/reference/founder.webp" alt={`${TEAM.founderName}, ${TEAM.founderLabel}`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-top" />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">{TEAM.founderLabel}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{TEAM.founderName}</h2>
            <div className="mt-6 space-y-5">
              {TEAM.founderBio.map((p, i) => (
                <p key={i} className="text-base leading-8 text-muted">{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team grid */}
      <section className="sec-mist theme-light px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-h2 text-center font-bold text-ink">{TEAM.meetTitle}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-muted">{TEAM.meetIntro}</p>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {TEAM.members.filter((m) => m.name === "Sheena Misri").map((m, i) => (
              <Reveal key={m.name} delay={i * 50}>
                <article className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-square overflow-hidden bg-brand-blue-soft/20">
                    <Image src={m.image} alt={m.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-bold text-ink">{m.name}</h3>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-brand-orange-strong">{m.role}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
