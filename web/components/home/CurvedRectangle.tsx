import Image from "next/image";
import { DEFAULT_PRODUCTS, type ProductData } from "@/lib/fallback-content";

/**
 * The Our Products section.
 *
 * The section is now a standard, full-bleed part of the homepage — the
 * same kind of section as Our Work and the ones around it. The curved
 * rectangle and its moving-pages stage are gone, and the two product
 * cards sit directly in an EQSoft-style grid: a centred header above a
 * clean row of white cards, each with a large product image, a tinted
 * tag, a name, a description and a checked feature list. The image
 * carries the blue hover wash with the "Explore" call on top, exactly
 * the way the reference reveals its cards.
 *
 * Only the section's design changed. The product data below — names,
 * descriptions, feature lists, images and destination links — is the
 * same data that was in the curved rectangle before.
 */

export default function CurvedRectangle({ products = DEFAULT_PRODUCTS }: { products?: ProductData[] }) {
  return (
    <section
      className="sec-mist theme-light relative overflow-hidden px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:py-[var(--section-padding)]"
      aria-label="Our products"
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* ===== Section header ===== */}
        <div className="products-title mb-12 text-center lg:mb-20">
          <span className="mb-6 inline-block rounded-full bg-brand-blue/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-blue sm:mb-8">
            What We Offer
          </span>

          <h2 className="flex flex-wrap items-baseline justify-center gap-x-[0.28em] text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-ink">
            <span className="products-title-word">
              <span style={{ animationDelay: "80ms" }}>OUR</span>
            </span>
            <span className="products-title-word">
              <span style={{ animationDelay: "260ms" }}>PRODUCTS</span>
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-[700px] text-base leading-7 text-muted sm:text-lg">
            Smart, scalable products that help your business build, automate
            and grow.
          </p>
        </div>

        {/* ===== Product card grid ===== */}
        {/* Two products, so two equal columns on larger screens and one
            column on a phone — the same card grid the reference uses,
            sized to the number of products we have. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {products.map((product) => (
            <a
              key={product.name}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${product.name} (opens in a new tab)`}
              className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_10px_40px_rgba(26,26,46,0.06)] ring-1 ring-black/[0.04] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(26,26,46,0.12)] focus-visible:-translate-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              {/* Product image, with the reference's hover wash */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <Image
                  src={product.imageUrl}
                  alt={product.imageAlt}
                  width={product.imageWidth}
                  height={product.imageHeight}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                />

                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-blue/90 opacity-0 backdrop-blur-[4px] transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex translate-y-3 items-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 group-hover:translate-y-0">
                    Explore {product.name}
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path d="M7.5 15 12.5 10 7.5 5" />
                    </svg>
                  </span>
                </span>
              </div>

              {/* Card content */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-blue/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-blue">
                  {product.tag}
                </span>

                <h3 className="mb-3 text-2xl font-semibold leading-tight text-ink">
                  {product.name}
                </h3>

                <p className="mb-6 flex-1 text-base leading-[1.65] text-muted">
                  {product.description}
                </p>

                <ul className="flex flex-col gap-3 border-t border-slate-100 pt-5">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm font-medium text-slate-600"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 shrink-0 text-brand-blue"
                        aria-hidden="true"
                      >
                        <path d="M16.6667 5 7.5 14.1667 3.3333 10" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
