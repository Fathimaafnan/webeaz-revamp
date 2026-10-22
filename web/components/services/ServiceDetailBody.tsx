import Link from "next/link";
import ServiceIcon from "@/components/services/ServiceIcon";
import { getSiblings, type Service, type ServiceCategory } from "@/lib/services";

/**
 * The gradient band a Services panel carries at its head.
 *
 * This is the Digital page's service card, reduced to a header:
 * the same two brand gradients the service cards use, the same
 * rounded corners, the same white type. `svc-card-band` is the
 * marker that keeps that type white — `.svc-surface` would
 * otherwise re-point `text-white` at ink, which is right for the
 * white card bodies and wrong inside a saturated band.
 */
function PanelBand({
  title,
  accent = "blue",
}: {
  title: string;
  accent?: "blue" | "orange";
}) {
  return (
    <div
      className={`svc-card-band flex h-16 items-center gap-3 px-6 ${
        accent === "orange"
          ? "bg-[linear-gradient(140deg,#b45309,#f79522)]"
          : "bg-[linear-gradient(140deg,#0b4b7d,#1076bc)]"
      }`}
    >
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full bg-white/90"
      />
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
        {title}
      </h2>
    </div>
  );
}

function Block({
  title,
  items,
  accent = "blue",
}: {
  title: string;
  items: string[];
  accent?: "blue" | "orange";
}) {
  return (
    <div className="card-panel overflow-hidden p-0">
      <PanelBand title={title} accent={accent} />
      <ul className="mt-5 space-y-3 px-6 pb-6">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-ink/70">
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Individual service detail page body.
 *
 * The title, the summary and the opening row — breadcrumb, icon,
 * actions and illustration — are the page's hero, and they live in
 * `ServiceDetailHero`, which the Services shell renders on the brand
 * field. What is left here is the working section: what the service
 * is, what WebEaz provides, key capabilities, benefits,
 * technologies, use cases and a CTA, with sibling services for
 * onward navigation.
 */
export default function ServiceDetailBody({
  category,
  service,
}: {
  category: ServiceCategory;
  service: Service;
}) {
  const siblings = getSiblings(category.slug, service.slug);

  return (
    <>
      {/* Overview */}
      <div className="card-panel overflow-hidden p-0">
        <PanelBand title="What this service is" />
        <p className="mt-5 px-6 pb-6 text-base leading-8 text-ink/70">
          {service.overview}
        </p>
      </div>

      {/* Detail blocks */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Block title="What WebEaz provides" items={service.provides} accent="blue" />
        <Block title="Key capabilities" items={service.capabilities} accent="orange" />
        <Block title="Benefits and business value" items={service.benefits} accent="blue" />
        {service.useCases?.length ? (
          <Block title="Relevant use cases" items={service.useCases} accent="orange" />
        ) : service.technologies?.length ? (
          <div className="card-panel overflow-hidden p-0">
            <PanelBand title="Technologies and platforms" accent="orange" />
            <ul className="mt-5 flex flex-wrap gap-2 px-6 pb-6">
              {service.technologies.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-brand-blue/20 bg-brand-blue-soft px-3 py-1.5 text-xs font-medium text-brand-blue-deep"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="card-panel overflow-hidden p-0">
            <PanelBand title="How we engage" accent="orange" />
            <p className="mt-5 px-6 pb-6 text-sm leading-7 text-ink/70">
              We begin with a situation analysis to determine what you actually
              require, then agree scope, sequence and success measures before
              any build starts.
            </p>
          </div>
        )}
      </div>

      {service.useCases?.length && service.technologies?.length ? (
        <div className="mt-6 card-panel overflow-hidden p-0">
          <PanelBand title="Technologies and platforms" accent="orange" />
          <ul className="mt-5 flex flex-wrap gap-2 px-6 pb-6">
            {service.technologies.map((t) => (
              <li
                key={t}
                className="rounded-full border border-brand-blue/20 bg-brand-blue-soft px-3 py-1.5 text-xs font-medium text-brand-blue-deep"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Sibling services */}
      <div className="mt-14 card-panel overflow-hidden p-0">
        <PanelBand title={`More in ${category.name}`} accent="blue" />
        <ul className="mt-5 grid gap-3 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-3">
          {siblings.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${category.slug}/${s.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-orange/40 hover:bg-brand-orange-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <ServiceIcon
                  name={s.icon}
                  className="h-4 w-4 shrink-0 text-brand-blue"
                />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink transition-colors duration-300 group-hover:text-brand-blue-deep">
                  {s.name}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-brand-orange transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Closing CTA — the Digital page's deep-blue band, so this page
          ends in the same colour the rest of the Services system
          now closes on. `svc-card-band` keeps the type white: the
          light scope `.svc-surface` would otherwise re-point it at
          ink, which is unreadable on this ground. */}
      <div className="svc-card-band mt-12 overflow-hidden rounded-2xl bg-brand-blue-deep p-8 text-center shadow-2xl shadow-brand-blue-deep/20 sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Ready to get started?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/80">
          Tell us the goal you are working towards and we will map it to the
          right combination of services.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
          >
            Get Started
          </Link>
          <Link
            href={`/services/${category.slug}`}
            className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-brand-orange hover:text-brand-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
          >
            ← All {category.name} services
          </Link>
        </div>
      </div>
    </>
  );
}
