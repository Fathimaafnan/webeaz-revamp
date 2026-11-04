"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";

export type BlogEditorValue = {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  author: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  status: string;
};

type Props = {
  initial: BlogEditorValue;
  media: Array<{ id: number; url: string; originalName: string; alt: string }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogEditor({ initial, media }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<
    { kind: "ok" | "err"; text: string } | null
  >(null);

  const setField = (key: keyof BlogEditorValue, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (status?: string) => {
    setSaving(true);
    setFeedback(null);
    try {
      const payload = { ...form, status: status ?? form.status };
      const url = form.id ? `/api/admin/blog/${form.id}` : "/api/admin/blog";
      const method = form.id ? "PUT" : "POST";
      const result = await apiSend<{ id?: number }>(url, method, payload);
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setFeedback({
        kind: "ok",
        text:
          payload.status === "PUBLISHED"
            ? `Saved and published. ${payload.title} is live at /insights/${payload.slug}.`
            : `Saved as ${payload.status.toLowerCase()}.`,
      });
      if (!form.id && result.data.id) {
        setForm((prev) => ({ ...prev, id: result.data.id as number }));
      }
      router.refresh();
    } catch (error) {
      setFeedback({
        kind: "err",
        text: error instanceof Error ? error.message : "Saving failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  const dateValue = form.publishedAt ? form.publishedAt.slice(0, 10) : "";

  return (
    <section className={panelClass} aria-label="Post editor">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="post-title">
            Title
          </label>
          <input
            id="post-title"
            className={inputClass}
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((prev) => ({
                ...prev,
                title,
                slug: prev.slug && prev.id ? prev.slug : slugify(title),
              }));
            }}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="post-slug">
            Slug (URL)
          </label>
          <input
            id="post-slug"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setField("slug", e.target.value)}
          />
          <p className="mt-1 text-xs text-white/50">/insights/{form.slug || "slug"}</p>
        </div>

        <div>
          <label className={labelClass} htmlFor="post-category">
            Category
          </label>
          <input
            id="post-category"
            className={inputClass}
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="post-author">
            Author
          </label>
          <input
            id="post-author"
            className={inputClass}
            value={form.author}
            onChange={(e) => setField("author", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="post-date">
            Publication date
          </label>
          <input
            id="post-date"
            type="date"
            className={inputClass}
            value={dateValue}
            onChange={(e) => setField("publishedAt", e.target.value)}
          />
          <p className="mt-1 text-xs text-white/50">
            Used when the post is published; left empty on publish it defaults to today.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="post-excerpt">
            Excerpt (card description)
          </label>
          <textarea
            id="post-excerpt"
            rows={2}
            className={inputClass}
            value={form.excerpt}
            onChange={(e) => setField("excerpt", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="post-content">
            Body content (Markdown supported)
          </label>
          <textarea
            id="post-content"
            rows={14}
            className={inputClass}
            value={form.content}
            onChange={(e) => setField("content", e.target.value)}
          />
          <p className="mt-1 text-xs text-white/50">
            Use headings, lists, links, bold text and blank lines to format the article.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="post-cover">
            Featured image
          </label>
          <select
            id="post-cover"
            className={inputClass}
            value={form.coverImage ?? ""}
            onChange={(e) => setField("coverImage", e.target.value)}
          >
            <option value="" className="bg-ink">
              No image
            </option>
            {media.map((asset) => (
              <option key={asset.id} value={asset.url} className="bg-ink">
                {asset.alt || asset.originalName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="post-status">
            Status
          </label>
          <select
            id="post-status"
            className={inputClass}
            value={form.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            <option value="DRAFT" className="bg-ink">
              Draft
            </option>
            <option value="PUBLISHED" className="bg-ink">
              Published
            </option>
            <option value="ARCHIVED" className="bg-ink">
              Archived
            </option>
          </select>
        </div>

        <div className="sm:col-span-2 border-t border-white/10 pt-4">
          <p className="text-sm font-semibold text-white">SEO</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="post-seo-title">
                SEO title
              </label>
              <input
                id="post-seo-title"
                className={inputClass}
                value={form.seoTitle}
                onChange={(e) => setField("seoTitle", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="post-seo-desc">
                Meta description
              </label>
              <input
                id="post-seo-desc"
                className={inputClass}
                value={form.seoDescription}
                onChange={(e) => setField("seoDescription", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className={primaryButton}
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => void save("PUBLISHED")}
          disabled={saving}
          className={secondaryButton}
        >
          Publish
        </button>
        <button
          type="button"
          onClick={() => void save("ARCHIVED")}
          disabled={saving}
          className={secondaryButton}
        >
          Archive
        </button>
      </div>

      {feedback ? (
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
      ) : null}
    </section>
  );
}
