"use client";

import { useState } from "react";
import {
  apiSend,
  apiUpload,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";

type Asset = {
  id: number;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string;
  createdAt: Date;
};

type Feedback = { kind: "ok" | "err"; text: string } | null;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary({
  initial,
  canSave,
}: {
  initial: Asset[];
  canSave: boolean;
}) {
  const [assets, setAssets] = useState(initial);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setFeedback({ kind: "err", text: "Choose an image first." });
      return;
    }
    setUploading(true);
    setFeedback(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("alt", alt);
      const result = await apiUpload<{ asset?: Asset }>("/api/admin/media", form);
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      const asset = result.data.asset;
      if (asset) setAssets((prev) => [asset, ...prev]);
      setFile(null);
      setAlt("");
      const input = document.getElementById("media-file-input") as HTMLInputElement | null;
      if (input) input.value = "";
      setFeedback({
        kind: "ok",
        text: `Uploaded ${asset?.originalName ?? "image"} (${asset?.url ?? ""}).`,
      });
    } finally {
      setUploading(false);
    }
  };

  const saveAlt = async (asset: Asset, value: string) => {
    setBusy(asset.id);
    setFeedback(null);
    try {
      const result = await apiSend(`/api/admin/media/${asset.id}`, "PATCH", {
        alt: value,
      });
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setAssets((prev) =>
        prev.map((a) => (a.id === asset.id ? { ...a, alt: value.trim() } : a)),
      );
      setFeedback({ kind: "ok", text: "Alt text saved." });
    } finally {
      setBusy(null);
    }
  };

  const remove = async (asset: Asset) => {
    if (
      !window.confirm(
        `Delete ${asset.originalName}? This removes the uploaded file. This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(asset.id);
    setFeedback(null);
    try {
      const result = await apiSend<{ error?: string }>(
        `/api/admin/media/${asset.id}`,
        "DELETE",
      );
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      setFeedback({ kind: "ok", text: `${asset.originalName} deleted.` });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <section className={panelClass} aria-label="Upload image">
        <h2 className="text-lg font-semibold text-white">Upload image</h2>
        <form onSubmit={upload} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="media-file-input">
              Image file
            </label>
            <input
              id="media-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm text-white/80 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-brand-orange file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-ink"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="media-alt-input">
              Alt text
            </label>
            <input
              id="media-alt-input"
              className={inputClass}
              value={alt}
              placeholder="Describe the image for screen readers"
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={uploading || !canSave}
              className={primaryButton}
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
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

      <section className={panelClass} aria-label="Uploaded images">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Library</h2>
          <span className="text-sm text-white/60">
            {assets.length} file{assets.length === 1 ? "" : "s"}
          </span>
        </div>

        {assets.length === 0 ? (
          <p className="mt-4 text-sm text-white/60">No images uploaded yet.</p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <li
                key={asset.id}
                className="overflow-hidden rounded-lg border border-white/10 bg-black/25"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.alt || asset.originalName}
                  className="h-36 w-full object-cover"
                />
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-medium text-white" title={asset.originalName}>
                    {asset.originalName}
                  </p>
                  <p className="text-[11px] text-white/50">
                    {asset.mimeType.replace("image/", "").toUpperCase()} ·{" "}
                    {formatSize(asset.size)}
                  </p>
                  <input
                    aria-label={`Alt text for ${asset.originalName}`}
                    className="w-full rounded-lg border border-white/10 bg-black/25 px-2.5 py-2 text-xs text-white placeholder:text-white/40"
                    defaultValue={asset.alt}
                    placeholder="Alt text"
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value !== asset.alt) void saveAlt(asset, value);
                    }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <code className="truncate text-[11px] text-white/40">{asset.url}</code>
                    <button
                      type="button"
                      onClick={() => void remove(asset)}
                      disabled={busy === asset.id}
                      className="shrink-0 rounded-lg border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div>
        <p className="text-xs text-white/50">
          Tip: uploaded images are available as choices in the blog, service and
          testimonial forms.
        </p>
        <button type="button" className={`${secondaryButton} mt-3`} onClick={() => window.location.reload()}>
          Refresh library
        </button>
      </div>
    </div>
  );
}
