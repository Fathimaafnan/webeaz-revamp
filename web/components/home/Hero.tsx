"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import {
  getIntroSnapshot,
  getIntroServerSnapshot,
  subscribeIntro,
} from "@/lib/intro";
import type { HomeContent } from "@/lib/defaults";

export default function Hero({ content }: { content: HomeContent }) {
  const introDone = useSyncExternalStore(
    subscribeIntro,
    getIntroSnapshot,
    getIntroServerSnapshot,
  );
  const hidden = !introDone;

  const entrance = (delay = 0) => ({
    className: `hero-item transition-all duration-700 ease-out ${
      hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section
      className="hero-base relative flex min-h-[100svh] items-center overflow-hidden"
      aria-label="WebEaz introduction"
    >
      {/* The inserted warm peach–ivory gradient, covering the whole hero
          section. Text, illustration and every other layer stay as-is. */}
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

      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".hero-item{opacity:1!important;transform:none!important}",
          }}
        />
      </noscript>

      <div className="hero-layout relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-28 sm:gap-12 sm:px-8 sm:py-36 md:grid-cols-[1.05fr_0.95fr] md:gap-7 lg:gap-12">
        <div className="relative z-10 text-center md:text-left">
          <div {...entrance()}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-brand-blue-deep/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue-deep backdrop-blur-md">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
              {content.heroEyebrow}
            </p>
          </div>

          <div {...entrance(90)}>
            <h1 className="hero-title mx-auto mt-6 text-balance font-bold text-brand-blue-deep sm:mt-7 md:mx-0">
              {content.heroTitle.split(/(\.)/g).map((part, index) =>
                part === "." ? (
                  <span
                    key={index}
                    style={{ color: "var(--color-brand-orange)" }}
                  >
                    .
                  </span>
                ) : (
                  part
                ),
              )}
            </h1>
          </div>

          <div {...entrance(180)}>
            <p className="mx-auto mt-5 max-w-xl text-lead text-brand-blue-deep sm:mt-6 md:mx-0">
              {content.heroDescription}
            </p>
          </div>

          <div {...entrance(270)}>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center md:justify-start">
              <Button href={content.heroPrimaryHref} variant="heroOrange">
                {content.heroPrimaryLabel}
              </Button>
              <Button href={content.heroSecondaryHref} variant="heroPrimary">
                {content.heroSecondaryLabel}
              </Button>
            </div>
          </div>
        </div>

        {/* The inserted illustration, kept at its original proportions and
            displayed on the right of the two-column hero. */}
        <div className="relative z-10 flex w-full items-center justify-center md:justify-end">
          <div
            className={`hero-item w-full transition-all duration-700 ease-out ${
              hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
            }`}
            style={{ transitionDelay: "180ms" }}
          >
            <div className="relative mx-auto aspect-[1200/896] w-[82vw] max-w-[560px] md:mx-0 md:w-full md:max-w-[620px]">
              <Image
                src="/assets/hero/webeaz-hero-duo-2026.png"
                alt="WebEaz team collaborating with digital tools"
                fill
                priority
                sizes="(min-width: 768px) 620px, 82vw"
                className="object-contain object-center drop-shadow-[0_24px_50px_rgba(6,40,63,0.18)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
