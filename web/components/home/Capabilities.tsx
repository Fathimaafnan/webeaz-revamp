"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import CardIcon from "@/components/ui/CardIcon";
import Reveal from "@/components/ui/Reveal";
import type { HomeSection } from "@/lib/defaults";
import { DEFAULT_CAPABILITIES, type CapabilityData } from "@/lib/fallback-content";

const icons = {
  "digital-transformation": "technology",
  "business-automation": "automation",
  "ai-solutions": "ai",
  "digital-growth": "digital-growth",
  "product-development": "work",
  "cloud-solutions": "technology",
  "web-hosting": "industry",
  "email-hosting": "automation",
  "microsoft-365": "work",
  "google-workspace": "outcome",
} as const;

/**
 * "What we do" — the five capabilities on a scroll-linked horizontal
 * rail.
 *
 * The rail runs the full width of the page rather than sitting inside
 * the narrow centred column the other content uses: the first card
 * starts at the page's left content boundary, the fifth one finishes
 * at its right content boundary, and the space between them is what
 * the visitor scrolls through.
 *
 * On a wide screen the section is pinned for the length of its own
 * scroll range: the surface stays in the viewport while the cards
 * travel from right to left, and the travel is driven directly by the
 * visitor's vertical scroll position. Nothing moves on a timer, there
 * is no automatic drift and no second copy of the set — the rail is
 * one row of five cards that is translated by a transform.
 *
 * The distance the rail travels is measured from the live layout (the
 * right edge of the last card against the right edge of the rail)
 * instead of being hardcoded, so every card — the fifth one included —
 * comes fully into view at every breakpoint and the rail never stops
 * short of its end.
 *
 * Below the wide breakpoint nothing is pinned: the section is an
 * ordinary band again and the same rail is a plain horizontal
 * scroller, so the vertical page scroll is never captured and all
 * five cards stay reachable.
 *
 * The cards themselves keep their content — same number, title, tags,
 * description, icon, arrow and link as before — and they keep the
 * widths the carousel gave them: one on a phone, two from 640px and
 * three, and noticeably larger, from 1024px.
 */
export default function Capabilities({
  section,
  cards = DEFAULT_CAPABILITIES,
}: {
  section: HomeSection;
  cards?: CapabilityData[];
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = sectionRef.current;
    const track = trackRef.current;
    const rail = railRef.current;
    const content = contentRef.current;
    const sticky = stickyRef.current;
    if (!root || !track || !rail || !content || !sticky) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** The site bar floats over the page, so the pinned surface is
     *  held below it rather than under it. Measured from the bar
     *  itself, because it changes height as the page is scrolled. */
    let chrome = 0;

    /** Horizontal distance the rail has to travel for the last card to
     *  sit flush with the right edge of the rail. Measured from the
     *  live layout, so it is right at every breakpoint and whenever
     *  the card content changes. */
    let travel = 0;

    /**
     * Hold the pinned surface below the floating site bar so the
     * heading is never covered by it. On a narrow screen nothing is
     * pinned, so the measurement is dropped again.
     */
    const align = () => {
      if (!wide.matches) {
        sticky.style.top = "";
        sticky.style.height = "";
        chrome = 0;
        return;
      }
      const bar = document.querySelector("header");
      const bottom = bar ? Math.round(bar.getBoundingClientRect().bottom) : 0;
      chrome = Math.max(0, bottom);
      sticky.style.top = `${chrome}px`;
      sticky.style.height = `calc(100vh - ${chrome}px)`;
    };

    /**
     * A pinned section is one viewport tall, so on a short screen the
     * heading and the cards together can be taller than the space
     * they are pinned in. When that happens the cards are reduced —
     * by as little as it takes — until the section fits, rather than
     * being cut off. On a screen with room for the cards this is a
     * no-op and they are drawn at their full size.
     */
    const fit = () => {
      if (!wide.matches) {
        track.style.setProperty("--rail-zoom", "1");
        return;
      }
      // Everything is measured with the cards at their natural size.
      track.style.setProperty("--rail-zoom", "1");
      const room = window.innerHeight - chrome - 8;
      const heading = content.firstElementChild;
      const headingH = heading instanceof HTMLElement ? heading.offsetHeight : 0;
      const gapH = parseFloat(getComputedStyle(rail).marginTop) || 0;
      const padH = Math.max(0, rail.offsetHeight - track.offsetHeight);
      const cardH = track.offsetHeight;
      const need = room - headingH - gapH - padH;
      const zoom = need < cardH && cardH > 0 ? Math.max(0.62, need / cardH) : 1;
      track.style.setProperty("--rail-zoom", String(zoom));
    };

    const measure = () => {
      const last = track.lastElementChild;
      if (!(last instanceof HTMLElement)) {
        travel = 0;
        return;
      }
      const railBox = track.getBoundingClientRect();
      const lastBox = last.getBoundingClientRect();
      travel = Math.max(0, lastBox.right - railBox.right);
    };

    /** One paint of the rail, driven by where the page is scrolled. */
    const paint = () => {
      if (!wide.matches || calm.matches) {
        track.style.transform = "";
        return;
      }

      const viewport = window.innerHeight;
      const top = root.getBoundingClientRect().top + window.scrollY;
      // The section is pinned from the moment its top reaches the top
      // of the viewport until its bottom reaches the bottom of it.
      const bottom = top + root.offsetHeight - viewport;
      const span = bottom - top;
      const y = window.scrollY;

      let progress = 0;
      if (span > 0 && y > top) {
        progress = y >= bottom ? 1 : (y - top) / span;
      }

      track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        paint();
      });
    };

    const refresh = () => {
      align();
      fit();
      measure();
      schedule();
    };

    align();
    fit();
    measure();
    paint();

    // The rail's own size changes with the viewport, so the travel is
    // re-measured whenever the layout does.
    const observer = new ResizeObserver(refresh);
    observer.observe(track);

    // The floating site bar changes height as the page is scrolled, so
    // the pinned surface is re-aligned whenever it does.
    const bar = document.querySelector("header");
    const barObserver =
      bar && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(refresh)
        : null;
    if (bar && barObserver) barObserver.observe(bar);

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", refresh);
    wide.addEventListener("change", refresh);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
      if (barObserver) barObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", refresh);
      wide.removeEventListener("change", refresh);
    };
  }, []);

  return (
    // Ten cards now run along the rail, so the scroll range is longer
    // than it was for five. It is scaled to keep the sweep at roughly
    // the same pace per pixel of scrolling rather than making the
    // cards whip past.
    <section ref={sectionRef} className="relative lg:h-[600vh]">
      {/* The pin. On a wide screen this holds the surface in the
          viewport while the rail travels; below that it is an
          ordinary block and the section is a band again. */}
      <div ref={stickyRef} className="lg:sticky lg:top-0 lg:h-screen">
        <div className="sec-white theme-light relative overflow-hidden px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:flex lg:h-full lg:flex-col lg:justify-center lg:py-0">
          {/* Orange-dominant with soft blue glow */}
          <div
            aria-hidden="true"
            className="ambient-glow ambient-glow-orange animate-glow-drift absolute -right-[12%] top-[10%] h-[28rem] w-[28rem]"
          />
          <div
            aria-hidden="true"
            className="ambient-glow ambient-glow-blue animate-glow-drift-slow absolute -left-[10%] bottom-[8%] h-[24rem] w-[24rem]"
          />

          <div ref={contentRef} className="w-full">
            {/* The heading keeps the centred column it has always had. */}
            <div className="relative mx-auto w-full max-w-6xl">
              <Reveal>
                <SectionHeading
                  eyebrow={section.eyebrow}
                  title={section.title}
                  description={section.description}
                  align="center"
                />
              </Reveal>
            </div>

            {/* The rail runs the full width of the page, so the first
                card starts at the left content boundary and the last
                one finishes at the right one. It is a plain
                horizontal scroller on a narrow screen and a clipped,
                transformed row on a wide one. */}
            <div
              ref={railRef}
              className="mt-8 min-w-0 overflow-x-auto overscroll-x-contain py-2 pb-6 lg:mt-6 lg:overflow-hidden"
            >
              <div
                ref={trackRef}
                className="flex flex-nowrap items-stretch will-change-transform"
                style={{ gap: 24 }}
              >
                {cards.map((c) => (
                  <div
                    key={c.title}
                    style={{ zoom: "var(--rail-zoom, 1)" }}
                    className="relative w-full shrink-0 sm:w-[calc(50%-12px)] md:w-[calc(33.33%-8px)] lg:w-[540px]"
                  >
                    <Link
                      href={c.href}
                      aria-label={`Visit ${c.title} service page`}
                      className={`
                        card-orb group flex h-full flex-col p-8 sm:p-10 lg:p-11
                        rounded-xl border border-transparent
                        transition-all duration-300 ease-out
                        hover:-translate-y-2
                        hover:shadow-lg hover:shadow-brand-blue/25
                        hover:border-brand-blue/30
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-brand-blue
                      `}
                    >
                      {/* The reference's service items lead with a round icon
                          disc that swells on hover, rather than a media
                          header. The disc is what moves — the card's own text
                          stays put under the cursor. */}
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className="card-orb-disc"
                          style={{ width: "5.5rem", height: "5.5rem" }}
                        >
                          <CardIcon
                            name={icons[c.slug as keyof typeof icons]}
                            className="card-orb-glyph h-11 w-11 text-brand-blue group-hover:text-brand-orange-strong"
                          />
                        </span>
                        <span className="font-mono text-xs tracking-widest text-muted">
                          {c.num}
                        </span>
                      </div>

                      <h3 className="mt-8 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                        {c.title}
                      </h3>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {c.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-blue-deep"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="mt-7 flex-1 text-base leading-7 text-muted">
                        {c.description}
                      </p>

                      {/* Arrow indicator — visual navigation cue inside the card link */}
                      <span
                        aria-hidden="true"
                        className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-brand-orange-strong transition-colors duration-300 group-hover:text-brand-orange-strong"
                      >
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                        {c.title}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
