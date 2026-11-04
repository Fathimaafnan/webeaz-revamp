import type { Metadata } from "next";
import Link from "next/link";
import ServiceIcon from "@/components/services/ServiceIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import type { ServiceIconName } from "@/lib/services";

const TITLE =
  "Digital Marketing Solutions | SEO, SEM & Social Media | WebEaz Technologies";
const DESCRIPTION =
  "Discover WebEaz digital marketing solutions — search engine optimisation, search engine marketing and social media handling — designed to improve online visibility and create meaningful business opportunities.";

/**
 * Each card links to a route that already exists in the project.
 * Icons come from the shared ServiceIcon set — no new SVGs.
 */
const services = [
  {
    icon: "seo" as ServiceIconName,
    short: "SEO",
    title: "Search Engine Optimization (SEO)",
    description:
      "Improve your website's visibility in organic search results with strategic optimisation, relevant content and sustainable search growth.",
    cta: "Explore SEO",
    href: "/search-engine-optimization",
    accent: "blue" as const,
  },
  {
    icon: "ads" as ServiceIconName,
    short: "SEM",
    title: "Search Engine Marketing (SEM)",
    description:
      "Reach potential customers through targeted paid search campaigns, relevant keywords and performance-focused advertising strategies.",
    cta: "Explore SEM",
    href: "/search-engine-marketing",
    accent: "orange" as const,
  },
  {
    icon: "social" as ServiceIconName,
    short: "SMH",
    title: "Social Media Handling (SMH)",
    description:
      "Build a consistent social media presence through engaging content, strategic planning, audience interaction and data-informed marketing.",
    cta: "Explore SMH",
    href: "/social-media-promotion",
    accent: "blue" as const,
  },
];

export const metadata: Metadata = {
  title: "Digital Marketing Solutions | SEO, SEM & Social Media",
  description: DESCRIPTION,
  alternates: { canonical: "https://www.webeaz.com/digital" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.webeaz.com/digital",
    type: "website",
  },
};

export default function DigitalPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden brand-surface-brand px-5 pb-20 pt-32 text-white sm:px-8 sm:pb-24 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[18%] -top-[24%] h-[34rem] w-[34rem] rounded-full bg-brand-blue/22 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[14%] top-[8%] h-[28rem] w-[28rem] rounded-full bg-brand-orange/16 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,118,188,0.16),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light backdrop-blur-sm">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                Digital marketing solutions
              </p>
              <h1 className="mt-7 text-[2.35rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
                Build Your Digital Presence.{" "}
                <span className="text-brand-orange">Accelerate Your Growth.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                Discover digital marketing solutions designed to improve your
                online visibility, reach the right audience and create meaningful
                business opportunities. Explore our specialised services in search
                engine optimisation, search engine marketing and social media
                handling.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ THREE SERVICE CARDS ============ */}
      <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading
              eyebrow="Our digital services"
              title="Three Specialised Services. One Growth Strategy."
              description="Each service is a complete discipline with its own approach. Start with the one that matches your priority right now."
              align="center"
            />
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.href} delay={i * 90}>
                {/* Whole card is the link. The CTA is a styled span, not a
                    nested anchor — a link inside a link is invalid HTML and
                    breaks keyboard/screen-reader behaviour. */}
                <Link
                  href={s.href}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue hover:border-transparent"
                >
                  {/* media header */}
                  <div
                    className={`relative flex h-32 items-center justify-center ${
                      s.accent === "orange"
                        ? "bg-[linear-gradient(140deg,#9a3412,#b45309)]"
                        : "bg-[linear-gradient(140deg,#0b4b7d,#1076bc)]"
                    }`}
                  >
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-black/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
                    >
                      <ServiceIcon name={s.icon} className="h-7 w-7 text-white" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-12 h-24 w-40 rounded-full bg-black/10 blur-2xl"
                    />
                    <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/55 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                      {s.short}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h2 className="text-lg font-semibold leading-snug tracking-tight text-ink">
                      {s.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                      {s.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange-strong transition-colors duration-300 group-hover:text-brand-orange-strong">
                      {s.cta}
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* closing CTA */}
          <Reveal delay={200}>
            <div className="mt-14 flex flex-col items-center gap-6 rounded-2xl border border-brand-blue-deep bg-brand-blue-deep p-7 text-center sm:flex-row sm:text-left sm:p-8">
              <div className="flex-1">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Not sure which service fits right now?
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  Tell us your goals and we will map them to the right combination
                  of services.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
              >
                Let&apos;s Talk
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}