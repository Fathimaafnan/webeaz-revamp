/**
 * The shared hero background layer.
 *
 * Reuses the exact warm peach–ivory gradient image that the Home page
 * hero uses, so every page that renders this layer shares one hero
 * background asset. Only the backdrop lives here — copy, layout and
 * every other hero element are untouched.
 */
export default function HeroBackground() {
  return (
    <div
      className="hero-field"
      aria-hidden="true"
      style={{
        zIndex: 0,
        backgroundImage: "url('/assets/hero/webeaz-hero-bg-warm-2026.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
