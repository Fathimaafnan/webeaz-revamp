import ServiceIcon from "@/components/services/ServiceIcon";

/**
 * Campaign analytics dashboard visual for the SEM measurement section.
 *
 * Deliberately contains NO numbers — no spend, CPA, ROAS, conversion
 * percentages or revenue. Every chart is an abstract shape driven by
 * a fixed array of widths, and the whole panel is labelled as
 * illustrative demo data. Nothing here can be mistaken for a real
 * WebEaz campaign result.
 */

const trend = [34, 48, 41, 58, 52, 67, 61, 74, 69, 82];
const funnel = [
  { label: "Impressions", width: 100 },
  { label: "Clicks", width: 72 },
  { label: "Sessions", width: 55 },
  { label: "Conversions", width: 32 },
];

export default function SemAnalyticsDashboard() {
  return (
    <div className="relative rounded-3xl border border-white/12 bg-white/[0.04] p-5 shadow-[0_36px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-6">
      {/* Window chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-orange/70" />
          <span className="h-2 w-2 rounded-full bg-brand-blue-light/70" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
          Campaign overview
        </span>
      </div>

      {/* Metric tiles — labels only */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: "Conversions", icon: "crm" as const },
          { label: "Cost / conv.", icon: "ads" as const },
          { label: "ROAS", icon: "sales-automation" as const },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
          >
            <ServiceIcon name={m.icon} className="h-3.5 w-3.5 text-brand-orange-light" />
            <p className="mt-2.5 text-[10px] font-medium leading-4 text-white/55">
              {m.label}
            </p>
            {/* placeholder rule, deliberately empty of any figure */}
            <span
              aria-hidden="true"
              className="mt-2 block h-1.5 w-10 rounded-full bg-white/12"
            />
          </div>
        ))}
      </div>

      {/* Trend chart — abstract bars */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
            Performance trend
          </span>
          <span className="h-2 w-12 rounded-full bg-brand-orange/35" />
        </div>
        <div className="mt-4 flex h-24 items-end gap-1.5" aria-hidden="true">
          {trend.map((h, i) => (
            <span
              key={i}
              className={`w-full rounded-sm ${
                i >= trend.length - 3
                  ? "bg-[linear-gradient(180deg,#f79522_0%,rgba(247,149,34,0.35)_100%)]"
                  : "bg-white/12"
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between" aria-hidden="true">
          <span className="h-1 w-6 rounded-full bg-white/10" />
          <span className="h-1 w-6 rounded-full bg-white/10" />
          <span className="h-1 w-6 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
          Conversion funnel
        </span>
        <div className="mt-4 space-y-2" aria-hidden="true">
          {funnel.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-[10px] text-white/55">
                {s.label}
              </span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <span
                  className={`block h-full rounded-full ${
                    i === funnel.length - 1
                      ? "bg-[linear-gradient(90deg,#f79522,#e07f0f)]"
                      : "bg-brand-blue/45"
                  }`}
                  style={{ width: `${s.width}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search-term rows */}
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
          Search-term performance
        </span>
        <div className="mt-3 space-y-2" aria-hidden="true">
          {[86, 64, 48, 33].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-brand-blue-light/60" />
              <span
                className="h-2 rounded-full bg-white/10"
                style={{ width: `${w}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-white/55">
        Illustrative demo data — no real WebEaz campaign figures
      </p>
    </div>
  );
}