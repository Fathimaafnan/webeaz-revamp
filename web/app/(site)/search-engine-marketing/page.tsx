import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SemHero from "@/components/sem/SemHero";
import SemProcess from "@/components/sem/SemProcess";
import SemAnalyticsDashboard from "@/components/sem/SemAnalyticsDashboard";
import Accordion from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ServiceIcon from "@/components/services/ServiceIcon";
import {
  aiFeatures,
  benefits,
  faqs,
  industries,
  metrics,
  pillars,
  services,
  values,
  semAnchors,
} from "@/lib/sem-page-content";

const SEO_PAGE = "/search-engine-optimization";

const TITLE =
  "Search Engine Marketing Services | AI-Powered SEM | WebEaz Technologies";
const DESCRIPTION =
  "Grow your business with WebEaz SEM services. Reach high-intent customers through Google Ads, AI-assisted campaign optimization, lead generation, and conversion-focused strategies.";

export const metadata: Metadata = {
  title: "Search Engine Marketing Services | AI-Powered SEM",
  description: DESCRIPTION,
  alternates: { canonical: "https://www.webeaz.com/search-engine-marketing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.webeaz.com/search-engine-marketing",
    type: "website",
  },
};

export default function SemPage() {
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
      {/* FAQ structured data — valid schema.org, emitted for machine
          readability only. Google's FAQ rich results are limited to
          authoritative government and health sites, so no rich-result
          eligibility is implied. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ============ 1. HERO ============ */}
      <SemHero />

      {/* ============ 2. INTRODUCTION TO SEM ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="The power of paid search"
              title="Be Present at the Moment That Matters"
              description="Your customers are already searching for solutions. The opportunity is to connect with them at the right moment, with the right message, and a clear next step."
            />
            <div className="mt-7 grid gap-5 text-base leading-8 text-muted lg:grid-cols-2">
              <p>
                Search Engine Marketing (SEM) uses paid search campaigns to help
                businesses appear in relevant search results and reach people
                actively looking for their products or services.
              </p>
              <p>
                At WebEaz, we bring audience insights, keyword strategy,
                compelling ad messaging, AI-assisted optimization, and conversion
                tracking together to build campaigns around measurable business
                objectives.
              </p>
            </div>
            <p className="mt-7 border-l-2 border-brand-orange pl-5 text-lg font-medium leading-8 text-ink">
              Don&apos;t just compete for clicks. Compete for the customers who
              matter to your business.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 80}>
                <article className="group h-full rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/35 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue-soft text-brand-blue transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                    <ServiceIcon name={v.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold leading-snug tracking-tight text-ink">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {v.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. OUR SEM SERVICES ============ */}
      <section
        id={semAnchors.services}
        className="scroll-mt-24 brand-surface-mist px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our SEM capabilities"
              title="A Smarter Approach to Every Search"
              description="Every business has a different audience, budget, and growth objective. Our SEM strategies are designed around those differences, combining focused campaign planning with ongoing optimization."
            />
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
              From capturing high-intent searches to improving the performance of
              your landing pages, we help create a connected advertising
              experience.
            </p>
          </Reveal>

          {/* Compact 3-column grid so no card becomes excessively tall */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={(i % 3) * 70}>
                <article className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-lg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange-soft text-brand-orange-deep transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-ink">
                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-muted">
                    {s.description}
                  </p>
                  <p className="mt-4 flex-1 border-t border-line pt-3.5 text-xs leading-5 text-brand-blue-deep">
                    {s.detail}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. AI-INTEGRATED SEM ============ */}
      <section className="relative overflow-hidden brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[15%] top-[6%] h-[32rem] w-[32rem] rounded-full bg-brand-blue/18 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[12%] bottom-[4%] h-[26rem] w-[26rem] rounded-full bg-brand-orange/12 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Intelligence meets performance"
              title="AI-Powered Search. Human-Led Strategy."
              onDark
            />
            <div className="mt-7 space-y-5 text-base leading-8 text-white/70">
              <p>
                Search behaviour continues to evolve. Customers use more specific
                queries, compare more options, and expect more relevant
                experiences.
              </p>
              <p>
                We combine AI-assisted advertising capabilities with strategic
                planning and human oversight to help your campaigns respond to
                changing search intent without losing sight of your business
                goals.
              </p>
            </div>
            <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-6 text-white/55">
              AI here means eligible advertising features and data-informed
              workflows working alongside human review — not an in-house engine,
              and never a guarantee of cost, ranking or revenue.
            </p>
          </Reveal>

          <div className="space-y-3.5">
            {aiFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <article className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-brand-orange/40 hover:bg-white/[0.07]">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-blue-light/35 bg-brand-blue/10 font-mono text-xs font-semibold text-brand-blue-light">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-tight text-white">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-white/65">
                      {f.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
            <p className="pt-2 text-sm leading-7 text-white/60">
              AI can help identify opportunities. Strategy, accurate data, and
              human judgment help turn those opportunities into better decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ============ 5. OUR PROCESS ============ */}
      <section
        id={semAnchors.process}
        className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our approach"
              title="From Campaign Planning to Continuous Improvement"
              description="Effective search marketing is not a one-time setup. It is a structured process that connects business objectives with targeting, campaign execution, measurement, and ongoing refinement."
              align="center"
            />
          </Reveal>
          <SemProcess />
        </div>
      </section>

      {/* ============ 6. BENEFITS OF SEM ============ */}
      <section className="brand-surface-sand px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Built around business outcomes"
              title="More Than Visibility. A Clearer Path to Growth."
              description="A well-managed SEM strategy connects your advertising investment to measurable business objectives. The goal is not simply to generate more traffic, but to understand which campaigns attract relevant prospects and encourage meaningful action."
            />
          </Reveal>

          {/* Split rows — deliberately unlike the 3-column service grid */}
          <div className="mt-12 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 60}>
                <div className="group flex flex-col gap-2 p-6 transition-colors duration-300 hover:bg-surface sm:flex-row sm:items-baseline sm:gap-8 sm:p-7">
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs font-semibold tabular-nums text-brand-orange-strong sm:w-8 sm:shrink-0"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="w-full shrink-0 text-base font-semibold tracking-tight text-ink sm:w-56">
                    {b.title}
                  </h3>
                  <p className="flex-1 text-sm leading-6 text-muted">
                    {b.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 7. INDUSTRY SOLUTIONS ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Strategies for your business"
              title="Different Goals. One Focus on Meaningful Results."
              description="Your advertising strategy should reflect the way your business attracts and serves customers. We shape SEM campaigns around your industry, sales process, audience, and growth priorities."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => (
              <Reveal key={ind.title} delay={i * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className={`relative flex h-32 items-center justify-center ${
                      i % 2 === 0
                        ? "bg-[linear-gradient(135deg,#0b4b7d_0%,#1076bc_100%)]"
                        : "bg-[linear-gradient(135deg,#9a3412_0%,#b45309_100%)]"
                    }`}
                  >
                    <ServiceIcon name={ind.icon} className="relative h-11 w-11 text-white" />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-10 h-24 w-36 rounded-full bg-black/10 blur-2xl"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-semibold leading-snug tracking-tight text-ink">
                      {ind.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-6 text-muted">
                      {ind.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 8. PERFORMANCE MEASUREMENT ============ */}
      <section
        id={semAnchors.measurement}
        className="scroll-mt-24 relative overflow-hidden brand-surface-brand px-5 py-20 text-white sm:px-8 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[14%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-brand-blue/18 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[10%] bottom-[6%] h-[24rem] w-[24rem] rounded-full bg-brand-orange/12 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Clarity through data"
              title="Know What Your Advertising Is Delivering"
              onDark
              description="Clicks and impressions tell only part of the story. Meaningful performance measurement connects campaign activity to the actions that matter to your business."
            />
            <p className="mt-7 text-base leading-8 text-white/70">
              Depending on your campaign objectives and available tracking data,
              we can monitor:
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {metrics.map((m) => (
                <li
                  key={m.title}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-sm font-semibold text-white">{m.title}</p>
                  <p className="mt-1.5 text-xs leading-5 text-white/60">
                    {m.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-7 border-l-2 border-brand-orange/60 pl-5 text-sm leading-7 text-white/70">
              Our focus is on turning campaign data into practical insights,
              clearer decisions, and a stronger foundation for continuous
              improvement.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <SemAnalyticsDashboard />
          </Reveal>
        </div>
      </section>

      {/* ============ 9. WHY CHOOSE WEBEAZ ============ */}
      <section className="brand-surface-mist px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="The WebEaz advantage"
              title="Your Business Goals. Our Strategic Focus."
              description="At WebEaz, we bring marketing thinking, digital expertise, and a focus on measurable outcomes together to support your business growth."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 70}>
                <article className="group h-full rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0b4b7d,#1076bc)] text-white">
                      <ServiceIcon name={p.icon} className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-semibold leading-snug tracking-tight text-ink">
                      {p.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">
                    {p.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-line bg-white p-7 text-center shadow-sm sm:flex-row sm:text-left">
              <Image
                src="/webeaz-logo.png"
                alt="WebEaz Technologies"
                width={1746}
                height={483}
                unoptimized
                className="h-9 w-auto shrink-0"
              />
              <p className="flex-1 text-sm leading-7 text-muted">
                WebEaz makes your business easier to discover, connect with, and
                grow through a more thoughtful approach to digital marketing.
              </p>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                Talk to WebEaz
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 10. SEM VS SEO ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="The right search strategy"
              title="Paid Search and Organic Search, Working Toward the Same Goal"
              description="Search Engine Marketing through paid advertising and Search Engine Optimization serve different roles in your search strategy."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {[
              {
                kicker: "Column 1",
                title: "Search Engine Marketing (SEM)",
                accent: "orange" as const,
                body: "Paid campaigns help your business compete for relevant search visibility and generate traffic while your ads are eligible to serve. Performance depends on targeting, budget, competition, campaign quality, and conversion experience.",
                points: [
                  "Traffic while ads are eligible to serve",
                  "Controlled by budget and bidding",
                  "Immediate, measurable entry",
                ],
              },
              {
                kicker: "Column 2",
                title: "Search Engine Optimization (SEO)",
                accent: "blue" as const,
                body: "SEO improves your website's organic search visibility through relevant content, technical improvements, and a useful website experience. Organic growth typically requires ongoing effort and time.",
                points: [
                  "Compounding unpaid visibility",
                  "Depends on site and content quality",
                  "Builds a long-term organic asset",
                ],
              },
            ].map((col, i) => (
              <Reveal key={col.title} delay={i * 90}>
                <article
                  className={`flex h-full flex-col rounded-2xl border p-7 ${
                    col.accent === "orange"
                      ? "border-brand-orange/30 bg-[linear-gradient(160deg,#fffaf3,#ffffff)]"
                      : "border-brand-blue/25 bg-[linear-gradient(160deg,#f3f8fd,#ffffff)]"
                  }`}
                >
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      col.accent === "orange"
                        ? "bg-brand-orange-soft text-brand-orange-strong"
                        : "bg-brand-blue-soft text-brand-blue-deep"
                    }`}
                  >
                    {col.kicker}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-ink">
                    {col.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{col.body}</p>
                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5">
                    {col.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <span
                          aria-hidden="true"
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                            col.accent === "orange" ? "bg-brand-orange" : "bg-brand-blue"
                          }`}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <div className="mt-5 rounded-2xl border border-brand-blue-deep bg-brand-blue-deep p-7 text-white sm:p-8">
              <h3 className="text-lg font-semibold tracking-tight">
                A connected approach
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
                Paid search can help capture immediate advertising opportunities
                while SEO builds your long-term organic presence. Together, they
                can provide complementary insights into customer intent and search
                demand.
              </p>
              <Link
                href={SEO_PAGE}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-all duration-200 hover:bg-brand-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
              >
                Explore Our SEO Services
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 11. FAQ ============ */}
      <section className="brand-surface-mist px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <SectionHeading
              eyebrow="Frequently asked questions"
              title="Everything You Need to Know About SEM"
              align="center"
            />
          </Reveal>
          <Accordion items={faqs} className="mt-12" />
        </div>
      </section>

      {/* ============ 12. FINAL CTA ============ */}
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
            Let&apos;s grow
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Ready to Turn Search Intent Into Business Opportunities?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">
            Let&apos;s build an SEM strategy around your audience, your goals, and
            the outcomes that matter most. Start with a conversation about where
            your business wants to go next.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-brand-orange px-7 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
            >
              Talk to WebEaz
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/55">
            Discuss your goals, target market, and campaign priorities with our
            team.
          </p>

          <ul className="mt-9 flex flex-wrap justify-center gap-2.5">
            {[
              { href: SEO_PAGE, label: "SEO services" },
              { href: "/services/digital-growth/google-ads", label: "Google Ads service" },
              { href: "/services/digital-growth/seo", label: "SEO service overview" },
              { href: "/services/automation", label: "Automation" },
              { href: "/services/ai", label: "AI services" },
            ].map((l) => (
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
        </div>
      </section>
    </>
  );
}