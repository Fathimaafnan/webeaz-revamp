"use client";

import { useState } from "react";
import {
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";
import type { HomeContent, HomeSection, HomeStat } from "@/lib/defaults";

type Feedback = { kind: "ok" | "err"; text: string } | null;

type Props = {
  initialHome: HomeContent;
  initialSections: HomeSection[];
  initialStats: { trust: HomeStat[]; why: HomeStat[] };
  initialIndustries: Array<{ id: number; name: string; order: number; status: string }>;
  initialMedia: Array<{ id: number; url: string; originalName: string; alt: string }>;
  canSave: boolean;
};

function FeedbackLine({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <p
      role="status"
      className={`mt-4 rounded-lg px-4 py-3 text-sm ${
        feedback.kind === "ok"
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-red-500/15 text-red-300"
      }`}
    >
      {feedback.text}
    </p>
  );
}

export default function HomepageEditor({
  initialHome,
  initialSections,
  initialStats,
  initialIndustries,
  initialMedia,
  canSave,
}: Props) {
  const [home, setHome] = useState<HomeContent>(initialHome);
  const [sections, setSections] = useState<HomeSection[]>(initialSections);
  const [trustStats, setTrustStats] = useState<HomeStat[]>(initialStats.trust);
  const [whyStats, setWhyStats] = useState<HomeStat[]>(initialStats.why);
  const [industries, setIndustries] = useState(initialIndustries);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const setHomeField = (key: keyof HomeContent, value: string) =>
    setHome((prev) => ({ ...prev, [key]: value }));

  const setSectionField = (
    key: string,
    field: keyof HomeSection,
    value: string | boolean | number,
  ) =>
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)),
    );

  const setStat = (
    group: "trust" | "why",
    index: number,
    field: keyof HomeStat,
    value: string | boolean | number,
  ) => {
    const setter = group === "trust" ? setTrustStats : setWhyStats;
    setter((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const addStat = (group: "trust" | "why") => {
    const setter = group === "trust" ? setTrustStats : setWhyStats;
    setter((prev) => [
      ...prev,
      {
        group,
        value: "",
        unit: "",
        label: "",
        order: (prev.at(-1)?.order ?? 0) + 10,
        visible: true,
      },
    ]);
  };

  const removeStat = (group: "trust" | "why", index: number) => {
    const setter = group === "trust" ? setTrustStats : setWhyStats;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const run = async (fn: () => Promise<void>, message: string) => {
    setSaving(true);
    setFeedback(null);
    try {
      await fn();
      setFeedback({ kind: "ok", text: message });
    } catch (error) {
      setFeedback({
        kind: "err",
        text: error instanceof Error ? error.message : "Saving failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveHome = () =>
    run(async () => {
      const result = await apiSend("/api/admin/homepage", "PUT", home);
      if (!result.ok) throw new Error(result.error);
    }, "Hero and call-to-action saved. The homepage has been revalidated.");

  const saveSections = () =>
    run(async () => {
      const result = await apiSend("/api/admin/homepage/sections", "PUT", {
        sections: sections.map((s, i) => ({ ...s, order: (i + 1) * 10 })),
      });
      if (!result.ok) throw new Error(result.error);
    }, "Section headings and visibility saved.");

  const saveStats = async (group: "trust" | "why") => {
    const list = group === "trust" ? trustStats : whyStats;
    await run(async () => {
      const result = await apiSend("/api/admin/homepage/stats", "PUT", {
        group,
        stats: list.map((s, i) => ({ ...s, order: (i + 1) * 10 })),
      });
      if (!result.ok) throw new Error(result.error);
    }, "Statistics saved.");
  };

  const addIndustry = async () => {
    const name = window.prompt("Industry name:");
    if (!name || !name.trim()) return;
    setSaving(true);
    setFeedback(null);
    try {
      const result = await apiSend<{ id?: number }>("/api/admin/industries", "POST", {
        name: name.trim(),
      });
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setIndustries((prev) => [
        ...prev,
        { id: result.data.id ?? Date.now(), name: name.trim(), order: 0, status: "PUBLISHED" },
      ]);
      setFeedback({ kind: "ok", text: `Industry “${name.trim()}” added.` });
    } finally {
      setSaving(false);
    }
  };

  const renameIndustryOnBlur = async (id: number, name: string) => {
    setFeedback(null);
    const result = await apiSend("/api/admin/industries/" + id, "PUT", { name });
    if (result.ok) {
      setIndustries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, name } : i)),
      );
      setFeedback({ kind: "ok", text: "Industry renamed." });
    } else {
      setFeedback({ kind: "err", text: result.error });
    }
  };

  const toggleIndustry = async (id: number, status: string) => {
    const next = status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    setSaving(true);
    setFeedback(null);
    try {
      const result = await apiSend("/api/admin/industries/" + id, "PUT", {
        status: next,
      });
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setIndustries((prev) => prev.map((i) => (i.id === id ? { ...i, status: next } : i)));
      setFeedback({
        kind: "ok",
        text: next === "PUBLISHED" ? "Industry published." : "Industry archived.",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteIndustry = async (id: number) => {
    const current = industries.find((i) => i.id === id);
    if (!current) return;
    if (
      !window.confirm(
        `Permanently delete the industry “${current.name}”? This cannot be undone.`,
      )
    ) {
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const result = await apiSend("/api/admin/industries/" + id, "DELETE");
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setIndustries((prev) => prev.filter((i) => i.id !== id));
      setFeedback({ kind: "ok", text: "Industry deleted." });
    } finally {
      setSaving(false);
    }
  };

  const heroFields: Array<{ key: keyof HomeContent; label: string; wide?: boolean }> = [
    { key: "heroEyebrow", label: "Eyebrow" },
    { key: "heroTitle", label: "Heading", wide: true },
    { key: "heroDescription", label: "Description", wide: true },
    { key: "heroPrimaryLabel", label: "Primary button" },
    { key: "heroPrimaryHref", label: "Primary link" },
    { key: "heroSecondaryLabel", label: "Secondary button" },
    { key: "heroSecondaryHref", label: "Secondary link" },
  ];

  const ctaFields: Array<{ key: keyof HomeContent; label: string; wide?: boolean }> = [
    { key: "ctaEyebrow", label: "Eyebrow" },
    { key: "ctaTitle", label: "Heading", wide: true },
    { key: "ctaDescription", label: "Description", wide: true },
    { key: "ctaLabel", label: "Button label", wide: true },
    { key: "ctaHref", label: "Button link" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Hero + final CTA */}
      <section className={panelClass}>
        <h2 className="text-lg font-semibold text-white">Hero &amp; final call to action</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {heroFields.map((field) => (
            <div key={field.key} className={field.wide ? "sm:col-span-2" : ""}>
              <label className={labelClass} htmlFor={`home-${field.key}`}>
                {field.label}
              </label>
              <input
                id={`home-${field.key}`}
                className={inputClass}
                value={home[field.key]}
                onChange={(e) => setHomeField(field.key, e.target.value)}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="home-heroImage">
              Hero background image
            </label>
            <select
              id="home-heroImage"
              className={inputClass}
              value={home.heroImage}
              onChange={(e) => setHomeField("heroImage", e.target.value)}
            >
              <option value="" className="bg-ink">
                Use the default hero background
              </option>
              {initialMedia.map((asset) => (
                <option key={asset.id} value={asset.url} className="bg-ink">
                  {asset.alt || asset.originalName}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-white/50">
              Selected images are shown under a dark overlay to keep hero text readable.
            </p>
          </div>
        </div>

        <h3 className="mt-8 text-base font-semibold text-white">Final CTA</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {ctaFields.map((field) => (
            <div key={field.key} className={field.wide ? "sm:col-span-2" : ""}>
              <label className={labelClass} htmlFor={`home-${field.key}`}>
                {field.label}
              </label>
              <input
                id={`home-${field.key}`}
                className={inputClass}
                value={home[field.key]}
                onChange={(e) => setHomeField(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button type="button" onClick={saveHome} disabled={saving || !canSave} className={primaryButton}>
            Save hero &amp; CTA
          </button>
        </div>
      </section>

      {/* Section headings + visibility */}
      <section className={panelClass}>
        <h2 className="text-lg font-semibold text-white">Section headings &amp; visibility</h2>
        <p className="mt-1 text-sm text-white/60">
          Untick a section to hide it from the homepage. The public page keeps its designed section order.
        </p>
        <ul className="mt-5 space-y-5">
          {sections.map((section, index) => (
            <li key={section.key} className="rounded-lg border border-white/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">
                  <span className="mr-2 text-white/40">{index + 1}</span>
                  {section.key}
                </p>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={(e) =>
                      setSectionField(section.key, "visible", e.target.checked)
                    }
                    className="h-4 w-4 accent-brand-orange"
                  />
                  Visible
                </label>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor={`sec-eyebrow-${section.key}`}>
                    Eyebrow
                  </label>
                  <input
                    id={`sec-eyebrow-${section.key}`}
                    className={inputClass}
                    value={section.eyebrow}
                    onChange={(e) => setSectionField(section.key, "eyebrow", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`sec-title-${section.key}`}>
                    Heading
                  </label>
                  <input
                    id={`sec-title-${section.key}`}
                    className={inputClass}
                    value={section.title}
                    onChange={(e) => setSectionField(section.key, "title", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor={`sec-desc-${section.key}`}>
                    Description
                  </label>
                  <textarea
                    id={`sec-desc-${section.key}`}
                    rows={2}
                    className={inputClass}
                    value={section.description}
                    onChange={(e) =>
                      setSectionField(section.key, "description", e.target.value)
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <button
            type="button"
            onClick={saveSections}
            disabled={saving || !canSave}
            className={primaryButton}
          >
            Save sections
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className={panelClass}>
        <h2 className="text-lg font-semibold text-white">Statistics</h2>
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          <StatGroup
            title="Trust strip"
            hint="Shown under the hero as “value + unit + label”."
            stats={trustStats}
            onChange={(i, f, v) => setStat("trust", i, f, v)}
            onAdd={() => addStat("trust")}
            onRemove={(i) => removeStat("trust", i)}
          />
          <StatGroup
            title="Why WebEaz points"
            hint="Shown as large number + caption."
            stats={whyStats}
            onChange={(i, f, v) => setStat("why", i, f, v)}
            onAdd={() => addStat("why")}
            onRemove={(i) => removeStat("why", i)}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => saveStats("trust")}
            disabled={saving || !canSave}
            className={primaryButton}
          >
            Save trust strip
          </button>
          <button
            type="button"
            onClick={() => saveStats("why")}
            disabled={saving || !canSave}
            className={secondaryButton}
          >
            Save Why WebEaz points
          </button>
        </div>
      </section>

      {/* Industries */}
      <section className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Industries</h2>
            <p className="mt-1 text-sm text-white/60">
              Published industries appear on the /industries page.
            </p>
          </div>
          <button
            type="button"
            onClick={addIndustry}
            disabled={saving || !canSave}
            className={primaryButton}
          >
            Add industry
          </button>
        </div>

        {industries.length === 0 ? (
          <p className="mt-4 text-sm text-white/60">No industries yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/10">
            {industries.map((industry) => (
              <li
                key={industry.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <input
                    aria-label={`Industry name ${industry.name}`}
                    className="w-56 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white"
                    defaultValue={industry.name}
                    onBlur={(e) => {
                      const value = e.target.value.trim();
                      if (value && value !== industry.name) {
                        void renameIndustryOnBlur(industry.id, value);
                      }
                    }}
                  />
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      industry.status === "PUBLISHED"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {industry.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleIndustry(industry.id, industry.status)}
                    disabled={saving}
                    className={secondaryButton}
                  >
                    {industry.status === "PUBLISHED" ? "Archive" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteIndustry(industry.id)}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-lg border border-red-400/40 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <FeedbackLine feedback={feedback} />
    </div>
  );
}

function StatGroup({
  title,
  hint,
  stats,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  hint: string;
  stats: HomeStat[];
  onChange: (index: number, field: keyof HomeStat, value: string | boolean | number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/50">{hint}</p>
        </div>
        <button type="button" onClick={onAdd} className={secondaryButton}>
          Add
        </button>
      </div>

      {stats.length === 0 ? (
        <p className="mt-3 text-sm text-white/50">No statistics in this group.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {stats.map((stat, index) => (
            <li key={index} className="rounded-lg border border-white/10 p-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelClass} htmlFor={`stat-value-${index}-${title}`}>
                    Value
                  </label>
                  <input
                    id={`stat-value-${index}-${title}`}
                    className={inputClass}
                    value={stat.value}
                    onChange={(e) => onChange(index, "value", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor={`stat-unit-${index}-${title}`}>
                    Unit
                  </label>
                  <input
                    id={`stat-unit-${index}-${title}`}
                    className={inputClass}
                    value={stat.unit}
                    placeholder="e.g. Years"
                    onChange={(e) => onChange(index, "unit", e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass} htmlFor={`stat-label-${index}-${title}`}>
                    Label
                  </label>
                  <input
                    id={`stat-label-${index}-${title}`}
                    className={inputClass}
                    value={stat.label}
                    onChange={(e) => onChange(index, "label", e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={stat.visible}
                    onChange={(e) => onChange(index, "visible", e.target.checked)}
                    className="h-4 w-4 accent-brand-orange"
                  />
                  Visible
                </label>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-xs font-semibold text-red-300 hover:underline"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
