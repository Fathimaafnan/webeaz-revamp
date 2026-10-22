"use client";

import { useId, useState } from "react";

type Props = {
  label: string;
  name: string;
  autoComplete?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
};

/**
 * Password input with an inline show/hide toggle. Purely
 * presentational — validation state is owned by the form.
 */
export default function PasswordField({
  label,
  name,
  autoComplete = "current-password",
  error,
  value,
  onChange,
  onBlur,
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const id = useId();
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-ink/70"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={revealed ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`w-full rounded-xl border bg-white px-4 py-3 pr-16 text-sm text-ink shadow-[0_1px_2px_0_rgba(11,90,150,0.06)] outline-none transition-all duration-200 placeholder:text-muted focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(16,118,188,0.14)] ${
            error
              ? "border-red-500"
              : "border-line hover:border-brand-blue/45"
          }`}
        />
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-label={revealed ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={revealed}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted transition-colors duration-200 hover:bg-brand-orange-soft hover:text-brand-orange-strong focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-blue"
        >
          {revealed ? "Hide" : "Show"}
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}