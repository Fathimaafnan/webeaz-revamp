import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";

const channels = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
];

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact WebEaz Technologies to discuss your technology, digital growth, automation or AI goals.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Let's Build What's Next."
      description="Have a business challenge, digital idea or transformation goal? Reach out through any of our channels and we'll start a conversation."
    >
      <div className="mt-10 rounded-2xl border border-line bg-surface p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-blue">
          Reach us on
        </p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-control bg-white px-5 py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange-strong hover:text-brand-orange-strong"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          A direct contact form is being added to this page. In the meantime, any
          channel above reaches the WebEaz team.
        </p>
      </div>
      <div className="mt-10">
        <Button href="/" variant="secondary">
          ← Back to homepage
        </Button>
      </div>
    </PageShell>
  );
}
