import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceCard from "@/components/services/ServiceCard";
import ServicesShell from "@/components/services/ServicesShell";
import ServicesCta from "@/components/services/ServicesCta";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { getCategory, serviceCategories } from "@/lib/services";

type Props = { params: Promise<{ area: string }> };

const variants = {
  technology: "cobalt",
  "digital-growth": "ember",
  automation: "steel",
  ai: "midnight",
} as const;

export function generateStaticParams() {
  return serviceCategories.map((c) => ({ area: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const category = getCategory(area);
  if (!category) return { title: "Not Found" };
  return {
    title: `${category.name} Services`,
    description: category.description,
    alternates: { canonical: `/services/${category.slug}` },
  };
}

export default async function ServiceCategoryPage({ params }: Props) {
  const { area } = await params;
  const category = getCategory(area);
  if (!category) notFound();

  const variant =
    variants[category.slug as keyof typeof variants] ?? ("navy" as const);

  return (
    <>
      <ServicesShell
        eyebrow={`Services — ${category.name}`}
        title={`${category.name} services`}
        description={category.description}
        variant={variant}
      >
        <div className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {category.services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 70}>
              <ServiceCard
                service={s}
                href={`/services/${category.slug}/${s.slug}`}
                warm={category.accent === "orange" ? i % 2 === 1 : i % 2 === 0}
              />
            </Reveal>
          ))}
        </div>
      </ServicesShell>

      {/* The category's own actions, now closing on the deep-blue
          band the Services system ends on. */}
      <ServicesCta
        title={`Ready to explore ${category.name}?`}
        body="Tell us what you are trying to build and we will map it to the services that get you there."
      >
        <Button href="/contact" variant="heroOrange">
          Let&apos;s Talk
        </Button>
        <Button href="/services" variant="heroSecondary">
          ← All Services
        </Button>
      </ServicesCta>
    </>
  );
}