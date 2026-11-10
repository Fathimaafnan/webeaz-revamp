"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import AuthCard from "@/components/ui/AuthCard";
import PasswordField from "@/components/ui/PasswordField";
import TextField from "@/components/ui/TextField";

type Errors = { email?: string; password?: string; form?: string };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Unified homepage sign-in for Admins and BlogUsers.
 *
 * Uses the shared NextAuth credentials provider; the role comes from
 * the server-issued session (JWT minted only after the database check
 * in lib/auth.ts) — never from the form. After sign-in the role
 * decides the destination: admin → /admin, blog_user → /user/dashboard.
 */
export default function UnifiedLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) next.email = "Please enter a valid email address.";
    else if (!emailRe.test(email.trim())) next.email = "Please enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 8) next.password = "Password must be at least 8 characters.";
    return next;
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (!result?.ok) {
        setErrors({ form: "Invalid email or password. Please try again." });
        return;
      }
      const session = await getSession();
      const role = (session?.user as { role?: string } | undefined)?.role;
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "blog_user") {
        router.push("/user/dashboard");
      } else {
        // Session minted but role unknown — send to user dashboard guard
        // which re-checks the database server-side.
        router.push("/user/dashboard");
      }
      router.refresh();
    } catch {
      setErrors({ form: "Unable to sign in right now. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthCard
      eyebrow="Login"
      title="Welcome Back"
      description="Sign in to your WebEaz account."
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
            setErrors((p) => ({ ...p, form: undefined }));
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
              setErrors((p) => ({ ...p, form: undefined }));
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

        {errors.form ? (
          <p role="alert" className="rounded-xl border border-red-500/30 bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">
            {errors.form}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 w-full rounded-xl bg-brand-orange px-6 py-3.5 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/30 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Login"}
        </button>
      </form>
    </AuthCard>
  );
}
