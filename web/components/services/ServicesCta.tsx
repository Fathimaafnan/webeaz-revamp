import type { ReactNode } from "react";

/**
 * The closing band for the Services pages.
 *
 * This is the Digital page's closing CTA, moved out of the white
 * section and given the full width of the viewport. On that page it
 * sits as an inset panel at the foot of a white section; here it
 * closes the page in the brand's deep blue, so every Services route
 * reads as blue field, white working section, deep-blue close —
 * the same three-part rhythm, with the colour landing harder.
 *
 * The band is the Digital page's own closing panel: a deep-blue
 * field, a white heading, a soft body line, and an orange action
 * on the right. `brand-blue-deep` and `brand-orange` are existing
 * project tokens, so nothing new is introduced.
 */
export default function ServicesCta({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  /** The action, or actions, on the right. */
  children?: ReactNode;
}) {
  return (
    <section className="bg-brand-blue-deep px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/15 bg-white/5 p-7 text-center backdrop-blur-sm sm:flex-row sm:text-left sm:p-8">
          <div className="flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              {title}
            </h2>
            {body ? (
              <p className="mt-2 text-sm leading-6 text-white/80">{body}</p>
            ) : null}
          </div>
          {children ? <div className="flex shrink-0 flex-wrap gap-3">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
