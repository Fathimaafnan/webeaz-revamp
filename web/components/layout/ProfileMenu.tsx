"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const items = [
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

/**
 * Compact profile control — a single minimal user glyph on
 * the right of the navbar that opens a small dropdown with
 * Login and Sign Up. Closes on outside click, Escape, and
 * route change; keyboard accessible via a real button.
 */
export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  // Close the dropdown whenever the route changes. Deriving it
  // during render avoids a setState-in-effect while still
  // guaranteeing the menu never survives navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep ${
          open
            ? "border-brand-orange bg-brand-orange-soft text-brand-blue-deep"
            : // The bar behind this control is a light cool glass, so
              // the resting state uses the light-theme border and fill
              // — a white hairline and a soft wash. Orange is reserved
              // for the open state so the control reads as brand-
              // coloured only when it is actually doing something.
              "border-line bg-white text-grey-600 hover:border-brand-orange/70 hover:text-brand-blue-deep"
        }`}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
        </svg>
      </button>

      <div
        role="menu"
        aria-label="Account"
        className={`absolute right-0 top-[calc(100%+0.6rem)] z-50 w-48 origin-top-right overflow-hidden rounded-xl border border-line navbar-panel shadow-xl shadow-[#09283f]/15 transition-all duration-200 ease-out ${
          open
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0"
        }`}
      >
        <span
          aria-hidden="true"
          className="block h-px w-full bg-gradient-to-r from-brand-orange/70 via-brand-blue-light/50 to-transparent"
        />
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-medium text-grey-600 transition-colors duration-200 hover:bg-brand-blue-soft hover:text-brand-blue-deep focus-visible:bg-brand-blue-soft focus-visible:text-brand-blue-deep focus-visible:outline-none"
          >
            {i.label}
          </Link>
        ))}
      </div>
    </div>
  );
}