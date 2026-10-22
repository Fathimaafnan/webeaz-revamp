"use client";

import Link from "next/link";
import { useState } from "react";
import AuthCard from "@/components/ui/AuthCard";
import PasswordField from "@/components/ui/PasswordField";
import TextField from "@/components/ui/TextField";

type Errors = { email?: string; password?: string; form?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Login — frontend only. No backend auth is configured, so
 * a valid submit surfaces a clear inline notice instead of
 * pretending to authenticate.
 */
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!emailRe.test(email.trim())) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Password must be at least 8 characters.";
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
      eyebrow="Login"
      title="Welcome Back"
      description="Login to continue to your account."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-blue-deep transition-colors hover:text-brand-orange-strong hover:underline"
          >
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
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

        <div>
          <PasswordField
            label="Password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setSubmitted(false);
            }}
            onBlur={() => setErrors((p) => ({ ...p, password: validate().password }))}
            error={errors.password}
          />
          <div className="mt-3 flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-xs text-ink/70">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="auth-check focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              />
              Remember me
            </label>
            <Link
              href="/contact"
              className="text-xs font-medium text-brand-blue-deep transition-colors hover:text-brand-orange-strong hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="mt-1 w-full rounded-xl bg-brand-orange px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/30 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          Login
        </button>

        {submitted ? (
          <p
            role="status"
            className="rounded-xl border border-brand-blue/25 bg-brand-blue-soft px-4 py-3 text-xs leading-5 text-brand-blue-deep"
          >
            Form validated successfully. Account sign-in is not connected yet
            &mdash; authentication will be enabled once a backend is configured.
          </p>
        ) : null}
      </form>
    </AuthCard>
  );
}