"use client";

import { useCallback, useId, useRef, useState } from "react";

export type AccordionItem = {
  question: string;
  answer: string;
};

/**
 * Shared single-open accordion.
 *
 * Extracted so more than one page can use the same accessible
 * behaviour without a second implementation.
 *
 * Accessibility:
 *  - native <button> per header, so keyboard activation is free
 *  - aria-expanded + aria-controls on the header
 *  - panel is role="region" labelled by its own header
 *  - ArrowUp / ArrowDown / Home / End move focus between headers
 *  - nothing is expanded by default
 *  - answers stay in the DOM, so they are readable without JS
 */
export default function Accordion({
  items,
  className = "",
}: {
  items: AccordionItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();
  const headerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = useCallback((e: React.KeyboardEvent, i: number) => {
    const last = items.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowDown") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp") next = i === 0 ? last : i - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    headerRefs.current[next]?.focus();
  }, [items.length]);

  return (
    <div
      className={`divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white ${className}`}
    >
      {items.map((f, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={f.question}>
            <h3>
              <button
                id={btnId}
                ref={(el) => {
                  headerRefs.current[i] = el;
                }}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-colors duration-200 hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-blue sm:px-6"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-brand-orange-strong"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base font-semibold leading-7 tracking-tight text-ink sm:text-[17px]">
                    {f.question}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 border-brand-orange bg-brand-orange text-ink"
                      : "border-line bg-white text-brand-blue"
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M6 1.5v9M1.5 6h9"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 pl-[3.1rem] text-sm leading-7 text-muted sm:px-6 sm:pl-[3.6rem]">
                  {f.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}