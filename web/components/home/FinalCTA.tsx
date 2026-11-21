import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import type { HomeContent, HomeSection } from "@/lib/defaults";

export default function FinalCTA({
  content,
  section,
}: {
  content: HomeContent;
  section: HomeSection;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-gray-50 px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:py-[var(--section-padding)]">
      {/* 3D orange wave background - smooth flowing curved wave */}
      <img
        src="/lets-talk-wave.png"
        alt=""
        className="absolute top-[-90px] left-0 w-full pointer-events-none"
      />
      <div className="relative mx-auto max-w-3xl text-center">
        {/* The close gets the same treatment as the rest of the page:
            the statement arrives first, the supporting line a beat
            later, the button last. Three steps of 120ms is enough to
            read as a sequence without making the visitor wait for it. */}
        <Reveal className="w-full text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/85">
            {content.ctaEyebrow || section.eyebrow}
          </p>
          <h2 className="mx-auto mt-5 w-full text-balance text-center text-h1 font-bold tracking-tight text-ink">
            {section.title || content.ctaTitle}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-xl text-lead text-ink/85">
            {section.description || content.ctaDescription}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10">
            <Button href={content.ctaHref} variant="heroPrimary">
              {content.ctaLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}