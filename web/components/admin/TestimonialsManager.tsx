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

type Row = {
  id: number;
  name: string;
  role: string;
  company: string;
  companyLogo: string | null;
  image: string;
  quote: string;
  rating: number | null;
  order: number;
  status: string;
};

type MediaRow = { id: number; url: string; originalName: string; alt: string };
type Feedback = { kind: "ok" | "err"; text: string } | null;

const EMPTY: Omit<Row, "id"> = {
  name: "",
  role: "",
  company: "",
  companyLogo: "",
  image: "",
  quote: "",
  rating: null,
  order: 0,
  status: "PUBLISHED",
};

function FeedbackLine({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <p
      role="status"
      className={`rounded-lg px-4 py-3 text-sm ${
        feedback.kind === "ok"
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-red-500/15 text-red-300"
      }`}
    >
      {feedback.text}
    </p>
  );
}

export default function TestimonialsManager({
  initial,
  media,
  canSave,
}: {
  initial: Row[];
  media: MediaRow[];
  canSave: boolean;
}) {
  const [rows, setRows] = useState(initial);
  const [form, setForm] = useState<Omit<Row, "id"> | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const setField = (key: keyof typeof EMPTY, value: string | number | null) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const startCreate = () => {
    setForm({ ...EMPTY });
    setEditingId(null);
    setFeedback(null);
  };

  const startEdit = (row: Row) => {
    setForm({ ...row });
    setEditingId(row.id);
    setFeedback(null);
  };

  const cancel = () => {
    setForm(null);
    setEditingId(null);
    setFeedback(null);
  };

  const submit = async () => {
    if (!form) return;
    setSaving(true);
    setFeedback(null);
    try {
      const url = editingId
        ? `/api/admin/testimonials/${editingId}`
        : "/api/admin/testimonials";
      const method = editingId ? "PUT" : "POST";
      const result = await apiSend<{ id?: number }>(url, method, form);
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }

      if (editingId) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === editingId ? { ...r, ...form, id: editingId } : r,
          ),
        );
        setFeedback({ kind: "ok", text: `Testimonial from “${form.name}” updated.` });
      } else {
        const id = result.data.id ?? Date.now();
        setRows((prev) => [...prev, { ...form, id, order: prev.length * 10 }]);
        setFeedback({ kind: "ok", text: `Testimonial from “${form.name}” added.` });
      }
      cancel();
    } finally {
      setSaving(false);
    }
  };

  const archive = async (row: Row) => {
    const next = row.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    setSaving(true);
    setFeedback(null);
    try {
      const result = await apiSend(`/api/admin/testimonials/${row.id}`, "PUT", {
        status: next,
      });
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
      setFeedback({
        kind: "ok",
        text:
          next === "PUBLISHED"
            ? `“${row.name}” published to the homepage.`
            : `“${row.name}” hidden from the homepage.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Row) => {
    if (
      !window.confirm(
        `Permanently delete the testimonial from “${row.name}”? This cannot be undone.`,
      )
    ) {
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const result = await apiSend(`/api/admin/testimonials/${row.id}`, "DELETE");
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setFeedback({ kind: "ok", text: "Testimonial deleted." });
      if (editingId === row.id) cancel();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/70">
          {rows.length} testimonial{rows.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={startCreate}
          disabled={!canSave || form !== null}
          className={primaryButton}
        >
          Add testimonial
        </button>
      </div>

      {form && (
        <section className={panelClass} aria-label="Testimonial form">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              {editingId ? "Edit testimonial" : "New testimonial"}
            </h2>
            <button type="button" onClick={cancel} className={secondaryButton}>
              Cancel
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="t-name">
                Customer name *
              </label>
              <input
                id="t-name"
                className={inputClass}
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="t-role">
                Role
              </label>
              <input
                id="t-role"
                className={inputClass}
                value={form.role}
                placeholder="e.g. Founder &amp; CEO OF"
                onChange={(e) => setField("role", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="t-company">
                Company
              </label>
              <input
                id="t-company"
                className={inputClass}
                value={form.company}
                onChange={(e) => setField("company", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="t-company-logo">
                Company logo (from media library)
              </label>
              <select
                id="t-company-logo"
                className={inputClass}
                value={form.companyLogo ?? ""}
                onChange={(e) => setField("companyLogo", e.target.value)}
              >
                <option value="" className="bg-ink">
                  No logo
                </option>
                {media.map((asset) => (
                  <option key={asset.id} value={asset.url} className="bg-ink">
                    {asset.alt || asset.originalName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="t-image">
                Photo (from media library)
              </label>
              <select
                id="t-image"
                className={inputClass}
                value={form.image}
                onChange={(e) => setField("image", e.target.value)}
              >
                <option value="" className="bg-ink">
                  No photo
                </option>
                {media.map((asset) => (
                  <option key={asset.id} value={asset.url} className="bg-ink">
                    {asset.alt || asset.originalName}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="t-quote">
                Feedback *
              </label>
              <textarea
                id="t-quote"
                rows={5}
                className={inputClass}
                value={form.quote}
                onChange={(e) => setField("quote", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="t-rating">
                Rating (optional, verified only)
              </label>
              <select
                id="t-rating"
                className={inputClass}
                value={form.rating === null ? "" : String(form.rating)}
                onChange={(e) =>
                  setField("rating", e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="" className="bg-ink">
                  No rating
                </option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n} className="bg-ink">
                    {n}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-white/50">
                Only set a score the customer actually gave.
              </p>
            </div>
            <div>
              <label className={labelClass} htmlFor="t-status">
                Status
              </label>
              <select
                id="t-status"
                className={inputClass}
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                <option value="PUBLISHED" className="bg-ink">
                  Published
                </option>
                <option value="DRAFT" className="bg-ink">
                  Draft
                </option>
                <option value="ARCHIVED" className="bg-ink">
                  Archived
                </option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => void submit()}
              disabled={saving}
              className={primaryButton}
            >
              {editingId ? "Save changes" : "Add testimonial"}
            </button>
          </div>
          <div className="mt-4">
            <FeedbackLine feedback={feedback} />
          </div>
        </section>
      )}

      {rows.length === 0 ? (
        <section className={panelClass}>
          <p className="text-sm text-white/60">No testimonials yet.</p>
        </section>
      ) : (
        <section className={panelClass}>
          <ul className="divide-y divide-white/10">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-start justify-between gap-3 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">
                    {row.name}
                    {row.company ? ` · ${row.company}` : ""}
                    {row.rating ? ` · ★ ${row.rating}` : ""}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-white/60">{row.quote}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      row.status === "PUBLISHED"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {row.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className={secondaryButton}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void archive(row)}
                    disabled={saving}
                    className={secondaryButton}
                  >
                    {row.status === "PUBLISHED" ? "Hide" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(row)}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-lg border border-red-400/40 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!form ? <FeedbackLine feedback={feedback} /> : null}
    </div>
  );
}
