import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import PortfolioGrid from "@/components/reference/PortfolioGrid";
import { CLIENTS_INTRO } from "@/lib/reference-content";

export const metadata: Metadata = {
  title: "Our Works",
  description:
    "Take a Look at What We Have Made — WebEaz collaborates with forward-thinking entrepreneurs and builds awesome things together.",
  alternates: { canonical: "/clients" },
};

export default function ClientsPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-blue-deep px-5 pb-20 pt-32 text-white sm:px-8 sm:pb-24 sm:pt-40">
        {/* The same warm peach–ivory gradient image as the Home hero. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('/assets/hero/webeaz-hero-bg-warm-2026.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-brand-blue-deep sm:text-4xl lg:text-5xl">
            {CLIENTS_INTRO.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-brand-blue-deep sm:text-lg">
            {CLIENTS_INTRO.subtitle}
          </p>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-h2 text-center font-bold text-ink">{CLIENTS_INTRO.heading}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-muted">
              Web Development · Mobile App · ERP Softwares · Social Media Posters
            </p>
          </Reveal>
          <div className="mt-12">
            <PortfolioGrid />
          </div>
        </div>
      </section>
    </main>
  );
}
