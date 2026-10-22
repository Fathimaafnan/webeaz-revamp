import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SmpHero from "@/components/smp/SmpHero";
import SmpProcess from "@/components/smp/SmpProcess";
import SmpAiVisual from "@/components/smp/SmpAiVisual";
import SmpEnquiryForm from "@/components/smp/SmpEnquiryForm";
import Accordion from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/services/ServiceIcon";
import {
  aiCapabilities,
  challenges,
  contentTypes,
  faqs,
  highlights,
  industries,
  journeyStages,
  metricGroups,
  platforms,
  pillars,
  reportItems,
  services,
  smpAnchors,
} from "@/lib/smp-page-content";

/** Verified existing routes only. */
const SEO_PAGE = "/search-engine-optimization";
const SEM_PAGE = "/search-engine-marketing";
const SOCIAL_SERVICE = "/services/digital-growth/social-media";
const WEB_SERVICE = "/services/technology/website-development";

const TITLE =
  "Social Media Marketing & Promotion Services | AI-Powered Growth | WebEaz Technologies";
const DESCRIPTION =
  "Grow your brand with WebEaz social media promotion services. Discover AI-assisted content strategies, social media management, paid campaigns and performance-focused marketing.";

export const metadata: Metadata = {
  title: "Social Media Marketing & Promotion Services | AI-Powered Growth",
  description: DESCRIPTION,
  alternates: { canonical: "https://www.webeaz.com/social-media-promotion" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.webeaz.com/social-media-promotion",
    type: "website",
  },
};

/** Shared primary/secondary CTA pair. */
function CtaRow({
  primary,
  secondary,
  tone = "light",
  center = false,
}: {
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  tone?: "light" | "dark";
  center?: boolean;
}) {
  return (
    <div
      className={`mt-10 flex flex-col gap-3 sm:flex-row ${center ? "items-center justify-center" : "items-start"}`}
    >
      <Link
        href={primary.href}
        className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        {primary.label}
        <span aria-hidden="true" className="ml-2">
          →
        </span>
      </Link>
      {secondary ? (
        <Link
          href={secondary.href}
          className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 ${
            tone === "dark"
              ? "border border-brand-blue-light/45 bg-brand-blue/10 text-white backdrop-blur-sm hover:border-brand-blue-light hover:bg-brand-blue/20 focus-visible:outline-brand-blue-light"
              : "border border-brand-blue/35 bg-white text-brand-blue-deep hover:border-brand-blue hover:bg-brand-blue-soft focus-visible:outline-brand-blue"
          }`}
        >
          {secondary.label}
        </Link>
      ) : null}
    </div>
  );
}

export default function SmpPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const galleryTones = [
    "bg-[linear-gradient(140deg,#0b4b7d,#1076bc)]",
    "bg-[linear-gradient(140deg,#1076bc,#f79522)]",
    "bg-[linear-gradient(140deg,#b45309,#f79522)]",
    "bg-[linear-gradient(140deg,#0b4b7d,#0f3f66)]",
    "bg-[linear-gradient(140deg,#f79522,#b45309)]",
    "bg-[linear-gradient(140deg,#123a5e,#1076bc)]",
  ];

  return (
    <>
      {/* FAQ structured data — valid schema.org for machine readability.
          Google's FAQ rich results are limited to authoritative
          government/health sites, so no rich-result eligibility implied. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ============ 1. HERO ============ */}
      <SmpHero />

      {/* ============ 2. BEYOND POSTS AND FOLLOWERS ============ */}
      <section
        id={smpAnchors.strategy}
        className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Beyond posts and followers"
              title="Your Social Media Should Work as Hard as Your Business."
            />
            <div className="mt-7 space-y-5 text-base leading-8 text-muted">
              <p>
                A consistent social media presence is only the beginning. Real
                growth comes from understanding your audience, delivering relevant
                content, building meaningful relationships and guiding interested
                people towards action.
              </p>
              <p>
                At WebEaz, we combine creative storytelling, platform-specific
                strategies, audience insights and AI-assisted optimisation to help
                your brand stay relevant, strengthen customer trust and create more
                opportunities for growth.
              </p>
              <p>
                Every strategy starts with your business objectives — because
                social media success should mean more than numbers on a screen.
              </p>
            </div>
          </Reveal>

          {/* Editorial highlight stack — numbered editorial blocks */}
          <div className="space-y-4">
            {highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 90}>
                <article className="group relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-lg">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1 ${
                      i === 0
                        ? "bg-brand-orange"
                        : i === 1
                          ? "bg-brand-blue"
                          : "bg-[linear-gradient(180deg,#f79522,#1076bc)]"
                    }`}
                  />
                  <div className="flex items-start gap-4 pl-2">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue-soft text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                      <ServiceIcon name={h.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-orange-strong">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1.5 text-base font-semibold tracking-tight text-ink">
                        {h.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {h.description}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. THE CHALLENGES WE SOLVE ============ */}
      <section className="brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Sound familiar?"
              title="Posting Regularly Isn't the Same as Growing Strategically."
              onDark
            />
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              Your brand may be active online, but are your social channels
              helping your business move forward?
            </p>
          </Reveal>

          {/* Alternating asymmetry: even items start text-left, odd flip */}
          <div className="mt-14 space-y-5">
            {challenges.map((c, i) => {
              const flip = i % 2 === 1;
              return (
                <Reveal key={c.num} delay={i * 70}>
                  <article
                    className={`grid items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:border-brand-orange/35 hover:bg-white/[0.07] sm:p-7 lg:grid-cols-[auto_1fr_1.6fr] ${
                      flip ? "lg:[&>*:first-child]:order-3" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 lg:block">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-blue-light/30 bg-brand-blue/12 text-brand-blue-light">
                        <ServiceIcon name={c.icon} className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-lg font-bold text-brand-orange lg:mt-3 lg:block">
                        {c.num}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-white lg:text-xl">
                      {c.title}
                    </h3>
                    <p className="text-sm leading-7 text-white/65">{c.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="mx-auto max-w-2xl text-base leading-7 text-white/70">
              Your brand doesn&apos;t need more random activity. It needs a social
              media strategy with a clear direction.
            </p>
            <Link
              href={`#${smpAnchors.enquiry}`}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Let&apos;s Fix Your Social Strategy
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 4. OUR SERVICES ============ */}
      <section
        id={smpAnchors.services}
        className="scroll-mt-24 brand-surface-mist px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our capabilities"
              title="Everything Your Brand Needs to Grow on Social Media."
              description="From strategic planning to creative execution and performance analysis, we bring your social media activities together under one coordinated growth strategy."
            />
          </Reveal>

          {/* 2-col blocks with a media edge — not a uniform card grid */}
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.num} delay={(i % 2) * 80}>
                <article className="group flex h-full gap-5 overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/35 hover:shadow-lg">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      i % 2 === 0
                        ? "bg-brand-blue text-white"
                        : "bg-brand-orange text-ink"
                    }`}
                  >
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
                      {s.num}
                    </p>
                    <h3 className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-6 text-muted">
                      {s.description}
                    </p>
                    <p className="mt-3.5 border-t border-line pt-3 text-xs leading-5 text-brand-blue-deep">
                      <span className="font-semibold">Includes: </span>
                      {s.includes}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <CtaRow
            primary={{ label: "Explore the Right Strategy for Your Business", href: `#${smpAnchors.enquiry}` }}
          />
        </div>
      </section>

      {/* ============ 5. AI-INTEGRATED SOCIAL ============ */}
      <section
        id={smpAnchors.ai}
        className="scroll-mt-24 relative overflow-hidden brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[14%] top-[8%] h-[32rem] w-[32rem] rounded-full bg-brand-blue/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[12%] bottom-[6%] h-[26rem] w-[26rem] rounded-full bg-brand-orange/12 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Intelligence meets creativity"
              title="Introducing a Smarter Way to Approach Social Media Growth."
              onDark
            />
            <p className="mt-7 text-base leading-8 text-white/70">
              AI is changing how marketers research audiences, develop content,
              test creative ideas and interpret campaign performance. We bring
              AI-assisted workflows into social media planning where they add
              value, while keeping human creativity, brand understanding and
              strategic judgement at the centre.
            </p>
            <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-6 text-white/60">
              AI supports better-informed marketing decisions; it does not replace
              original thinking, audience understanding or human review.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <SmpAiVisual />
          </Reveal>
        </div>

        {/* Six capability blocks below the split */}
        <div className="relative mx-auto mt-14 max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiCapabilities.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 70}>
                <article className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-brand-blue-light/40 hover:bg-white/[0.07]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-orange/30 bg-brand-orange/10 font-mono text-[11px] font-semibold text-brand-orange-light">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-white">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {c.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href={`#${smpAnchors.enquiry}`}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Build Your AI-Ready Social Strategy
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 6. PLATFORMS ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="The right platform. The right audience."
              title="Your Audience Is Different on Every Platform. Your Strategy Should Be, Too."
              description="We tailor content, messaging and campaign approaches to the platforms that best match your customers, business model and marketing objectives."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 70}>
                <article className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                        i % 2 === 0
                          ? "bg-[linear-gradient(135deg,#0b4b7d,#1076bc)] text-white"
                          : "bg-[linear-gradient(135deg,#b45309,#f79522)] text-ink"
                      }`}
                    >
                      {p.short}
                    </span>
                    <ServiceIcon
                      name={p.icon}
                      className="h-4 w-4 text-brand-blue/60"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-6 text-muted">
                    {p.description}
                  </p>
                  <p className="mt-4 rounded-xl bg-brand-blue-soft p-3 text-xs leading-5 text-brand-blue-deep">
                    <span className="font-semibold">Best suited for: </span>
                    {p.bestFor}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mx-auto max-w-2xl text-base leading-7 text-muted">
              We prioritise the channels that fit your audience and objectives
              instead of spreading your resources across every platform.
            </p>
            <CtaRow
              center
              primary={{ label: "Find Your Best-Fit Platforms", href: `#${smpAnchors.enquiry}` }}
            />
          </div>
        </div>
      </section>

      {/* ============ 7. CONTENT THAT CAPTURES ATTENTION ============ */}
      <section className="brand-surface-sand px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Creative that connects"
              title="Give Your Audience a Reason to Stop, Watch and Remember."
              description="A strong social media presence balances discovery, education, trust and action. We develop a content mix that communicates your value while giving people relevant reasons to interact with your brand."
            />
          </Reveal>

          {/* Gallery — varied heights and gradient seeds, not six boxes */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contentTypes.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 70}>
                <article
                  className={`group relative flex flex-col overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    i % 3 === 1 ? "lg:mt-8" : ""
                  }`}
                >
                  <div
                    className={`relative flex h-28 items-center justify-center ${galleryTones[c.tone]}`}
                  >
                    <ServiceIcon name={c.icon} className="h-9 w-9 text-white/90" />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-10 h-20 w-28 rounded-full bg-black/10 blur-2xl"
                    />
                    <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-white/15 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex-1 bg-white p-5">
                    <h3 className="text-base font-semibold tracking-tight text-ink">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {c.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-base leading-7 text-muted">
            Every content format has a purpose. We match the format to your
            message, your audience and the action you want people to take.
          </p>
        </div>
      </section>

      {/* ============ 8. OUR PROCESS ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our approach"
              title="From Business Goals to Measurable Social Media Progress."
              align="center"
            />
          </Reveal>
          <SmpProcess />
          <CtaRow
            center
            primary={{ label: "Plan My Social Media Growth", href: `#${smpAnchors.enquiry}` }}
          />
        </div>
      </section>

      {/* ============ 9. WHY WEBEAZ ============ */}
      <section className="brand-surface-mist px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Why WebEaz"
              title="Creative Thinking. Strategic Direction. Measurable Progress."
              description="WebEaz brings social media promotion into the wider picture of your digital growth. Our approach connects brand communication, marketing strategy, technology and business objectives instead of treating each post as an isolated activity."
            />
          </Reveal>

          {/* 3x2 with a gradient feature block for contrast */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 70}>
                <article
                  className={`flex h-full flex-col rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    i === 0
                      ? "bg-[linear-gradient(150deg,#0b4b7d,#1076bc)] text-white"
                      : "border border-line bg-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      i === 0
                        ? "bg-white/12 text-brand-orange-light"
                        : "bg-[linear-gradient(135deg,#0b4b7d,#1076bc)] text-white"
                    }`}
                  >
                    <ServiceIcon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3
                    className={`mt-4 text-base font-semibold leading-snug tracking-tight ${
                      i === 0 ? "text-white" : "text-ink"
                    }`}
                  >
                    {p.title}
                  </h3>
                  <p
                    className={`mt-2.5 text-sm leading-6 ${
                      i === 0 ? "text-white/70" : "text-muted"
                    }`}
                  >
                    {p.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-line bg-white p-7 text-center shadow-sm sm:flex-row sm:text-left">
              <Image
                src="/webeaz-logo-brand.png"
                alt="WebEaz Technologies"
                width={185}
                height={53}
                unoptimized
                className="h-9 w-auto shrink-0"
              />
              <p className="flex-1 text-lg font-medium leading-8 text-ink">
                We don&apos;t just help your brand show up. We help it show up with
                purpose.
              </p>
              <Link
                href={`#${smpAnchors.enquiry}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                Discuss Your Growth Goals
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 10. CUSTOMER JOURNEY ============ */}
      <section
        id={smpAnchors.funnel}
        className="scroll-mt-24 relative overflow-hidden brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[14%] top-[12%] h-[30rem] w-[30rem] rounded-full bg-brand-blue/18 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[10%] bottom-[8%] h-[26rem] w-[26rem] rounded-full bg-brand-orange/12 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="A full-funnel approach"
              title="Turn Discovery Into Engagement. Turn Engagement Into Action."
              onDark
              description="Your audience doesn't move from discovering your brand to becoming a customer in a single step. We plan social media activities that support different stages of the journey."
            />
          </Reveal>

          {/* Stacked funnel — narrowing width reads as a funnel */}
          <div className="mt-14 space-y-3.5">
            {journeyStages.map((s, i) => (
              <Reveal key={s.num} delay={i * 70}>
                <article
                  className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-brand-orange/35 hover:bg-white/[0.07] sm:grid-cols-[auto_1fr_1.1fr] sm:items-start sm:gap-6"
                  style={{ marginLeft: `${i * 3}%`, marginRight: `${i * 3}%` }}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#b45309,#f79522)] font-mono text-sm font-bold text-ink">
                    {s.num}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-tight text-white">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {s.description}
                    </p>
                  </div>
                  <p className="rounded-xl border border-white/10 bg-brand-blue-deep/40 p-3.5 text-xs leading-5 text-white/65">
                    <span className="block font-semibold uppercase tracking-[0.12em] text-brand-orange-light">
                      Focus metrics
                    </span>
                    <span className="mt-1.5 block">{s.metrics}</span>
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href={`#${smpAnchors.enquiry}`}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Build My Social Media Funnel
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 11. INDUSTRY SOLUTIONS ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Your industry. Your audience. Your strategy."
              title="Social Media Marketing That Understands Your Business."
              description="Different industries need different messages, content formats and conversion paths. We adapt our approach to your market, audience and business priorities."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <Reveal key={ind.title} delay={(i % 3) * 70}>
                <article className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/35 hover:shadow-lg">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      i % 3 === 1
                        ? "bg-brand-orange-soft text-brand-orange-deep"
                        : "bg-brand-blue-soft text-brand-blue"
                    }`}
                  >
                    <ServiceIcon name={ind.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold leading-snug tracking-tight text-ink">
                      {ind.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {ind.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-base leading-7 text-muted">
            Whether you are building a new brand or strengthening an established
            business, we tailor the social strategy to your goals.
          </p>
        </div>
      </section>

      {/* ============ 12. PERFORMANCE TRACKING ============ */}
      <section className="brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Measure what matters"
              title="Every Campaign Should Teach Us Something."
              onDark
              description="Social media performance is about more than follower counts. We focus on the indicators that help explain whether your content and campaigns are moving towards your business objectives."
            />
          </Reveal>

          {/* Four distinct metric panels — varied widths, not identical cards */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metricGroups.map((m, i) => (
              <Reveal key={m.title} delay={i * 70}>
                <article
                  className={`h-full rounded-2xl border p-6 transition-all duration-300 ${
                    i === 0
                      ? "border-brand-orange/30 bg-brand-orange/[0.08]"
                      : i === 3
                        ? "border-brand-blue-light/30 bg-brand-blue/[0.08]"
                        : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.06] text-brand-orange-light">
                    <ServiceIcon name={m.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-tight text-white">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {m.description}
                  </p>
                  {/* abstract meter — no values */}
                  <div className="mt-4 flex items-end gap-1" aria-hidden="true">
                    {[34, 58, 44, 70, 52, 80, 62, 88].map((h, b) => (
                      <span
                        key={b}
                        className={`w-full rounded-sm ${
                          b >= 6 ? "bg-brand-orange/60" : "bg-white/14"
                        }`}
                        style={{ height: `${h * 0.1}px` }}
                      />
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] uppercase tracking-[0.14em] text-white/55">
            Illustrative structure only — no real performance figures
          </p>

          {/* Reporting subsection */}
          <Reveal delay={120}>
            <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <h3 className="text-lg font-semibold tracking-tight text-white">
                What Our Reporting Approach Covers
              </h3>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {reportItems.map((r, i) => (
                  <li key={r.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-blue-light/30 bg-brand-blue/12 font-mono text-[10px] font-semibold text-brand-blue-light">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">
                        {r.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-white/65">
                        {r.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-6 text-white/55">
                Reporting frequency and available metrics will depend on the
                agreed service package, platform access and tracking setup.
              </p>
              <Link
                href={`#${smpAnchors.enquiry}`}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
              >
                Discuss Your Growth Goals
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 13. FAQ ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeading
              eyebrow="Social media promotion FAQs"
              title="Everything You Need to Know Before Getting Started."
              align="center"
            />
          </Reveal>
          <Accordion items={faqs} className="mt-12" />
        </div>
      </section>

      {/* ============ 14. FINAL CTA ============ */}
      <section className="relative overflow-hidden brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[14%] -top-[26%] h-[30rem] w-[30rem] rounded-full bg-brand-blue/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[34%] -right-[10%] h-[28rem] w-[28rem] rounded-full bg-brand-orange/16 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange-light">
            Your next stage of digital growth starts here
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Let&apos;s Make Your Social Media Work Smarter.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">
            Your audience is out there. Let&apos;s build a strategy that helps your
            brand reach the right people, start meaningful conversations and
            create opportunities for business growth.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/70">
            Combine creative content, intelligent marketing and measurable
            performance with a social media approach built around your goals.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`#${smpAnchors.enquiry}`}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Let&apos;s Talk About Your Growth
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/60">
            Have a goal in mind? Let&apos;s build the strategy around it.
          </p>

          <ul className="mt-9 flex flex-wrap justify-center gap-2.5">
            {[
              { href: SOCIAL_SERVICE, label: "Social media service" },
              { href: SEO_PAGE, label: "SEO services" },
              { href: SEM_PAGE, label: "Search engine marketing" },
              { href: WEB_SERVICE, label: "Website development" },
              { href: "/contact", label: "Contact WebEaz" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70 transition-colors duration-200 hover:border-brand-orange/50 hover:text-brand-orange-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
                >
                  {l.label}
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Enquiry form (CTA destination) ---- */}
      <section
        id={smpAnchors.enquiry}
        className="scroll-mt-24 brand-surface-mist px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <SmpEnquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}