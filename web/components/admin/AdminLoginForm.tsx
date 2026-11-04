"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type AdminLoginFormProps = {
  /** Where to send the user after a successful sign in. */
  redirectTo?: string;
};

export default function AdminLoginForm({
  redirectTo = "/admin",
}: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setPending(true);
    try {
      const result = await signIn("credentials", {
        email: trimmedEmail,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
      noValidate
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">Admin Sign In</h1>
        <p className="mt-2 text-sm text-white/70">
          WebEaz CMS · Authorized access only
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-brand-orange/40 bg-brand-orange/10 px-4 py-3 text-sm text-brand-orange-light"
        >
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-2 block text-sm font-medium text-white/90"
          >
            Email
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-blue-bright"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-2 block text-sm font-medium text-white/90"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-blue-bright"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-white/70 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-brand-orange px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-white/50">
        Authorized personnel only. All sign-in attempts are monitored.
      </p>
    </form>
  );
}
