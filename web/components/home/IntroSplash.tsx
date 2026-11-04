"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  advanceNavIntro,
  clearNavIntroRequest,
  getIntroServerSnapshot,
  getIntroSnapshot,
  getNavIntroRequest,
  getNavIntroServerSnapshot,
  introAlreadySeen,
  markIntroDone,
  markIntroSeen,
  markNavIntroNavigating,
  reducedMotion,
  subscribeIntro,
  subscribeNavIntro,
} from "@/lib/intro";

// Runs before first paint on the client (no-op on the server) so
// returning visitors never see the splash flash.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The official WebEaz logo, as the intro's wordmark.
 *
 * `public/webeaz-logo.png` (1746x483) is the single official logo
 * asset for the site — the supplied WebEaz logo artwork, cropped
 * only of the empty margins around it. The navbar, the footer, the
 * service-page lockups and the structured data all resolve to this
 * same file, so the intro is guaranteed to match every other
 * placement.
 *
 * The file is stored well above display size (the splash shows it
 * at most ~368px wide, the file is 1746px), so the browser only
 * ever downscales it and the wordmark and tagline stay sharp at
 * every pixel density.
 *
 * The artwork is never touched: no recolour, no redraw, no
 * approximation in text, no filter, no mask.
 */
const WORDMARK_SRC = "/webeaz-logo.png";
const WORDMARK_W = 1746;
const WORDMARK_H = 483;

/* --- Opening (first load) timing. The original splash ran ~5.2s;
   it still does, with the logo taking the place of the letters. --- */
const BOOT_RULE_AT = 1250;
const BOOT_HOLD_UNTIL = 4500;
const BOOT_EXIT_MS = 520;

/* --- Navigation timing. Short enough to feel like a transition
   rather than a wait: the whole run is ~1.1s. --- */
const NAV_RULE_AT = 260;
const NAV_NAVIGATE_AT = 700;
const NAV_EXIT_MS = 420;
/* Safety net. If the route never changes — a push the router
   refuses, an interrupted animation — the overlay must not be left
   on the screen. */
const NAV_ROUTE_TIMEOUT = 2600;

/** The opening reveal is identified by this, so its counters can be
    told apart from a navigation's. */
const BOOT_ID = 0;

type BootPhase = "enter" | "exit" | "done";

// Guards the one-time session decision against React
// StrictMode's double-invoked effects in development.
let introInitialized = false;

/**
 * WebEaz brand reveal, in two modes.
 *
 * 1. OPENING — the original splash. Shown once per browser session,
 *    the first time the site is opened. The official WebEaz colour
 *    logo fades up over a soft blue/orange bloom, the accent rule
 *    draws in beneath it, it holds, and it eases away.
 *
 * 2. NAVIGATION — the same reveal, much shorter. Played when one of
 *    the main navigation actions is used, so a route change reads as
 *    the brand handing over to the next page rather than as a cut.
 *    The destination is remembered while the reveal plays and the
 *    navigation happens at the moment the logo has resolved; the
 *    overlay then lifts off the page that has already rendered
 *    underneath it, so there is no white flash and no layout jump.
 *
 * - Shown once per browser session for the opening; on demand for
 *   navigation.
 * - Skipped entirely for prefers-reduced-motion users, who are
 *   taken straight to their destination.
 * - The opening is coordinated with the hero via the shared intro
 *   store. The navigation is NOT triggered by a global link
 *   interceptor: it is asked for explicitly by the navigation
 *   actions that are allowed to show it, so every card, service
 *   link, product card, article card and content button on the site
 *   keeps navigating exactly as it did before.
 */
export default function IntroSplash() {
  const router = useRouter();
  const pathname = usePathname();

  const bootDone = useSyncExternalStore(
    subscribeIntro,
    getIntroSnapshot,
    getIntroServerSnapshot,
  );
  const navRequest = useSyncExternalStore(
    subscribeNavIntro,
    getNavIntroRequest,
    getNavIntroServerSnapshot,
  );

  /* --- Opening state. Every setState here happens in a timer
     callback, never synchronously in an effect body. --- */
  const [bootPhase, setBootPhase] = useState<BootPhase>("enter");
  const [bootRule, setBootRule] = useState({ id: BOOT_ID, on: false });

  /* --- Navigation state, tagged with the request it belongs to, so
     a new request starts from nothing without needing the old one
     reset first. --- */
  const [navRule, setNavRule] = useState({ id: 0, on: false });

  /**
   * The navigation's phase comes from the store and nowhere else.
   * Keeping a second copy here would mean the two could disagree,
   * and the overlay would never be told to lift.
   */
  const isNav = navRequest !== null;
  const navId = navRequest?.id ?? 0;
  const navPhase = navRequest?.phase ?? "enter";
  const activePhase = isNav ? navPhase : bootPhase;
  const activeId = isNav ? navId : BOOT_ID;

  useIsomorphicLayoutEffect(() => {
    if (introInitialized) return;
    introInitialized = true;

    if (reducedMotion() || introAlreadySeen()) {
      // Returning visit or reduced motion — complete instantly,
      // before first paint.
      markIntroDone();
    } else {
      markIntroSeen();
    }
  }, []);

  /**
   * Perform the navigation the visitor asked for.
   *
   * A different page is pushed through the App Router, so no full
   * reload happens and the client keeps its state. A destination on
   * the page the visitor is already on is scrolled to instead,
   * smoothly, which is the behaviour a plain anchor link would have
   * had.
   *
   * The current route is read from `window.location` at the moment
   * of the call rather than from the render, so the function does
   * not change identity when the route does — which is what lets it
   * sit in the timer effect's dependencies without restarting the
   * reveal the instant the route changes.
   */
  const performNavigation = useCallback(() => {
    const request = getNavIntroRequest();
    if (!request) return;

    const url = new URL(request.href, window.location.href);
    const samePage =
      url.pathname === window.location.pathname &&
      url.search === window.location.search;

    if (samePage) {
      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        const el =
          document.getElementById(id) ||
          (id ? document.querySelector(`[id="${CSS.escape(id)}"]`) : null);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
      advanceNavIntro();
      return;
    }

    // A different page. The overlay stays up until the new route has
    // rendered underneath it, so the destination is never seen
    // mid-transition and there is no flash.
    markNavIntroNavigating(window.location.pathname);
    router.push(url.pathname + url.search + url.hash);
  }, [router]);

  /* ------------------------------------------------------------------
     The reveal. One timer set drives whichever mode is running; the
     phase change re-runs this effect with the next step's timers.

     Nothing here is a direct setState in an effect body — every
     state change happens inside a timer callback, which is where
     the animation actually needs it.
     ------------------------------------------------------------------ */
  useEffect(() => {
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    if (isNav) {
      if (navPhase === "enter") {
        later(() => setNavRule({ id: navId, on: true }), NAV_RULE_AT);
        later(() => performNavigation(), NAV_NAVIGATE_AT);
      } else if (navPhase === "exit") {
        // The destination has rendered underneath. Lift the overlay.
        later(() => clearNavIntroRequest(), NAV_EXIT_MS);
      }
    } else if (bootPhase === "enter") {
      later(() => setBootRule({ id: BOOT_ID, on: true }), BOOT_RULE_AT);
      later(() => setBootPhase("exit"), BOOT_HOLD_UNTIL);
    } else if (bootPhase === "exit") {
      later(() => {
        setBootPhase("done");
        markIntroDone();
      }, BOOT_EXIT_MS);
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [isNav, navId, navPhase, bootPhase, performNavigation]);

  /* Once the route has actually changed, the new page is rendered
     behind the overlay — lift it. */
  useEffect(() => {
    if (!isNav) return;
    if (navPhase !== "enter") return;
    const from = navRequest?.fromPath;
    if (!from) return;
    if (pathname === from) return;
    advanceNavIntro();
  }, [pathname, isNav, navPhase, navRequest?.fromPath]);

  /* Safety net: if the route never changes, do not leave the
     overlay on the screen. */
  useEffect(() => {
    if (!isNav || navPhase !== "enter") return;
    const timer = window.setTimeout(() => advanceNavIntro(), NAV_ROUTE_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [isNav, navPhase]);

  /* --- What is on screen right now. --- */
  const visible =
    !bootDone && (isNav || bootPhase !== "done");
  if (!visible) return null;

  const ruleShown = isNav
    ? navRule.on && navRule.id === activeId
    : bootRule.on && bootRule.id === activeId;

  return (
    <div
      className={`webeaz-intro fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white ${
        activePhase === "exit" ? "intro-leave" : "intro-enter"
      }`}
      style={isNav ? { animationDuration: "340ms" } : undefined}
      role="status"
    >
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: ".webeaz-intro{display:none!important}",
          }}
        />
      </noscript>

      {/* The soft blue/orange bloom the logo sits in. It is a wash
          behind the artwork, not a filter on it — the logo's own
          colours are untouched. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[20rem] w-[36rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(16,118,188,0.20),rgba(247,149,34,0.12),transparent_76%)] blur-2xl"
      />

      <div className="intro-item relative flex flex-col items-center">
        {/* The wordmark, centred, at its own proportion.

            This is the reference's reveal rather than a fade: the
            whole word sits behind as a faint ghost, and the two
            halves of the lockup turn in on the Y axis over it,
            staggered, each pivoting on its own centre. The ghost is
            the same artwork at low opacity, so the coloured letters
            land exactly on top of it and cover it completely.

            All three are the same 4x file, and the two halves are
            cut with `clip-path` rather than as separate images, so
            they are guaranteed to register pixel-perfectly with the
            ghost underneath.

            Nothing blurs the artwork: the bloom is a separate
            element BEHIND the wordmark, and the wordmark itself
            carries no filter and no opacity. */}
        <div
          className="relative w-[min(78vw,23rem)]"
          style={{ aspectRatio: `${WORDMARK_W} / ${WORDMARK_H}` }}
        >
          {/* The wordmark — rendered once, in full colour. */}
          <Image
            src={WORDMARK_SRC}
            alt=""
            aria-hidden="true"
            width={WORDMARK_W}
            height={WORDMARK_H}
            priority
            fetchPriority="high"
            unoptimized
            sizes="(min-width: 640px) 23rem, 78vw"
            className="absolute inset-0 h-full w-full object-contain"
          />

          {/* The name is announced once, in full. */}
          <span className="sr-only">WebEaz</span>
        </div>

        {/* Accent rule beneath the logo. */}
        <span
          aria-hidden="true"
          className={`mt-7 block h-px w-16 bg-gradient-to-r from-brand-blue to-brand-orange transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            ruleShown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
