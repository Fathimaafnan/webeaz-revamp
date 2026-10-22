import ServiceIcon from "@/components/services/ServiceIcon";
import { processSteps } from "@/lib/sem-page-content";

/**
 * Five-step SEM process.
 *
 * Desktop (lg+) renders a horizontal timeline with a single
 * connecting line running behind the numbered markers. Below `lg`
 * it collapses to a vertical timeline with its own vertical rule.
 * Both are the same DOM — only CSS changes the direction — so there
 * is no duplicated markup and no resize listener.
 */
export default function SemProcess() {
  return (
    <ol className="relative mt-14 grid gap-8 lg:grid-cols-5 lg:gap-5">
      {/* Horizontal connector — desktop only */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-[1.4rem] hidden h-px bg-gradient-to-r from-brand-blue/40 via-brand-orange/40 to-brand-blue/40 lg:block"
      />

      {processSteps.map((s, i) => (
        <li key={s.num} className="relative flex gap-5 lg:block">
          {/* Marker + vertical connector — mobile only */}
          <span className="relative flex shrink-0 flex-col items-center lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b4b7d,#1076bc)] font-mono text-sm font-bold text-white shadow-md">
              {s.num}
            </span>
            {i < processSteps.length - 1 ? (
              <span
                aria-hidden="true"
                className="mt-2 w-px flex-1 bg-gradient-to-b from-brand-blue/40 to-brand-orange/40"
              />
            ) : null}
          </span>

          <div className="pb-2 lg:mt-7 lg:pb-0 lg:pr-2">
            {/* Desktop marker */}
            <span className="mb-5 hidden h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b4b7d,#1076bc)] font-mono text-sm font-bold text-white shadow-md lg:flex">
              {s.num}
            </span>
            <h3 className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-ink">
              <ServiceIcon
                name={(["seo", "marketing", "cloud", "process", "workflow"] as const)[i]}
                className="h-4 w-4 shrink-0 text-brand-orange-strong lg:hidden"
              />
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{s.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}