import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Explore selected digital products, platforms and transformation projects delivered by WebEaz.",
  alternates: { canonical: "/our-work" },
};

export default function OurWorkPage() {
  return (
    <PageShell
      eyebrow="Our work"
      title="What we've built."
      description="Explore selected digital products, platforms and transformation projects delivered by WebEaz. Each project follows a simple story: challenge → solution → result."
    >
      <div className="mt-10 space-y-5">
        {caseStudies.map((c, i) => (
          <Reveal key={c.client} delay={i * 60}>
            <article className="rounded-2xl border border-line bg-white p-7">
              <p className="font-mono text-[11px] uppercase tracking-wider text-brand-blue">
                {c.industry}
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink">
                {c.client}
              </h2>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-orange-strong">
                    Challenge
                  </dt>
                  <dd className="mt-1 leading-6 text-muted">{c.challenge}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-orange-strong">
                    Solution
                  </dt>
                  <dd className="mt-1 leading-6 text-muted">{c.solution}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-orange-strong">
                    Technology
                  </dt>
                  <dd className="mt-1 font-mono text-[12px] text-ink">{c.technology}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-brand-orange-strong">
                    Result
                  </dt>
                  <dd className="mt-1 leading-6 text-muted">{c.result}</dd>
                </div>
              </dl>
            </article>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted">
        Selected projects are shown with client permission. Full case studies and
        verified results are shared on request.
      </p>
    </PageShell>
  );
}
