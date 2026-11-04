import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * "Meet Our Founder" — sits immediately after the Hero.
 *
 * The composition is borrowed from a printed poster, and only the
 * structure of it: a thin meta row pinned to the measure, one
 * oversized display line running the full width of the content,
 * the identification split to the two edges of that measure, and
 * then the portrait — the single largest object on the page —
 * standing on the ground with nothing behind or around it.
 *
 * The portrait is a real cutout, not a masked rectangle.
 * `public/webeaz-founder-cutout.png` is the supplied photograph with
 * the office chair, the wall and the desk genuinely removed; 41% of
 * that file is fully transparent alpha and the edge is tight to 1.6%
 * soft pixels. Nothing here fakes that: there is no `mix-blend-mode`,
 * no white card behind the image, no `object-fit` crop and no filter.
 * The silhouette is simply standing on the section's own ground,
 * which is the whole point of cutting it out.
 *
 * Because it is a cutout there is no frame to hang it in — no ring,
 * no shadow, no card. The only ornaments are the print crop marks
 * kept from the previous layout at the edges of the measure, the
 * brand hairline under the display type, and a single soft brand
 * glow that sits BEHIND the silhouette and only appears on hover.
 * Because the PNG is transparent, that glow reads through the empty
 * space around him rather than over him.
 *
 * The surface is `sec-white`, the shared light ground, so the page
 * steps down from the Hero's blue without a seam, and a brand
 * hairline carries that transition instead of a heavy band.
 */

/**
 * Facts used below — all of them already stated elsewhere in this
 * project: the name, the role, and the 2008 founding date carried
 * by this section's own biography. No award, qualification, client
 * result or personal detail appears here, because none is on
 * record to state.
 */
const CEO_NAME = "Fasalurahman Moolayil";
const CEO_ROLE = "Founder & CEO, WebEaz Technologies";
const CEO_SINCE = "Est. 2008";

const CEO_BIO =
  "Fasalurahman Moolayil founded WebEaz in 2008 with a clear conviction: technology should solve real business problems, not the other way around. Leading a team across technology, digital growth, automation and AI, he works closely with organisations to shape practical digital strategies — spanning digital transformation, e-commerce and performance marketing — that move businesses forward. His approach pairs hands-on technical understanding with a commercial mindset, keeping every engagement anchored in business outcomes.";

export default function FounderSpotlight() {
  return (
    <section
      className="sec-white relative overflow-hidden px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20"
      aria-labelledby="founder-heading"
    >
      {/* One hairline carries the transition out of the Hero's blue
          onto the light editorial ground. It fades out rather than
          ending on a hard edge. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-brand-blue/45 via-brand-orange/45 to-transparent"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* ---------------- Meta row ----------------
            The reference opens on a thin line of small caps split
            across the measure, and that is the whole trick: it
            makes the display type underneath feel enormous by
            contrast. Pinned with space-between so the year sits on
            the right edge exactly where the eye expects it.

            It stacks below 640px rather than wrapping: the eyebrow
            is a 32-character tracked line, so at phone widths it
            already wraps under its own rule, and letting the year
            wrap around it as well left the two reading as debris. */}
        <Reveal>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-6">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange-strong">
              <span
                aria-hidden="true"
                className="h-px w-9 shrink-0 bg-gradient-to-r from-brand-orange to-brand-orange/20"
              />
              Leadership • Vision • Innovation
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-blue-deep">
              {CEO_SINCE}
            </p>
          </div>
        </Reveal>

        {/* ---------------- Two-column editorial block ----------------
            Text on the left, portrait on the right, vertically
            centred against each other so neither column is left
            floating above the other.

            The heading moves INTO the text column, and that is what
            actually closes the gap. Set full-width above a centred
            portrait, this section was three stacked bands — meta
            row, display line, portrait — with a measure of dead air
            between each one. As the first thing in the left column
            it now reads straight down into the name and the
            biography.

            Its size drops from 5.5rem to 3.4rem for the same reason:
            5.5rem was sized to fill a 1152px measure on one line and
            would overrun a ~610px column by a wide margin. At 3.4rem
            it still sets on one line at desktop and folds to two
            below that. The words themselves are unchanged. */}
        <div className="mt-10 grid items-start gap-x-14 gap-y-12 lg:mt-14 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
          <Reveal delay={120} from="left">
            <div>
              <h2
                id="founder-heading"
                className="text-balance text-[clamp(2.25rem,4.6vw,3.4rem)] font-bold uppercase leading-[0.98] tracking-[-0.038em] text-ink"
              >
                Meet Our Founder
              </h2>

              <span
                aria-hidden="true"
                className="mt-7 block h-px w-full bg-gradient-to-r from-brand-blue/30 via-brand-blue/10 to-transparent"
              />

              <p className="mt-7 text-[clamp(1.5rem,3vw,2.35rem)] font-bold leading-[1.1] tracking-[-0.028em] text-brand-blue-deep">
                {CEO_NAME}
              </p>

              <p className="mt-4 flex items-center gap-3 text-[15px] font-medium tracking-tight text-brand-blue-deep">
                <span
                  aria-hidden="true"
                  className="h-4 w-[2px] shrink-0 rounded-full bg-brand-orange"
                />
                {CEO_ROLE}
              </p>

              {/* The orange rule that introduced the biography when
                  it sat centred underneath now opens the copy
                  itself, rather than floating above it. */}
              <span
                aria-hidden="true"
                className="mt-8 block h-px w-16 bg-gradient-to-r from-brand-orange to-brand-orange/20"
              />

              <p className="mt-7 max-w-[56ch] text-base leading-[1.9] text-muted sm:text-[17px]">
                {CEO_BIO}
              </p>
            </div>
          </Reveal>

          {/* ---------------- The portrait ----------------
              No `aspect-*` and no `object-cover`: the PNG is a
              cutout, and cropping one would slice the silhouette in
              half. It keeps its own proportion and stands on the
              section ground.

              The file is the supplied cutout, used exactly as given
              — 435x573, unmodified. The declared width/height match
              it, and the display is capped at 27rem (432px), the
              widest that stays at 1:1 with the source rather than
              upscaling it. Below that it downscales. `sizes` is
              stated from those real boxes so the optimiser is never
              asked for less than it draws. */}
          {/* The two columns arrive from opposite sides, so the pair reads as
              one gesture rather than two independent blocks. Both use
              the same duration and easing as every other reveal on the
              page; only the offset differs.

              The portrait's own hover behaviour — the lift, the 1.02
              scale and the brand glow behind the silhouette — lives on
              the <figure> and the <Image> inside this wrapper, so
              adding the entrance here cannot interfere with it. They
              are also different properties on different elements: this
              animates the outer wrapper once, on entry, while hover
              animates the image continuously. */}
          <Reveal delay={200} from="right">
            <figure className="group relative mx-auto w-full max-w-[20rem] sm:max-w-[24rem] lg:max-w-[27rem]">
              {/* Print crop marks at the edges of the measure, not of
                  the image — they belong to the page, and they are the
                  only ornament left in this layout. */}
              <span
                aria-hidden="true"
                className="absolute -left-6 top-1/2 hidden h-6 w-6 -translate-y-1/2 border-l border-t border-brand-blue/30 xl:block"
              />
              <span
                aria-hidden="true"
                className="absolute -right-6 top-1/2 hidden h-6 w-6 -translate-y-1/2 border-r border-t border-brand-blue/30 xl:block"
              />

              {/* The hover glow. It sits UNDER the transparent PNG, so
                  it reads as light behind him rather than a filter on
                  him, and it never touches a single pixel of the
                  photograph. Kept soft and well inside the silhouette
                  so it reads as ambient, not as a halo.

                  `motion-safe:` gates the whole interaction: with
                  reduced motion the transform and the fade simply do
                  not happen, and the portrait sits still. Nothing here
                  is load-bearing — no information appears or changes
                  on hover, so touch and keyboard users lose nothing. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(16,118,188,0.28),rgba(247,149,34,0.16),transparent_78%)] opacity-0 blur-2xl transition-opacity duration-500 motion-safe:group-hover:opacity-100"
              />

              <Image
                src="/webeaz-founder-cutout.png"
                alt={`${CEO_NAME}, ${CEO_ROLE}`}
                width={435}
                height={573}
                sizes="(min-width: 1024px) 27rem, (min-width: 640px) 24rem, 20rem"
                className="relative h-auto w-full transition-transform duration-500 ease-out motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:scale-[1.02]"
              />
            </figure>
          </Reveal>
        </div>

        {/* The full-width rule that closes the spread. Purely a
            print device; it carries no text. */}
        <Reveal delay={340}>
          <span
            aria-hidden="true"
            className="mt-16 block h-px w-full bg-gradient-to-r from-transparent via-brand-blue/15 to-transparent lg:mt-20"
          />
        </Reveal>
      </div>
    </section>
  );
}