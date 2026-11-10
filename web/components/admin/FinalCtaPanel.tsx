"use client";

import { useEffect, useState } from "react";
import {
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
} from "@/components/admin/api";
import type { HomeCtaContent } from "@/lib/defaults";

type Props = {
  initial: HomeCtaContent;
  canSave: boolean;
};

export default function FinalCtaPanel({ initial, canSave }: Props) {
  const [form, setForm] = useState<HomeCtaContent>(initial);
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

  const setField = (key: keyof HomeCtaContent, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await apiSend<{ ok?: boolean }>(
      "/api/admin/homepage",
      "PUT",
      {
        ctaEyebrow: form.ctaEyebrow,
        ctaTitle: form.ctaTitle,
        ctaDescription: form.ctaDescription,
        ctaLabel: form.ctaLabel,
        ctaHref: form.ctaHref,
      },
    );
    setSaving(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setDirty(false);
    setFeedback({ kind: "ok", text: "Final CTA saved and published." });
  };

  return (
    <section aria-labelledby="cta-title" className={panelClass}>
      <div className="flex items-center justify-between gap-4">
        <h2 id="cta-title" className="text-lg font-bold text-white">
          Final CTA
        </h2>
        {dirty ? (
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
            Unsaved
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/70">
        The closing call-to-action band at the bottom of the homepage.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="cta-eyebrow" className={labelClass}>
            Eyebrow text
          </label>
          <input
            id="cta-eyebrow"
            value={form.ctaEyebrow}
            onChange={(e) => setField("ctaEyebrow", e.target.value)}
            className={inputClass}
            maxLength={140}
            autoComplete="off"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="cta-title" className={labelClass}>
            Heading
          </label>
          <input
            id="cta-title"
            required
            value={form.ctaTitle}
            onChange={(e) => setField("ctaTitle", e.target.value)}
            className={inputClass}
            maxLength={180}
            placeholder="Let's Build What's Next."
            autoComplete="off"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="cta-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="cta-description"
            value={form.ctaDescription}
            onChange={(e) => setField("ctaDescription", e.target.value)}
            className={`${inputClass} min-h-24`}
            maxLength={600}
          />
        </div>
        <div>
          <label htmlFor="cta-label" className={labelClass}>
            Button label
          </label>
          <input
            id="cta-label"
            value={form.ctaLabel}
            onChange={(e) => setField("ctaLabel", e.target.value)}
            className={inputClass}
            maxLength={80}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="cta-href" className={labelClass}>
            Button URL
          </label>
          <input
            id="cta-href"
            value={form.ctaHref}
            onChange={(e) => setField("ctaHref", e.target.value)}
            className={inputClass}
            placeholder="/contact"
            inputMode="url"
            autoComplete="off"
          />
        </div>
      </div>

      {feedback ? (
        <p
          role={feedback.kind === "err" ? "alert" : "status"}
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
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
          {saving ? "Saving…" : "Save Final CTA"}
        </button>
      </div>
    </section>
  );
}
