"use client";

import { useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import HeroBackground from "./HeroBackground";
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
      <HeroBackground />

      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".hero-item{opacity:1!important;transform:none!important}",
          }}
        />
      </noscript>

      <div className="hero-layout relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-28 sm:gap-12 sm:px-8 sm:py-36 md:gap-7 lg:gap-12">
        <div className="relative z-10 text-center">
          <div {...entrance()}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-brand-blue-deep/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
              {content.heroEyebrow}
            </p>
          </div>

          <div {...entrance(90)}>
            {/* The heading sits in the middle of the hero now, so it is
                centred in the column like everything else around it.
                Nothing about the type itself changes. */}
            <h1 className="hero-title mx-auto mt-6 text-balance font-bold text-white sm:mt-7">
              {content.heroTitle.split(/(\.)/g).map((part, index) =>
                part === "." ? (
                  <span key={index} className="text-brand-orange">
                    .
                  </span>
                ) : (
                  part
                ),
              )}
            </h1>
          </div>

          <div {...entrance(180)}>
            <p className="mx-auto mt-5 max-w-xl text-lead text-white sm:mt-6">
              {content.heroDescription}
            </p>
          </div>

          <div {...entrance(270)}>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href={content.heroPrimaryHref} variant="heroOrange">
                {content.heroPrimaryLabel}
              </Button>
              <Button href={content.heroSecondaryHref} variant="heroPrimary">
                {content.heroSecondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
