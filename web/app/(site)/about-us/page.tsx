import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { ABOUT } from "@/lib/reference-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About our digital transformation company | Webeaz — a team of creative designers, technologists and digital marketing experts.",
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <main>
      {/* Banner */}
      <section className="relative overflow-hidden bg-brand-blue-deep px-5 pb-20 pt-32 text-white sm:px-8 sm:pb-24 sm:pt-40">
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-orange-strong">
            {ABOUT.heroEyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-brand-blue-deep sm:text-4xl lg:text-5xl">
            {ABOUT.heroTitle}
          </h1>
        </div>
      </section>

      {/* Who we are */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Reveal>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">{ABOUT.whoTitle}</h2>
            <blockquote className="mt-6 border-l-4 border-brand-orange pl-5 text-xl font-semibold leading-relaxed text-brand-blue-deep sm:text-2xl">
              “{ABOUT.quote}”
            </blockquote>
          </Reveal>
          <Reveal delay={80}>
            {ABOUT.who.map((p, i) => (
              <p key={i} className="mb-5 text-base leading-8 text-muted">{p}</p>
            ))}
            <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">{ABOUT.methodologyTitle}</h2>
            {ABOUT.methodology.map((p, i) => (
              <p key={i} className="mt-4 text-base leading-8 text-muted">{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* How we work — six stages */}
      <section className="sec-mist theme-light px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-h2 text-center font-bold text-ink">Our Business Methodology</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-7 text-muted">Analysis · Objective · Strategy · Tactics · Action · Control</p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <article className="h-full rounded-2xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-4">
                    <span className="relative h-12 w-12 shrink-0">
                      <Image src={`/reference/about-icon-${i + 1}.webp`} alt="" fill sizes="48px" className="object-contain" />
                    </span>
                    <span className="font-mono text-xs font-bold text-brand-orange-strong">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-brand-blue-deep">{s.subtitle}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{s.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Influence / What / How */}
      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          {[
            { title: ABOUT.influenceTitle, paras: ABOUT.influence },
            { title: ABOUT.whatTitle, paras: ABOUT.what },
            { title: ABOUT.howTitle, paras: ABOUT.how },
          ].map((block, i) => (
            <Reveal key={block.title} delay={i * 70}>
              <div className="h-full rounded-2xl border border-line bg-white p-7 shadow-sm">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">{block.title}</h2>
                {block.paras.map((p, j) => (
                  <p key={j} className="mt-4 text-sm leading-7 text-muted">{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl justify-center">
          <Button href="/contact" variant="primary">Get in Touch</Button>
        </div>
      </section>
    </main>
  );
}
