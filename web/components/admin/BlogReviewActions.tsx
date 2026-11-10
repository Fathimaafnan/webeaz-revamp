"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiSend, primaryButton, secondaryButton } from "@/components/admin/api";

export default function BlogReviewActions({
  revisionId,
  proposedSlug,
}: {
  revisionId: number;
  proposedSlug: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [slugChange, setSlugChange] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  async function approve() {
    if (slugChange && slugChange.trim().toLowerCase() === proposedSlug.toLowerCase()) {
      setFeedback("The new slug is the same as the current one — leave it blank for no slug change.");
      setFeedbackError(true);
      return;
    }
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/blogs/reviews/${revisionId}/approve`, "POST", {
      ...(slugChange.trim() ? { slugChange: slugChange.trim() } : {}),
    });
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback("Approved and published.");
    setFeedbackError(false);
    router.refresh();
  }

  async function returnForCorrection() {
    if (!reason.trim()) {
      setFeedback("A return reason is required.");
      setFeedbackError(true);
      return;
    }
    setBusy(true);
    setFeedback("");
    const result = await apiSend(`/api/admin/blogs/reviews/${revisionId}/return`, "POST", {
      reason: reason.trim(),
    });
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback("Returned to the author for correction.");
    setFeedbackError(false);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {feedback ? (
        <p role={feedbackError ? "alert" : "status"} className={`rounded-lg border px-3 py-2 text-sm ${feedbackError ? "border-red-300/20 bg-red-500/10 text-red-100" : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"}`}>
          {feedback}
        </p>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-black/10 p-4">
        <h3 className="font-semibold text-white">Approve</h3>
        <p className="mt-1 text-xs text-white/50">
          Publishes the proposal to the live site. Optionally change the slug at
          the same time — the old URL redirects permanently.
        </p>
        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-white/60" htmlFor="review-slug-change">
          New slug (optional)
        </label>
        <input
          id="review-slug-change"
          className="mt-1 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-2 focus:outline-offset-1 focus:outline-brand-orange"
          value={slugChange}
          onChange={(e) => setSlugChange(e.target.value)}
          placeholder={`current: ${proposedSlug}`}
          maxLength={120}
          disabled={busy}
        />
        <button type="button" onClick={() => void approve()} disabled={busy} className={`${primaryButton} mt-3`}>
          {busy ? "Working…" : "Approve and publish"}
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/10 p-4">
        <h3 className="font-semibold text-white">Return for correction</h3>
        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-white/60" htmlFor="review-reason">
          Reason (required)
        </label>
        <textarea
          id="review-reason"
          className="mt-1 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-2 focus:outline-offset-1 focus:outline-brand-orange"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={2000}
          disabled={busy}
        />
        <button type="button" onClick={() => void returnForCorrection()} disabled={busy} className={`${secondaryButton} mt-3 text-red-100`}>
          {busy ? "Working…" : "Return submission"}
        </button>
      </div>
    </div>
  );
}
