import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

/**
 * Shared shell for the Login and Sign Up pages.
 *
 * These two pages used to be a near-black card floating on a dark
 * blue atmosphere, which put them on a different design system from
 * the Home page — where the light sections, the white cards with
 * hairline borders, the deep-orange eyebrows and the blue links are
 * what the brand actually looks like.
 *
 * The page is now built from that light system instead:
 *
 *   - the ground is `sec-mist`, the Home page's own light grey
 *     surface, with the same soft brand lighting it uses
 *   - the card is a white panel with a hairline border and a
 *     blue-tinted shadow, like the Home page's cards
 *   - the eyebrow carries the Home page's orange-to-blue rule
 *   - the type steps down through ink, muted and blue-deep, which
 *     is the Home page's hierarchy
 *
 * The blue and the orange are still both there — the seam, the
 * eyebrow, the submit button — they just sit on white now instead of
 * on black. Only the frame and the backdrop live here; each page
 * owns its fields.
 */
export default function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: Props) {
  return (
    <section className="sec-mist theme-light relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-32">
      {/* The Home page's soft brand lighting, read on a light ground
          by `theme-light`. Static rather than drifting: a form is
          where the eye needs to stay put. */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue -top-40 -left-32 h-[34rem] w-[34rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange -bottom-44 -right-28 h-[30rem] w-[30rem]"
      />

      <div className="relative mx-auto w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_28px_60px_-30px_rgba(11,90,150,0.38)]">
          {/* Brand accent seam — the one piece of the old dark card
              worth keeping, because it carries both brand colours in
              a single line. */}
          <span
            aria-hidden="true"
            className="block h-px w-full bg-gradient-to-r from-brand-blue via-brand-orange to-brand-blue/30"
          />

          <div className="px-7 py-9 sm:px-9 sm:py-10">
            {/* The Home page's section-opener signature: a short
                orange-to-blue rule, then the label. */}
            <p className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange-strong">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gradient-to-r from-brand-orange to-brand-blue"
              />
              {eyebrow}
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">{description}</p>

            <div className="mt-8">{children}</div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted">{footer}</div>
      </div>
    </section>
  );
}
