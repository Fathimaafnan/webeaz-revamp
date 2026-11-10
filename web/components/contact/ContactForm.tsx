"use client";

import { useState, type FormEvent } from "react";

type Errors = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact enquiry form. Validation mirrors the server exactly; the
 * server currently has no email delivery integration, so a *valid*
 * submission receives an honest 503 notice — not a fake "sent"
 * confirmation. See app/api/contact/route.ts.
 */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "accepted" | "unavailable" | "failed">("idle");

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (!form.email.trim()) next.email = "Please enter a valid email address.";
    else if (!emailRe.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (form.company.trim().length > 100) next.company = "Keep the company name under 100 characters.";
    if (!form.message.trim()) next.message = "Please include a few details about your project.";
    else if (form.message.trim().length > 2000) next.message = "Keep your message under 2000 characters.";
    return next;
  };

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: e.target.value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const rest: Errors = { ...current };
      delete rest[key];
      return rest;
    });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          message: form.message.trim(),
        }),
      });
      const payload: unknown = await res.json().catch(() => null);
      if (res.status === 503) {
        setStatus("unavailable");
      } else if (res.ok && payload && typeof payload === "object" && "ok" in payload) {
        setStatus("accepted");
      } else if (
        res.status === 400 &&
        payload && typeof payload === "object" && "errors" in payload &&
        typeof (payload as { errors: unknown }).errors === "object"
      ) {
        // Server-side validation rejected the submission: surface the
        // returned field errors next to their fields.
        const serverErrors = (payload as { errors: Record<string, unknown> }).errors;
        setErrors({
          name: typeof serverErrors.name === "string" ? serverErrors.name : undefined,
          email: typeof serverErrors.email === "string" ? serverErrors.email : undefined,
          company: typeof serverErrors.company === "string" ? serverErrors.company : undefined,
          message: typeof serverErrors.message === "string" ? serverErrors.message : undefined,
        });
        setStatus("failed");
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-control bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand-blue";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-muted";

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="contact-name">Name *</label>
            <input id="contact-name" className={inputClass} value={form.name} onChange={set("name")} required aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? "contact-name-error" : undefined} />
            {errors.name ? <p id="contact-name-error" role="alert" className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="contact-email">Email *</label>
            <input id="contact-email" type="email" className={inputClass} value={form.email} onChange={set("email")} required aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? "contact-email-error" : undefined} />
            {errors.email ? <p id="contact-email-error" role="alert" className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-company">Company (optional)</label>
          <input id="contact-company" className={inputClass} value={form.company} onChange={set("company")} maxLength={100} aria-invalid={errors.company ? true : undefined} aria-describedby={errors.company ? "contact-company-error" : undefined} />
          {errors.company ? <p id="contact-company-error" role="alert" className="mt-1 text-xs text-red-600">{errors.company}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-message">What are you hoping to build or improve? *</label>
          <textarea id="contact-message" className={inputClass} value={form.message} onChange={set("message")} rows={5} required aria-invalid={errors.message ? true : undefined} aria-describedby={errors.message ? "contact-message-error" : undefined} />
          {errors.message ? <p id="contact-message-error" role="alert" className="mt-1 text-xs text-red-600">{errors.message}</p> : null}
        </div>

        {status === "unavailable" ? (
          <p role="alert" className="rounded-lg border border-line bg-surface p-4 text-sm leading-6 text-muted">
            Thank you for your details — the form thinks so far, but delivery to the
            WebEaz inbox is <strong>not yet wired up</strong>, so this message has
            <strong> not been sent</strong>. Please use one of the channels below
            instead, and we’ll get back to you.
          </p>
        ) : null}
        {status === "accepted" ? (
          <p role="status" aria-live="polite" className="rounded-lg border border-line bg-surface p-4 text-sm text-ink">
            Message sent successfully! Thank you for contacting WebEaz. We will get back to you soon.
          </p>
        ) : null}
        {status === "failed" && Object.keys(errors).length === 0 ? (
          <p role="alert" className="rounded-lg border border-line bg-surface p-4 text-sm text-red-600">
            Something went wrong sending your enquiry. Please try again or use a channel below.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-lg bg-brand-orange px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </form>
    </div>
  );
}
