"use client";

import { useState } from "react";
import {
  apiSend,
  inputClass,
  labelClass,
  primaryButton,
} from "@/components/admin/api";

const KEYS = ["siteName", "siteDescription", "footerTagline", "footerBlurb", "footerNote", "footerLogoUrl"] as const;

/** Footer text editor using the existing admin panel and input styling. */
export default function FooterSettingsForm({ initial }: { initial: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setFeedback(null);
    const result = await apiSend("/api/admin/settings", "PUT", { settings: values });
    setSaving(false);
    setFeedback(
      result.ok
        ? { kind: "ok", text: "Footer text saved and published." }
        : { kind: "err", text: result.error },
    );
  };

  return (
    <section aria-labelledby="footer-settings-title" className="rounded-xl border border-white/10 bg-white/5 p-6">
      <div>
        <h2 id="footer-settings-title" className="text-lg font-bold text-white">
          Footer text and logo
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
          Edit the site name, footer tagline and logo path used by the public footer.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {KEYS.map((key) => (
          <div key={key}>
            <label className={labelClass}>{key}</label>
            <input
              type="text"
              value={values[key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
              className={`${inputClass} m-0`}
            />
          </div>
        ))}
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

      <div className="mt-5">
        <button type="button" onClick={() => void save()} disabled={saving} className={primaryButton}>
          {saving ? "Saving…" : "Save footer text"}
        </button>
      </div>
    </section>
  );
}
