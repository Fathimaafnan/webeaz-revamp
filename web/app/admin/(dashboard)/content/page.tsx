import Link from "next/link";

export const dynamic = "force-dynamic";

const CARDS = [
  { href: "/admin/content/locations", label: "Earth / Globe Locations", note: "Offices, coordinates, maps and markers" },
  { href: "/admin/content/products", label: "Our Products", note: "ERPEaz and DGVerse cards" },
  { href: "/admin/content/logos", label: "Partners & Featured Clients", note: "Both logo groups" },
  { href: "/admin/content/capabilities", label: "What We Do", note: "Capability and solution cards" },
  { href: "/admin/content/case-studies", label: "Our Work", note: "Case study cards" },
  { href: "/admin/content/testimonials", label: "Testimonials", note: "Client quotes and portraits" },
  { href: "/admin/content/faq", label: "FAQ", note: "Homepage questions and answers" },
  { href: "/admin/content/footer", label: "Footer", note: "Links, socials and footer text" },
];

export default function SiteContentHub() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
          WebEaz CMS
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Site Content</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
          Manage homepage content without editing source code. Changes publish to the live pages after saving.
        </p>
      </header>

      <section aria-label="Site content sections" className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-orange/40"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-light">
              Site Content
            </p>
            <h2 className="mt-2 text-xl font-bold text-white group-hover:text-white">
              {c.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">{c.note}</p>
            <span aria-hidden="true" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange-light">
              Open editor <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
