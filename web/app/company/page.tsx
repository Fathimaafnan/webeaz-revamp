import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Company",
  description:
    "WebEaz Technologies Pvt. Ltd. — a technology company helping businesses build, transform, automate and grow.",
  alternates: { canonical: "/company" },
};

export default function CompanyPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="WebEaz Technologies Pvt. Ltd."
      description="WebEaz is a technology company building digital experiences, growth programs, automation and AI solutions for businesses. This page is being updated with our full company story."
    >
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-7">
          <p className="text-3xl font-semibold tracking-tight text-brand-blue">
            <span className="text-brand-orange-strong">10+</span> Years
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            WebEaz Experience
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-7">
          <p className="text-3xl font-semibold tracking-tight text-brand-blue">
            <span className="text-brand-orange-strong">22+</span> Years
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Founder Experience
          </p>
        </div>
      </div>
      <ul className="mt-10 space-y-3 text-sm text-muted">
        <li className="flex items-center gap-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
          Technology • Digital Growth • Automation • AI
        </li>
        <li className="flex items-center gap-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
          Products built by WebEaz:{" "}
          <a href="https://erpeaz.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue hover:text-brand-blue-deep">ERPEaz</a>
          {" · "}
          <a href="https://dgverse.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-blue hover:text-brand-blue-deep">DGVerse</a>
        </li>
      </ul>
      <div className="mt-10">
        <Button href="/contact" variant="primary">
          Get in Touch
        </Button>{" "}
        <Link href="/" className="ml-3 text-sm font-semibold text-brand-blue hover:text-brand-blue-deep">
          ← Back to homepage
        </Link>
      </div>
    </PageShell>
  );
}
