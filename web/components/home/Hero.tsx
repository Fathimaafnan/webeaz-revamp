"use client";

import { useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import HeroBackground from "./HeroBackground";
import HeroVisual from "./HeroVisual";
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
      {content.heroImage ? (
        <div className="pointer-events-none absolute inset-0 z-[1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.heroImage}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-brand-blue-deep/80" />
        </div>
      ) : null}

      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".hero-item{opacity:1!important;transform:none!important}",
          }}
        />
      </noscript>

      <div className="hero-layout relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-12 pt-28 sm:gap-12 sm:px-8 sm:pb-16 sm:pt-36 md:grid-cols-[1.08fr_0.92fr] md:gap-7 lg:gap-12">
        <div className="relative z-10">
          <div {...entrance()}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-brand-blue-deep/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
              {content.heroEyebrow}
            </p>
          </div>

          <div {...entrance(90)}>
            <h1 className="hero-title mt-6 text-balance font-bold text-white sm:mt-7">
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
            <p className="mt-5 max-w-xl text-lead text-white sm:mt-6">
              {content.heroDescription}
            </p>
          </div>

          <div {...entrance(270)}>
            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href={content.heroPrimaryHref} variant="heroOrange">
                {content.heroPrimaryLabel}
              </Button>
              <Button href={content.heroSecondaryHref} variant="heroPrimary">
                {content.heroSecondaryLabel}
              </Button>
            </div>
          </div>
        </div>

        <div {...entrance(360)} className="relative z-10 w-full md:min-w-0">
          <div className="relative w-full h-[26rem] md:h-[36rem]">
            <HeroVisual />
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-0"
              role="img"
              aria-label="Software dashboard preview showing business growth, digital performance, automated workflows and AI insights"
            >
              <div className="hero-dashboard mx-auto w-full max-w-[34rem]">
              <div className="flex items-center gap-2.5">
                <span className="hero-dashboard__appmark" aria-hidden="true">
                  <span />
                </span>
                <span className="text-sm font-bold tracking-tight text-slate-900">
                  Business workspace
                </span>
              </div>
              <span className="hero-dashboard__live">
                <span aria-hidden="true" />
                Live
              </span>
            <div className="hero-dashboard__content">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Monday, October 26
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
                    Growth overview
                  </h2>
                </div>
                <span className="hero-dashboard__period">This month</span>
              </div>

              <div className="hero-dashboard__metrics">
                <div className="hero-dashboard__metric">
                  <span>Pipeline</span>
                  <strong>$84.2k</strong>
                  <small>+12.8%</small>
                </div>
                <div className="hero-dashboard__metric">
                  <span>Conversions</span>
                  <strong>248</strong>
                  <small>+8.4%</small>
                </div>
                <div className="hero-dashboard__metric">
                  <span>Workflows</span>
                  <strong>18</strong>
                  <small>Automated</small>
                </div>
              </div>

              <div className="hero-dashboard__lower">
                <div className="hero-dashboard__chart">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Digital performance
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Qualified leads
                      </p>
                    </div>
                    <span className="hero-dashboard__chart-change">+24%</span>
                  </div>
                  <div className="hero-dashboard__bars" aria-hidden="true">
                    <span style={{ height: "36%" }} />
                    <span style={{ height: "50%" }} />
                    <span style={{ height: "42%" }} />
                    <span style={{ height: "68%" }} />
                    <span style={{ height: "57%" }} />
                    <span style={{ height: "78%" }} />
                    <span style={{ height: "92%" }} />
                  </div>
                  <div
                    className="hero-dashboard__days"
                    aria-hidden="true"
                  >
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                <div className="hero-dashboard__insight">
                  <span
                    className="hero-dashboard__insight-icon"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <p className="text-xs font-bold text-slate-900">AI insight</p>
                  <p className="mt-1.5 text-[11px] leading-4 text-slate-600">
                    Lead conversion is up 18% this month.
                  </p>
                  <div className="hero-dashboard__workflow">
                    <span aria-hidden="true" />
                    Follow-up flow active
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
