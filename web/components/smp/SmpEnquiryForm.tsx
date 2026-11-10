"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { enquiryGoals } from "@/lib/smp-page-content";

type Values = {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  social: string;
  goals: string[];
  message: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  social: "",
  goals: [],
  message: "",
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const urlRe = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
const phoneRe = /^[+]?[\d\s()-]{7,20}$/;

/**
 * SMP enquiry form.
 *
 * INTEGRATION REQUIREMENT — this project has no backend, no API
 * routes and no server actions, so this form cannot submit anywhere
 * yet. Rather than simulate success, it validates locally and then
 * tells the visitor plainly that nothing was sent, keeping the
 * contact page as the working route.
 *
 * To wire it up: add `app/api/smp-enquiry/route.ts` that validates
 * and forwards to a form service, then call it from `submit()` and
 * only reveal the confirmation on a 2xx response.
 */
export default function SmpEnquiryForm() {
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [routed, setRouted] = useState(false);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setRouted(false);
    setErrors((current) => {
      if (!current[key]) return current;
      const rest: Errors = { ...current };
      delete rest[key];
      return rest;
    });
  };

  const toggleGoal = (g: string) => {
    setValues((v) => ({
      ...v,
      goals: v.goals.includes(g) ? v.goals.filter((x) => x !== g) : [...v.goals, g],
    }));
    setRouted(false);
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please enter your full name.";
    if (!values.email.trim()) next.email = "Please enter a valid email address.";
    else if (!emailRe.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (values.phone.trim() && !phoneRe.test(values.phone.trim()))
      next.phone = "Please enter a valid phone number.";
    if (!values.company.trim()) next.company = "Please enter your company or brand name.";
    if (values.website.trim() && !urlRe.test(values.website.trim()))
      next.website = "Enter a valid website address, e.g. example.com";
    if (values.social.trim() && !urlRe.test(values.social.trim()))
      next.social = "Enter a valid profile URL or leave blank.";
    if (values.goals.length === 0) next.goals = "Choose at least one goal.";
    if (!values.message.trim()) next.message = "Tell us briefly about your goals.";
    return next;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    setRouted(Object.keys(next).length === 0);
  };

  const labelCls =
    "text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue-deep";
  const inputCls = (bad?: string) =>
    `mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink transition-colors duration-200 outline-none placeholder:text-muted focus-visible:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue-deep ${
      bad ? "border-red-500" : "border-control"
    }`;

  const field = (
    key: "name" | "email" | "phone" | "company" | "website" | "social",
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
        <label htmlFor={id} className={labelCls}>
          {label}
          {required ? <span className="ml-1 text-brand-orange-strong">*</span> : null}
        </label>
        <input
          id={id}
          name={key}
          type={type}
          value={values[key]}
          onChange={(e) => set(key, e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={errors[key] ? true : undefined}
          aria-describedby={errors[key] ? errId : undefined}
          className={inputCls(errors[key])}
        />
        {errors[key] ? (
          <p id={errId} className="mt-1.5 text-xs text-red-600">
            {errors[key]}
          </p>
        ) : null}
      </div>
    );
  };

  const goalsId = `${uid}-goals`;
  const goalsErrId = `${goalsId}-err`;

  return (
    <form
      onSubmit={submit}
      noValidate
      className="relative overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <span aria-hidden="true" className="card-seam absolute inset-x-0 top-0" />

      <h2 className="text-2xl font-semibold tracking-tight text-ink">
        Tell Us About Your Business
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        Share your goals with us, and let&apos;s explore the right social media
        strategy for your brand.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {field("name", "Full name", "text", "Your name", "name")}
        {field("email", "Business email", "email", "you@company.com", "email")}
        {field("phone", "Phone number", "tel", "+91 00000 00000", "tel", false)}
        {field("company", "Company / brand name", "text", "Your company", "organization")}
        {field("website", "Website URL", "url", "example.com", "url", false)}
        {field("social", "Social profile URL", "url", "instagram.com/yourbrand", "url", false)}
      </div>

      {/* Multi-select goals */}
      <fieldset className="mt-6" aria-describedby={errors.goals ? goalsErrId : undefined}>
        <legend className={labelCls}>
          Primary goals
          <span className="ml-1 text-brand-orange-strong">*</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {enquiryGoals.map((g) => {
            const on = values.goals.includes(g);
            return (
              <label
                key={g}
                className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-blue ${
                  on
                    ? "border-brand-orange-strong bg-brand-orange text-ink"
                    : "border-control bg-white text-muted hover:border-brand-blue hover:text-ink"
                } ${errors.goals ? "border-red-500" : ""}`}
              >
                <input
                  type="checkbox"
                  name="goals"
                  value={g}
                  checked={on}
                  onChange={() => toggleGoal(g)}
                  className="sr-only"
                />
                {g}
              </label>
            );
          })}
        </div>
        {errors.goals ? (
          <p id={goalsErrId} className="mt-2 text-xs text-red-600">
            {errors.goals}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-6 flex flex-col">
        <label htmlFor={`${uid}-message`} className={labelCls}>
          Message<span className="ml-1 text-brand-orange-strong">*</span>
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="What would you like to achieve on social media?"
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
          className={`${inputCls(errors.message)} resize-y leading-6`}
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
        Request a Social Media Consultation
      </button>

      {/* Honest integration notice — never a fake confirmation. */}
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
            been sent. To reach the team now, use the contact page.
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
          contact page is the working route to reach WebEaz today.
        </p>
      )}
    </form>
  );
}