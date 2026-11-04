import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import type { HomeSection } from "@/lib/defaults";

/**
 * Partner and recognition information published on
 * www.webeaz.com — labels and official logos reproduced verbatim.
 *
 * All logos are displayed in a single horizontal row at their
 * original size, without cropping or distortion.
 *
 * Logos reveal one by one (fade + slight rise) via the shared
 * Reveal component, staggered across all five in reading order.
 * Sizing is driven purely by max-height so each logo keeps its
 * original aspect ratio — `object-contain` guards that too.
 *
 * These are official partner and recognition marks, published in
 * full brand colour, and they are shown in those colours at rest.
 * The mono treatment the shared `.card-logo-mono` class applies is
 * for the Featured Clients rail, where it is wanted; `partner-logo`
 * opts these out of it. See the note on that rule in globals.css.
 */

/** All partner logos in a single flat array, in reading order. */
const partnerLogos = [
  {
    src: "/partners/google-partner.png",
    alt: "Google Workspace Certified Partner",
    width: 202,
    height: 58,
    delay: 120,
  },
  {
    src: "/partners/office-partner.jpg",
    alt: "Office 365 Microsoft Partner",
    width: 202,
    height: 58,
    delay: 250,
  },
  {
    src: "/partners/amazon-partner.png",
    alt: "Amazon Web Services Certified Partner",
    width: 202,
    height: 58,
    delay: 380,
  },
  {
    src: "/partners/leadsquare-partner.png",
    alt: "Leadsquared Associate Partner",
    width: 202,
    height: 58,
    delay: 510,
  },
  {
    src: "/partners/startup-india-recognition.png",
    alt: "#startupindia Recognition",
    width: 202,
    height: 58,
    delay: 640,
  },
];

export default function PartnersStrip({ section }: { section: HomeSection }) {
  return (
    <div className="sec-mist theme-light px-6 pt-[var(--space-5)] pb-[var(--space-5)] sm:px-10 sm:pt-[var(--space-6)] sm:pb-[var(--space-6)] lg:pt-[var(--section-padding)] lg:pb-[var(--section-padding)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start gap-y-6 sm:gap-y-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange-strong">
            {section.title}
          </h2>
          <div className="flex flex-nowrap items-center gap-x-6 sm:gap-x-8 lg:gap-x-10 overflow-x-auto pb-2">
            {partnerLogos.map((l) => (
              <div key={l.src}>
                <Reveal delay={l.delay} className="card-logo-mono partner-logo">
                  <Image
                    src={l.src}
                    alt={l.alt}
                    width={l.width}
                    height={l.height}
                    unoptimized
                    sizes="260px"
                    className="block h-14 w-auto object-contain sm:h-16"
                  />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}