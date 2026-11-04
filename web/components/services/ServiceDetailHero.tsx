import Link from "next/link";
import ServiceIcon from "@/components/services/ServiceIcon";
import type { Service, ServiceCategory } from "@/lib/services";

/**
 * The opening of an individual service page, in three parts.
 *
 * These used to sit on the white working section, under a flat blue
 * rectangle, which meant the first screen of every one of the
 * twenty-four detail pages was a title band followed by a wide expanse
 * of white with a near-white illustration panel floating in it. They
 * now belong to the hero: the Services shell hands them the field, so
 * the trail, the icon, the actions and the drawing are one
 * composition on the brand ground.
 *
 * The drawing keeps the same artwork — the same SVG on the same
 * four-by-three frame — but it now sits on a deep blue panel with
 * the Home hero's fine grid on it, instead of on the pale
 * `card-media` rectangle the light scope produced. That is what turns
 * an unfinished placeholder into a designed surface.
 */

/**
 * The trail. It sits on the blue field now, so the type is stepped up
 * from the grey it used to carry on white: the separators stay
 * decorative and the current page is marked by weight rather than by
 * a colour that cannot clear AA at this size against the field.
 */
export function ServiceDetailTrail({
  category,
  service,
}: {
  category: ServiceCategory;
  service: Service;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white">
        <li>
          <Link
            href="/services"
            className="transition-colors hover:text-white hover:underline hover:underline-offset-4"
          >
            Services
          </Link>
        </li>
        <li aria-hidden="true" className="text-white">
          /
        </li>
        <li>
          <Link
            href={`/services/${category.slug}`}
            className="transition-colors hover:text-white hover:underline hover:underline-offset-4"
          >
            {category.name}
          </Link>
        </li>
        <li aria-hidden="true" className="text-white">
          /
        </li>
        <li aria-current="page" className="font-semibold text-white">
          {service.name}
        </li>
      </ol>
    </nav>
  );
}

/**
 * The service's icon and its two actions, at the foot of the headline
 * panel. The white disc is the Home page's card disc, inverted for a
 * dark ground: a bright plate carrying the brand-blue glyph, and the
 * one thing on this page bright enough to be the focal point.
 */
export function ServiceDetailActions({
  category,
  service,
}: {
  category: ServiceCategory;
  service: Service;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <span className="svc-hero-disc" aria-hidden="true">
        <ServiceIcon name={service.icon} className="h-7 w-7 text-brand-blue" />
      </span>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-brand-orange/25 transition-all duration-200 hover:bg-brand-orange-deep hover:shadow-glow-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue-light"
        >
          Let&apos;s Talk
        </Link>
        <Link
          href={`/services/${category.slug}`}
          className="inline-flex items-center justify-center rounded-full border border-white/70 bg-transparent px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-brand-orange-on-dark hover:text-brand-orange-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          ← {category.name}
        </Link>
      </div>
    </div>
  );
}

/**
 * The illustration, in the column beside the headline panel.
 */
export function ServiceDetailVisual({
  image,
  alt,
}: {
  image?: string;
  alt: string;
}) {
  return (
    <div className="svc-hero-visual relative flex aspect-[16/10] items-center justify-center">
      {image ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 h-full w-full rounded-xl object-cover"
        />
      ) : null}
      {image ? null : (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-brand-orange/25 blur-3xl"
          />
          <svg
            viewBox="0 0 240 160"
            className="relative h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect
              x="30"
              y="24"
              width="180"
              height="112"
              rx="12"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.2)"
            />
            <path d="M30 46h180" stroke="rgba(255,255,255,0.18)" />
            <circle cx="44" cy="35" r="3" fill="rgba(255,255,255,0.32)" />
            <circle cx="55" cy="35" r="3" fill="rgba(255,255,255,0.22)" />
            <circle cx="66" cy="35" r="3" fill="rgba(255,255,255,0.14)" />
            <g
              transform="translate(88 62) scale(2.6)"
              stroke="#8ecdf7"
              fill="none"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <g transform="translate(-12 -12)">
                <circle cx="12" cy="12" r="3" />
                <path d="M5 21c0-4 3.2-6 7-6s7 2 7 6" />
              </g>
            </g>
            <rect x="52" y="108" width="46" height="8" rx="4" fill="rgba(247,149,34,0.55)" />
            <rect x="104" y="108" width="30" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
            <rect x="140" y="108" width="22" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
          </svg>
        </>
      )}
    </div>
  );
}
