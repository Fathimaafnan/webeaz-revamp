"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiSend, panelClass, secondaryButton } from "@/components/admin/api";

type PostRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  author: string;
  status: string;
  publishedAt: Date | null;
  updatedAt: Date;
};

type Feedback = { kind: "ok" | "err"; text: string } | null;

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "PUBLISHED"
      ? "bg-emerald-500/15 text-emerald-300"
      : status === "ARCHIVED"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-white/10 text-white/60";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}

export default function BlogList({
  posts,
  canSave,
}: {
  posts: PostRow[];
  canSave: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(posts);
  const [busy, setBusy] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const cycleStatus = async (post: PostRow) => {
    const next =
      post.status === "PUBLISHED" ? "DRAFT" : post.status === "DRAFT" ? "ARCHIVED" : "PUBLISHED";
    setBusy(post.id);
    setFeedback(null);
    try {
      // The editor API needs the full payload, so fetch the post first.
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setFeedback({ kind: "err", text: data?.error || `Could not change status (${res.status}).` });
        return;
      }
      setRows((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: next } : p)));
      setFeedback({
        kind: "ok",
        text: `“${post.title}” is now ${next.toLowerCase()}.`,
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  const remove = async (post: PostRow) => {
    if (
      !window.confirm(
        `Permanently delete “${post.title}”? Its public URL /insights/${post.slug} will stop working. This cannot be undone.`,
      )
    ) {
      return;
    }
    setBusy(post.id);
    setFeedback(null);
    try {
      const result = await apiSend(`/api/admin/blog/${post.id}`, "DELETE");
      if (!result.ok) {
        setFeedback({ kind: "err", text: result.error });
        return;
      }
      setRows((prev) => prev.filter((p) => p.id !== post.id));
      setFeedback({ kind: "ok", text: `“${post.title}” deleted.` });
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  if (rows.length === 0) {
    return (
      <section className={panelClass}>
        <p className="text-sm text-white/60">
          {canSave
            ? "No posts yet. Create the first one with “New post”."
            : "Posts cannot be listed while the database is unreachable."}
        </p>
        {feedback ? (
          <p
            role="status"
            className={`mt-3 rounded-lg px-4 py-3 text-sm ${
              feedback.kind === "ok"
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-red-500/15 text-red-300"
            }`}
          >
            {feedback.text}
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <>
      <section className={panelClass}>
        <ul className="divide-y divide-white/10">
          {rows.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{post.title}</p>
                <p className="truncate text-xs text-white/50">
                  {post.category} · {post.author} · /insights/{post.slug}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={post.status} />
                <Link
                  href={`/admin/blog/${post.id}`}
                  className={secondaryButton}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => void cycleStatus(post)}
                  disabled={busy === post.id}
                  className={secondaryButton}
                >
                  {post.status === "PUBLISHED"
                    ? "Unpublish"
                    : post.status === "DRAFT"
                      ? "Archive"
                      : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => void remove(post)}
                  disabled={busy === post.id}
                  className="inline-flex items-center justify-center rounded-lg border border-red-400/40 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {feedback ? (
        <p
          role="status"
          className={`rounded-lg px-4 py-3 text-sm ${
            feedback.kind === "ok"
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-red-500/15 text-red-300"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </>
  );
}
