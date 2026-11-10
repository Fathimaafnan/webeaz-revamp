"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  apiSend,
  inputClass,
  labelClass,
  panelClass,
  primaryButton,
  secondaryButton,
} from "@/components/admin/api";

export type BlogEditorInitial = {
  id: number | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  author: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export default function BlogEditor({
  initial,
  slugLocked,
  locked,
  lockedMessage,
}: {
  initial: BlogEditorInitial;
  slugLocked: boolean;
  locked: boolean;
  lockedMessage?: string;
}) {
  const [form, setForm] = useState({ ...initial });
  const [busy, setBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);
  const router = useRouter();

  const setField = <K extends keyof BlogEditorInitial>(key: K, value: BlogEditorInitial[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleTitle = (value: string) => {
    setForm((current) => {
      const next = { ...current, title: value };
      // Mirror the server slugifier while the author is typing a new
      // title (create/edit of unpublished posts only).
      if (!slugLocked && !current.slug) next.slug = slugifyTitle(value);
      return next;
    });
  };

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setUploadBusy(true);
    setFeedback("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/user/blogs/upload", {
        method: "POST",
        body: data,
      });
      const payload: unknown = await res.json().catch(() => null);
      if (!res.ok || !payload || typeof payload !== "object" || !("ok" in payload)) {
        throw new Error(
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "Upload failed.",
        );
      }
      const body = (payload as unknown as { data: { url: string } }).data;
      setField("coverImage", body.url);
      setFeedback("Image uploaded.");
      setFeedbackError(false);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Upload failed.");
      setFeedbackError(true);
    } finally {
      setUploadBusy(false);
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    const result = await apiSend(
      form.id === null ? "/api/user/blogs" : `/api/user/blogs/${form.id}`,
      form.id === null ? "POST" : "PATCH",
      {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        coverImage: form.coverImage,
        author: form.author,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
      },
    );
    setBusy(false);
    if (!result.ok) {
      setFeedback(result.error);
      setFeedbackError(true);
      return;
    }
    setFeedback(form.id === null ? "Draft created." : "Saved.");
    setFeedbackError(false);
    router.push("/user/blogs");
    router.refresh();
  }

  const disabled = busy || locked;

  return (
    <form onSubmit={handleSave} className={panelClass}>
      <h2 className="font-semibold text-white">
        {form.id === null ? "New blog draft" : "Edit blog"}
      </h2>
      <p className="mt-1 text-xs text-white/50">
        Drafts stay private until an administrator approves them. Saving never
        publishes on its own.
      </p>

      {locked ? (
        <p role="status" className="mt-4 rounded-lg border border-amber-300/20 bg-amber-500/5 p-3 text-sm text-amber-100">
          {lockedMessage ?? "This blog is under review and cannot be edited. Withdraw the submission first."}
        </p>
      ) : null}
      {feedback ? (
        <p role={feedbackError ? "alert" : "status"} className={`mt-4 rounded-lg border px-3 py-2 text-sm ${feedbackError ? "border-red-300/20 bg-red-500/10 text-red-100" : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100"}`}>
          {feedback}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="blog-title">Title</label>
          <input id="blog-title" className={inputClass} value={form.title} onChange={(e) => handleTitle(e.target.value)} required maxLength={200} disabled={disabled} />
        </div>
        <div>
          <label className={labelClass} htmlFor="blog-slug">Slug{slugLocked ? " (locked — published)" : ""}</label>
          <input
            id="blog-slug"
            className={inputClass}
            value={form.slug}
            onChange={(e) => setField("slug", e.target.value)}
            required={!slugLocked}
            maxLength={120}
            disabled={disabled || slugLocked}
          />
          {slugLocked ? (
            <p className="mt-1 text-xs text-white/50">Published slugs are locked. An administrator can change them on approval.</p>
          ) : (
            <p className="mt-1 text-xs text-white/50">Lowercase letters, numbers and dashes.</p>
          )}
        </div>
        <div>
          <label className={labelClass} htmlFor="blog-category">Category</label>
          <input id="blog-category" className={inputClass} value={form.category} onChange={(e) => setField("category", e.target.value)} maxLength={60} disabled={disabled} />
        </div>
        <div>
          <label className={labelClass} htmlFor="blog-author">Author</label>
          <input id="blog-author" className={inputClass} value={form.author} onChange={(e) => setField("author", e.target.value)} maxLength={80} disabled={disabled} />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="blog-excerpt">Excerpt</label>
        <textarea id="blog-excerpt" className={inputClass} value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value)} maxLength={500} rows={3} disabled={disabled} />
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor="blog-content">Content (Markdown)</label>
        <textarea id="blog-content" className={inputClass} value={form.content} onChange={(e) => setField("content", e.target.value)} rows={12} disabled={disabled} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="blog-cover">Cover image URL</label>
          <input id="blog-cover" className={inputClass} value={form.coverImage ?? ""} onChange={(e) => setField("coverImage", e.target.value || null)} maxLength={400} disabled={disabled} />
          <div className="mt-2">
            <label className={labelClass} htmlFor="blog-upload">Upload image file</label>
            <input id="blog-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => void handleUpload(e.target.files?.[0])} disabled={disabled || uploadBusy} className="mt-1 w-full text-sm text-white/70" />
            {uploadBusy ? <p className="mt-1 text-xs text-white/50">Uploading…</p> : null}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="blog-seo-title">SEO title</label>
            <input id="blog-seo-title" className={inputClass} value={form.seoTitle ?? ""} onChange={(e) => setField("seoTitle", e.target.value || null)} maxLength={150} disabled={disabled} />
          </div>
          <div>
            <label className={labelClass} htmlFor="blog-seo-desc">SEO description</label>
            <textarea id="blog-seo-desc" className={inputClass} value={form.seoDescription ?? ""} onChange={(e) => setField("seoDescription", e.target.value || null)} maxLength={300} rows={3} disabled={disabled} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={disabled} className={primaryButton}>
          {busy ? "Saving…" : form.id === null ? "Save draft" : "Save changes"}
        </button>
        <button type="button" onClick={() => router.push("/user/blogs")} disabled={busy} className={secondaryButton}>
          Back to My Blogs
        </button>
      </div>
    </form>
  );
}
