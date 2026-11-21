import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { HomeSection } from "@/lib/defaults";
import { DEFAULT_PARTNER_LOGOS, type LogoData } from "@/lib/fallback-content";

/**
 * Partners & Recognition.
 *
 * The section now uses the large curved rectangle from the EQSoft Online
 * About page as its reference: a 40px-radius branded panel with a soft
 * radial sheen, a heavy diffused shadow, and an even grid of glass tiles.
 * The original WebEaz blue-orange identity supplies the panel colour.
 *
 * Every logo is the existing official asset, in its original colour and
 * aspect ratio, sitting on a light glass tile so it stays legible against
 * the branded panel. Nothing about the logos themselves is changed — no
 * crops, no filters, no recolouring, no replacements.
 */

export default function PartnersStrip({
  section,
  logos = DEFAULT_PARTNER_LOGOS,
}: {
  section: HomeSection;
  logos?: LogoData[];
}) {
  return (
    <div className="sec-mist theme-light px-6 pt-[var(--space-5)] pb-[var(--space-5)] sm:px-10 sm:pt-[var(--space-6)] sm:pb-[var(--space-6)] lg:pt-[var(--section-padding)] lg:pb-[var(--section-padding)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange-strong">
          {section.title}
        </h2>

        {/* ===== The curved rectangle ===== */}
        {/* 40px radius, a branded panel, a soft radial sheen and a
            deep diffused shadow — the same construction as the
            reference's company-highlights panel. */}
        <div
          className="relative mt-8 overflow-hidden rounded-[40px] p-8 shadow-[0_40px_80px_rgba(8,74,123,0.25)] sm:mt-12 sm:p-14 lg:mt-16 lg:p-20"
          style={{
            background: "#1076bc",
          }}
        >
          {/* The reference's ::before sheen, held above the panel and
              behind the logos. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-[20%] -top-[50%] h-[200%] w-[140%]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)",
            }}
          />

          {/* ===== Logo grid ===== */}
          {/* Five official marks, evenly sized and evenly spaced, each
              on a light glass tile so its original colours stay true. */}
          <div className="relative z-10 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-8 lg:grid-cols-5">
            {logos.map((logo, i) => (
              <Reveal key={logo.imageUrl} delay={120 + i * 130}>
                <div className="flex h-full min-h-[100px] items-center justify-center rounded-[20px] border border-white/60 bg-white/95 p-3 shadow-sm backdrop-blur-[10px] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg sm:min-h-[120px] sm:p-4">
                  <Image
                    src={logo.imageUrl}
                    alt={logo.alt}
                    width={202}
                    height={58}
                    unoptimized
                    sizes="200px"
                    className="block h-auto max-h-14 w-full max-w-[150px] object-contain sm:max-h-16"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
