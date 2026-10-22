import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { insights } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Ideas, insights and perspectives on technology, AI, digital growth and automation from the WebEaz team.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <PageShell
      eyebrow="Insights"
      title="Ideas. Insights. What's next."
      description="Perspectives on technology, AI, digital growth and automation from the WebEaz team. New articles are published regularly."
    >
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {insights.map((a, i) => (
          <Reveal key={a.title} delay={i * 60}>
            <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/40 hover:shadow-lg hover:shadow-brand-blue/5">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-brand-blue-soft px-3 py-1 font-semibold uppercase tracking-wider text-brand-blue-deep">
                  {a.category}
                </span>
                <span className="text-muted">{a.date}</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                {a.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted">{a.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </PageShell>
  );
}
