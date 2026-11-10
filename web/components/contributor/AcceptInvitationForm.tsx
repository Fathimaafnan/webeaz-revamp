"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { inputClass, labelClass, primaryButton } from "@/components/admin/api";

/**
 * Password setup for an approved contributor. The invitation token is
 * validated server-side before this form renders; submitting hashes
 * the password (cost 12), activates the account and marks the
 * invitation used — atomically.
 */
export default function AcceptInvitationForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const next: { password?: string; confirmPassword?: string } = {};
    if (Array.from(password).length < 12 || Buffer.byteLength(password, "utf8") > 72) {
      next.password = "Password must be at least 12 characters and no more than 72 UTF-8 bytes.";
    }
    if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    try {
      const res = await fetch("/api/contributor/accept-invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const payload: unknown = await res.json().catch(() => null);
      if (
        res.ok &&
        payload &&
        typeof payload === "object" &&
        (payload as { ok?: unknown }).ok === true
      ) {
        setDone(true);
        return;
      }
      const message =
        payload && typeof payload === "object" && "error" in payload
          ? String((payload as { error: unknown }).error)
          : "Something went wrong. Please try again.";
      setError(message);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="space-y-5">
        <p className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">
          Your WebEaz Contributor account is ready. You can now log in.
        </p>
        <Link href="/user/login" className={`${primaryButton} w-full`}>
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {error ? (
        <div role="alert" className="rounded-lg border border-brand-orange/40 bg-brand-orange/10 px-4 py-3 text-sm text-brand-orange-light">
          {error}
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="invitation-password">New password *</label>
        <input
          id="invitation-password"
          type={showPasswords ? "text" : "password"}
          autoComplete="new-password"
          className={inputClass}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
          }}
          required
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "invitation-password-error" : "invitation-password-hint"}
        />
        <p id="invitation-password-hint" className="mt-1 text-xs text-white/45">Minimum 12 characters.</p>
        {errors.password ? <p id="invitation-password-error" role="alert" className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
      </div>
      <div>
        <label className={labelClass} htmlFor="invitation-confirm">Confirm password *</label>
        <input
          id="invitation-confirm"
          type={showPasswords ? "text" : "password"}
          autoComplete="new-password"
          className={inputClass}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((current) => ({ ...current, confirmPassword: undefined }));
          }}
          required
          aria-invalid={errors.confirmPassword ? true : undefined}
          aria-describedby={errors.confirmPassword ? "invitation-confirm-error" : undefined}
        />
        {errors.confirmPassword ? <p id="invitation-confirm-error" role="alert" className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p> : null}
      </div>
      <label className="flex items-center gap-2 text-sm text-white/70">
        <input type="checkbox" checked={showPasswords} onChange={(e) => setShowPasswords(e.target.checked)} />
        Show passwords
      </label>
      <button type="submit" disabled={busy} className={`${primaryButton} w-full`}>
        {busy ? "Activating…" : "Activate my account"}
      </button>
    </form>
  );
}
