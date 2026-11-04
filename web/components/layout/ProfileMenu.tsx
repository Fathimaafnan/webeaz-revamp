"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent } from "react";

const items = [
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

type Props = {
  mobile?: boolean;
};

export default function ProfileMenu({ mobile = false }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeWhenFocusLeaves = (
    event: FocusEvent<HTMLDivElement>,
  ) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`relative ${mobile ? "w-full" : ""}`}
      onMouseEnter={() => {
        if (!mobile) setOpen(true);
      }}
      onMouseLeave={(event) => {
        if (!mobile && !event.currentTarget.querySelector(":focus-visible")) {
          setOpen(false);
        }
      }}
      onBlur={closeWhenFocusLeaves}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(event) => {
          if (!mobile && event.detail > 0) {
            setOpen(true);
          } else {
            setOpen(!open);
          }
        }}
        className={`inline-flex min-h-11 items-center gap-2 rounded-lg text-[13px] font-semibold tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-deep xl:text-sm ${
          mobile
            ? `w-full justify-between px-3 text-[15px] ${
                open
                  ? "text-brand-blue-deep"
                  : "text-grey-700 hover:bg-brand-blue-soft hover:text-brand-blue-deep"
              }`
            : `justify-center px-2 text-grey-600 hover:text-brand-blue-deep xl:px-2.5 ${
                open ? "text-brand-blue-deep" : ""
              }`
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <svg
            width="17"
            height="17"
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
          Account
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>

      <div
        aria-label="Account links"
        aria-hidden={!open}
        inert={!open}
        className={`navbar-panel ${
          mobile
            ? `grid overflow-hidden rounded-lg transition-[grid-template-rows,opacity] duration-200 ${
                open
                  ? "mt-1 grid-rows-[1fr] opacity-100"
                  : "pointer-events-none grid-rows-[0fr] opacity-0"
              }`
            : `absolute right-0 top-full z-50 w-48 origin-top-right overflow-hidden rounded-xl border border-line shadow-xl shadow-[#09283f]/15 transition-[visibility,transform,opacity] duration-200 ${
                open
                  ? "visible scale-100 opacity-100"
                  : "invisible pointer-events-none scale-95 opacity-0"
              }`
        }`}
      >
        <ul
          className={`min-h-0 ${
            mobile
              ? "overflow-hidden rounded-lg border-l-2 border-brand-orange/70"
              : "border-t border-brand-blue/10 p-1"
          }`}
        >
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex min-h-11 items-center rounded-md px-4 text-sm font-medium text-grey-700 transition-colors hover:bg-brand-blue-soft hover:text-brand-blue-deep focus-visible:bg-brand-blue-soft focus-visible:text-brand-blue-deep focus-visible:outline-none ${
                  mobile ? "pl-5" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
