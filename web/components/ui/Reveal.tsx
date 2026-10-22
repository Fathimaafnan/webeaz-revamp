"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-triggered entrance.
 *
 * One observer per instance, `threshold: 0.15`, and the class is
 * added once and the observer disconnected immediately after — so a
 * visitor scrolling back up never sees the animation replay and
 * nothing flickers. There is no scroll listener and no per-frame
 * work: the movement is a CSS transition on `opacity` and `transform`
 * only, so it stays on the compositor and costs nothing to scroll
 * past.
 *
 * `from` selects the direction the element travels IN FROM:
 *
 *   "up"     rises 18px      the default, and what every caller
 *                            used before this prop existed
 *   "left"   slides in from the left
 *   "right"  slides in from the right
 *   "scale"  settles back from 94%
 *
 * Only the starting offset changes between them — duration and
 * easing are shared — so a page using all four still reads as one
 * motion system rather than four.
 */
export default function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        from === "up" ? `reveal ${className}` : `reveal reveal-from-${from} ${className}`
      }
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}