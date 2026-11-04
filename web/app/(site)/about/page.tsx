import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import FounderSpotlight from "@/components/home/FounderSpotlight";

export const metadata: Metadata = {
  title: "About WebEaz",
  description:
    "WebEaz Technologies Pvt. Ltd. — helping businesses build, transform, automate and grow through technology, digital growth, automation and AI.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="About WebEaz Technologies"
      description="WebEaz helps businesses build, transform, automate and grow through technology, digital growth, automation and AI solutions."
    >
      <div className="mt-10 space-y-6 text-sm leading-7 text-muted">
        <p>
          WebEaz Technologies Pvt. Ltd. is a technology company that helps
          businesses build, transform, automate and grow through digital
          solutions, automation and AI.
        </p>
        <p>
          Founded with the mission to simplify business transformation through
          technology, we combine deep industry expertise with modern
          engineering practices to deliver practical, results-oriented
          solutions.
        </p>
        <h3 className="mt-8 text-base font-semibold text-ink">What We Do</h3>
        <ul className="mt-2 space-y-3 text-sm text-muted pl-6 list-disc">
          <li>Technology consulting and digital transformation</li>
          <li>Business automation and AI solutions</li>
          <li>Search engine optimisation and digital marketing</li>
          <li>Custom software and product development</li>
        </ul>
        <h3 className="mt-8 text-base font-semibold text-ink">Our Values</h3>
        <ul className="mt-2 space-y-3 text-sm text-muted pl-6 list-disc">
          <li>Customer-first approach to every project</li>
          <li>Pragmatic, business-aligned technology choices</li>
          <li>Transparency and clear communication</li>
          <li>Long-term partnership over short-term delivery</li>
        </ul>
        <FounderSpotlight />
      </div>
    </PageShell>
  );
}