"use client";

import { useState, type FormEvent } from "react";

type Errors = {
  fullName?: string;
  email?: string;
  professionalRole?: string;
  company?: string;
  bio?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  contributionReason?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function optionalUrlOk(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Become-a-Contributor application form. No password or role is ever
 * asked for; an approved applicant receives a one-time invitation link
 * by email instead. Duplicate submissions are prevented client-side
 * (busy state) and server-side (pending-email constraint + notice).
 */
export default function ContributorApplyForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    professionalRole: "",
    company: "",
    bio: "",
    linkedInUrl: "",
    portfolioUrl: "",
    contributionReason: "",
    website: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: e.target.value }));
    setErrors((current) => {
      const field = key as keyof Errors;
      if (!current[field]) return current;
      const rest: Errors = { ...current };
      delete rest[field];
      return rest;
    });
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.fullName.trim()) next.fullName = "Your full name is required.";
    if (!form.email.trim()) next.email = "Your email is required.";
    else if (!emailRe.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.professionalRole.trim()) next.professionalRole = "Your professional role is required.";
    if (form.company.trim().length > 100) next.company = "Keep the company name under 100 characters.";
    if (!form.bio.trim()) next.bio = "A short professional bio is required.";
    else if (form.bio.trim().length > 2000) next.bio = "Keep your bio under 2000 characters.";
    if (!optionalUrlOk(form.linkedInUrl)) next.linkedInUrl = "Enter a valid LinkedIn URL.";
    if (!optionalUrlOk(form.portfolioUrl)) next.portfolioUrl = "Enter a valid website URL.";
    if (!form.contributionReason.trim()) {
      next.contributionReason = "Tell us why you want to contribute.";
    } else if (form.contributionReason.trim().length > 2000) {
      next.contributionReason = "Keep this under 2000 characters.";
    }
    return next;
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    try {
      const res = await fetch("/api/contributor-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          professionalRole: form.professionalRole.trim(),
          company: form.company.trim(),
          bio: form.bio.trim(),
          linkedInUrl: form.linkedInUrl.trim(),
          portfolioUrl: form.portfolioUrl.trim(),
          contributionReason: form.contributionReason.trim(),
          website: form.website,
        }),
      });
      const payload: unknown = await res.json().catch(() => null);
      if (
        res.ok &&
        payload &&
        typeof payload === "object" &&
        (payload as { ok?: unknown }).ok === true
      ) {
        setSubmitted(true);
      } else {
        const message =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "Could not submit your application. Please try again.";
        setFormError(message);
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-control bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand-blue";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-muted";

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl border border-line bg-white p-8">
        <h2 className="text-xl font-semibold tracking-tight text-ink">
          Application received.
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Thank you for your interest in contributing to WebEaz. Our team reviews
          every application. If approved, you will receive a secure invitation link
          by email to set your contributor password — you can then log in at{" "}
          <a href="/user/login" className="font-semibold text-brand-blue-deep underline underline-offset-4">
            /user/login
          </a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      ) : null}
      {/* Honeypot — invisible to people; filled only by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contributor-website">Leave this field empty</label>
        <input id="contributor-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contributor-name">Full Name *</label>
          <input id="contributor-name" className={inputClass} value={form.fullName} onChange={set("fullName")} required maxLength={100} aria-invalid={errors.fullName ? true : undefined} aria-describedby={errors.fullName ? "contributor-name-error" : undefined} />
          {errors.fullName ? <p id="contributor-name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.fullName}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="contributor-email">Email Address *</label>
          <input id="contributor-email" type="email" className={inputClass} value={form.email} onChange={set("email")} required aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? "contributor-email-error" : undefined} />
          {errors.email ? <p id="contributor-email-error" role="alert" className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contributor-role">Professional Role / Designation *</label>
          <input id="contributor-role" className={inputClass} value={form.professionalRole} onChange={set("professionalRole")} required maxLength={120} placeholder="e.g. Frontend Developer" aria-invalid={errors.professionalRole ? true : undefined} aria-describedby={errors.professionalRole ? "contributor-role-error" : undefined} />
          {errors.professionalRole ? <p id="contributor-role-error" role="alert" className="mt-1 text-xs text-red-600">{errors.professionalRole}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="contributor-company">Company / Organization (optional)</label>
          <input id="contributor-company" className={inputClass} value={form.company} onChange={set("company")} maxLength={100} aria-invalid={errors.company ? true : undefined} aria-describedby={errors.company ? "contributor-company-error" : undefined} />
          {errors.company ? <p id="contributor-company-error" role="alert" className="mt-1 text-xs text-red-600">{errors.company}</p> : null}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="contributor-bio">Short Professional Bio *</label>
        <textarea id="contributor-bio" className={inputClass} value={form.bio} onChange={set("bio")} rows={4} required maxLength={2000} aria-invalid={errors.bio ? true : undefined} aria-describedby={errors.bio ? "contributor-bio-error" : undefined} />
        {errors.bio ? <p id="contributor-bio-error" role="alert" className="mt-1 text-xs text-red-600">{errors.bio}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contributor-linkedin">LinkedIn Profile URL (optional)</label>
          <input id="contributor-linkedin" type="url" className={inputClass} value={form.linkedInUrl} onChange={set("linkedInUrl")} placeholder="https://www.linkedin.com/in/…" aria-invalid={errors.linkedInUrl ? true : undefined} aria-describedby={errors.linkedInUrl ? "contributor-linkedin-error" : undefined} />
          {errors.linkedInUrl ? <p id="contributor-linkedin-error" role="alert" className="mt-1 text-xs text-red-600">{errors.linkedInUrl}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="contributor-portfolio">Portfolio / Personal Website URL (optional)</label>
          <input id="contributor-portfolio" type="url" className={inputClass} value={form.portfolioUrl} onChange={set("portfolioUrl")} placeholder="https://…" aria-invalid={errors.portfolioUrl ? true : undefined} aria-describedby={errors.portfolioUrl ? "contributor-portfolio-error" : undefined} />
          {errors.portfolioUrl ? <p id="contributor-portfolio-error" role="alert" className="mt-1 text-xs text-red-600">{errors.portfolioUrl}</p> : null}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="contributor-reason">Why do you want to contribute to WebEaz? *</label>
        <textarea id="contributor-reason" className={inputClass} value={form.contributionReason} onChange={set("contributionReason")} rows={5} required maxLength={2000} aria-invalid={errors.contributionReason ? true : undefined} aria-describedby={errors.contributionReason ? "contributor-reason-error" : undefined} />
        {errors.contributionReason ? <p id="contributor-reason-error" role="alert" className="mt-1 text-xs text-red-600">{errors.contributionReason}</p> : null}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Submitting…" : "Submit application"}
      </button>
      <p className="text-xs leading-5 text-muted">
        Your application is reviewed by an administrator. If approved, you will
        receive a secure invitation link by email to set your password (48-hour,
        single-use). No account is created until then.
      </p>
    </form>
  );
}
