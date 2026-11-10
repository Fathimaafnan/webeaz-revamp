"use client";

import { useCallback, useState } from "react";
import {
  apiGet,
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";

export type BlogUserRow = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  postCount: number;
  applicationId: number | null;
  latestInvitation: {
    id: number;
    expiresAt: string;
    usedAt: string | null;
    revokedAt: string | null;
    sentStatus: string;
    sentAt: string | null;
    deliveryError: string | null;
  } | null;
};

const emptyCreate = { name: "", email: "", password: "" };

export default function BlogUsersManager({ initialUsers = [] }: { initialUsers?: BlogUserRow[] }) {
  const [users, setUsers] = useState<BlogUserRow[]>(initialUsers);
  const [form, setForm] = useState(emptyCreate);
  const [resetPasswordFor, setResetPasswordFor] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  const refresh = useCallback(async () => {
    const result = await apiGet<{ users: BlogUserRow[] }>("/api/admin/blog-users");
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setUsers(result.data.users);
  }, []);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    const result = await apiSend("/api/admin/blog-users", "POST", form);
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setForm(emptyCreate);
    setFeedback("Account created. The contributor can now sign in at /user/login.");
    setFeedbackError(false);
    await refresh();
  }

  async function setActive(user: BlogUserRow, isActive: boolean) {
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/blog-users/${user.id}`, "PATCH", { isActive });
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback(isActive ? `${user.name} activated.` : `${user.name} deactivated. Existing sessions stop working immediately.`);
    setFeedbackError(false);
    await refresh();
  }

  async function resetPasswordSubmit(user: BlogUserRow) {
    if (!resetPassword) {
      setFeedback("Enter a new password.");
      setFeedbackError(true);
      return;
    }
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/blog-users/${user.id}/reset-password`, "POST", {
      password: resetPassword,
    });
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setResetPassword("");
    setResetPasswordFor(null);
    setFeedback(`Password reset for ${user.name}.`);
    setFeedbackError(false);
  }

  async function remove(user: BlogUserRow) {
    if (!window.confirm(`Delete the account “${user.name}” (${user.email})? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/blog-users/${user.id}`, "DELETE");
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback(`Account deleted (${result.data.deletedPosts} unpublished draft(s) removed with it).`);
    setFeedbackError(false);
    await refresh();
  }

  async function resendInvitation(user: BlogUserRow) {
    if (!user.applicationId) {
      setFeedback("This account has no linked application invitation to resend.");
      setFeedbackError(true);
      return;
    }
    setBusy(true);
    setFeedback("");
    const result = await apiSend(
      `/api/admin/contributor-applications/${user.applicationId}/resend`,
      "POST",
      {},
    );
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback(
      result.data.invitationSent
        ? `Invitation resent and accepted by the provider for ${user.name}.`
        : `Resend recorded for ${user.name}, but delivery failed (${(result.data as { emailError?: string }).emailError ?? "not configured"}).`,
    );
    setFeedbackError(!result.data.invitationSent);
    await refresh();
  }

  return (
    <div className="space-y-6">
      {feedback ? (
        <p role={feedbackError ? "alert" : "status"} className={`rounded-lg border px-3 py-2 text-sm ${feedbackError ? "border-red-300/20 bg-red-500/10 text-red-100" : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"}`}>
          {feedback}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)]">
        <section aria-label="Create account" className={panelClass}>
          <h2 className="font-semibold text-white">Create BlogUser</h2>
          <p className="mt-1 text-xs text-white/50">
            Accounts are created only here. There is no public signup.
          </p>
          <form onSubmit={create} className="mt-4 space-y-4">
            <div>
              <label className={labelClass} htmlFor="account-name">Name</label>
              <input
                id="account-name"
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                required maxLength={80} disabled={busy}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="account-email">Email</label>
              <input
                id="account-email"
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))}
                required disabled={busy}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="account-password">Password (12+ chars)</label>
              <input
                id="account-password"
                type="password"
                autoComplete="new-password"
                className={inputClass}
                value={form.password}
                onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
                required disabled={busy}
              />
            </div>
            <button type="submit" disabled={busy} className={primaryButton}>
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>
        </section>

        <section aria-label="Accounts" className={panelClass}>
          <h2 className="font-semibold text-white">Accounts</h2>
          {users.length === 0 ? (
            <p role="status" className="mt-4 rounded-lg border border-white/10 bg-black/10 p-4 text-sm text-white/60">
              No blog contributor accounts exist yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {users.map((user) => (
                <div key={user.id} className="rounded-xl border border-white/10 bg-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-white/45">{user.email}</p>
                      <p className="text-xs text-white/45">
                        {user.isActive ? "Active" : "Deactivated"} · {user.postCount} blog(s) · joined{" "}
                        {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(user.createdAt))}
                      </p>
                      {user.applicationId && !user.isActive ? (
                        <p className="mt-1 text-xs text-white/45">
                          Invitation: {user.latestInvitation?.sentStatus ?? "Pending"}
                          {user.latestInvitation?.deliveryError ? ` — ${user.latestInvitation.deliveryError}` : ""}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => void setActive(user, !user.isActive)} disabled={busy} className={secondaryButton}>
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                      {user.applicationId && !user.isActive ? (
                        <button type="button" onClick={() => void resendInvitation(user)} disabled={busy} className={secondaryButton}>
                          Resend invitation
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setResetPasswordFor(resetPasswordFor === user.id ? null : user.id)}
                        disabled={busy}
                        className={secondaryButton}
                      >
                        Reset password
                      </button>
                      <button type="button" onClick={() => void remove(user)} disabled={busy} className={`${secondaryButton} text-red-100`}>
                        Delete
                      </button>
                    </div>
                  </div>
                  {resetPasswordFor === user.id ? (
                    <div className="mt-3 flex flex-wrap items-end gap-2">
                      <div className="min-w-56 flex-1">
                        <label className={labelClass} htmlFor={`reset-${user.id}`}>New password</label>
                        <input
                          id={`reset-${user.id}`}
                          type="password"
                          autoComplete="new-password"
                          className={inputClass}
                          value={resetPassword}
                          onChange={(e) => setResetPassword(e.target.value)}
                          disabled={busy}
                        />
                      </div>
                      <button type="button" onClick={() => void resetPasswordSubmit(user)} disabled={busy} className={primaryButton}>
                        Set password
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
