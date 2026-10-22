import Image from "next/image";
import Link from "next/link";

const nav = [
  { label: "Solutions", href: "/solutions" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Our Work", href: "/our-work" },
  { label: "Company", href: "/company" },
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

export default function Footer() {
  return (
    <footer className="bg-brand-blue-chrome text-zinc-200">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/webeaz-logo-white.png"
              alt="WebEaz"
              width={185}
              height={53}
              unoptimized
              className="h-8 w-auto"
            />
            <p className="mt-4 text-sm font-medium text-zinc-100">
              Technology • Digital Growth • Automation • AI
            </p>
            <p className="mt-3 max-w-xs text-sm leading-6">
              Technology and digital solutions that help businesses build,
              transform, automate and grow.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-100">Navigate</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-zinc-200 transition-colors hover:text-brand-orange">
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
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-zinc-200 transition-colors hover:text-brand-orange">
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-100">Legal</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-zinc-200 transition-colors hover:text-brand-orange">
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
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-brand-blue">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-zinc-200 sm:flex-row">
          <p>© WebEaz Technologies Pvt. Ltd.</p>
          <p>Built for the future of business technology.</p>
        </div>
      </div>
    </footer>
  );
}
