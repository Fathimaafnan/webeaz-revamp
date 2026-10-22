import { processSteps } from "@/lib/smp-page-content";

/**
 * Five-stage SMP process timeline.
 *
 * Same DOM for both layouts: `lg` renders a horizontal rail behind the
 * numbered markers, below `lg` each item becomes a vertical step with
 * its own connector. No resize listener, no duplicated markup.
 */
export default function SmpProcess() {
  return (
    <ol className="relative mt-14 grid gap-8 lg:grid-cols-5 lg:gap-5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-[1.375rem] hidden h-px bg-gradient-to-r from-brand-blue/45 via-brand-orange/45 to-brand-blue/45 lg:block"
      />

      {processSteps.map((s, i) => (
        <li key={s.num} className="relative flex gap-5 lg:block">
          {/* mobile marker + vertical rail */}
          <span className="flex shrink-0 flex-col items-center lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b4b7d,#1076bc)] font-mono text-sm font-bold text-white shadow-md">
              {s.num}
            </span>
            {i < processSteps.length - 1 ? (
              <span
                aria-hidden="true"
                className="mt-2 w-px flex-1 bg-gradient-to-b from-brand-blue/45 to-brand-orange/45"
              />
            ) : null}
          </span>

          <div className="pb-2 lg:mt-7 lg:pb-0 lg:pr-2">
            <span className="mb-5 hidden h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0b4b7d,#1076bc)] font-mono text-sm font-bold text-white shadow-md lg:flex">
              {s.num}
            </span>
            <h3 className="text-base font-semibold tracking-tight text-ink">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted">{s.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}