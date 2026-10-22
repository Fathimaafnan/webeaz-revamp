import Link from "next/link";
import ServiceIcon from "@/components/services/ServiceIcon";
import type { ServiceCategory } from "@/lib/services";

/**
 * Main Services category card — the four cards on /services.
 *
 * This is the Digital page's service card, reproduced: a saturated
 * gradient media band carrying the icon in a glass disc, a small
 * mono badge, then a white body with the name, the tagline, the
 * description and an orange CTA that nudges on hover.
 *
 * The band is where the colour lives. The old card used the shared
 * `.card-media` band, which the light theme washes out to a pale
 * blue-grey, so all four cards read as white boxes on a white page.
 * `svc-card-band` keeps the type inside the band white, which
 * `.svc-surface` would otherwise re-point at ink.
 */
export default function CategoryCard({
  category,
  index,
}: {
  category: ServiceCategory;
  index: number;
}) {
  const warm = category.accent === "orange";

  return (
    <Link
      href={`/services/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
    >
      {/* media header — the Digital page's gradient band */}
      <div
        className={`svc-card-band relative flex h-32 items-center justify-center ${
          warm
            ? "bg-[linear-gradient(140deg,#b45309,#f79522)]"
            : "bg-[linear-gradient(140deg,#0b4b7d,#1076bc)]"
        }`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          <ServiceIcon name={category.icon} className="h-7 w-7 text-white" />
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 h-24 w-40 rounded-full bg-black/10 blur-2xl"
        />
        <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
          {category.num}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-ink">
          {category.name}
        </h2>
        <p className="mt-2 font-mono text-[11px] uppercase leading-5 tracking-wider text-brand-blue">
          {category.tagline}
        </p>
        <p className="mt-3 flex-1 text-sm leading-6 text-muted">
          {category.description}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-orange-strong transition-colors duration-300 group-hover:text-brand-orange-deep">
            {category.services.length} services
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </Link>
  );
}
