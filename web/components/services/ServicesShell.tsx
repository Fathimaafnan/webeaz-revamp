import type { ReactNode } from "react";
import HeroBackground from "@/components/home/HeroBackground";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  /**
   * Which category this is. The nine original names are kept because
   * the category and service-detail routes pass them in and must not
   * change. What they point at has changed: they no longer resolve to
   * a pale surface, but to the Home page's hero environment, and the
   * name decides which way the field leans — the warm light moves and
   * the blue goes deeper or cooler — so the four categories still read
   * as four places while the system stays one.
   */
  variant?:
    | "navy"
    | "blend"
    | "azure"
    | "abyss"
    | "cobalt"
    | "steel"
    | "ember"
    | "midnight"
    | "twin";
  /** A trail above the panel — the service pages' breadcrumb. */
  trail?: ReactNode;
  /** Actions at the foot of the panel — the service pages' buttons. */
  actions?: ReactNode;
  /**
   * A column beside the panel. The service detail pages put their
   * illustration here, so the drawing sits on the field at the same
   * height as the headline rather than dropping to a second row and
   * stretching the hero down the page.
   */
  aside?: ReactNode;
};

/**
 * Shared shell for the Services pages.
 *
 * The composition is the Home page's:
 *
 *   1. the brand field — the Home hero's grid, four brand lights,
 *      node network, centre calm, top-right lumen and vignette,
 *      over the same blue ground, carrying the headline on a glass
 *      panel built from the Home hero's own badge vocabulary
 *   2. the white working section holding the cards
 *   3. the deep-blue closing band
 *
 * Previously the Services hero was a flat blue rectangle with the
 * headline sitting straight on it, and the detail pages put their
 * entire opening row on the white section below, so the first
 * screen of every service page read as a plain white template.
 */
export default function ServicesShell({
  eyebrow,
  title,
  description,
  children,
  variant = "navy",
  trail,
  actions,
  aside,
}: Props) {
  return (
    <>
      {/* ============ 1 · the brand field ============ */}
      <section
        className="svc-hero hero-base relative overflow-hidden px-5 pb-16 pt-24 text-white sm:px-8 sm:pb-20 sm:pt-28"
        data-accent={variant}
      >
        {/* The Home page's hero environment, reused rather than
            imitated: the faint grid, the four soft brand lights, the
            network of nodes and links, the centre calm that keeps
            the copy legible, the top-right lumen the navbar sits in,
            and the vignette that guarantees contrast wherever the
            pointer pushes the lights. */}
        <HeroBackground />

        <div className="relative mx-auto max-w-6xl">
          {trail ? <div className="mb-6">{trail}</div> : null}

          <div
            className={
              aside
                ? "grid items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]"
                : undefined
            }
          >
            {/* The headline panel. Translucent rather than white, so it
                belongs to the field behind it instead of sitting on it
                as a pasted-on rectangle. */}
            <div className={aside ? "svc-hero-panel" : "svc-hero-panel max-w-3xl"}>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md sm:px-4 sm:text-xs sm:tracking-[0.2em]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange shadow-[0_0_10px_rgba(247,149,34,0.9)]"
                />
                {eyebrow}
              </p>
              <h1 className="mt-6 text-[2.35rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
                {description}
              </p>
              {actions ? <div className="mt-7">{actions}</div> : null}
            </div>

            {aside}
          </div>
        </div>
      </section>

      {/* ============ 2 · the working section ============ */}
      <section className="sec-white relative px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          {/* The cards keep the light treatment they have always had —
              white panels, dark type, blue hairlines — sitting on the
              Home page's own white surface rather than on flat
              white, so they read as cards on a ground instead of
              white boxes on a page. */}
          <div className="svc-surface theme-light relative">{children}</div>
        </div>
      </section>
    </>
  );
}
