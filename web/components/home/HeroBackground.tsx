"use client";

/**
 * The hero background - WebEaz brand blue field with a dotted sphere.
 *
 * Replaces the previous gradient + light trail atmosphere with a
 * premium, technology-inspired composition: a deep blue field
 * carrying a large dotted sphere on the right side, with subtle
 * glowing accents and a centre calm zone for text readability.
 *
 * All motion is pure CSS - no JavaScript animation loop. The
 * dot pattern is rendered with CSS gradients so it stays crisp
 * at any screen size.
 */
export default function HeroBackground() {
  return (
    <div className="hero-field">
      {/* The main sphere - WebEaz brand blue field with dot pattern */}
      <div className="hero-globe">
        <div className="hero-globe-band" />
        {/* Brighter accent dots scattered across the sphere */}
        <div className="hero-globe-dot" />
        <div className="hero-globe-dot" />
        <div className="hero-globe-dot" />
        <div className="hero-globe-dot" />
        <div className="hero-globe-dot" />
        <div className="hero-globe-dot" />
        <div className="hero-globe-dot" />
        <div className="hero-globe-dot" />
      </div>

      {/* Centre calm - darkens the middle so copy keeps contrast */}
      <div className="hero-calm" />

      {/* Top right glow */}
      <div className="hero-lumen" />

      {/* Corner vignette */}
      <div className="hero-vignette" />
    </div>
  );
}
