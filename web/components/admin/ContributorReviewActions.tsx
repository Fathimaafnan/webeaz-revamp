"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiSend, primaryButton, secondaryButton, inputClass, labelClass } from "@/components/admin/api";

export default function ContributorReviewActions({
  applicationId,
  status,
  invitationSentStatus,
}: {
  applicationId: number;
  status: string;
  invitationSentStatus: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);
  const [approvedBlogUserId, setApprovedBlogUserId] = useState<number | null>(null);

  async function approve() {
    if (!window.confirm("Approve this application and create the contributor account?")) return;
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/contributor-applications/${applicationId}/approve`, "POST", {});
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback(
      result.data.invitationSent
        ? "Approved. The invitation email was accepted by the provider."
        : `Approved, but the invitation email could not be sent (${(result.data as { emailError?: string }).emailError ?? "not configured"}). Use resend once fixed.`,
    );
    setFeedbackError(!result.data.invitationSent);
    setApprovedBlogUserId((result.data as { blogUserId?: number }).blogUserId ?? null);
    router.refresh();
  }

  async function reject() {
    if (!reason.trim()) {
      setFeedback("A rejection reason is required.");
      setFeedbackError(true);
      return;
    }
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/contributor-applications/${applicationId}/reject`, "POST", {
      reason: reason.trim(),
    });
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback("Application rejected.");
    setFeedbackError(false);
    router.refresh();
  }

  async function resend() {
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/contributor-applications/${applicationId}/resend`, "POST", {});
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback(
      result.data.invitationSent
        ? "Invitation resent and accepted by the provider."
        : `Invitation resent attempt recorded, but delivery failed (${(result.data as { emailError?: string }).emailError ?? "not configured"}).`,
    );
    setFeedbackError(!result.data.invitationSent);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {feedback ? (
        <div role={feedbackError ? "alert" : "status"} className={`rounded-lg border px-3 py-2 text-sm ${feedbackError ? "border-red-300/20 bg-red-500/10 text-red-100" : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"}`}>
          <p>{feedback}</p>
          {approvedBlogUserId !== null ? (
            <p className="mt-2">
              <Link href="/admin/blog-users" className="font-semibold text-emerald-100 underline underline-offset-4">
                View the new account in Blog Users →
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {status === "PENDING" ? (
        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <h3 className="font-semibold text-white">Decision</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="button" onClick={() => void approve()} disabled={busy} className={primaryButton}>
              {busy ? "Working…" : "Approve & invite"}
            </button>
          </div>
          <label className={`${labelClass} mt-4`} htmlFor="contributor-reject-reason">Rejection reason *</label>
          <textarea
            id="contributor-reject-reason"
            className={inputClass}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            maxLength={2000}
            disabled={busy}
          />
          <button type="button" onClick={() => void reject()} disabled={busy} className={`${secondaryButton} mt-3 text-red-100`}>
            Reject application
          </button>
        </div>
      ) : null}

      {status === "APPROVED" && invitationSentStatus !== "ACCEPTED" ? (
        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <h3 className="font-semibold text-white">Invitation delivery</h3>
          <p className="mt-1 text-sm text-white/60">
            Current delivery status: <strong className="text-white">{invitationSentStatus === "FAILED" ? "Failed" : "Pending"}</strong>
          </p>
          <button type="button" onClick={() => void resend()} disabled={busy} className={`${secondaryButton} mt-3`}>
            {busy ? "Working…" : "Resend invitation"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
