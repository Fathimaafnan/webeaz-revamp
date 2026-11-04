"use client";

import { useId } from "react";

type Props = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
};

/** Labelled text input used by the auth forms. */
export default function TextField({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  error,
  value,
  onChange,
  onBlur,
}: Props) {
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
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink shadow-[0_1px_2px_0_rgba(11,90,150,0.06)] outline-none transition-all duration-200 placeholder:text-muted focus:border-brand-blue focus:shadow-[0_0_0_4px_rgba(16,118,188,0.14)] ${
          error
            ? "border-red-500"
            : "border-control hover:border-brand-blue"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}