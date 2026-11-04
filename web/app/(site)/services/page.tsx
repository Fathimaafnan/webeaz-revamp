import type { Metadata } from "next";
import Link from "next/link";
import CategoryCard from "@/components/services/CategoryCard";
import ServicesShell from "@/components/services/ServicesShell";
import ServicesCta from "@/components/services/ServicesCta";
import Reveal from "@/components/ui/Reveal";
import { getServiceTree } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "WebEaz services across technology, digital growth, automation and AI — built to help businesses build, transform, automate and grow.",
  alternates: { canonical: "/services" },
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { categories } = await getServiceTree();

  return (
    <>
      <ServicesShell
        eyebrow="Services"
        title="Technology, growth, automation and AI services."
        description="WebEaz services are organised around business outcomes — not technology lists. Explore each capability to see how it applies to your business."
        variant="navy"
      >
        <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-2">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 80}>
              <CategoryCard category={c} index={i} />
            </Reveal>
          ))}
        </div>
      </ServicesShell>

      {/* The Digital page's closing CTA, in the deep blue the whole
          Services system now closes on. */}
      <ServicesCta
        title="Not sure which service fits right now?"
        body="Tell us your goals and we will map them to the right combination of services."
      >
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-ink shadow-md shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
        >
          Let&apos;s Talk
          <span aria-hidden="true">→</span>
        </Link>
      </ServicesCta>
    </>
  );
}