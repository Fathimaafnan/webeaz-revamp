import Link from "next/link";
import type { ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "onDark"
  | "heroPrimary"
  | "heroSecondary"
  | "heroOrange";

const styles: Record<Variant, string> = {
  primary:
    "bg-brand-orange text-ink hover:bg-brand-orange-deep shadow-sm shadow-brand-orange/30",
  secondary:
    "border border-control text-ink hover:border-brand-blue hover:text-brand-blue bg-white",
  ghost: "text-brand-blue hover:text-brand-blue-deep",
  onDark:
    "bg-white text-ink hover:bg-brand-orange-soft",
  // Hero primary — WebEaz blue button with a soft blue
  // glow that gently increases on hover.
  heroPrimary:
    "hero-button border border-white/80 bg-brand-blue text-white shadow-lg shadow-brand-blue/25 hover:bg-brand-blue-deep hover:shadow-glow-blue",
  // Hero secondary — minimal dark outline treatment,
  // transitioning toward WebEaz orange on hover.
  heroSecondary:
    "hero-button border border-white/70 bg-transparent text-white backdrop-blur-sm hover:border-brand-orange-on-dark hover:bg-black/10",
  // Hero orange — WebEaz orange button with a soft orange
  // glow that gently increases on hover.
  heroOrange:
    "hero-button bg-brand-orange text-ink shadow-lg shadow-brand-orange/25 hover:bg-brand-orange-deep hover:shadow-glow-orange",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
};

export default function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
  ariaLabel,
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={`${base} ${styles[variant]} ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
