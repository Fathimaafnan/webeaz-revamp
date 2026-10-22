import Image from "next/image";
import Carousel from "@/components/ui/Carousel";
import Reveal from "@/components/ui/Reveal";

const clients = [
  "/clients/all-logo_17.jpg",
  "/clients/all-logo_13.jpg",
  "/clients/all-logo_03.jpg",
  "/clients/all-logo_08.jpg",
  "/clients/all-logo_14.jpg",
  "/clients/all-logo_10.jpg",
  "/clients/all-logo_09.jpg",
  "/clients/all-logo_02.jpg",
  "/clients/ias.jpg",
  "/clients/all-logo_05.jpg",
  "/clients/all-logo_07.jpg",
  "/clients/all-logo_15.jpg",
  "/clients/all-logo_04.jpg",
  "/clients/all-logo_01.jpg",
  "/clients/all-logo_06.jpg",
  "/clients/all-logo_11.jpg",
  "/clients/Bazuki.webp",
  "/clients/Feet_Match.webp",
  "/clients/Freeline.webp",
  "/clients/FutureA4.webp",
  "/clients/Mage.webp",
  "/clients/NTS.webp",
  "/clients/Qamar_al_madina.webp",
  "/clients/Confederate-Logo.png",
  "/clients/Screenshot_from_2024-01-15_16-10-22.png",
  "/clients/Screenshot_from_2024-01-15_16-17-44.png",
  "/clients/Layer_2.webp",
  "/clients/image_2_-removebg-preview-e1708586105666.png",
  "/clients/GPT-logo.webp",
  "/clients/Logo-e1691137142631-300x120-1.png",
  "/clients/fh.webp",
  "/clients/CGS.png",
  "/clients/Malabar.png",
];

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
export default function FeaturedClients() {
  return (
    <section
      aria-label="Our featured clients"
      className="sec-sky theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24"
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
              Our Featured Clients
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
              {clients.map((src) => (
                <div
                  key={src}
                  className="card-logo-mono clients-logo flex h-28 w-[15rem] items-center justify-center sm:w-[17rem]"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 272px, 240px"
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
