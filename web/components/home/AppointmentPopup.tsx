"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import styles from "./AppointmentPopup.module.css";

/**
 * Schedule An Appointment — premium popup card.
 *
 * Appears once, only after the visitor has scrolled past the Our Products
 * section. Uses the exact fields/options from the reference form, with
 * client-side validation. Submission reuses the existing /api/contact
 * endpoint so no backend logic is changed.
 */

type FormState = { name: string; email: string; phone: string; services: string; message: string };
type Errors = Partial<Record<keyof FormState, string>>;

const SERVICES = [
  "Website Development",
  "Mobile App Development",
  "Social Media Promotions",
  "ERP Software-ERPEaz",
  "SEM Services",
  "SEO Services",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DISMISSED_KEY = "webeaz.appointment.dismissed";

const initialForm: FormState = { name: "", email: "", phone: "", services: "", message: "" };

export default function AppointmentPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "unavailable" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger once, only after Our Products has passed above the viewport.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY) === "1") return;
    } catch { /* storage unavailable — still allow the popup */ }

    const products = document.querySelector<HTMLElement>('section[aria-label="Our products"]');
    if (!products) return;

    let frame = 0;
    let fired = false;

    const check = () => {
      frame = 0;
      if (fired) return;
      if (products.getBoundingClientRect().bottom < 0) {
        fired = true;
        setVisible(true);
        window.removeEventListener("scroll", schedule);
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const close = () => {
    if (closing) return;
    setClosing(true);
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch { /* ignore */ }
    timer.current = setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 260);
  };

  const onBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close();
  };

  const set = (key: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Please enter your phone number.";
    if (!form.services) next.services = "Please choose a service.";
    if (form.message.length > 2000) next.message = "Keep your message under 2000 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    try {
      // Reuse the existing contact endpoint — no backend changes. The phone
      // and chosen service are carried in the existing accepted fields.
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.phone.trim(),
          message: `Service: ${form.services}\n\n${form.message.trim()}`,
        }),
      });
      if (res.status === 503) setStatus("unavailable");
      else setStatus("failed");
    } catch {
      setStatus("failed");
    }
  }

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${closing ? styles.closing : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-title"
      onMouseDown={onBackdrop}
    >
      <div className={styles.card} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className={styles.close} onClick={close} aria-label="Close appointment popup">
          ×
        </button>

        <header className={styles.header}>
          <span className={styles.pill}>WEBAEZ · BOOK AN APPOINTMENT</span>
          <h2 id="appointment-title" className={styles.title}>Schedule An Appointment</h2>
          <p className={styles.description}>
            Tell us what you need and our team will get back to you.
          </p>
          <span className={styles.accent} aria-hidden="true" />
        </header>

        <form onSubmit={onSubmit} noValidate className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="appt-name">Name</label>
              <input id="appt-name" type="text" placeholder="Name" value={form.name} onChange={set("name")} className={styles.input} aria-invalid={errors.name ? true : undefined} />
              {errors.name ? <span role="alert" className={styles.error}>{errors.name}</span> : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="appt-email">Email Address</label>
              <input id="appt-email" type="email" placeholder="Email Address" value={form.email} onChange={set("email")} className={styles.input} aria-invalid={errors.email ? true : undefined} />
              {errors.email ? <span role="alert" className={styles.error}>{errors.email}</span> : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="appt-phone">Phone Number</label>
              <input id="appt-phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={set("phone")} className={styles.input} aria-invalid={errors.phone ? true : undefined} />
              {errors.phone ? <span role="alert" className={styles.error}>{errors.phone}</span> : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="appt-services">Choose Our Services</label>
              <select id="appt-services" value={form.services} onChange={set("services")} className={`${styles.input} ${styles.select}`} aria-invalid={errors.services ? true : undefined}>
                <option value="" disabled>Choose Our Services</option>
                {SERVICES.map((service) => <option key={service} value={service}>{service}</option>)}
              </select>
              {errors.services ? <span role="alert" className={styles.error}>{errors.services}</span> : null}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="appt-message">Write a Message</label>
            <textarea id="appt-message" rows={4} placeholder="Write a Message" value={form.message} onChange={set("message")} className={`${styles.input} ${styles.textarea}`} aria-invalid={errors.message ? true : undefined} />
            {errors.message ? <span role="alert" className={styles.error}>{errors.message}</span> : null}
          </div>

          {status === "unavailable" ? (
            <p role="alert" className={styles.notice}>
              Thank you for your details — enquiry delivery is not yet configured, so this message has not been sent. Please contact us through the channels on the page.
            </p>
          ) : null}
          {status === "failed" ? (
            <p role="alert" className={styles.notice}>Something went wrong. Please try again.</p>
          ) : null}

          <button type="submit" disabled={status === "sending"} className={styles.submit}>
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
