import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";

const nav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Our Work", href: "/our-work" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const products = [
  { label: "ERPEaz", href: "https://erpeaz.com/" },
  { label: "DGVerse", href: "https://dgverse.org/" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
];

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-brand-blue-chrome text-zinc-200">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/webeaz-logo.png"
              alt="WebEaz"
              width={1746}
              height={483}
              unoptimized
              className="h-8 w-auto"
            />
            <p className="mt-4 text-sm font-medium text-zinc-100">
              {settings.footerTagline}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6">
              {settings.footerBlurb}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-100">Navigate</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-200 transition-colors hover:text-brand-orange-on-dark hover:underline focus-visible:text-brand-orange-on-dark focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-on-dark"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-100">Products</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {products.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-200 transition-colors hover:text-brand-orange-on-dark hover:underline focus-visible:text-brand-orange-on-dark focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-on-dark"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-100">Legal</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-200 transition-colors hover:text-brand-orange-on-dark hover:underline focus-visible:text-brand-orange-on-dark focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-on-dark"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-100">Follow</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-brand-orange-on-dark hover:underline focus-visible:text-brand-orange-on-dark focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange-on-dark"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-zinc-200 sm:flex-row">
          <p>© {settings.siteName}</p>
          <p>{settings.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
