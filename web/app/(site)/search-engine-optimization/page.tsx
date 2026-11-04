import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SeoHero from "@/components/seo/SeoHero";
import SeoFaqAccordion from "@/components/seo/SeoFaqAccordion";
import SeoEnquiryForm from "@/components/seo/SeoEnquiryForm";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/services/ServiceIcon";
import {
  aiCapabilities,
  benefits,
  faqs,
  introHighlights,
  metrics,
  pillars,
  processSteps,
  segments,
  seoAnchors,
  services,
} from "@/lib/seo-page-content";

const TITLE = "SEO Services & AI Search Optimization | WebEaz";
const DESCRIPTION =
  "Improve search visibility with WebEaz SEO services, including technical SEO, keyword research, content optimization, local SEO, and AI-assisted search strategies.";
const CANONICAL = "https://www.webeaz.com/search-engine-optimization";

export const metadata: Metadata = {
  title: "SEO Services & AI Search Optimization",
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    type: "website",
  },
};

/**
 * Shared dark-navy CTA band. `slot` receives the children so the
 * final CTA and the closing band stay visually identical.
 */
function CtaBand({
  id,
  eyebrow,
  heading,
  body,
  primary,
  secondary,
  note,
}: {
  id?: string;
  eyebrow: string;
  heading: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  note?: string;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[12%] -top-[30%] h-[30rem] w-[30rem] rounded-full bg-brand-blue/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[35%] -right-[10%] h-[26rem] w-[26rem] rounded-full bg-brand-orange/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange-light">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">{body}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
          >
            {primary.label}
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center rounded-full border border-brand-blue-light/45 bg-brand-blue/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-brand-blue-light hover:bg-brand-blue/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
        {note ? <p className="mt-6 text-sm text-white/55">{note}</p> : null}
      </div>
    </section>
  );
}

/** Small reusable "go further" strip of real internal routes. */
function RelatedLinks() {
  const links = [
    { href: "/services/digital-growth/seo", label: "SEO service overview" },
    {
      href: "/services/digital-growth/digital-marketing",
      label: "Digital marketing",
    },
    {
      href: "/services/technology/website-development",
      label: "Website development",
    },
    { href: "/our-work", label: "Our work" },
  ];
  return (
    <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-transparent px-4 py-2 text-xs font-medium text-white/70 transition-colors duration-200 hover:border-brand-orange-on-dark hover:text-brand-orange-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {l.label}
            <span aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function SeoPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      {/* FAQ structured data. Note: since Aug 2023 Google limits FAQ
          rich results to authoritative government and health sites, so
          this is emitted for machine readability — not to promise a
          rich snippet. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ============ 1. HERO ============ */}
      <SeoHero />

      {/* ============ 2. INTRODUCTION ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="More than rankings"
              title="Make Every Search Opportunity Count"
            />
            <div className="mt-7 space-y-5 text-base leading-8 text-muted">
              <p>
                Your customers are already searching for answers, services, and
                solutions online. The challenge is helping them discover your
                business, understand your value, and take the next step.
              </p>
              <p>
                WebEaz combines technical SEO, strategic content, search intent
                analysis, and AI-assisted insights to build a stronger organic
                search presence for your business. We focus on making your website
                easier to discover, easier to navigate, and more useful to the
                people you want to reach.
              </p>
              <p>
                Whether you&apos;re building visibility for a new website or
                improving an established digital presence, our approach starts with
                your business goals and turns them into a practical SEO strategy.
              </p>
            </div>
            <Link
              href={`#${seoAnchors.enquiry}`}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Discover Your Growth Opportunities
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <ul className="space-y-4">
              {introHighlights.map((h) => (
                <li
                  key={h.label}
                  className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/35 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-soft text-brand-blue">
                    <ServiceIcon name={h.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-base font-semibold tracking-tight text-ink">
                      {h.label}
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-muted">
                      {h.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============ 3. SEO BENEFITS ============ */}
      <section className="brand-surface-mist px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Why SEO matters"
              title="Build Visibility That Works Beyond the Click"
              description="Sustainable organic growth starts with being visible to the right people—and giving them a reason to choose you."
              align="center"
            />
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={(i % 4) * 80}>
                <article className="group h-full rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-soft text-brand-orange-deep transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-ink">
                    <ServiceIcon name={b.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold leading-snug tracking-tight text-ink">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{b.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. AI-INTEGRATED SEO ============ */}
      <section
        id={seoAnchors.ai}
        className="relative overflow-hidden brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[15%] top-[8%] h-[32rem] w-[32rem] rounded-full bg-brand-blue/18 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[12%] bottom-[4%] h-[26rem] w-[26rem] rounded-full bg-brand-orange/12 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="SEO for the AI-powered search era"
                title="Optimize for Search. Prepare for AI Discovery."
                onDark
                align="left"
              />
              <div className="mt-7 space-y-5 text-base leading-8 text-white/70">
                <p>
                  People increasingly use conversational queries and AI-powered
                  search experiences to explore topics, compare options, and
                  discover businesses. Your website needs more than a list of
                  keywords—it needs useful answers, clear information, and a
                  technically sound foundation.
                </p>
                <p>
                  WebEaz uses AI-assisted research and analysis to support a
                  human-led SEO strategy that helps search engines and users better
                  understand your business.
                </p>
              </div>
              <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-6 text-white/55">
                AI supports good SEO practice. It does not guarantee inclusion in
                Google AI Overviews, AI Mode, or any other AI-generated answer —
                no optimisation can.
              </p>
              <Link
                href={`#${seoAnchors.enquiry}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
              >
                Build Your AI-Ready SEO Strategy
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>

            <div className="space-y-3.5">
              {aiCapabilities.map((c, i) => (
                <Reveal key={c.title} delay={i * 70}>
                  <article className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-brand-blue-light/40 hover:bg-white/[0.07]">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-orange/35 bg-brand-orange/10 font-mono text-xs font-semibold text-brand-orange-light">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold tracking-tight text-white">
                        {c.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-white/65">
                        {c.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. SEO SERVICES ============ */}
      <section id={seoAnchors.services} className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our SEO capabilities"
              title="Everything Your Website Needs to Compete in Search"
              description="A connected SEO strategy addresses the technical foundation, the quality of your content, the relevance of your pages, and the trust your business builds online."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 4) * 70}>
                <article className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-lg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue-soft text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-6 text-muted">
                    {s.description}
                  </p>
                  <p className="mt-4 border-t border-line pt-3 text-[11px] font-medium uppercase leading-5 tracking-wider text-brand-blue-deep">
                    {s.keywords}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={`#${seoAnchors.enquiry}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Find the Right SEO Services for Your Business
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 6. PROCESS ============ */}
      <section
        id={seoAnchors.process}
        className="scroll-mt-24 brand-surface-sand px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our approach"
              title="A Clear Strategy. Continuous Improvement. Measurable Progress."
              description="Every business has different customers, competitors, and growth objectives. Our process is designed to understand your starting point, prioritize the right opportunities, and improve performance over time."
              align="center"
            />
          </Reveal>

          <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((s, i) => (
              <li key={s.num} className="h-full">
                <Reveal delay={i * 90} className="h-full">
                  <div className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/45 hover:shadow-lg">
                  <span className="absolute -top-3 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange font-mono text-xs font-bold text-ink shadow-md">
                    {s.num}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                    {s.description}
                  </p>
                  <p className="mt-5 rounded-xl bg-brand-blue-soft p-3.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-blue-deep">
                      Deliverable
                    </span>
                    <span className="mt-1.5 block text-sm leading-6 text-ink-soft">
                      {s.deliverable}
                    </span>
                  </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Link
              href={`#${seoAnchors.enquiry}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-200 hover:bg-brand-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Start Your SEO Journey
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 7. BUSINESS SEGMENTS ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Strategies built around your business"
              title="The Right SEO Strategy for Where You Want to Go"
              description="Whether your priority is reaching customers nearby, expanding into new markets, or generating more qualified enquiries, your SEO strategy should reflect how your customers search and make decisions."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  {/* Graphic header — brand-tinted, in place of stock
                      photography so no unrelated imagery is implied. */}
                  <div
                    className={`relative flex h-28 items-center justify-center ${
                      i % 2 === 0
                        ? "bg-[linear-gradient(135deg,#0b4b7d_0%,#1076bc_100%)]"
                        : "bg-[linear-gradient(135deg,#9a3412_0%,#b45309_100%)]"
                    }`}
                  >
                    <ServiceIcon
                      name={s.icon}
                      className="relative h-10 w-10 text-white"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-8 h-20 w-32 rounded-full bg-black/10 blur-2xl"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-semibold leading-snug tracking-tight text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-6 text-muted">
                      {s.description}
                    </p>
                    <ul className="mt-4 space-y-1.5 border-t border-line pt-3.5">
                      {s.focus.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-muted">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Discuss Your Business Goals
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 8. WHAT WE MEASURE ============ */}
      <section
        id={seoAnchors.measure}
        className="scroll-mt-24 brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Beyond vanity metrics"
              title="Measure Progress That Matters to Your Business"
              description="Rankings can be useful indicators, but effective SEO reporting connects search performance with what visitors actually do on your website."
              onDark
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <Reveal key={m.title} delay={i * 80}>
                <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-brand-blue-light/40 hover:bg-white/[0.07]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-orange/30 bg-brand-orange/10 text-brand-orange-light">
                    <ServiceIcon name={m.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-white">
                    {m.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-6 text-white/65">
                    {m.description}
                  </p>
                  {/* Conceptual meter — deliberately carries no numbers. */}
                  <div className="mt-5 border-t border-white/10 pt-3.5">
                    <div className="flex items-end gap-1.5" aria-hidden="true">
                      {[30, 52, 40, 66, 46, 74, 58].map((h, b) => (
                        <span
                          key={b}
                          className="w-full rounded-sm bg-white/12"
                          style={{ height: `${h * 0.28}px` }}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/35">
                      Conceptual illustration
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-7 text-white/60">
            We use available analytics and search performance data to understand
            what&apos;s improving, what needs attention, and where to focus next.
          </p>
        </div>
      </section>

      {/* ============ 9. WHY WEBEAZ ============ */}
      <section className="brand-surface-mist px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Your SEO growth partner"
                title="Strategy, Technology, and Marketing Working Together"
              />
              <p className="mt-7 text-base leading-8 text-muted">
                WebEaz brings digital strategy, website expertise, and marketing
                capabilities together to help businesses strengthen their online
                presence. Our SEO approach considers how your website works, what
                your customers need, and how search visibility can support your
                wider business goals.
              </p>
              <div className="mt-9 rounded-2xl border border-line bg-white p-5 shadow-sm">
                <Image
                  src="/webeaz-logo.png"
                  alt="WebEaz Technologies"
                  width={1746}
                  height={483}
                  unoptimized
                  className="h-8 w-auto"
                />
                <p className="mt-4 text-sm leading-6 text-muted">
                  One team across technology, digital growth, automation and AI —
                  so SEO recommendations fit the website you actually have.
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                Let&apos;s Plan Your SEO Growth
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map((p, i) => (
                <Reveal key={p.title} delay={(i % 2) * 80}>
                  <article className="group h-full rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/35 hover:shadow-md">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0b4b7d,#1076bc)] text-white">
                      <ServiceIcon name={p.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-6 text-muted">
                      {p.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 10. CASE STUDIES ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="SEO in action"
              title="Real Challenges. Thoughtful Strategies. Verifiable Outcomes."
              description="Every successful SEO engagement starts with understanding the challenge and identifying the changes most likely to help."
              align="center"
            />
          </Reveal>

          <Reveal delay={100}>
            <article className="mt-14 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="border-b border-line bg-[linear-gradient(135deg,#0b4b7d_0%,#1076bc_55%,#b45309_100%)] px-6 py-8 sm:px-8">
                <span className="inline-flex items-center rounded-full border border-white/30 bg-black/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                  Awaiting verified data
                </span>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Building a Stronger Organic Search Presence
                </h3>
              </div>

              <dl className="grid gap-px bg-line sm:grid-cols-3">
                <div className="bg-white p-6">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Industry
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-ink">
                    [Client industry]
                  </dd>
                </div>
                <div className="bg-white p-6">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Reporting period
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-ink">
                    [Verified reporting period]
                  </dd>
                </div>
                <div className="bg-white p-6">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Business impact
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-ink">
                    [Verified outcome]
                  </dd>
                </div>
              </dl>

              <div className="space-y-5 p-6 sm:p-8">
                {[
                  {
                    h: "The challenge",
                    p: "[Describe the client’s actual SEO challenge.]",
                  },
                  {
                    h: "The approach",
                    p: "[Summarize the implemented SEO strategy.]",
                  },
                  {
                    h: "The results",
                    p: "[Insert verified metrics with a clear baseline and measurement period.]",
                  },
                ].map((b) => (
                  <div key={b.h} className="border-l-2 border-brand-orange pl-4">
                    <h4 className="text-sm font-semibold text-ink">{b.h}</h4>
                    <p className="mt-1 text-sm leading-6 text-muted">{b.p}</p>
                  </div>
                ))}
                <p className="rounded-xl brand-surface-sand p-4 text-xs leading-6 text-muted">
                  This block is an intentional placeholder. No client names,
                  rankings, traffic figures or outcomes are published here until
                  they are verified and approved for release.
                </p>
              </div>
            </article>
          </Reveal>

          <div className="mt-12 text-center">
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-200 hover:bg-brand-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Explore Our Work
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 11. FAQ ============ */}
      <section className="brand-surface-mist px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeading
              eyebrow="Frequently asked questions"
              title="Everything You Need to Know About SEO"
              align="center"
            />
          </Reveal>
          <SeoFaqAccordion />
          <div className="mt-12 text-center">
            <Link
              href={`#${seoAnchors.enquiry}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Still Have Questions? Let&apos;s Talk SEO
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 12. FINAL CTA ============ */}
      <CtaBand
        eyebrow="Your next growth opportunity"
        heading="Your Next Customer Could Be Searching for You Right Now."
        body="Make it easier for the right people to discover your business. Let's identify your SEO opportunities and build a strategy aligned with your goals."
        primary={{ label: "Request an SEO Audit", href: `#${seoAnchors.enquiry}` }}
        secondary={{ label: "Talk to Our Team", href: "/contact" }}
        note="Share your website and goals to start a conversation about your SEO needs."
      />

      {/* Related real routes */}
      <section className="brand-surface-brand px-5 pb-20 text-white sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Go deeper
          </p>
          <RelatedLinks />
        </div>
      </section>

      {/* ---- Enquiry form (CTA destination) ---- */}
      <section
        id={seoAnchors.enquiry}
        className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SectionHeading
              eyebrow="Talk to WebEaz"
              title="Start With a Search Review"
              description="Tell us about your website and goals, and we can discuss the SEO priorities worth addressing first."
              align="center"
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10">
              <SeoEnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}