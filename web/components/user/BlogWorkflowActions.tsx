"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiSend, primaryButton, secondaryButton } from "@/components/admin/api";

export default function BlogWorkflowActions({ blogId }: { blogId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  async function act(kind: "submit" | "withdraw" | "delete") {
    if (kind === "delete" && !window.confirm("Delete this blog? This cannot be undone.")) {
      return;
    }
    setBusy(true);
    setFeedback("");
    const result =
      kind === "delete"
        ? await apiSend(`/api/user/blogs/${blogId}`, "DELETE")
        : await apiSend(`/api/user/blogs/${blogId}/${kind}`, "POST", {});
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    if (kind === "delete") {
      router.push("/user/blogs");
    } else {
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => void act("submit")} disabled={busy} className={primaryButton}>
          {busy ? "Working…" : "Submit for review"}
        </button>
        <button type="button" onClick={() => void act("withdraw")} disabled={busy} className={secondaryButton}>
          Withdraw submission
        </button>
        <button type="button" onClick={() => void act("delete")} disabled={busy} className={`${secondaryButton} text-red-100`}>
          Delete draft
        </button>
      </div>
      {feedback ? (
        <p role={feedbackError ? "alert" : "status"} className={`mt-3 rounded-lg border px-3 py-2 text-sm ${feedbackError ? "border-red-300/20 bg-red-500/10 text-red-100" : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"}`}>
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
