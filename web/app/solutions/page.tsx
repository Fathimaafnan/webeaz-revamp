import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { capabilities } from "@/lib/capabilities";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "WebEaz technology solutions across technology, digital growth, automation and AI for modern businesses.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <PageShell
      eyebrow="Solutions"
      title="Solutions for every stage of digital growth."
      description="WebEaz solutions combine technology, digital growth, automation and AI into outcome-focused engagements. Start with the capability your business needs most."
    >
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {capabilities.map((c, i) => (
          <Reveal key={c.title} delay={i * 60}>
            <Link
              href={c.href}
              className="group flex h-full items-start justify-between rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/50 hover:shadow-lg hover:shadow-brand-blue/5"
            >
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-ink">
                  {c.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">{c.description}</p>
              </div>
              <span
                aria-hidden="true"
                className="mt-1 text-brand-orange transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
