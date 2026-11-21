"use client";

import { useEffect } from "react";

/**
 * Lightweight scroll enhancement layer.
 *
 * Adds gentle parallax to decorative ambient glows only — elements that are
 * already pointer-events-none and purely visual. No content, layout,
 * dimensions or existing transforms are changed: the drift animations keep
 * owning `transform`, while this owns the independent CSS `translate`
 * property, so the two compose cleanly.
 *
 * Disabled on small screens and for reduced-motion visitors.
 */
export default function ScrollMotion() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 767px)");
    if (reduce.matches || compact.matches) return;

    let frame = 0;
    let glows: HTMLElement[] = [];

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (const el of glows) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -240 || rect.top > viewport + 240) continue;
        const offset = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        el.style.setProperty("--scroll-shift", `${(offset * 26).toFixed(1)}px`);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const collect = () => {
      glows = Array.from(document.querySelectorAll<HTMLElement>(".ambient-glow"));
      update();
    };

    collect();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", collect);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", collect);
      glows.forEach((el) => el.style.removeProperty("--scroll-shift"));
    };
  }, []);

  return null;
}
