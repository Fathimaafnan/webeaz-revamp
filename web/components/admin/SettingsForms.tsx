"use client";

import { useState } from "react";
import {
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
} from "@/components/admin/api";
import type { SiteSettings } from "@/lib/defaults";

type Feedback = { kind: "ok" | "err"; text: string } | null;

const FIELDS: Array<{ key: keyof SiteSettings; label: string; hint: string; wide?: boolean }> = [
  { key: "siteName", label: "Site name", hint: "Used in the footer copyright and metadata." },
  {
    key: "siteDescription",
    label: "Meta description",
    hint: "Default SEO description for pages without their own.",
    wide: true,
  },
  { key: "footerTagline", label: "Footer tagline", hint: "Line under the footer logo." },
  { key: "footerBlurb", label: "Footer blurb", hint: "Short description in the footer.", wide: true },
  { key: "footerNote", label: "Footer note", hint: "Closing line above the legal row.", wide: true },
];

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

export default function SettingsForms({
  initialSettings,
  initialProfile,
  canSave,
}: {
  initialSettings: SiteSettings;
  initialProfile: { name: string; email: string };
  canSave: boolean;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [profile, setProfile] = useState({
    name: initialProfile.name,
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<Feedback>(null);
  const [profileFeedback, setProfileFeedback] = useState<Feedback>(null);

  const saveSettings = async () => {
    setSaving(true);
    setSettingsFeedback(null);
    try {
      const result = await apiSend("/api/admin/settings", "PUT", settings);
      setSettingsFeedback(
        result.ok
          ? { kind: "ok", text: "Site settings saved and the site revalidated." }
          : { kind: "err", text: result.error },
      );
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setProfileFeedback(null);
    try {
      const payload: Record<string, string> = { name: profile.name };
      if (profile.newPassword) {
        payload.currentPassword = profile.currentPassword;
        payload.newPassword = profile.newPassword;
      }
      const result = await apiSend("/api/admin/profile", "PUT", payload);
      if (result.ok) {
        setProfile((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
        setProfileFeedback({
          kind: "ok",
          text: profile.newPassword
            ? "Name and password updated. Use your new password next sign-in."
            : "Name updated.",
        });
      } else {
        setProfileFeedback({ kind: "err", text: result.error });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className={panelClass} aria-label="Site settings">
        <h2 className="text-lg font-semibold text-white">Site settings</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.key} className={field.wide ? "sm:col-span-2" : ""}>
              <label className={labelClass} htmlFor={`setting-${field.key}`}>
                {field.label}
              </label>
              {field.wide ? (
                <textarea
                  id={`setting-${field.key}`}
                  rows={3}
                  className={inputClass}
                  value={settings[field.key]}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                />
              ) : (
                <input
                  id={`setting-${field.key}`}
                  className={inputClass}
                  value={settings[field.key]}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                />
              )}
              <p className="mt-1 text-xs text-white/50">{field.hint}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => void saveSettings()}
            disabled={saving || !canSave}
            className={primaryButton}
          >
            Save settings
          </button>
        </div>
        <FeedbackLine feedback={settingsFeedback} />
      </section>

      <section className={panelClass} aria-label="Admin profile">
        <h2 className="text-lg font-semibold text-white">Admin profile</h2>
        <p className="mt-1 text-sm text-white/60">
          Signed in as {initialProfile.email}. There is no public registration — this
          account was created by the admin bootstrap script.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="profile-name">
              Display name
            </label>
            <input
              id="profile-name"
              className={inputClass}
              value={profile.name}
              onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="hidden sm:block" aria-hidden="true" />
          <div>
            <label className={labelClass} htmlFor="profile-current">
              Current password
            </label>
            <input
              id="profile-current"
              type="password"
              autoComplete="current-password"
              className={inputClass}
              value={profile.currentPassword}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="profile-new">
              New password (min 10 chars)
            </label>
            <input
              id="profile-new"
              type="password"
              autoComplete="new-password"
              className={inputClass}
              value={profile.newPassword}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => void saveProfile()}
            disabled={saving}
            className={primaryButton}
          >
            Save profile
          </button>
        </div>
        <FeedbackLine feedback={profileFeedback} />
      </section>
    </>
  );
}
