import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * Partner and recognition information published on
 * www.webeaz.com — labels and official logos reproduced verbatim.
 *
 * Deliberately minimal: one slim unified strip, no cards and no
 * per-partner columns, so it reads as a quiet footnote beneath
 * the Insights section rather than a section of its own.
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

/** `delay` staggers the five logos in reading order. */
const groups = [
  {
    heading: "Certified Partner",
    logos: [
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
    ],
  },
  {
    heading: "Associate Partner",
    logos: [
      {
        src: "/partners/leadsquare-partner.png",
        alt: "Leadsquared Associate Partner",
        width: 202,
        height: 58,
        delay: 510,
      },
    ],
  },
  {
    heading: "Recognization",
    logos: [
      {
        src: "/partners/startup-india-recognition.png",
        alt: "#startupindia Recognition",
        width: 202,
        height: 58,
        delay: 640,
      },
    ],
  },
];

export default function PartnersStrip() {
  return (
    <div className="sec-mist theme-light px-6 sm:px-10 pt-8 sm:pt-10 pb-0 sm:pb-0">
      <div className="mx-auto max-w-6xl">
        <ul className="flex flex-wrap items-start gap-x-10 gap-y-10 lg:gap-x-12">
          {groups.map((g) => (
            <li key={g.heading}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-orange-strong">
                {g.heading}
              </h2>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-5 sm:gap-x-8">
                {g.logos.map((l) => (
                  <li key={l.src}>
                    <Reveal
                      delay={l.delay}
                      className="card-logo-mono partner-logo"
                    >
                      <Image
                        src={l.src}
                        alt={l.alt}
                        width={l.width}
                        height={l.height}
                        sizes="260px"
                        className="block h-14 w-auto object-contain sm:h-16"
                      />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}