import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { industries } from "@/lib/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "WebEaz works across education, retail, ecommerce, manufacturing, healthcare, automotive, professional services, finance and SMEs.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <PageShell
      eyebrow="Industries"
      title="Built for real-world business."
      description="WebEaz technology, digital growth, automation and AI capabilities apply across industries. Select your industry to start a conversation about your goals."
    >
      {/* The <li> is the grid item and Reveal sits inside it. Wrapping
          the other way round put <ul><div><li>, which leaves the list
          item without a list parent and trips the axe `list`/`listitem`
          rules. This is the same order the home page already uses. */}
      <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {industries.map((ind, i) => (
          <li key={ind} className="h-full">
            <Reveal delay={i * 40} className="h-full">
              <div className="flex h-full items-center rounded-xl border border-line bg-white px-5 py-4 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-orange hover:bg-brand-orange-soft hover:text-brand-orange-strong">
                {ind}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <Button href="/contact" variant="primary">
          Explore Industries →
        </Button>
      </div>
    </PageShell>
  );
}
