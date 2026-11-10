"use client";

import { useEffect, useState } from "react";
import {
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";
import type { HomeSection } from "@/lib/defaults";

type Props = {
  initial: HomeSection[];
  canSave: boolean;
};

export default function SectionsPanel({ initial, canSave }: Props) {
  const [rows, setRows] = useState<HomeSection[]>(initial);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<
    { kind: "ok" | "err"; text: string } | null
  >(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const updateRow = (
    index: number,
    patch: Partial<HomeSection>,
  ) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
    setDirty(true);
  };

  const move = (index: number, direction: -1 | 1) => {
    setRows((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      const current = next[index];
      const other = next[target];
      next[index] = { ...other, order: current.order };
      next[target] = { ...current, order: other.order };
      // keep rows sorted by their (swapped) order values
      return next.sort((a, b) => a.order - b.order);
    });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await apiSend<{ ok?: boolean }>(
      "/api/admin/homepage/sections",
      "PUT",
      { sections: rows },
    );
    setSaving(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setDirty(false);
    setFeedback({ kind: "ok", text: "Section content saved and published." });
  };

  return (
    <section aria-labelledby="sections-title" className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="sections-title" className="text-lg font-bold text-white">
            Homepage Sections
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
            Edit headings, visibility and display order for the existing
            homepage sections. Hidden sections are removed from the public
            homepage.
          </p>
        </div>
        {dirty ? (
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
            Unsaved
          </span>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {rows.map((row, index) => (
          <fieldset
            key={row.key}
            className="rounded-2xl border border-white/10 bg-brand-blue-deep/30 p-5"
          >
            <legend className="rounded-md bg-brand-orange/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange-light">
              {row.key}
            </legend>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
              <div>
                <label htmlFor={`eyebrow-${row.key}`} className={labelClass}>
                  Eyebrow
                </label>
                <input
                  id={`eyebrow-${row.key}`}
                  value={row.eyebrow}
                  onChange={(e) => updateRow(index, { eyebrow: e.target.value })}
                  className={inputClass}
                  maxLength={140}
                  autoComplete="off"
                />
                <label htmlFor={`title-${row.key}`} className={`${labelClass} mt-4`}>
                  Heading
                </label>
                <input
                  id={`title-${row.key}`}
                  required
                  value={row.title}
                  onChange={(e) => updateRow(index, { title: e.target.value })}
                  className={inputClass}
                  maxLength={200}
                  autoComplete="off"
                />
                <label
                  htmlFor={`description-${row.key}`}
                  className={`${labelClass} mt-4`}
                >
                  Description
                </label>
                <textarea
                  id={`description-${row.key}`}
                  value={row.description}
                  onChange={(e) =>
                    updateRow(index, { description: e.target.value })
                  }
                  className={`${inputClass} min-h-20`}
                  maxLength={600}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor={`order-${row.key}`} className={labelClass}>
                    Display order
                  </label>
                  <input
                    id={`order-${row.key}`}
                    type="number"
                    min={0}
                    value={row.order}
                    onChange={(e) =>
                      updateRow(index, {
                        order: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className={`${inputClass} w-28`}
                  />
                </div>
                <label
                  htmlFor={`visible-${row.key}`}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                >
                  <input
                    id={`visible-${row.key}`}
                    type="checkbox"
                    checked={row.visible}
                    onChange={(e) => updateRow(index, { visible: e.target.checked })}
                    className="h-5 w-5 rounded border-white/20 bg-black/30 accent-brand-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                  />
                  <span className="text-sm font-semibold text-white">
                    Show on homepage
                  </span>
                </label>
              </div>

              <div className="flex flex-row gap-2 md:flex-col md:items-center md:justify-center">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  aria-label={`Move ${row.key} earlier`}
                  className={secondaryButton}
                >
                  ↑ Move up
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  aria-label={`Move ${row.key} later`}
                  className={secondaryButton}
                >
                  ↓ Move down
                </button>
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      {feedback ? (
        <p
          role={feedback.kind === "err" ? "alert" : "status"}
          className={`mt-6 rounded-lg px-4 py-3 text-sm ${
            feedback.kind === "err"
              ? "border border-red-400/30 bg-red-500/10 text-red-200"
              : "border border-green-400/30 bg-green-500/10 text-green-200"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!canSave || saving || !dirty}
          className={primaryButton}
        >
          {saving ? "Saving…" : "Save sections"}
        </button>
      </div>
    </section>
  );
}
