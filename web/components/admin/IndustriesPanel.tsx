"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";

export type IndustryRow = {
  id: number;
  name: string;
  order: number;
  status: string;
};

type Props = {
  initialIndustries: IndustryRow[];
  builtInIndustries: readonly string[];
  canSave: boolean;
};

export default function IndustriesPanel({
  initialIndustries,
  builtInIndustries,
  canSave,
}: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initialIndustries);
  const [draftName, setDraftName] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<
    { kind: "ok" | "err"; text: string } | null
  >(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!draftName && editingId === null) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [draftName, editingId]);

  const addIndustry = async () => {
    const name = draftName.trim();
    if (!name) {
      setFeedback({ kind: "err", text: "Enter an industry name." });
      return;
    }
    setBusy(true);
    setFeedback(null);
    const result = await apiSend<{ industry: IndustryRow }>(
      "/api/admin/industries",
      "POST",
      { name },
    );
    setBusy(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setRows((prev) =>
      [...prev, result.data.industry].sort(
        (a, b) => a.order - b.order || a.id - b.id,
      ),
    );
    setDraftName("");
    setFeedback({ kind: "ok", text: `Added “${name}”.` });
    router.refresh();
  };

  const saveName = async (id: number, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setFeedback({ kind: "err", text: "Industry name cannot be empty." });
      return;
    }
    setBusy(true);
    setFeedback(null);
    const result = await apiSend(`/api/admin/industries/${id}`, "PUT", {
      name: trimmed,
    });
    setBusy(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, name: trimmed } : row,
      ),
    );
    setEditingId(null);
    setEditingName("");
    setFeedback({ kind: "ok", text: "Industry renamed." });
    router.refresh();
  };

  const setStatus = async (id: number, status: "PUBLISHED" | "DRAFT") => {
    setBusy(true);
    setFeedback(null);
    const result = await apiSend(`/api/admin/industries/${id}`, "PUT", {
      status,
    });
    setBusy(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    setFeedback({
      kind: "ok",
      text: status === "PUBLISHED" ? "Industry is now visible." : "Industry is hidden.",
    });
    router.refresh();
  };

  const move = async (id: number, direction: "up" | "down") => {
    setBusy(true);
    setFeedback(null);
    const result = await apiSend(`/api/admin/industries/${id}`, "PUT", {
      move: direction,
    });
    setBusy(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    // Swap locally to avoid a full refetch for a simple reorder.
    setRows((prev) => {
      const list = [...prev].sort((a, b) => a.order - b.order);
      const index = list.findIndex((r) => r.id === id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || target < 0 || target >= list.length) return prev;
      const current = list[index];
      const other = list[target];
      list[index] = { ...other, order: current.order };
      list[target] = { ...current, order: other.order };
      return [...list].sort((a, b) => a.order - b.order);
    });
    setFeedback({ kind: "ok", text: "Industry display order updated." });
    router.refresh();
  };

  const remove = async (id: number) => {
    setBusy(true);
    setFeedback(null);
    const result = await apiSend(`/api/admin/industries/${id}`, "DELETE");
    setBusy(false);
    setConfirmDeleteId(null);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    setFeedback({ kind: "ok", text: "Industry deleted." });
    router.refresh();
  };

  const importBuiltIn = async () => {
    setBusy(true);
    setFeedback(null);
    const result = await apiSend<{ created?: number; skipped?: number }>(
      "/api/admin/industries/import",
      "POST",
    );
    setBusy(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    setFeedback({
      kind: "ok",
      text: `Imported ${result.data?.created ?? 0} industries — ${result.data?.skipped ?? 0} already existed and were skipped.`,
    });
    router.refresh();
  };

  return (
    <section aria-labelledby="industries-title" className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="industries-title" className="text-lg font-bold text-white">
            Industries
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
            Control the industry list shown on the homepage and /industries.
            Hidden industries never appear publicly.
          </p>
        </div>
      </div>

      {!canSave ? (
        <p
          role="status"
          className="mt-5 rounded-xl border border-amber-300/20 bg-amber-500/5 p-4 text-sm text-amber-100"
        >
          Database content is unavailable. The public website continues to use
          its existing fallback; industry changes are disabled until the
          database is available.
        </p>
      ) : null}
      {rows.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-black/20 p-5">
          <p className="text-sm leading-6 text-white/60">
            No industries are managed in the database yet. The public website
            is currently showing its built-in list of{" "}
            {builtInIndustries.length} industries. Import that list once to
            rename, hide, reorder and extend it from the CMS — the names,
            order and public appearance stay exactly the same.
          </p>
        </div>
      ) : null}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => void importBuiltIn()}
          disabled={busy || !canSave}
          className={secondaryButton}
        >
          {busy ? "Working…" : "Import built-in industries"}
        </button>
        <p className="mt-1.5 text-[11px] leading-4 text-white/45">
          Copies any missing built-in industries, in order. Existing rows are
          never changed or overwritten.
        </p>
      </div>
      <>
        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            void addIndustry();
          }}
        >
          <div className="flex-1">
            <label htmlFor="new-industry" className={labelClass}>
              Add industry
            </label>
            <input
              id="new-industry"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className={inputClass}
              placeholder="e.g. Logistics"
              maxLength={80}
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !canSave || !draftName.trim()}
            className={primaryButton}
          >
            {busy ? "Adding…" : "Add"}
          </button>
        </form>

        {rows.length > 0 ? (
          <ol className="mt-6 space-y-3">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-brand-blue-deep/30 px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/15 font-mono text-xs font-bold text-brand-orange-light"
                >
                  {row.order}
                </span>

                {editingId === row.id ? (
                  <input
                    aria-label="Industry name"
                    value={editingName}
                    autoFocus
                    maxLength={80}
                    onChange={(event) => setEditingName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void saveName(row.id, editingName);
                      } else if (event.key === "Escape") {
                        setEditingId(null);
                        setEditingName("");
                      }
                    }}
                    className={`${inputClass} m-0 min-w-0 flex-1`}
                  />
                ) : (
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                    {row.name}
                  </span>
                )}

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    row.status === "PUBLISHED"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {row.status === "PUBLISHED" ? "Published" : "Hidden"}
                </span>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {editingId === row.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => void saveName(row.id, editingName)}
                        className={secondaryButton}
                        disabled={busy || !canSave}
                      >
                        Save name
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                        className={secondaryButton}
                        disabled={busy || !canSave}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(row.id);
                        setEditingName(row.name);
                      }}
                      className={secondaryButton}
                      disabled={busy || !canSave}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      void setStatus(
                        row.id,
                        row.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                      )
                    }
                    className={secondaryButton}
                    disabled={busy || !canSave}
                    aria-label={
                      row.status === "PUBLISHED"
                        ? `Hide ${row.name}`
                        : `Publish ${row.name}`
                    }
                  >
                    {row.status === "PUBLISHED" ? "Hide" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(row.id, "up")}
                    aria-label={`Move ${row.name} earlier`}
                    className={secondaryButton}
                    disabled={busy || !canSave}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => void move(row.id, "down")}
                    aria-label={`Move ${row.name} later`}
                    className={secondaryButton}
                    disabled={busy || !canSave}
                  >
                    ↓
                  </button>
                  {confirmDeleteId === row.id ? (
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-white/70">Delete?</span>
                      <button
                        type="button"
                        onClick={() => void remove(row.id)}
                        className="rounded-lg border border-red-400/40 px-3 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
                        disabled={busy || !canSave}
                        aria-label={`Confirm deleting ${row.name}`}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className={secondaryButton}
                        disabled={busy}
                        aria-label={`Cancel deleting ${row.name}`}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(row.id)}
                      className="rounded-lg border border-red-400/40 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                      disabled={busy || !canSave}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : null}
      </>

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
    </section>
  );
}
