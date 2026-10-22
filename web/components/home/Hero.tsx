"use client";

import { useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import HeroBackground from "./HeroBackground";
import {
  getIntroSnapshot,
  getIntroServerSnapshot,
  subscribeIntro,
} from "@/lib/intro";

/**
 * Full-bleed dark hero over an animated brand-blue field of
 * morphing masses and expanding rings. Content entrance is
 * coordinated with the IntroSplash through the shared
 * intro store, so the sequence feels like one continuous
 * experience: logo intro → hero environment → headline
 * → text → CTAs.
 */
export default function Hero() {
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

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <div {...entrance()}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange shadow-[0_0_10px_rgba(247,149,34,0.9)]" />
              Technology • Growth • Automation • AI
            </p>
          </div>

          <div {...entrance(90)}>
            <h1 className="mt-7 text-display font-bold text-white">
              Build<span className="text-brand-orange">.</span> Transform
              <span className="text-brand-orange">.</span>
              <br />
              Automate<span className="text-brand-orange">.</span> Grow
              <span className="text-brand-orange">.</span>
            </h1>
          </div>

          <div {...entrance(180)}>
            <p className="mx-auto mt-7 max-w-2xl text-lead text-white/70">
              Technology and digital solutions that help businesses build,
              transform, automate and grow.
            </p>
          </div>

          <div {...entrance(270)}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button href="/services" variant="heroOrange">
                Explore Capabilities
              </Button>
              <Button href="/contact" variant="heroPrimary">
                Let&apos;s Talk
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
