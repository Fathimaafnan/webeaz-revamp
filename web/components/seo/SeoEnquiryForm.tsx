"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { enquiryGoals } from "@/lib/seo-page-content";

type Values = {
  name: string;
  email: string;
  company: string;
  website: string;
  location: string;
  goal: string;
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  name: "",
  email: "",
  company: "",
  website: "",
  location: "",
  goal: "",
  message: "",
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const urlRe = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

/**
 * SEO enquiry form.
 *
 * INTEGRATION REQUIREMENT — this project has no backend, no API
 * routes and no server actions, so this form cannot submit
 * anywhere yet. Rather than fake a success message, it validates
 * locally and then tells the visitor plainly that enquiries are
 * currently routed to the contact page, which always works.
 *
 * To wire it up for real, add a route handler at
 * `app/api/seo-enquiry/route.ts` that validates and forwards to a
 * form service (Formspree, Resend, HubSpot, ...), then call it
 * from `submit()` and only show the success state on a 2xx.
 */
export default function SeoEnquiryForm() {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [routed, setRouted] = useState(false);

  const set = (key: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setRouted(false);
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter your work email.";
    else if (!emailRe.test(values.email.trim())) next.email = "Enter a valid email address.";
    if (!values.company.trim()) next.company = "Please enter your company name.";
    if (values.website.trim() && !urlRe.test(values.website.trim()))
      next.website = "Enter a valid website address, e.g. example.com";
    if (!values.location.trim()) next.location = "Please tell us your target market.";
    if (!values.goal) next.goal = "Please choose a primary goal.";
    if (!values.message.trim()) next.message = "Tell us briefly what you need.";
    return next;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setRouted(Object.keys(next).length === 0);
  };

  const field = (
    key: keyof Values,
    label: string,
    type: string,
    placeholder: string,
    autoComplete?: string,
    required = true,
  ) => {
    const id = `${uid}-${key}`;
    const errId = `${id}-err`;
    return (
      <div className="flex flex-col">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue-deep">
          {label}
          {required ? <span className="ml-1 text-brand-orange-strong">*</span> : null}
        </label>
        <input
          id={id}
          name={key}
          type={type}
          value={values[key]}
          onChange={(e) => set(key)(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={errors[key] ? true : undefined}
          aria-describedby={errors[key] ? errId : undefined}
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink transition-colors duration-200 outline-none placeholder:text-muted focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue-deep ${
            errors[key] ? "border-red-500" : "border-control"
          }`}
        />
        {errors[key] ? (
          <p id={errId} className="mt-1.5 text-xs text-red-600">
            {errors[key]}
          </p>
        ) : null}
      </div>
    );
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="card-panel theme-light relative overflow-hidden rounded-2xl border border-line bg-white p-6 sm:p-8"
    >
      <span aria-hidden="true" className="card-seam absolute inset-x-0 top-0" />

      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-strong">
        SEO enquiry
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
        Request your SEO consultation
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted">
        Share a few details and we can review your current search position and
        discuss the priorities worth tackling first.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {field("name", "Full name", "text", "Your name", "name")}
        {field("email", "Work email", "email", "you@company.com", "email")}
        {field("company", "Company name", "text", "Your company", "organization")}
        {field("website", "Website URL", "url", "example.com", "url", false)}
        {field("location", "Target country or location", "text", "e.g. India, UAE, UK", undefined)}
        <div className="flex flex-col">
          <label
            htmlFor={`${uid}-goal`}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue-deep"
          >
            Primary goal<span className="ml-1 text-brand-orange-strong">*</span>
          </label>
          <select
            id={`${uid}-goal`}
            name="goal"
            value={values.goal}
            onChange={(e) => set("goal")(e.target.value)}
            required
            aria-invalid={errors.goal ? true : undefined}
            aria-describedby={errors.goal ? `${uid}-goal-err` : undefined}
            className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink transition-colors duration-200 outline-none focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue-deep ${
              errors.goal ? "border-red-500" : "border-control"
            }`}
          >
            <option value="">Select a goal</option>
            {enquiryGoals.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {errors.goal ? (
            <p id={`${uid}-goal-err`} className="mt-1.5 text-xs text-red-600">
              {errors.goal}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col">
        <label
          htmlFor={`${uid}-message`}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue-deep"
        >
          Message or additional requirements<span className="ml-1 text-brand-orange-strong">*</span>
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder="What would you like to achieve in search?"
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
          className={`mt-2 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-ink transition-colors duration-200 outline-none placeholder:text-muted focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue-deep ${
            errors.message ? "border-red-500" : "border-control"
          }`}
        />
        {errors.message ? (
          <p id={`${uid}-message-err`} className="mt-1.5 text-xs text-red-600">
            {errors.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-brand-orange px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:w-auto"
      >
        Request My SEO Consultation
      </button>

      {/* Honest integration notice — never a fake success message. */}
      {routed ? (
        <div
          role="status"
          className="mt-6 rounded-xl border border-brand-blue/25 bg-brand-blue-soft p-5"
        >
          <p className="text-sm font-semibold text-brand-blue-deep">
            Your details passed validation.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            This form is not yet connected to a submission service, so nothing has
            been sent. To reach the team now, use the contact page — or call the
            number listed there.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            Go to the contact page
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : (
        <p className="mt-5 text-xs leading-5 text-muted">
          Fields marked <span className="text-brand-orange-strong">*</span> are
          required. This form is not yet connected to a submission service — the
          contact page is the working route to reach the WebEaz team today.
        </p>
      )}
    </form>
  );
}