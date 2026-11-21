"use client";

import { useEffect, useState } from "react";

/**
 * Floating scroll-to-top button.
 *
 * The visual reference is the circular blue button on eqsoftonline.com:
 * a 50px blue disc with a white chevron, a soft shadow and a small spring
 * on hover. It sits in the bottom-right corner of the page.
 *
 * It shares that corner with the existing WhatsApp button, so it is
 * stacked directly above it — that button is left completely untouched.
 *
 * The button only appears once the page has been scrolled away from the
 * Hero, and a click returns to the top of the page, which is the Hero
 * section. Reduced-motion visitors get an instant jump instead of a
 * smooth scroll.
 */

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Run once on mount so a reload part-way down the page is correct.
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll to top"
      className={[
        "fixed right-6 bottom-8 z-[100] flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full",
        "bg-[#1076bc]/90 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-white/10",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)]",
        "hover:-translate-y-1 hover:scale-110 hover:bg-[#1076bc] hover:shadow-[0_15px_30px_rgba(16,118,188,0.4)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue",
        "sm:h-[50px] sm:w-[50px]",
        visible ? "visible opacity-100" : "invisible opacity-0",
      ].join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 transition-transform duration-300 ease-out hover:-translate-y-0.5"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
      <span className="sr-only">Scroll to top</span>
    </button>
  );
}
