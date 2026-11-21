import Image from "next/image";
import Carousel from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";
import type { HomeSection } from "@/lib/defaults";
import { DEFAULT_CLIENT_LOGOS, type LogoData } from "@/lib/fallback-content";

/**
 * "Our Featured Clients" — the same client logos shown on
 * www.webeaz.com, presented as a SINGLE seamless horizontal
 * row on a premium, highlighted dark background. Every client
 * stays on one line and never wraps to a second row; the row
 * simply glides horizontally and loops forever. Each logo
 * floats individually with a soft glow — no boxes, no cards.
 * Hovering pauses the movement; users who prefer reduced
 * motion get a static single-row view (no scrolling animation).
 */
export default function FeaturedClients({
  section,
  logos = DEFAULT_CLIENT_LOGOS,
}: {
  section: HomeSection;
  logos?: LogoData[];
}) {
  return (
    <section
      aria-label="Our featured clients"
      className="sec-sky theme-light relative overflow-hidden px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:py-[var(--section-padding)]"
    >
      {/* Subtle WebEaz blue + orange light */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift -top-40 right-[-12rem] h-[28rem] w-[28rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow -bottom-44 left-[-10rem] h-[26rem] w-[26rem]"
      />

      <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-h2 text-center font-bold text-ink">
              {section.title}
            </h2>
          </Reveal>

        {/* SINGLE horizontal row — every client on one line, drifting
            continuously, with the logo at the centre lifted. The
            rail renders the set twice so the loop never shows a
            seam; the fade mask and the glow treatment are unchanged.

            The slide is a fixed box and the logo is `object-contain`
            inside it, so every logo keeps its own proportions — none
            is stretched or cropped — while sharing one visual
            height. The box is deliberately generous because most of
            these files are logo-on-white tiles whose artwork only
            fills a third to two thirds of the tile, and a tight box
            would shrink the mark itself rather than the padding.

            `secondsPerCard` went from 2.4 to 3.5 because the rail
            advances by one *card stride* per that interval: the
            stride grew from 232px to 336px, so without this the
            logos would have scrolled 45% faster. The pixels-per-
            second drift is unchanged. */}
        <Reveal delay={160} from="scale">
          <div className="clients-fade mt-14 overflow-hidden">
            <Carousel
              label="Featured client logos"
              mode="marquee"
              secondsPerCard={3.5}
              gap={0}
              slideClassName="shrink-0 px-6 sm:px-8"
            >
              {logos.map((logo) => (
                <div
                  key={logo.imageUrl}
                  className="card-logo-mono clients-logo flex h-32 w-32 sm:h-36 sm:w-36 lg:h-40 lg:w-40 items-center justify-center p-2 sm:p-3 rounded-lg border border-white/40 bg-white/5 backdrop-blur-sm"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={logo.imageUrl}
                      alt={logo.alt}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 160px, (min-width: 640px) 144px, 128px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
