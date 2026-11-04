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
    <section className="sec-ember relative overflow-hidden px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:py-[var(--section-padding)]">
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift -top-44 left-[8%] h-[34rem] w-[34rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow -bottom-48 right-[-8rem] h-[30rem] w-[30rem]"
      />
      {/* This section is the one saturated ground on the page, and it
          is the brand orange. Its type therefore had to come off white:
          white on this ground measures 2.05:1 at the light top and
          2.91:1 at the deep bottom, and the old light-orange eyebrow
          measured 1.18:1 — invisible. Orange text on orange is worse
          still (brand-orange-strong is only 1.72:1 at the bottom
          stop), so none of this is orange.

          Ink is the answer. At full strength it holds 6.35:1 at the
          darkest stop and 9.04:1 at the lightest, and at 85% — used for
          the eyebrow and the lede — it still clears 4.99:1, so the
          small type passes AA everywhere on the gradient rather than
          only in the middle of it.

          The button flips from heroOrange to heroPrimary. An orange
          button on an orange field has no edge; the brand blue gives
          the one strong complementary accent the close wants, and its
          white label measures a constant 4.84:1 against every stop. */}
      <div className="relative mx-auto max-w-3xl text-center">
        {/* The close gets the same treatment as the rest of the page:
            the statement arrives first, the supporting line a beat
            later, the button last. Three steps of 120ms is enough to
            read as a sequence without making the visitor wait for it. */}
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/85">
            {content.ctaEyebrow || section.eyebrow}
          </p>
          <h2 className="mt-5 text-h1 font-bold tracking-tight text-ink">
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
