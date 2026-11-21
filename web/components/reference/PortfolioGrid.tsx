"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CLIENTS_INTRO, PORTFOLIO, type PortfolioItem } from "@/lib/reference-content";
import styles from "./PortfolioGrid.module.css";

type Filter = "All" | (typeof CLIENTS_INTRO.filters)[number];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Our Works cards as a scroll-driven 3D carousel.
 *
 * Every existing project, image, category, name and link is preserved. The
 * section scrolls through the deck; each card is positioned continuously
 * from its distance to the current scroll index, producing the depth,
 * tilt and perspective motion. No scroll is captured or prevented.
 */
export default function PortfolioGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const items: PortfolioItem[] =
    filter === "All" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter);

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const last = Math.max(0, items.length - 1);
    let frame = 0;
    let target = 0;
    let current = 0;

    const readScroll = () => {
      const rect = track.getBoundingClientRect();
      const range = Math.max(1, track.offsetHeight - window.innerHeight);
      target = clamp(-rect.top / range, 0, 1) * last;
    };

    const paint = () => {
      const spread = mobile ? 58 : 40;
      const depth = mobile ? 120 : 170;
      const tilt = mobile ? 16 : 24;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const delta = i - current;
        const dist = Math.abs(delta);

        if (dist > 2.6) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.style.transform = `translate3d(-50%, -50%, -${depth * 3}px)`;
          return;
        }

        const x = delta * spread;
        const z = -Math.min(dist, 2.4) * depth;
        const rotateY = -delta * tilt;
        const rotateZ = delta * 3;
        const scale = Math.max(0.7, 1 - Math.min(dist, 2) * 0.13);

        el.style.transform =
          `translate3d(calc(-50% + ${x}%), -50%, ${z}px) ` +
          `rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
        el.style.opacity = String(Math.max(0.35, 1 - Math.min(dist, 2.2) * 0.3));
        el.style.zIndex = String(100 - Math.round(dist * 10));
        el.style.pointerEvents = dist < 0.7 ? "auto" : "none";
      });
    };

    const tick = () => {
      current += (target - current) * (reduce ? 1 : 0.14);
      if (Math.abs(target - current) < 0.001) current = target;
      paint();
      frame = window.requestAnimationFrame(tick);
    };

    const schedule = () => {
      readScroll();
      if (reduce) {
        current = target;
        paint();
      }
    };

    readScroll();
    current = target;
    paint();
    if (!reduce) frame = window.requestAnimationFrame(tick);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items.length, filter]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {(["All", ...CLIENTS_INTRO.filters] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors sm:text-sm ${
              filter === f
                ? "bg-brand-orange text-ink shadow-md"
                : "border border-brand-blue/15 bg-white text-grey-700 hover:border-brand-blue/40 hover:text-brand-blue-deep"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        style={{ height: `${items.length * 17 + 40}vh` }}
      >
        <div className={styles.stage}>
          <span className={styles.glow} aria-hidden="true" />
          <div className={styles.scene}>
            {items.map((item, i) => {
              const inner = (
                <>
                  <div className={styles.cardInner}>
                    <Image
                      src={item.image}
                      alt={`${item.name} — ${item.category}`}
                      fill
                      sizes="(min-width: 768px) 380px, 72vw"
                      className="object-cover"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardCategory}>{item.category}</p>
                    <h3 className={styles.cardName}>{item.name}</h3>
                  </div>
                </>
              );
              return (
                <article
                  key={`${item.name}-${i}`}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className={styles.card}
                >
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${item.name}`}>
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </article>
              );
            })}
          </div>
          <span className={styles.hint}>Scroll to explore our works</span>
        </div>
      </div>
    </div>
  );
}
