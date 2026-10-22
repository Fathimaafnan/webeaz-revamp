import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

const products = [
  {
    name: "ERPEaz",
    tagline: "Cloud ERP",
    description:
      "A cloud ERP platform built by WebEaz to run finance, operations and growth in one place.",
    href: "https://erpeaz.com/",
  },
  {
    name: "DGVerse",
    tagline: "Digital Growth & Automation Platform",
    description:
      "A digital growth and automation platform from WebEaz that connects marketing, sales and operations.",
    href: "https://dgverse.org/",
  },
];

const erpModules = ["Accounts", "Sales", "Inventory", "CRM"];
const dgModules = ["Marketing", "Sales", "Operations", "Automation"];
const erpBars = [38, 62, 48, 78, 56, 92, 68];

/**
 * "Built by WebEaz" — two unified premium product showcases.
 * Each showcase is ONE composed panel: a large product visual
 * on top, with the product name, description and CTA integrated
 * into the same panel below it. ERPEaz uses a clean white and
 * light-grey frame — #ffffff through the theme's own grey scale —
 * carrying slow drifting silver light around a warm white
 * dashboard; see `.erp-card` in globals.css. DGVerse keeps its
 * dark navy/cyan identity.
 *
 * The section's own ground is `.sec-peach`, a soft light-orange
 * gradient taken from the logo's orange and held far away from
 * it, drifting slowly so the warm light changes weight rather
 * than sliding a shape across the page. See that rule in
 * globals.css. The ERPEaz panel keeps its own white background
 * and the DGVerse panel its own dark navy, so neither product
 * card is affected by the ground.
 *
 * Both cards share one graph area: the same 2.5/1 region, the
 * same width, in the same place between the media header and the
 * module chips. ERPEaz's stat tiles sit inside that region above
 * its bars, so its band is a dashboard; DGVerse's region is the
 * curve itself. Same box, same size, same position — so the two
 * cards read as equals, and the panel below each graph starts at
 * the same height.
 */
export default function Products() {
  return (
    <section className="sec-peach theme-light relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      {/* Blue base with premium orange accents */}
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-blue animate-glow-drift absolute -left-[15%] top-[5%] h-[30rem] w-[30rem]"
      />
      <div
        aria-hidden="true"
        className="ambient-glow ambient-glow-orange animate-glow-drift-slow absolute -right-[12%] bottom-[8%] h-[24rem] w-[24rem]"
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Built by WebEaz"
            title="Products created by WebEaz."
            description="Beyond services, WebEaz builds and operates its own technology products."
            align="center"
      />
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-6xl items-stretch gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
          {products.map((p, i) => (
            <Reveal key={p.name} delay={i * 140} className="h-full">
              <article className="group flex h-full flex-col">
                {/* ====== ERPEaz — clean white + WebEaz blue ====== */}
                {i === 0 ? (
                  <div className="erp-card relative flex flex-1 flex-col overflow-hidden rounded-3xl transition-all duration-500 ease-out">
                    <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                      {/* White ERP dashboard panel */}
                      <div className="flex flex-1 items-center">
                        <div className="w-full overflow-hidden rounded-xl border border-[rgba(16,118,188,0.2)] bg-white shadow-[0_18px_52px_rgba(16,118,188,0.12)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-[#1076bc]/60 group-hover:shadow-[0_26px_64px_rgba(16,118,188,0.25)]">
                          {/* Media header. The fixed height is shared with
                              the DGVerse header below: the DGVerse badge
                              is taller than the ERPEaz pill, so without it
                              the two cards drift apart by 15px before the
                              graph area is even reached. */}
                          <div className="relative flex h-[3.25rem] items-center justify-between border-b border-[rgba(16,118,188,0.1)] bg-[linear-gradient(90deg,#ffffff_0%,#f0f7fb_100%)] px-4 pb-3 pt-3.5">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-[#1076bc]" />
                              <span className="h-2 w-2 rounded-full bg-[#1a86d4]" />
                              <span className="h-2 w-2 rounded-full bg-[#5cb3ee]" />
                            </span>
                            <span className="h-2 w-28 rounded-full bg-[#e3f0f8]" />
                          </div>

                          {/* ====== THE GRAPH AREA ======
                              The same 2.5/1 box the DGVerse curve sits
                              in: one shared region, the same width, in
                              the same place between the media header and
                              the module chips. ERPEaz's stat tiles sit
                              inside that box, above the bars, so the
                              band reads as one dashboard rather than as
                              a tall chart with something bolted on
                              top — and so the two graph areas are
                              exactly the same size. ====== */}
                          <div className="mx-4 mt-2.5 flex aspect-[2.5/1] flex-col gap-2.5 rounded-lg border border-[rgba(16,118,188,0.12)] bg-[#f0f7fb] p-2.5 sm:mx-5">
                            {/* stat cards */}
                            <div className="grid grid-cols-3 gap-2.5">
                              {[0, 1, 2].map((n) => (
                                <div key={n} className="rounded-lg border border-[rgba(16,118,188,0.12)] bg-white p-2.5 shadow-[0_2px_10px_rgba(16,118,188,0.06)]">
                                  <div className="h-1.5 w-8 rounded-full bg-[#e3f0f8]" />
                                  <div className="mt-2 h-3 w-12 rounded-full bg-[#1a86d4]" />
                                  <div className="mt-1.5 h-1.5 w-6 rounded-full bg-[#e3f0f8]" />
                                </div>
                              ))}
                            </div>
                            {/* bar chart */}
                            <div className="flex flex-1 items-end gap-2">
                              {erpBars.map((h, n) => (
                                <div
                                  key={n}
                                  className={`w-full rounded-sm ${n === 5 ? "bg-[#1076bc]" : "bg-[#5cb3ee]"}`}
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* module chips */}
                          <div className="flex flex-wrap gap-2 p-4 pt-3 sm:p-5 sm:pt-3">
                            {erpModules.map((m) => (
                              <span
                                key={m}
                                className="rounded-full border border-[rgba(16,118,188,0.2)] bg-[rgba(16,118,188,0.08)] px-2.5 py-1 text-[10px] font-medium text-[#1076bc]"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Integrated product content — same panel */}
                      <div className="mt-6">
                        <h3 className="text-2xl font-bold tracking-tight text-ink">
                          ERPEaz
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-[#1076bc]">
                          Cloud ERP
                        </p>
                        <p className="mt-2.5 max-w-md text-sm leading-6 text-grey-600">
                          A cloud ERP platform built by WebEaz to run finance,
                          operations and growth in one place.
                        </p>
                        <div className="mt-5">
                          <Button
                            href="https://erpeaz.com/"
                            variant="heroSecondary"
                            external
                            className="!border-[#1076bc] !bg-[#1076bc] !text-white shadow-[0_10px_28px_rgba(16,118,188,0.35)] hover:!border-[#1a86d4] hover:!bg-[#1a86d4] hover:!text-white hover:shadow-[0_14px_34px_rgba(16,118,188,0.45)]"
                          >
                            Explore ERPEaz{" "}
                            <span
                              aria-hidden="true"
                              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#22264e] bg-[#0b0d24] transition-all duration-500 ease-out group-hover:border-[#23e6f5]/40 group-hover:shadow-[0_24px_60px_rgba(123,47,242,0.22)]">
                    <div
                      aria-hidden="true"
                      className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-[#23e6f5]/15 blur-3xl"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-14 -right-10 h-48 w-48 rounded-full bg-[#7b2ff2]/20 blur-3xl"
                    />
                    <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                      {/* Product visual — stronger presence in the card */}
                      <div className="flex flex-1 items-center">
                      <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0e27]/90 shadow-[0_18px_52px_rgba(35,230,245,0.12)] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-[#23e6f5]/40 group-hover:shadow-[0_26px_64px_rgba(35,230,245,0.2)]">
                        <div className="flex h-[3.25rem] items-center justify-between border-b border-white/10 bg-[radial-gradient(ellipse_120%_160%_at_20%_0%,rgba(35,230,245,0.16),transparent_62%)] px-4 pb-3 pt-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#23e6f5]/70" />
                            <span className="h-2 w-2 rounded-full bg-[#7b2ff2]/70" />
                            <span className="h-2 w-2 rounded-full bg-white/20" />
                          </div>
                          <span className="rounded-full bg-[#23e6f5]/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#23e6f5]">
                            DGVerse
                          </span>
                        </div>

                        {/* ====== THE GRAPH AREA — the same 2.5/1 box the
                            ERPEaz chart sits in. The curve keeps its own
                            viewBox and proportions, so it fills the box
                            exactly, without being stretched. ====== */}
                        <div className="mx-4 mt-2.5 flex aspect-[2.5/1] items-center sm:mx-5">
                        <svg viewBox="0 0 320 128" className="h-full w-full" aria-hidden="true">
                          <defs>
                            <linearGradient id="dg-line" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#23e6f5" />
                              <stop offset="100%" stopColor="#7b2ff2" />
                            </linearGradient>
                            <linearGradient id="dg-fill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#23e6f5" stopOpacity="0.18" />
                              <stop offset="100%" stopColor="#23e6f5" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,76 C36,70 58,72 88,58 C118,44 142,52 172,36 C202,20 236,28 272,16 C296,8 308,12 320,10"
                            fill="none"
                            stroke="url(#dg-line)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M0,76 C36,70 58,72 88,58 C118,44 142,52 172,36 C202,20 236,28 272,16 C296,8 308,12 320,10 L320,96 L0,96 Z"
                            fill="url(#dg-fill)"
                          />
                        </svg>
                        </div>

                        <div className="flex flex-wrap gap-2 p-4 pt-3 sm:p-5 sm:pt-3">
                          {dgModules.map((m) => (
                            <span
                              key={m}
                              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/70"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      </div>

                      {/* Integrated product content — same panel */}
                      <div className="mt-6">
                        <h3 className="text-2xl font-bold tracking-tight text-white">
                          DGVerse
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-[#23e6f5]">
                          Digital Growth & Automation Platform
                        </p>
                        <p className="mt-2.5 max-w-md text-sm leading-6 text-white/60">
                          A digital growth and automation platform from WebEaz
                          that connects marketing, sales and operations.
                        </p>
                        <div className="mt-5">
                          <Button href="https://dgverse.org/" variant="heroSecondary" external>
                            Explore DGVerse{" "}
                            <span
                              aria-hidden="true"
                              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
