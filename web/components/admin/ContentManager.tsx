"use client";

import { useCallback, useState, type ReactNode } from "react";
import {
  apiGet,
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";
import type { FieldSpec } from "@/lib/admin-content";

/**
 * Generic CMS editor used by every Site Content page. It only talks to the
 * authenticated content APIs; field definitions come from the server-side
 * allowlist so the form can never submit unsupported fields.
 *
 * Styling uses only the existing admin design tokens and layout patterns.
 */

type Item = Record<string, unknown> & { id: number };

type Props = {
  collection: string;
  label: string;
  fields: FieldSpec[];
  initialItems: Item[];
  groupField?: string;
  initialMedia?: Array<{ id: number; url: string; originalName: string }>;
  storageConfigured?: boolean;
  topContent?: ReactNode;
};

const isImageField = (name: string) =>
  /image|logo|flag|map|photo|cover/i.test(name);

export default function ContentManager({
  collection,
  label,
  fields,
  initialItems,
  groupField,
  initialMedia = [],
  storageConfigured = false,
  topContent,
}: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [mediaOpen, setMediaOpen] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const result = await apiGet<{ items: Item[] }>(`/api/admin/content/${collection}`);
    if (result.ok && Array.isArray(result.data.items)) setItems(result.data.items);
  }, [collection]);

  const beginCreate = (group?: string) => {
    const base: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.type === "stringArray") base[f.name] = [];
      else if (f.type === "number") base[f.name] = 0;
      else if (f.type === "enum") base[f.name] = f.allowed?.[0] ?? "";
      else base[f.name] = "";
    }
    if (groupField && group) base[groupField] = group;
    setDraft(base);
    setEditing(null);
    setCreating(true);
    setFeedback(null);
  };

  const beginEdit = (item: Item) => {
    const next: Record<string, unknown> = {};
    for (const f of fields) next[f.name] = item[f.name] ?? (f.type === "stringArray" ? [] : "");
    setDraft(next);
    setEditing(item);
    setCreating(false);
    setFeedback(null);
  };

  const toPayload = (item: Item): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    for (const f of fields) out[f.name] = item[f.name] ?? (f.type === "stringArray" ? [] : "");
    return out;
  };

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    const isEdit = Boolean(editing);
    const result = isEdit
      ? await apiSend(`/api/admin/content/${collection}/${editing!.id}`, "PUT", draft)
      : await apiSend(`/api/admin/content/${collection}`, "POST", draft);
    setSaving(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    await refresh();
    setCreating(false);
    setEditing(null);
    setFeedback({ kind: "ok", text: isEdit ? "Item saved and published." : "Item added." });
  };

  const remove = async (id: number) => {
    setSaving(true);
    setFeedback(null);
    const result = await apiSend(`/api/admin/content/${collection}/${id}`, "DELETE");
    setSaving(false);
    setConfirmDeleteId(null);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    await refresh();
    setFeedback({ kind: "ok", text: "Item deleted." });
  };

  const toggleStatus = async (item: Item) => {
    const status = item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setSaving(true);
    setFeedback(null);
    const result = await apiSend(`/api/admin/content/${collection}/${item.id}`, "PUT", {
      ...toPayload(item),
      status,
    });
    setSaving(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    await refresh();
    setFeedback({ kind: "ok", text: status === "PUBLISHED" ? "Item is now visible." : "Item is hidden." });
  };

  const reorder = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    for (const item of [a, b]) {
      const result = await apiSend(`/api/admin/content/${collection}/${item.id}`, "PUT", {
        ...toPayload(item),
        order: item === a ? target : index,
      });
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
    }
    await refresh();
    setFeedback({ kind: "ok", text: "Display order updated." });
  };

  const fieldInput = (f: FieldSpec) => {
    const value = draft[f.name];
    const set = (v: unknown) => setDraft((d) => ({ ...d, [f.name]: v }));
    if (f.type === "stringArray") {
      return (
        <textarea
          rows={4}
          value={Array.isArray(value) ? value.join("\n") : ""}
          onChange={(e) => set(e.target.value.split("\n").filter(Boolean))}
          className={`${inputClass} min-h-20`}
          maxLength={f.maxLength}
        />
      );
    }
    if (f.type === "enum") {
      return (
        <select
          value={String(value ?? "")}
          onChange={(e) => set(e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          {f.allowed?.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      );
    }
    if (f.type === "number") {
      return (
        <input
          type="number"
          value={Number(value ?? 0)}
          onChange={(e) => set(Number(e.target.value))}
          className={`${inputClass} m-0 w-28`}
        />
      );
    }
    return (
      <div>
        <input
          type="text"
          value={value == null ? "" : String(value)}
          onChange={(e) => set(e.target.value)}
          className={`${inputClass} m-0`}
          maxLength={f.maxLength}
        />
        {isImageField(f.name) ? (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setMediaOpen(mediaOpen === f.name ? null : f.name)}
              className={secondaryButton}
            >
              {mediaOpen === f.name ? "Close media library" : "Choose from media library"}
            </button>
            {mediaOpen === f.name ? (
              <div className="mt-2 rounded-xl border border-white/10 bg-black/20 p-3">
                <input
                  type="text"
                  placeholder="/path or https://…"
                  value={value == null ? "" : String(value)}
                  onChange={(e) => set(e.target.value)}
                  className={`${inputClass} m-0`}
                />
                {initialMedia.length > 0 ? (
                  <div className="mt-3 grid max-h-32 grid-cols-2 gap-2 overflow-auto sm:grid-cols-4">
                    {initialMedia.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        title={m.originalName}
                        onClick={() => { set(m.url); setMediaOpen(null); }}
                        className="truncate rounded-lg border border-white/10 bg-brand-blue-deep/40 px-2 py-1.5 text-left text-[11px] text-white/80 transition-colors hover:border-brand-orange/40"
                      >
                        {m.originalName}
                      </button>
                    ))}
                  </div>
                ) : null}
                {!storageConfigured ? (
                  <p className="mt-2 text-[11px] leading-4 text-white/45">
                    Direct upload is unavailable; paste an image URL above.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          Site Content
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{label}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          Add, edit, reorder, publish and hide content. Changes publish to the public website after saving.
        </p>
      </header>

      {topContent}

      <section aria-labelledby="content-title" className={panelClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="content-title" className="text-lg font-bold text-white">
              Manage {label}
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
              Hidden items never appear publicly. Use the arrows to change display order.
            </p>
          </div>
          <button
            type="button"
            onClick={() => beginCreate(groupField ? String(fields.find((f) => f.name === groupField)?.allowed?.[0] ?? "") : undefined)}
            className={primaryButton}
          >
            Add new
          </button>
        </div>

        {feedback ? (
          <p
            role={feedback.kind === "err" ? "alert" : "status"}
            className={`mt-5 rounded-lg px-4 py-3 text-sm ${
              feedback.kind === "err"
                ? "border border-red-400/30 bg-red-500/10 text-red-200"
                : "border border-green-400/30 bg-green-500/10 text-green-200"
            }`}
          >
            {feedback.text}
          </p>
        ) : null}

        {creating || editing ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-brand-blue-deep/30 p-5">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/60">
              {editing ? "Edit item" : "New item"}
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className={labelClass}>{f.name}</label>
                  {fieldInput(f)}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => void save()} disabled={saving} className={primaryButton}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => { setCreating(false); setEditing(null); }}
                className={secondaryButton}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        {items.length > 0 ? (
          <ol className="mt-6 space-y-3">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-brand-blue-deep/30 px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 font-mono text-xs font-bold text-brand-orange-light"
                >
                  {String(item.order ?? index)}
                </span>
                {groupField ? (
                  <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-white/60">
                    {String(item[groupField] ?? "")}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                  {String(item.name ?? item.title ?? item.label ?? item.industry ?? `#${item.id}`)}
                </span>
                <button
                  type="button"
                  onClick={() => void toggleStatus(item)}
                  disabled={saving}
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    item.status === "PUBLISHED"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-white/10 text-white/60"
                  }`}
                  aria-label={item.status === "PUBLISHED" ? `Hide ${String(item.name ?? item.id)}` : `Publish ${String(item.name ?? item.id)}`}
                >
                  {item.status === "PUBLISHED" ? "Published" : "Hidden"}
                </button>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <button type="button" onClick={() => beginEdit(item)} className={secondaryButton} disabled={saving}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void reorder(index, -1)}
                    className={secondaryButton}
                    disabled={saving}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => void reorder(index, 1)}
                    className={secondaryButton}
                    disabled={saving}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  {confirmDeleteId === item.id ? (
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-white/70">Delete?</span>
                      <button
                        type="button"
                        onClick={() => void remove(item.id)}
                        disabled={saving}
                        className="rounded-lg border border-red-400/40 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className={secondaryButton}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="rounded-lg border border-red-400/40 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                      disabled={saving}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-black/20 p-5">
            <p className="text-sm leading-6 text-white/60">No items yet. Use “Add new” to create the first one.</p>
          </div>
        )}
      </section>
    </div>
  );
}
