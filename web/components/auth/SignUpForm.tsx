"use client";

import Link from "next/link";
import { useState } from "react";
import AuthCard from "@/components/ui/AuthCard";
import PasswordField from "@/components/ui/PasswordField";
import TextField from "@/components/ui/TextField";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Sign Up — frontend only. No backend auth is configured, so
 * a valid submit surfaces a clear inline notice instead of
 * pretending to create an account.
 */
export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Full name is required.";
    else if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!emailRe.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Use at least 8 characters.";
    if (!confirm) next.confirm = "Please confirm your password.";
    else if (confirm !== password) next.confirm = "Passwords do not match.";
    return next;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <AuthCard
      eyebrow="Sign Up"
      title="Create Your Account"
      description="Sign up to get started with WebEaz."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-blue-deep transition-colors hover:text-brand-orange-strong hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <TextField
          label="Full Name"
          name="name"
          autoComplete="name"
          placeholder="Your full name"
          value={name}
          onChange={(v) => {
            setName(v);
            setSubmitted(false);
          }}
          onBlur={() => setErrors((p) => ({ ...p, name: validate().name }))}
          error={errors.name}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setSubmitted(false);
          }}
          onBlur={() => setErrors((p) => ({ ...p, email: validate().email }))}
          error={errors.email}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setSubmitted(false);
          }}
          onBlur={() => setErrors((p) => ({ ...p, password: validate().password }))}
          error={errors.password}
        />

        <PasswordField
          label="Confirm Password"
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(v) => {
            setConfirm(v);
            setSubmitted(false);
          }}
          onBlur={() => setErrors((p) => ({ ...p, confirm: validate().confirm }))}
          error={errors.confirm}
        />

        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-brand-orange px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/30 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          Create Account
        </button>

        {submitted ? (
          <p
            role="status"
            className="rounded-xl border border-brand-blue/25 bg-brand-blue-soft px-4 py-3 text-xs leading-5 text-brand-blue-deep"
          >
            Form validated successfully. Account creation is not connected yet
            &mdash; registration will be enabled once a backend is configured.
          </p>
        ) : null}
      </form>
    </AuthCard>
  );
}