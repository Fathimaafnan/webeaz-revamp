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
import type { HomeStat } from "@/lib/defaults";

type Group = "trust" | "why";

type Row = HomeStat & { _clientId: number };

const GROUPS: Array<{ key: Group; label: string; hint: string }> = [
  {
    key: "trust",
    label: "Trust Statistics",
    hint: "Shown in the TrustStats strip (e.g. 10+ years of WebEaz experience).",
  },
  {
    key: "why",
    label: "Why WebEaz",
    hint: "Shown in the WhyWebEaz panel's credibility list.",
  },
];

let nextClientId = 1;

export default function StatsPanel({
  initialStats,
  canSave,
}: {
  initialStats: Record<Group, HomeStat[]>;
  canSave: boolean;
}) {
  const [group, setGroup] = useState<Group>("trust");
  const [rowsByGroup, setRowsByGroup] = useState<Record<Group, Row[]>>(() => ({
    trust: initialStats.trust.map((s) => ({ ...s, _clientId: nextClientId++ })),
    why: initialStats.why.map((s) => ({ ...s, _clientId: nextClientId++ })),
  }));
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

  const rows = rowsByGroup[group];

  const updateRow = (clientId: number, patch: Partial<Row>) => {
    setRowsByGroup((prev) => ({
      ...prev,
      [group]: prev[group].map((row) =>
        row._clientId === clientId ? { ...row, ...patch } : row,
      ),
    }));
    setDirty(true);
  };

  const removeRow = (clientId: number) => {
    const row = rowsByGroup[group].find((r) => r._clientId === clientId);
    if (!row) return;
    if (
      !window.confirm(
        `Remove “${row.value} ${row.unit} — ${row.label}”? The statistic will be deleted when you save.`,
      )
    ) {
      return;
    }
    setRowsByGroup((prev) => ({
      ...prev,
      [group]: prev[group].filter((r) => r._clientId !== clientId),
    }));
    setDirty(true);
  };

  const addRow = () => {
    setRowsByGroup((prev) => {
      const maxOrder = prev[group].reduce((m, r) => Math.max(m, r.order), 0);
      return {
        ...prev,
        [group]: [
          ...prev[group],
          {
            id: undefined,
            _clientId: nextClientId++,
            group,
            value: "",
            unit: "",
            label: "",
            order: maxOrder + 10,
            visible: true,
          },
        ],
      };
    });
    setDirty(true);
  };

  const move = (index: number, direction: -1 | 1) => {
    setRowsByGroup((prev) => {
      const list = [...prev[group]];
      const target = index + direction;
      if (target < 0 || target >= list.length) return prev;
      const current = list[index];
      const other = list[target];
      list[index] = { ...other, order: current.order };
      list[target] = { ...current, order: other.order };
      return { ...prev, [group]: list.sort((a, b) => a.order - b.order) };
    });
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    const payload = rows.map((row) => ({
      id: row.id,
      value: row.value,
      unit: row.unit,
      label: row.label,
      order: row.order,
      visible: row.visible,
    }));
    const result = await apiSend<{ stats?: HomeStat[] }>(
      "/api/admin/homepage/stats",
      "PUT",
      { group, stats: payload },
    );
    setSaving(false);
    if (!result.ok) {
      setFeedback({ kind: "err", text: result.error });
      return;
    }
    const savedByClientId = new Map(
      rows.map((row, index) => [
        row._clientId,
        result.data.stats?.[index],
      ]),
    );
    setRowsByGroup((prev) => ({
      ...prev,
      [group]: prev[group].map((row) => {
        const saved = savedByClientId.get(row._clientId);
        return saved ? { ...row, id: saved.id } : row;
      }),
    }));
    setDirty(false);
    setFeedback({ kind: "ok", text: `${GROUPS.find((g) => g.key === group)?.label} saved and published.` });
  };

  return (
    <section aria-labelledby="stats-title" className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 id="stats-title" className="text-lg font-bold text-white">
            Homepage Statistics
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
            Edit the metrics shown on the public homepage. Changes publish on
            save; hidden statistics are never rendered publicly.
          </p>
        </div>
        {dirty ? (
          <span className="rounded-full bg-amber-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
            Unsaved
          </span>
        ) : null}
      </div>

      <div
        role="tablist"
        aria-label="Statistic groups"
        className="mt-6 inline-flex rounded-xl border border-white/10 bg-black/20 p-1"
      >
        {GROUPS.map((g) => (
          <button
            key={g.key}
            role="tab"
            type="button"
            aria-selected={group === g.key}
            onClick={() => setGroup(g.key)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange ${
              group === g.key
                ? "bg-brand-orange text-ink"
                : "text-white/70 hover:text-white"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-white/50">
        {GROUPS.find((g) => g.key === group)?.hint}
      </p>

      <div className="mt-4 space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 bg-black/20 p-6 text-sm text-white/60">
            No statistics in this group yet. Add your first one below.
          </p>
        ) : (
          rows.map((row, index) => (
            <fieldset
              key={row._clientId}
              className="rounded-2xl border border-white/10 bg-brand-blue-deep/30 p-5"
            >
              <div className="grid gap-4 md:grid-cols-[2fr_1fr_2fr]">
                <div>
                  <label
                    htmlFor={`value-${row._clientId}`}
                    className={labelClass}
                  >
                    Value
                  </label>
                  <input
                    id={`value-${row._clientId}`}
                    value={row.value}
                    onChange={(e) =>
                      updateRow(row._clientId, { value: e.target.value })
                    }
                    className={inputClass}
                    maxLength={24}
                    placeholder="10+"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label htmlFor={`unit-${row._clientId}`} className={labelClass}>
                    Unit
                  </label>
                  <input
                    id={`unit-${row._clientId}`}
                    value={row.unit}
                    onChange={(e) =>
                      updateRow(row._clientId, { unit: e.target.value })
                    }
                    className={inputClass}
                    maxLength={32}
                    placeholder="Years"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`label-${row._clientId}`}
                    className={labelClass}
                  >
                    Label
                  </label>
                  <input
                    id={`label-${row._clientId}`}
                    value={row.label}
                    onChange={(e) =>
                      updateRow(row._clientId, { label: e.target.value })
                    }
                    className={inputClass}
                    maxLength={140}
                    autoComplete="off"
                    placeholder="Years of WebEaz experience"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div>
                  <label
                    htmlFor={`order-${row._clientId}`}
                    className="sr-only"
                  >
                    Order
                  </label>
                  <input
                    id={`order-${row._clientId}`}
                    type="number"
                    min={0}
                    value={row.order}
                    onChange={(e) =>
                      updateRow(row._clientId, {
                        order: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    aria-label="Display order"
                    className={`${inputClass} m-0 w-24`}
                  />
                </div>
                <label
                  htmlFor={`visible-${row._clientId}`}
                  className="flex cursor-pointer items-center gap-2 text-sm text-white/80"
                >
                  <input
                    id={`visible-${row._clientId}`}
                    type="checkbox"
                    checked={row.visible}
                    onChange={(e) =>
                      updateRow(row._clientId, { visible: e.target.checked })
                    }
                    className="h-5 w-5 rounded border-white/20 bg-black/30 accent-brand-orange"
                  />
                  Shown publicly
                </label>
                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    aria-label="Move statistic earlier"
                    className={secondaryButton}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    aria-label="Move statistic later"
                    className={secondaryButton}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(row._clientId)}
                    className="rounded-lg border border-red-400/40 px-3 py-2.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </fieldset>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={addRow}
        className={`${secondaryButton} mt-4`}
      >
        + Add statistic
      </button>

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
          {saving ? "Saving…" : `Save ${GROUPS.find((g) => g.key === group)?.label}`}
        </button>
      </div>
    </section>
  );
}
