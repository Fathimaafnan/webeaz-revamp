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

type ServiceRow = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  icon: string;
  image: string | null;
  overview: string;
  provides: string[];
  capabilities: string[];
  benefits: string[];
  useCases: string[];
  technologies: string[];
  status: string;
  order: number;
  categoryId: number;
};

type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  services: ServiceRow[];
};

type MediaRow = { id: number; url: string; originalName: string; alt: string };

type Feedback = { kind: "ok" | "err"; text: string } | null;

const ICON_NAMES = [
  "website",
  "mobile",
  "ecommerce",
  "software",
  "product",
  "cloud",
  "marketing",
  "seo",
  "ads",
  "meta",
  "social",
  "funnel",
  "content",
  "crm",
  "marketing-automation",
  "sales-automation",
  "whatsapp",
  "workflow",
  "process",
  "ai-consulting",
  "ai-integration",
  "ai-automation",
  "ai-agents",
  "ai-apps",
];

const LIST_FIELDS: Array<{ key: "provides" | "capabilities" | "benefits" | "useCases" | "technologies"; label: string }> = [
  { key: "provides", label: "Provides" },
  { key: "capabilities", label: "Capabilities" },
  { key: "benefits", label: "Benefits" },
  { key: "useCases", label: "Use cases" },
  { key: "technologies", label: "Technologies" },
];

const EMPTY_FORM = {
  categorySlug: "",
  slug: "",
  name: "",
  summary: "",
  icon: "software",
  image: "",
  overview: "",
  provides: [] as string[],
  capabilities: [] as string[],
  benefits: [] as string[],
  useCases: [] as string[],
  technologies: [] as string[],
  status: "DRAFT",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "PUBLISHED"
      ? "bg-emerald-500/15 text-emerald-300"
      : status === "ARCHIVED"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-white/10 text-white/60";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}

export default function ServicesManager({
  categories,
  media,
  canSave,
}: {
  categories: CategoryRow[];
  media: MediaRow[];
  canSave: boolean;
}) {
  const [list, setList] = useState(categories);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const startCreate = () => {
    setForm({
      ...EMPTY_FORM,
      categorySlug: list[0]?.slug ?? "",
    });
    setCreating(true);
    setEditing(null);
    setFeedback(null);
  };

  const startEdit = (service: ServiceRow) => {
    const category = list.find((c) => c.services.some((s) => s.id === service.id));
    setForm({
      categorySlug: category?.slug ?? "",
      slug: service.slug,
      name: service.name,
      summary: service.summary,
      icon: service.icon,
      image: service.image ?? "",
      overview: service.overview,
      provides: [...service.provides],
      capabilities: [...service.capabilities],
      benefits: [...service.benefits],
      useCases: [...service.useCases],
      technologies: [...service.technologies],
      status: service.status,
    });
    setEditing(service);
    setCreating(false);
    setFeedback(null);
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setFeedback(null);
  };

  const setField = (key: keyof typeof EMPTY_FORM, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (status?: string) => {
    setSaving(true);
    setFeedback(null);
    try {
      const payload = { ...form, status: status ?? form.status };
      const url = editing
        ? `/api/admin/services/${editing.id}`
        : "/api/admin/services";
      const method = editing ? "PUT" : "POST";
      const result = await apiSend<{ id?: number }>(url, method, payload);
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }

      const savedId = editing?.id ?? result.data.id ?? 0;
      const saved: ServiceRow = {
        id: savedId,
        slug: payload.slug,
        name: payload.name,
        summary: payload.summary,
        icon: payload.icon,
        image: payload.image || null,
        overview: payload.overview,
        provides: payload.provides,
        capabilities: payload.capabilities,
        benefits: payload.benefits,
        useCases: payload.useCases,
        technologies: payload.technologies,
        status: payload.status,
        order: editing?.order ?? 0,
        categoryId:
          list.find((c) => c.slug === payload.categorySlug)?.id ??
          editing?.categoryId ??
          0,
      };

      setList((prev) =>
        prev.map((category) => {
          const withoutSaved = category.services.filter(
            (s) => s.id !== savedId && s.slug !== saved.slug,
          );
          if (category.slug === payload.categorySlug) {
            return {
              ...category,
              services: [...withoutSaved, saved].sort((a, b) =>
                a.name.localeCompare(b.name),
              ),
            };
          }
          return { ...category, services: withoutSaved };
        }),
      );

      setFeedback({
        kind: "ok",
        text: editing
          ? `“${saved.name}” updated (${saved.status}).`
          : `“${saved.name}” created (${saved.status}).`,
      });
      setEditing(null);
      setCreating(false);
    } catch (error) {
      setFeedback({
        kind: "err",
        text: error instanceof Error ? error.message : "Saving failed.",
      });
    } finally {
      setSaving(false);
    }
  };

  const archive = async (service: ServiceRow) => {
    const next = service.status === "ARCHIVED" ? "PUBLISHED" : "ARCHIVED";
    setSaving(true);
    setFeedback(null);
    try {
      const result = await apiSend(`/api/admin/services/${service.id}`, "PUT", {
        categorySlug:
          list.find((c) => c.services.some((s) => s.id === service.id))?.slug ?? "",
        slug: service.slug,
        name: service.name,
        summary: service.summary,
        icon: service.icon,
        image: service.image,
        overview: service.overview,
        provides: service.provides,
        capabilities: service.capabilities,
        benefits: service.benefits,
        useCases: service.useCases,
        technologies: service.technologies,
        status: next,
      });
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setList((prev) =>
        prev.map((c) => ({
          ...c,
          services: c.services.map((s) =>
            s.id === service.id ? { ...s, status: next } : s,
          ),
        })),
      );
      setFeedback({
        kind: "ok",
        text:
          next === "ARCHIVED"
            ? `“${service.name}” archived — it no longer appears publicly.`
            : `“${service.name}” published.`,
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (service: ServiceRow) => {
    if (
      !window.confirm(
        `Permanently delete “${service.name}”? Its public URL will stop working. This cannot be undone.`,
      )
    ) {
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const result = await apiSend(`/api/admin/services/${service.id}`, "DELETE");
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setList((prev) =>
        prev.map((c) => ({
          ...c,
          services: c.services.filter((s) => s.id !== service.id),
        })),
      );
      setFeedback({ kind: "ok", text: `“${service.name}” deleted.` });
      if (editing?.id === service.id) cancel();
    } finally {
      setSaving(false);
    }
  };

  const total = list.reduce((sum, c) => sum + c.services.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/70">
          {total} service{total === 1 ? "" : "s"} across {list.length} categories
        </p>
        <button
          type="button"
          onClick={startCreate}
          disabled={!canSave || creating}
          className={primaryButton}
        >
          New service
        </button>
      </div>

      {(creating || editing) && (
        <section className={panelClass} aria-label="Service form">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">
              {editing ? `Edit “${editing.name}”` : "New service"}
            </h2>
            <button type="button" onClick={cancel} className={secondaryButton}>
              Cancel
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="svc-category">
                Category
              </label>
              <select
                id="svc-category"
                className={inputClass}
                value={form.categorySlug}
                onChange={(e) => setField("categorySlug", e.target.value)}
              >
                {list.map((c) => (
                  <option key={c.slug} value={c.slug} className="bg-ink">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="svc-status">
                Status
              </label>
              <select
                id="svc-status"
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
            <div>
              <label className={labelClass} htmlFor="svc-name">
                Name
              </label>
              <input
                id="svc-name"
                className={inputClass}
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name,
                    slug: editing ? prev.slug : slugify(name),
                  }));
                }}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="svc-slug">
                Slug (URL)
              </label>
              <input
                id="svc-slug"
                className={inputClass}
                value={form.slug}
                onChange={(e) => setField("slug", e.target.value)}
              />
              <p className="mt-1 text-xs text-white/50">
                URL: /services/[area]/{form.slug || "slug"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="svc-summary">
                Card summary
              </label>
              <input
                id="svc-summary"
                className={inputClass}
                value={form.summary}
                onChange={(e) => setField("summary", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="svc-icon">
                Icon
              </label>
              <select
                id="svc-icon"
                className={inputClass}
                value={form.icon}
                onChange={(e) => setField("icon", e.target.value)}
              >
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name} className="bg-ink">
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="svc-image">
                Image (from media library)
              </label>
              <select
                id="svc-image"
                className={inputClass}
                value={form.image}
                onChange={(e) => setField("image", e.target.value)}
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
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="svc-overview">
                Detail overview
              </label>
              <textarea
                id="svc-overview"
                rows={4}
                className={inputClass}
                value={form.overview}
                onChange={(e) => setField("overview", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {LIST_FIELDS.map((field) => (
              <div key={field.key}>
                <label className={labelClass} htmlFor={`svc-${field.key}`}>
                  {field.label} (one per line)
                </label>
                <textarea
                  id={`svc-${field.key}`}
                  rows={5}
                  className={inputClass}
                  value={form[field.key].join("\n")}
                  onChange={(e) =>
                    setField(
                      field.key,
                      e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void submit()}
              disabled={saving}
              className={primaryButton}
            >
              {editing ? "Save changes" : "Create service"}
            </button>
            {!editing && (
              <button
                type="button"
                onClick={() => void submit("PUBLISHED")}
                disabled={saving}
                className={secondaryButton}
              >
                Create &amp; publish
              </button>
            )}
          </div>
          <FeedbackLine feedback={feedback} />
        </section>
      )}

      <div className="flex flex-col gap-6">
        {list.map((category) => (
          <section key={category.slug} className={panelClass}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">{category.name}</h2>
              <span className="text-xs font-semibold uppercase tracking-wide text-white/50">
                /services/{category.slug}
              </span>
            </div>

            {category.services.length === 0 ? (
              <p className="mt-3 text-sm text-white/50">No services in this category.</p>
            ) : (
              <ul className="mt-4 divide-y divide-white/10">
                {category.services.map((service) => (
                  <li
                    key={service.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {service.name}
                      </p>
                      <p className="truncate text-xs text-white/50">
                        /{category.slug}/{service.slug}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={service.status} />
                      <button
                        type="button"
                        onClick={() => startEdit(service)}
                        className={secondaryButton}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void archive(service)}
                        disabled={saving}
                        className={secondaryButton}
                      >
                        {service.status === "ARCHIVED" ? "Publish" : "Archive"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void remove(service)}
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
        ))}
      </div>

      {!creating && !editing ? <FeedbackLine feedback={feedback} /> : null}
    </div>
  );
}
