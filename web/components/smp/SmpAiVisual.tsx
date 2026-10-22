import ServiceIcon from "@/components/services/ServiceIcon";

/**
 * Abstract AI + social analytics visual for the AI-integrated section.
 *
 * Purely structural: an insight panel, sentiment bars, a content
 * pipeline and a planning horizon. No scores, no sentiment numbers,
 * no predicted outcomes — nothing that could be read as a real
 * WebEaz measurement or a proprietary system.
 */
export default function SmpAiVisual() {
  return (
    <div className="relative rounded-3xl border border-white/12 bg-white/[0.04] p-5 shadow-[0_40px_90px_-44px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:p-6">
      {/* Insight header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-blue-light/30 bg-brand-blue/12">
          <ServiceIcon name="ai-automation" className="h-4 w-4 text-brand-blue-light" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
            AI-assisted analysis
          </p>
          <p className="mt-0.5 text-[11px] leading-4 text-white/55">
            Human-reviewed, platform-available data
          </p>
        </div>
      </div>

      {/* Audience signal clusters */}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {[
          { label: "Interest cluster", tone: "bg-brand-orange/16 border-brand-orange/30" },
          { label: "Content preference", tone: "bg-brand-blue/16 border-brand-blue-light/30" },
          { label: "Engagement pattern", tone: "bg-brand-blue/16 border-brand-blue-light/30" },
          { label: "Potential segment", tone: "bg-brand-orange/16 border-brand-orange/30" },
        ].map((c) => (
          <div
            key={c.label}
            className={`rounded-xl border p-3 ${c.tone} flex items-center gap-2.5`}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span className="text-[11px] font-medium leading-4 text-white/70">
              {c.label}
            </span>
          </div>
        ))}
      </div>

      {/* Sentiment bars */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
          Conversation sentiment
        </p>
        <div className="mt-3.5 space-y-2.5" aria-hidden="true">
          {[
            { w: 78, c: "bg-brand-orange/70" },
            { w: 54, c: "bg-brand-blue-light/65" },
            { w: 32, c: "bg-white/22" },
          ].map((s, i) => (
            <span key={i} className="block h-2 rounded-full bg-white/[0.06]">
              <span
                className={`block h-full rounded-full ${s.c}`}
                style={{ width: `${s.w}%` }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Content pipeline */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
          Ideation to publish
        </p>
        <div className="mt-3.5 flex items-center gap-1.5" aria-hidden="true">
          {["Discover", "Draft", "Review", "Publish"].map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-1.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[9px] font-semibold ${
                  i === 2
                    ? "bg-brand-orange text-ink"
                    : "border border-white/12 bg-white/[0.06] text-white/65"
                }`}
              >
                {i + 1}
              </span>
              {i < 3 ? (
                <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-white/8" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex justify-between" aria-hidden="true">
          {["Discover", "Draft", "Review", "Publish"].map((s) => (
            <span key={s} className="text-[9px] leading-4 text-white/55">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Planning horizon */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
          Planning horizon
        </p>
        <div className="mt-3.5 flex items-center gap-3">
          <span className="h-2 flex-1 rounded-full bg-gradient-to-r from-brand-orange/70 via-brand-orange/35 to-transparent" />
          <span className="h-3 w-3 shrink-0 rounded-full border-2 border-brand-orange bg-brand-blue-deep" />
        </div>
        <p className="mt-2.5 text-[10px] leading-4 text-white/55">
          Scenario planning only — forecasts are not guaranteed results.
        </p>
      </div>

      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-white/55">
        Illustrative — no real WebEaz data
      </p>
    </div>
  );
}