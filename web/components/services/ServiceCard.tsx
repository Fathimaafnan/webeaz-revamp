import Link from "next/link";
import ServiceIcon from "@/components/services/ServiceIcon";
import type { Service } from "@/lib/services";

/**
 * Individual service card — used on the category pages to link
 * through to a detail page.
 *
 * The Digital page's card, reproduced: a gradient media band with
 * the icon in a glass disc, then a white body with the name, the
 * summary and a "Learn more" CTA that nudges on hover. The band
 * carries the colour, the way it does on that page.
 *
 * `svc-card-band` keeps the type inside the band white, which
 * `.svc-surface` would otherwise re-point at ink.
 */
export default function ServiceCard({
  service,
  href,
  warm,
}: {
  service: Service;
  href: string;
  warm?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
    >
      {/* media header — the Digital page's gradient band */}
      <div
        className={`svc-card-band relative flex h-28 items-center justify-center ${
          warm
            ? "bg-[linear-gradient(140deg,#9a3412,#b45309)]"
            : "bg-[linear-gradient(140deg,#0b4b7d,#1076bc)]"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/25 bg-black/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          <ServiceIcon name={service.icon} className="h-6 w-6 text-white" />
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 h-20 w-32 rounded-full bg-black/10 blur-2xl"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* h2 — sits directly beneath the page h1 on category pages */}
        <h2 className="text-lg font-bold tracking-tight text-ink">
          {service.name}
        </h2>
        <p className="mt-2.5 flex-1 text-sm leading-6 text-muted">
          {service.summary}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange-strong transition-colors duration-300 group-hover:text-brand-orange-strong">
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
          Learn more
        </span>
      </div>
    </Link>
  );
}
