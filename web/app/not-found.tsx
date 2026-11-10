import Button from "@/components/ui/Button";

/**
 * Custom 404 page — root `not-found.tsx` handles both unmatched URLs
 * (rendered inside the root layout) and `notFound()` thrown by any
 * route (rendered inside that route's layout). Self-contained and
 * built only from existing design tokens: brand blue heading, ink
 * text, and the shared `Button` component (next/link) for the
 * homepage CTA.
 */
export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center bg-white px-5 py-20 text-center sm:py-28">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
          WebEaz Technologies
        </p>
        <h1 className="mt-4 text-7xl font-extrabold tracking-tight text-brand-blue sm:text-8xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
          Page Not Found
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-ink/70">
          Sorry, the page you are looking for doesn&apos;t exist or may have been
          moved.
        </p>
        <div className="mt-8">
          <Button href="/" variant="primary">
            Go to Homepage
          </Button>
        </div>
      </div>
    </section>
  );
}
