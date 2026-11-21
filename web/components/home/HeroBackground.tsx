/**
 * The hero's background layer.
 *
 * The composition is the one used on eqsoftonline.com: a deep
 * ground, a set of flowing forms sweeping through it, a technical
 * dot grid over the top, three soft light fields drifting on their
 * own slow cycles, and a fine shimmer across everything. The same
 * geometry, the same masks, the same timings, the same layers in the
 * same order.
 *
 * Only the colours are WebEaz's, and they are kept soft. Where that
 * design uses a blue for its ground, its dot grid and its light
 * fields, this one uses WebEaz's own blue and orange — a light blue
 * ground under the flowing forms, and a soft orange carrying the
 * warm side of the identity so the field reads as ours rather than
 * as a copy. The reference's violet secondary becomes WebEaz orange.
 * Every colour here is held at a low intensity, so the field stays
 * gentle and restful rather than loud.
 *
 * The hero's own copy, layout, logo, buttons and navigation are
 * untouched; only this layer behind them is new.
 */

/** The flowing forms: soft, glass-like ribbons sweeping across the
 *  ground, with a bright edge where the light catches them. */
function HeroForms() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 2000 1126"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* The forms are blurred so their edges feather into the ground
            rather than cutting it, which is what makes them read as
            glass catching light instead of as flat bands. */}
        <filter id="hz-form-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16" />
        </filter>

        {/* The main sweep: soft blue at its root, a bright edge
            through the middle, light blue again as it lifts away. */}
        <linearGradient id="hz-form-blue" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f93cd" stopOpacity="0.36" />
          <stop offset="38%" stopColor="#7cc0ef" stopOpacity="0.32" />
          <stop offset="66%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#a9d6f7" stopOpacity="0.28" />
        </linearGradient>

        {/* The warm sweep that crosses it — WebEaz's soft orange,
            sitting where the reference puts its second accent. */}
        <linearGradient id="hz-form-orange" x1="1" y1="1" x2="0.1" y2="0">
          <stop offset="0%" stopColor="#f2a64a" stopOpacity="0.26" />
          <stop offset="52%" stopColor="#fbb85c" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.10" />
        </linearGradient>

        {/* The broad light mass in the upper right. */}
        <radialGradient id="hz-form-mass" cx="74%" cy="26%" r="72%">
          <stop offset="0%" stopColor="#7cc0ef" stopOpacity="0.38" />
          <stop offset="58%" stopColor="#5cb3ee" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#1076bc" stopOpacity="0" />
        </radialGradient>

        {/* The low warm pool that lifts the bottom-left corner. */}
        <radialGradient id="hz-form-warm" cx="8%" cy="96%" r="68%">
          <stop offset="0%" stopColor="#ffc98a" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#fbb85c" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#fbb85c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The broad light mass, sitting under the forms. */}
      <rect width="2000" height="1126" fill="url(#hz-form-mass)" />
      <rect width="2000" height="1126" fill="url(#hz-form-warm)" />

      {/* The forms themselves, softened as one group so they melt into
          the ground rather than sitting on top of it. */}
      <g filter="url(#hz-form-soft)">
        {/* The lower-left form — a broad, rounded petal rising off
            the bottom edge, the way the reference lifts out of the
            corner. */}
        <path
          d="M -180 520 C 120 630 390 765 605 935 C 700 1015 690 1115 615 1190 L -180 1190 Z"
          fill="url(#hz-form-blue)"
          opacity="0.75"
        />

        {/* The main sweep: a single ribbon that leaves the lower left,
            dips through the centre and lifts out of the upper right. */}
        <path
          d="M -180 865 C 220 1045 620 1095 990 885 C 1340 685 1560 360 1760 20 L 2160 20 C 1900 420 1600 760 1200 950 C 780 1155 260 1115 -180 965 Z"
          fill="url(#hz-form-blue)"
        />

        {/* The form that rises out of the upper right. */}
        <path
          d="M 1480 -80 C 1700 60 1860 225 1910 430 C 1950 595 1885 740 1780 820 C 1700 670 1680 485 1618 340 C 1556 195 1495 85 1410 -10 Z"
          fill="url(#hz-form-blue)"
          opacity="0.8"
        />

        {/* The warm sweep that crosses it — WebEaz's orange. */}
        <path
          d="M 1160 1190 C 1400 950 1620 700 1790 410 L 2090 410 C 1910 760 1690 1020 1460 1190 Z"
          fill="url(#hz-form-orange)"
        />

        {/* The bright edge that reads as the light catching the glass. */}
        <path
          d="M -180 865 C 220 1045 620 1095 990 885 C 1340 685 1560 360 1760 20"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.16"
          strokeWidth="4"
        />
      </g>

      {/* The technical traces running through the middle of the
          field — the reference's circuit pattern, redrawn. */}
      <g
        fill="none"
        stroke="#9ed4f5"
        strokeOpacity="0.2"
        strokeWidth="1.6"
      >
        <path d="M 330 286 L 512 286 L 636 410 L 968 410 L 1092 534 L 1352 534" />
        <path d="M 268 388 L 452 388 L 580 516 L 880 516 L 1004 640 L 1288 640" />
        <path d="M 396 214 L 566 214 L 690 338 L 1046 338 L 1170 462 L 1420 462" />
        <path d="M 210 494 L 398 494 L 524 620 L 792 620 L 916 744 L 1180 744" />
        <path d="M 470 150 L 632 150 L 756 274 L 1104 274 L 1228 398 L 1470 398" />
        <path d="M 176 596 L 360 596 L 486 722 L 726 722 L 850 846 L 1104 846" />
        <path d="M 552 108 L 700 108 L 824 232 L 1156 232 L 1280 356 L 1512 356" />
        <path d="M 142 700 L 322 700 L 448 826 L 664 826 L 788 950 L 1028 950" />
      </g>

      {/* The small square nodes on the traces. */}
      <g fill="#ffffff" fillOpacity="0.42">
        <rect x="326" y="282" width="9" height="9" />
        <rect x="264" y="384" width="9" height="9" />
        <rect x="392" y="210" width="9" height="9" />
        <rect x="206" y="490" width="9" height="9" />
        <rect x="466" y="146" width="9" height="9" />
        <rect x="172" y="592" width="9" height="9" />
        <rect x="548" y="104" width="9" height="9" />
        <rect x="138" y="696" width="9" height="9" />
        <rect x="962" y="406" width="9" height="9" />
        <rect x="876" y="512" width="9" height="9" />
        <rect x="1040" y="334" width="9" height="9" />
        <rect x="786" y="616" width="9" height="9" />
        <rect x="1148" y="228" width="9" height="9" />
        <rect x="722" y="722" width="9" height="9" />
        <rect x="1272" y="352" width="9" height="9" />
        <rect x="1142" y="458" width="9" height="9" />
        <rect x="1412" y="274" width="9" height="9" />
        <rect x="1096" y="640" width="9" height="9" />
      </g>
    </svg>
  );
}

export default function HeroBackground() {
  return (
    <div className="hero-field" aria-hidden="true" style={{ zIndex: 0 }}>
      {/* ===== Layer 1 — the ground and the flowing forms ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* The ground: a soft, light aqua/blue atmosphere with a gentle
            teal depth at its centre so the white hero copy stays legible.
            No hard edges — every field feathers into the next. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 52% 48% at 50% 44%, rgba(26,96,130,0.64), transparent 84%)," +
              "radial-gradient(ellipse 72% 82% at 84% 6%, rgba(255,255,255,0.78), transparent 66%)," +
              "radial-gradient(ellipse 66% 78% at 4% 96%, rgba(174,224,228,0.55), transparent 72%)," +
              "linear-gradient(158deg, #ecf6f9 0%, #d5e9f0 46%, #c2dce6 100%)",
          }}
        />
        <HeroForms />
      </div>

      {/* ===== Layer 2 — the technical dot grid ===== */}
      {/* Fine blue dots on a 35px grid, faded out from a point
          two-fifths across and two-fifths down, so the pattern only
          shows where the light is. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(168,214,247,0.32) 1px, transparent 1px)",
          backgroundSize: "35px 35px",
          maskImage: "radial-gradient(circle at 40% 40%, black, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(circle at 40% 40%, black, transparent 90%)",
          opacity: 0.3,
        }}
      />

      {/* ===== Layers 3, 4 and 5 — the soft light fields ===== */}
      {/* Three heavily blurred discs, each drifting on its own slow
          cycle. The nearest one travels furthest, which is what
          makes the field read as depth rather than as one glow
          sliding about. */}
      <div
        className="hero-orb absolute"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.4,
          background:
            "radial-gradient(circle, rgba(122,196,245,0.20), transparent 70%)",
          top: -120,
          right: -100,
        }}
      />
      <div
        className="hero-orb hero-orb--mid absolute"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.4,
          background:
            "radial-gradient(circle, rgba(251,184,92,0.30), transparent 70%)",
          bottom: -80,
          left: -80,
        }}
      />
      <div
        className="hero-orb hero-orb--inner absolute"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.4,
          background:
            "radial-gradient(circle, rgba(168,214,247,0.13), transparent 70%)",
          top: "50%",
          left: "50%",
        }}
      />

      {/* ===== Layer 6 — the shimmer ===== */}
      {/* A white sweep across the top left and a fine grain over the
          whole field, both barely there, so the ground never looks
          flat. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.40) 0%, transparent 100%)," +
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.02,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  );
}
