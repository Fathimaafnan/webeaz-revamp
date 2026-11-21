import Accordion from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import type { HomeSection } from "@/lib/defaults";
import { DEFAULT_FAQS, type FaqData } from "@/lib/fallback-content";

/**
 * Homepage FAQ section.
 *
 * Uses the site's shared Accordion (accessible, single-open, smooth) and the
 * same section wrapper, heading and reveal patterns as the other homepage
 * sections. Content comes from the CMS, with the original four questions and
 * answers preserved verbatim as the fallback.
 */

export default function Faq({
  section,
  items = DEFAULT_FAQS,
}: {
  section: HomeSection;
  items?: FaqData[];
}) {
  return (
    <section
      aria-label="Frequently asked questions"
      className="sec-white theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift-slow absolute -right-[12%] bottom-[15%] h-[28rem] w-[28rem]"
      />
      <div className="relative mx-auto max-w-4xl">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            align="center"
          />
        </Reveal>
        <Reveal delay={100}>
          <Accordion
            items={items.map(({ question, answer }) => ({ question, answer }))}
            className="mt-12 sm:mt-14"
          />
        </Reveal>
      </div>
    </section>
  );
}
