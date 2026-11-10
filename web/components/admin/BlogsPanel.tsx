"use client";

import { useCallback, useEffect, useState } from "react";
import {
  apiGet,
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";
import type { HomepageBlogSettings } from "@/lib/defaults";

export type EligibleBlogOption = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  publishedAt: string | null;
};

type Props = {
  initialSettings: HomepageBlogSettings;
  initialEligible: EligibleBlogOption[];
  canSave: boolean;
};

export default function BlogsPanel({ initialSettings, initialEligible, canSave }: Props) {
  const [settings, setSettings] = useState<HomepageBlogSettings>(initialSettings);
  const [eligible, setEligible] = useState<EligibleBlogOption[]>(initialEligible);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await apiGet<{ settings: HomepageBlogSettings; eligible: EligibleBlogOption[] }>(
      "/api/admin/homepage/blogs",
    );
    setLoading(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setSettings(result.data.settings);
    setEligible(result.data.eligible ?? []);
    setDirty(false);
  }, []);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const patch = (p: Partial<HomepageBlogSettings>) => {
    setSettings((prev) => ({ ...prev, ...p }));
    setDirty(true);
  };

  const featuredIds = settings.featuredIds ?? [];
  const featuredPosts = featuredIds
    .map((id) => eligible.find((p) => p.id === id))
    .filter((p): p is EligibleBlogOption => Boolean(p));
  // When customized to fewer than eligible, show configured order; missing (unpublished) posts drop out.
  const availableToAdd = eligible.filter((p) => !featuredIds.includes(p.id));

  const moveFeatured = (index: number, direction: -1 | 1) => {
    const next = [...featuredIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    patch({ featuredIds: next });
  };

  const removeFeatured = (id: number) => {
    if (!window.confirm("Remove this blog from the homepage? The blog post itself will NOT be deleted.")) return;
    patch({ featuredIds: featuredIds.filter((fid) => fid !== id) });
  };

  const replaceFeatured = (currentId: number, nextId: number) => {
    if (!nextId || featuredIds.includes(nextId)) return;
    patch({ featuredIds: featuredIds.map((fid) => (fid === currentId ? nextId : fid)) });
  };

  const addFeatured = (id: number) => {
    if (!id || featuredIds.includes(id)) return;
    if (featuredIds.length >= 3) {
      setFeedback({ kind: "err", text: "Up to 3 featured blogs can be selected." });
      return;
    }
    patch({ featuredIds: [...featuredIds, id] });
  };

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await apiSend("/api/admin/homepage/blogs", "PUT", {
      settings: {
        exploreLabel: settings.exploreLabel,
        exploreHref: settings.exploreHref,
        featuredIds: featuredIds,
        ctaVisible: settings.ctaVisible,
        ctaHeading: settings.ctaHeading,
        ctaDescription: settings.ctaDescription,
        ctaLabel: settings.ctaLabel,
        ctaHref: settings.ctaHref,
      },
    });
    setSaving(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setDirty(false);
    setFeedback({ kind: "ok", text: "Homepage Blogs settings saved and published." });
  };

  if (loading) {
    return (
      <section aria-labelledby="blogs-title" className={panelClass}>
        <p role="status" className="text-sm text-white/60">Loading homepage blog settings…</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="blogs-title" className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="blogs-title" className="text-lg font-bold text-white">Homepage Blogs</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
            Manage the homepage Blogs section: up to 3 featured published blogs, the Explore More button,
            and the Become a Contributor banner. Heading, eyebrow, description and visibility live in
            {" "}<strong className="text-white">Homepage Sections</strong> (key <code>blogs</code>).
            Cards always show live BlogPost data — title, cover, category and date.
          </p>
        </div>
        {dirty ? (
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
            Unsaved
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <fieldset className="rounded-2xl border border-white/10 bg-brand-blue-deep/30 p-5">
            <legend className="rounded-md bg-brand-orange/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange-light">
              Featured blogs (up to 3)
            </legend>

            {featuredPosts.length === 0 ? (
              <p className="text-sm text-white/60">
                No featured blogs selected. Until you save a selection, the 3 most recent eligible published
                blogs are shown. Only <strong className="text-white">PUBLISHED + APPROVED</strong> posts can be selected.
              </p>
            ) : (
              <ol className="space-y-3">
                {featuredPosts.map((post, index) => (
                  <li key={post.id} className="flex flex-wrap items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{index + 1}. {post.title}</p>
                      <p className="text-xs text-white/50">{post.category} · {post.publishedAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(post.publishedAt)) : "No date"} · /insights/{post.slug}</p>
                      <label className={`${labelClass} mt-2`} htmlFor={`replace-${post.id}`}>Replace with</label>
                      <select
                        id={`replace-${post.id}`}
                        className={inputClass}
                        value=""
                        onChange={(e) => replaceFeatured(post.id, Number(e.target.value))}
                        disabled={!canSave}
                      >
                        <option value="">Select a blog…</option>
                        {availableToAdd.map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button type="button" onClick={() => moveFeatured(index, -1)} disabled={index === 0 || !canSave} className={secondaryButton} aria-label={`Move ${post.title} earlier`}>↑</button>
                      <button type="button" onClick={() => moveFeatured(index, 1)} disabled={index === featuredPosts.length - 1 || !canSave} className={secondaryButton} aria-label={`Move ${post.title} later`}>↓</button>
                      <button type="button" onClick={() => removeFeatured(post.id)} disabled={!canSave} className={`${secondaryButton} text-red-100`}>Remove</button>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <label className={`${labelClass} mt-5`} htmlFor="add-featured">Add a published blog</label>
            <div className="flex gap-2">
              <select
                id="add-featured"
                className={inputClass}
                value=""
                onChange={(e) => addFeatured(Number(e.target.value))}
                disabled={!canSave || availableToAdd.length === 0}
              >
                <option value="">{availableToAdd.length === 0 ? "No more eligible blogs" : "Choose an eligible blog…"}</option>
                {availableToAdd.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <button type="button" onClick={() => void load()} className={secondaryButton}>Refresh</button>
            </div>
            <p className="mt-2 text-xs text-white/50">Removing a selection does not delete the BlogPost. Unpublished or deleted posts stop appearing automatically.</p>
          </fieldset>

          <fieldset className="rounded-2xl border border-white/10 bg-brand-blue-deep/30 p-5">
            <legend className="rounded-md bg-brand-orange/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange-light">
              Explore More
            </legend>
            <label className={labelClass} htmlFor="blogs-explore-label">Button text</label>
            <input id="blogs-explore-label" value={settings.exploreLabel} maxLength={80} onChange={(e) => patch({ exploreLabel: e.target.value })} className={inputClass} disabled={!canSave} />
            <label className={`${labelClass} mt-4`} htmlFor="blogs-explore-href">Destination URL (internal path)</label>
            <input id="blogs-explore-href" value={settings.exploreHref} maxLength={200} onChange={(e) => patch({ exploreHref: e.target.value })} className={inputClass} disabled={!canSave} placeholder="/blog" />
          </fieldset>
        </div>

        <div className="space-y-5">
          <fieldset className="rounded-2xl border border-white/10 bg-brand-blue-deep/30 p-5">
            <legend className="rounded-md bg-brand-orange/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange-light">
              Become a Contributor CTA
            </legend>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3" htmlFor="blogs-cta-visible">
              <input id="blogs-cta-visible" type="checkbox" checked={settings.ctaVisible} onChange={(e) => patch({ ctaVisible: e.target.checked })} className="h-5 w-5 accent-brand-orange" disabled={!canSave} />
              <span className="text-sm font-semibold text-white">Show CTA banner on homepage</span>
            </label>
            <label className={`${labelClass} mt-4`} htmlFor="blogs-cta-heading">Heading</label>
            <input id="blogs-cta-heading" value={settings.ctaHeading} maxLength={200} onChange={(e) => patch({ ctaHeading: e.target.value })} className={inputClass} disabled={!canSave} />
            <label className={`${labelClass} mt-4`} htmlFor="blogs-cta-description">Description</label>
            <textarea id="blogs-cta-description" value={settings.ctaDescription} maxLength={600} rows={3} onChange={(e) => patch({ ctaDescription: e.target.value })} className={`${inputClass} min-h-20`} disabled={!canSave} />
            <label className={`${labelClass} mt-4`} htmlFor="blogs-cta-label">Button label</label>
            <input id="blogs-cta-label" value={settings.ctaLabel} maxLength={80} onChange={(e) => patch({ ctaLabel: e.target.value })} className={inputClass} disabled={!canSave} />
            <label className={`${labelClass} mt-4`} htmlFor="blogs-cta-href">Destination URL (existing contributor page)</label>
            <input id="blogs-cta-href" value={settings.ctaHref} maxLength={200} onChange={(e) => patch({ ctaHref: e.target.value })} className={inputClass} disabled={!canSave} placeholder="/blog/become-a-contributor" />
          </fieldset>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="font-semibold text-white">Preview</h3>
            <p className="mt-1 text-sm text-white/60">A compact preview of the selected cards, Explore link and CTA.</p>
            <div className="mt-3 space-y-2 text-sm text-white/80">
              <p><strong className="text-white">{settings.exploreLabel}</strong> → <code className="text-xs">{settings.exploreHref}</code></p>
              <ul className="list-decimal space-y-1 pl-5">
                {(featuredPosts.length > 0 ? featuredPosts : eligible.slice(0, 3)).map((p) => (
                  <li key={p.id}>{p.title}</li>
                ))}
                {(featuredPosts.length === 0 && eligible.length === 0) ? <li>No eligible blogs yet.</li> : null}
              </ul>
              {settings.ctaVisible ? (
                <div className="rounded-xl border border-brand-blue/20 bg-brand-blue-soft p-4">
                  <p className="font-semibold text-ink">{settings.ctaHeading}</p>
                  <p className="text-muted">{settings.ctaDescription}</p>
                  <p className="mt-1 font-semibold text-ink">{settings.ctaLabel} → <span className="font-normal">{settings.ctaHref}</span></p>
                </div>
              ) : (
                <p className="text-white/50">Contributor CTA hidden.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {feedback ? (
        <p role={feedback.kind === "err" ? "alert" : "status"} className={`mt-6 rounded-lg px-4 py-3 text-sm ${feedback.kind === "err" ? "border border-red-400/30 bg-red-500/10 text-red-200" : "border border-green-400/30 bg-green-500/10 text-green-200"}`}>
          {feedback.text}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-end gap-3">
        <button type="button" onClick={() => void load()} className={secondaryButton} disabled={!canSave}>Reset</button>
        <button type="button" onClick={() => void save()} disabled={!canSave || saving || !dirty} className={primaryButton}>
          {saving ? "Saving…" : "Save Blogs settings"}
        </button>
      </div>
    </section>
  );
}
