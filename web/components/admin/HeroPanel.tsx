"use client";

import { useEffect, useState } from "react";
import {
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
} from "@/components/admin/api";
import type { HomeHeroContent } from "@/lib/defaults";

type Props = {
  initial: HomeHeroContent;
  canSave: boolean;
};

export default function HeroPanel({ initial, canSave }: Props) {
  const [form, setForm] = useState<HomeHeroContent>(initial);
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

  const setField = (key: keyof HomeHeroContent, value: string) => {
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
        heroEyebrow: form.heroEyebrow,
        heroTitle: form.heroTitle,
        heroDescription: form.heroDescription,
        heroPrimaryLabel: form.heroPrimaryLabel,
        heroPrimaryHref: form.heroPrimaryHref,
        heroSecondaryLabel: form.heroSecondaryLabel,
        heroSecondaryHref: form.heroSecondaryHref,
        heroImage: form.heroImage,
      },
    );
    setSaving(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setDirty(false);
    setFeedback({ kind: "ok", text: "Hero content saved and published." });
  };

  return (
    <section aria-labelledby="hero-title" className={panelClass}>
      <div className="flex items-center justify-between gap-4">
        <h2 id="hero-title" className="text-lg font-bold text-white">
          Hero
        </h2>
        {dirty ? (
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
            Unsaved
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/70">
        These fields feed the hero at the top of the public homepage. Changes
        publish immediately after saving.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="hero-eyebrow" className={labelClass}>
            Eyebrow text
          </label>
          <input
            id="hero-eyebrow"
            value={form.heroEyebrow}
            onChange={(e) => setField("heroEyebrow", e.target.value)}
            className={inputClass}
            maxLength={140}
            placeholder="Technology • Growth • Automation • AI"
            autoComplete="off"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="hero-title" className={labelClass}>
            Main heading
          </label>
          <input
            id="hero-title"
            required
            value={form.heroTitle}
            onChange={(e) => setField("heroTitle", e.target.value)}
            className={inputClass}
            maxLength={180}
            placeholder="Build. Transform. Automate. Grow."
            autoComplete="off"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="hero-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="hero-description"
            required
            value={form.heroDescription}
            onChange={(e) => setField("heroDescription", e.target.value)}
            className={`${inputClass} min-h-24`}
            maxLength={600}
            placeholder="Technology and digital solutions that help businesses build, transform, automate and grow."
          />
        </div>

        <div>
          <label htmlFor="hero-primary-label" className={labelClass}>
            Primary CTA label
          </label>
          <input
            id="hero-primary-label"
            value={form.heroPrimaryLabel}
            onChange={(e) => setField("heroPrimaryLabel", e.target.value)}
            className={inputClass}
            maxLength={80}
            placeholder="Let's Talk"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="hero-primary-href" className={labelClass}>
            Primary CTA URL
          </label>
          <input
            id="hero-primary-href"
            value={form.heroPrimaryHref}
            onChange={(e) => setField("heroPrimaryHref", e.target.value)}
            className={inputClass}
            placeholder="/contact"
            inputMode="url"
            autoComplete="off"
          />
          <p className="mt-1 text-[11px] text-white/50">
            Site path or http(s) URL.
          </p>
        </div>

        <div>
          <label htmlFor="hero-secondary-label" className={labelClass}>
            Secondary CTA label
          </label>
          <input
            id="hero-secondary-label"
            value={form.heroSecondaryLabel}
            onChange={(e) => setField("heroSecondaryLabel", e.target.value)}
            className={inputClass}
            maxLength={80}
            placeholder="Explore Our Services"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="hero-secondary-href" className={labelClass}>
            Secondary CTA URL
          </label>
          <input
            id="hero-secondary-href"
            value={form.heroSecondaryHref}
            onChange={(e) => setField("heroSecondaryHref", e.target.value)}
            className={inputClass}
            placeholder="/services"
            inputMode="url"
            autoComplete="off"
          />
          <p className="mt-1 text-[11px] text-white/50">
            Site path or http(s) URL.
          </p>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="hero-image" className={labelClass}>
            Hero image (optional)
          </label>
          <input
            id="hero-image"
            value={form.heroImage}
            onChange={(e) => setField("heroImage", e.target.value)}
            className={inputClass}
            placeholder="/uploads/hero.jpg or https://…"
            inputMode="url"
            autoComplete="off"
          />
          <p className="mt-1 text-[11px] text-white/50">
            Leave empty to keep the built-in hero graphic. Only local paths
            (e.g. <code>/uploads/…</code>) or HTTPS URLs are accepted.
          </p>
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
          {saving ? "Saving…" : "Save hero"}
        </button>
      </div>
    </section>
  );
}
