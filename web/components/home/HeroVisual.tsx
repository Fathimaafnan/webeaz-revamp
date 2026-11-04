"use client";

/**
 * Hero visual — an abstract technology illustration that sits behind
 * the dashboard mockup on the right side of the hero.
 *
 * Built entirely from CSS/SVG primitives using WebEaz brand colours,
 * so no image assets are required. Gentle floating and pulsing
 * animations communicate technology, connectivity and innovation
 * without competing with the headline or CTAs. All motion respects
 * `prefers-reduced-motion`.
 */
export default function HeroVisual() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Ambient brand blue glow — diffused, soft, behind everything */}
      <div
        className="absolute -top-36 -left-28 w-[40rem] h-[40rem] rounded-full bg-brand-blue/10 blur-[160px] animate-hero-pulse"
        style={{ animationDelay: "0s" }}
        aria-hidden="true"
      />

      {/* Subtle orange accent glow */}
      <div
        className="absolute -bottom-24 -right-16 w-[24rem] h-[24rem] rounded-full bg-brand-orange/8 blur-[128px] animate-hero-pulse"
        style={{ animationDelay: "2.5s" }}
        aria-hidden="true"
      />

      {/* Floating interface panel — suggests a web application */}
      <div
        className="absolute top-8 left-8 w-[14rem] h-[8rem] rounded-xl border border-white/15 bg-white/5 p-4 shadow-lg shadow-brand-blue/10 backdrop-blur animate-hero-float"
        style={{ animationDelay: "0s" }}
        aria-hidden="true"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-brand-blue" />
          <span className="w-2 h-2 rounded-full bg-brand-blue/50" />
          <span className="w-2 h-2 rounded-full bg-brand-blue/30" />
        </div>
        <div className="space-y-1.5">
          <div className="h-1 w-3/4 rounded bg-white/10" />
          <div className="h-1 w-1/2 rounded bg-white/10" />
          <div className="h-1 w-5/6 rounded bg-white/10" />
        </div>
      </div>

      {/* Floating notification panel — suggests a digital/mobile product */}
      <div
        className="absolute top-8 right-8 w-[10rem] h-[5rem] rounded-lg border border-white/15 bg-white/5 p-3 animate-hero-float"
        style={{ animationDelay: "1.5s" }}
        aria-hidden="true"
      >
        <div className="flex gap-1">
          <span className="w-1 h-1 rounded-full bg-brand-orange" />
          <span className="w-1 h-1 rounded-full bg-brand-orange" />
          <span className="w-1 h-1 rounded-full bg-brand-orange" />
        </div>
      </div>

      {/* Floating connection dots — represent connectivity and nodes */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-brand-blue animate-hero-float" style={{ animationDelay: "0s" }} aria-hidden="true" />
      <div className="absolute top-1/3 left-2/3 w-1 h-1 rounded-full bg-brand-orange animate-hero-float" style={{ animationDelay: "1s" }} aria-hidden="true" />
      <div className="absolute top-1/2 left-1/6 w-2 h-2 rounded-full bg-brand-blue animate-hero-float" style={{ animationDelay: "2s" }} aria-hidden="true" />
      <div className="absolute top-2/3 left-3/4 w-1 h-1 rounded-full bg-brand-orange animate-hero-float" style={{ animationDelay: "0.5s" }} aria-hidden="true" />

      {/* Subtle connection line */}
      <div className="absolute top-1/2 left-1/5 w-[16rem] h-[0.5px] bg-white/10 rotate-[12deg]" aria-hidden="true" />
    </div>
  );
}
