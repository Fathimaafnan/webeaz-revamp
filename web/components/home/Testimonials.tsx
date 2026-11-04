import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import type { HomeSection, TestimonialItem } from "@/lib/defaults";

/**
 * "What Our Clients Say" — three client testimonials, side by side.
 *
 * This used to be a split composition: the heading held the left
 * column while the quotes travelled through a rail on the right, with
 * a pair of chevron buttons underneath to push them along by hand.
 * Three quotes in a rail meant only ever one and a half of them were
 * on screen, the outer two cut off at the frame edge, and the one in
 * the middle was scaled up while the others were not — so the section
 * read as a carousel that happened to have too few cards for it.
 *
 * It is now a plain grid. The heading sits above the quotes, centred
 * the way every other card row on the page is, and all three
 * testimonials stand side by side, the same size, in the same row,
 * with nothing moving. One per row on a phone, two from 768px, three
 * from 1024px.
 *
 * The quotes, names, roles, companies and portraits are all
 * unchanged, the cards keep the `.card-quote` treatment they always
 * had, and there are no arrows to add or remove.
 */
export default function Testimonials({
  testimonials,
  section,
}: {
  testimonials: TestimonialItem[];
  section: HomeSection;
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="sec-sky theme-light relative overflow-hidden px-5 py-[var(--space-5)] sm:px-8 sm:py-[var(--space-6)] lg:py-[var(--section-padding)]">
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift absolute -left-[12%] top-[10%] h-[28rem] w-[28rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift-slow absolute -right-[12%] bottom-[8%] h-[28rem] w-[28rem]"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:mt-14 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="card-quote group relative flex h-full flex-col p-7 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-5 select-none font-serif text-6xl leading-none text-brand-orange-strong/65"
              >
                &rdquo;
              </span>

              <div className="relative flex items-center gap-4">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md shadow-brand-blue/10">
                  {t.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-full w-full items-center justify-center bg-brand-blue-soft text-lg font-bold text-brand-blue-deep"
                    >
                      {t.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-bold tracking-tight text-ink">
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange-strong">
                    {t.role}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted">{t.company}</p>
                  {t.companyLogo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={t.companyLogo}
                      alt={`${t.company || "Customer"} logo`}
                      loading="lazy"
                      className="mt-2 h-6 max-w-24 object-contain object-left"
                    />
                  ) : null}
                </div>
              </div>

              <p className="relative mt-6 flex-1 text-sm leading-7 text-muted">
                {t.quote}
              </p>

              <span
                aria-hidden="true"
                className="mt-6 block h-px w-14 rounded-full bg-gradient-to-r from-brand-orange to-brand-blue"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
