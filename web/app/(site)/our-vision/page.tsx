import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { VISION } from "@/lib/reference-content";

export const metadata: Metadata = {
  title: "Our Vision",
  description:
    "Our Vision | Digital Transformation of your Business for Better ROI — Webeaz.",
  alternates: { canonical: "/our-vision" },
};

export default function OurVisionPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-blue-deep px-5 pb-20 pt-32 text-white sm:px-8 sm:pb-24 sm:pt-40">
        <div className="absolute inset-0">
          <Image src="/reference/vision-banner.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06283f]/95 via-[#06283f]/70 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-orange-light">{VISION.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {VISION.title}
          </h1>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">{VISION.missionTitle}</h2>
            {VISION.mission.map((p, i) => (
              <p key={i} className="mt-5 text-base leading-8 text-muted">{p}</p>
            ))}
            <div className="mt-8">
              <Button href="/contact" variant="primary">Contact us</Button>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
              <Image src="/reference/core-values.webp" alt="Innovative solutions for a connected world" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <p className="mt-5 text-center text-sm font-bold uppercase tracking-[0.18em] text-brand-blue-deep">
              {VISION.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sec-mist theme-light px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-h2 text-center font-bold text-ink">Explore WebEaz</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "COMPANY", links: VISION.companyLinks.map((l) => ({ ...l, external: false })) },
              { title: "SERVICES", links: VISION.serviceLinks.map((label) => ({ label, href: "/services", external: false })) },
              { title: "SOLUTIONS", links: VISION.solutionLinks.map((label) => ({ label, href: "/solutions", external: false })) },
              { title: "MARKETING", links: VISION.marketingLinks.map((label) => ({ label, href: "/services#digital-marketing", external: false })) },
            ].map((group, i) => (
              <Reveal key={group.title} delay={i * 60}>
                <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-orange-strong">{group.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {group.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-sm text-grey-700 transition-colors hover:text-brand-blue-deep hover:underline">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-brand-blue/10 bg-white p-6 text-sm text-muted">
            <a href={`mailto:${VISION.contact.email}`} className="font-semibold text-brand-blue-deep hover:underline">{VISION.contact.email}</a>
            <a href={`tel:${VISION.contact.india.replace(/\s/g, "")}`} className="hover:text-brand-blue-deep">{VISION.contact.india} (IND)</a>
            <a href={`tel:${VISION.contact.uae.replace(/\s/g, "")}`} className="hover:text-brand-blue-deep">{VISION.contact.uae} (UAE)</a>
          </div>
        </div>
      </section>
    </main>
  );
}
