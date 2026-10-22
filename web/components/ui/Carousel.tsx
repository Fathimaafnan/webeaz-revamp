"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

/**
 * How long one card width takes to travel past the centre. A time,
 * not a distance, so the rail keeps the same readable pace whatever
 * the card width or the viewport.
 */
const DEFAULT_SECONDS_PER_CARD = 8;

/**
 * A small guard so the highlight cannot flip twice while two cards are
 * almost equally close to the middle. Kept deliberately tiny: the rail
 * drifts slowly, so the centre already changes exactly once per card
 * and a larger value would only make the highlight arrive late.
 */
const HYSTERESIS = 0.08;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * A horizontally moving rail of cards with an automatic centre
 * highlight.
 *
 * Two movement styles, because one style cannot serve both kinds of
 * content:
 *
 * - `pingpong` (default) renders the cards exactly once. They drift
 *   across and ease back the other way, so there is no second copy
 *   anywhere in the page and no reset to hide. This is the right
 *   choice for a handful of substantial cards, where a repeating
 *   marquee would just show the reader the same text again and again.
 *
 * - `marquee` renders the set a second time purely so the loop can
 *   wrap without a seam, and is only worth it when there are enough
 *   unique items that the repeat never lands in view — a wall of
 *   client logos, say. The duplicate is `aria-hidden` and `inert`, so
 *   it cannot be read, focused or clicked.
 *
 * `loop` asks for the same wrapping behaviour from `pingpong`, for the
 * sections that want forward-only travel but do not have enough cards
 * for a full wall of logos. See the prop for the details.
 *
 * Whichever style is used, whichever card is nearest the centre of
 * the visible area is the one that is highlighted, worked out from
 * the rail's own geometry rather than from a timer or a click.
 * Hovering changes nothing — the drift does not pause. A visitor can
 * take over by dragging with a mouse, pen or finger; the drag is added
 * to the position rather than replacing it, so the drift carries on
 * from wherever they let go.
 *
 * The wrapper reserves vertical room for the highlighted card's scale
 * and shadow, and clips there, so the lift is never cut off and can
 * never reach the section heading above it.
 */
export default function Carousel({
  children,
  label,
  slideClassName = "",
  className = "",
  secondsPerCard = DEFAULT_SECONDS_PER_CARD,
  gap = 24,
  mode = "pingpong",
  loop = false,
  controls = false,
  pauseOnHover = false,
}: {
  children: ReactNode;
  /** Accessible name for the moving region. */
  label: string;
  /** Width classes applied to each slide. */
  slideClassName?: string;
  className?: string;
  /** Seconds for one card width to travel past the centre. */
  secondsPerCard?: number;
  /** Space between cards in pixels. */
  gap?: number;
  /** `pingpong` for a handful of cards, `marquee` for a long strip. */
  mode?: "pingpong" | "marquee";
  /**
   * Forward-only travel that wraps without a visible reset.
   *
   * The default `pingpong` path eases the rail out to its last card and
   * back again, which is a reversal: the cards change direction twice a
   * lap and a visitor reading one can watch it slide back under them.
   * `loop` removes the turn-around entirely. The set is rendered a
   * second time and the position is taken modulo one full set, so the
   * rail only ever advances and the second copy covers the seam.
   *
   * The copy is `aria-hidden` and `inert`, so it is never announced,
   * focusable or clickable — it is scenery, exactly as in `marquee`.
   */
  loop?: boolean;
  /**
   * Render a pair of circular previous/next buttons.
   *
   * They sit in the gutters to the left and right of the rail, so
   * they never cover a card, and drop below the rail on narrow
   * screens where there is no gutter to sit in. Each press moves the
   * rail exactly one card and holds the automatic drift briefly — see
   * `nudge`.
   */
  controls?: boolean;
  /**
   * Hold the drift still while the pointer is over the carousel.
   *
   * The cards stop exactly where they are and stay there for as long
   * as the pointer is over them, so a card can be read, and they pick
   * up again from the same place when it leaves.
   */
  pauseOnHover?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const total = Children.count(children);
  const reduced = usePrefersReducedMotion();

  /**
   * Both `marquee` and `loop` want one monotonic, wrapping rail, so
   * they share the duplication and the modulo position. `pingpong`
   * without `loop` keeps the original turn-around.
   */
  const isLoop = mode === "marquee" || loop;

  const [centreIndex, setCentreIndex] = useState(0);

  /** Position along the rail's path, in pixels. Monotonic. */
  const phaseRef = useRef(0);
  /**
   * Whether the pointer is over the carousel right now. A ref rather
   * than state: the drift loop reads it on every frame, and a ref
   * keeps that read free of a re-render.
   */
  const hoverRef = useRef(false);
  /** How far the visitor has dragged it, added on top. */
  const dragOffsetRef = useRef(0);
  const centreRef = useRef(0);
  /** Rail geometry, remeasured on resize. */
  const metricsRef = useRef({ step: 0, period: 0, travel: 0, viewportW: 0, itemW: 0 });

  const drag = useRef({ active: false, moved: false, startX: 0, startPhase: 0 });
  /** Set after a real drag so the release click is not treated as a tap. */
  const swallowClick = useRef(false);
  /**
   * R3 time at which the automatic drift may start again. A manual
   * arrow press moves the rail by hand; if the drift kept advancing
   * underneath it the two would fight and the next card would appear
   * to skip. Holding it briefly lets the visitor read what they moved
   * to, and then it carries on from exactly where they left it —
   * `dragOffsetRef` is untouched, so nothing snaps back.
   */
  const resumeAtRef = useRef(0);

  const readMetrics = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const kids = track.children as HTMLCollectionOf<HTMLElement>;
    const originals = isLoop ? kids.length / 2 : kids.length;
    if (kids.length < 2 || originals < 2) return;

    const itemW = kids[0].offsetWidth;
    // The distance between the first two card starts is the exact
    // stride between neighbours, gaps included, whatever spacing is
    // in play.
    const step = kids[1].offsetLeft - kids[0].offsetLeft;
    // The visible width is the rail's container, not the rail: the
    // track is a flex row wide enough to hold every card, so measuring
    // the track would give the whole content width.
    const viewportW = track.parentElement?.clientWidth || track.clientWidth;
    const contentEnd = kids[originals - 1].offsetLeft + kids[originals - 1].offsetWidth;

    metricsRef.current = {
      step,
      // One full set of cards is one lap in marquee mode.
      period: originals * step,
      // How far the rail can travel before the last card is in view.
      travel: Math.max(0, contentEnd - viewportW),
      viewportW,
      itemW,
    };
  }, [isLoop]);

  useEffect(() => {
    readMetrics();
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => readMetrics());
    ro.observe(track);
    return () => ro.disconnect();
  }, [readMetrics]);

  /* The single animation loop. Everything else only feeds it. */
  useEffect(() => {
    let raf = 0;
    let last = 0;

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const track = trackRef.current;
      if (!track) return;

      const { step, period, travel, viewportW, itemW } = metricsRef.current;
      if (step <= 0) return;

      // Capped so a long stall — a backgrounded tab, a heavy frame —
      // cannot teleport the rail when it resumes.
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
      last = t;

      // The drift advances on its own. A drag adds to the position
      // instead of fighting it, so the two never collide. A recent
      // manual nudge holds the drift so it cannot outrun the hand.
      // A pointer over the carousel holds it too, so the cards stand
      // still for as long as anyone is reading them.
      const held = t < resumeAtRef.current;
      if (
        !reduced &&
        !drag.current.active &&
        !held &&
        !hoverRef.current &&
        dt > 0
      ) {
        phaseRef.current += (step / Math.max(secondsPerCard, 0.5)) * dt;
      }

      const phase = phaseRef.current + dragOffsetRef.current;
      let x: number;
      if (isLoop && period > 0) {
        // One lap of the set, forward only. `phase` only ever grows,
        // so the rail never turns round; `mod` folds it back into one
        // set and the duplicate copy covers the seam.
        x = mod(phase, period);
      } else {
        // A single set, eased to a stop at each end and turned back.
        const span = travel * 2;
        if (span <= 0) return;
        const p = mod(phase, span);
        x = p <= travel ? p : span - p;
      }

      track.style.transform = `translate3d(${-x}px, 0, 0)`;

      // Which card is nearest the middle of what is on screen?
      const posInCards = (x + viewportW / 2 - itemW / 2) / step;
      let candidate = Math.round(posInCards) % total;
      if (candidate < 0) candidate += total;
      if (Math.abs(posInCards - centreRef.current) >= 0.5 + HYSTERESIS) {
        centreRef.current = candidate;
        setCentreIndex(candidate);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reduced, total, secondsPerCard, isLoop]);

  /**
   * Move the rail one card by hand and hold the drift briefly.
   * Used by the arrow controls; the keyboard handler adds to the same
   * offset so the two routes cannot drift apart.
   */
  const nudge = useCallback((direction: 1 | -1) => {
    const { step } = metricsRef.current;
    if (step <= 0) return;
    dragOffsetRef.current += direction * step;
    resumeAtRef.current = performance.now() + 4500;
  }, []);

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const { period, travel, viewportW } = metricsRef.current;
    const canMove = isLoop ? period > viewportW + 1 : travel > 4;
    if (!canMove) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startPhase: dragOffsetRef.current,
    };
    e.currentTarget.classList.add("is-dragging");
  }, [isLoop]);

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    if (!drag.current.moved) return;
    // Stop the page from panning sideways under the gesture while
    // still letting a vertical finger-scroll pass through.
    if (e.cancelable) e.preventDefault();
    dragOffsetRef.current = drag.current.startPhase - dx;
  }, []);

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const { moved } = drag.current;
    drag.current.active = false;
    e.currentTarget.classList.remove("is-dragging");
    if (moved) swallowClick.current = true;
  }, []);

  const onKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (metricsRef.current.step <= 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nudge(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nudge(-1);
    }
  }, [nudge]);

  const items = Children.toArray(children);

  const stopHover = () => {
    if (!pauseOnHover) return;
    hoverRef.current = false;
  };
  const startHover = () => {
    if (!pauseOnHover) return;
    hoverRef.current = true;
  };

  return (
    // The root is now a positioned wrapper rather than the clipped box
    // itself, so the arrow buttons can sit OUTSIDE the clip in the
    // gutters beside the rail. `min-w-0` stays on it for the same
    // reason it was on the old root: a grid or flex item defaults to
    // `min-width: auto`, which would be sized by the full width of
    // every card and push this column past the viewport.
    <div
      className="relative min-w-0"
      onPointerEnter={startHover}
      onPointerLeave={stopHover}
    >
      {/* The vertical padding is what keeps the highlighted card's lift
          and shadow inside the clip instead of against the heading, and
          `overflow-hidden` is load-bearing: it fixes this element's
          automatic minimum size to zero so a grid or flex column is not
          forced open by the full width of every card. */}
      <div className={`min-w-0 overflow-hidden px-1 py-4 pb-8 ${className}`.trim()}>
      <div
        ref={trackRef}
        role="group"
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        // A drag that happens to end over a link must not also fire it.
        onClickCapture={(e) => {
          if (!swallowClick.current) return;
          swallowClick.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyDown={onKeyDown}
        className="rail-track"
        style={{ gap }}
      >
        {items.map((child, i) => (
          <div
            key={`a${i}`}
            className={`rail-item ${slideClassName}`}
            data-center={i === centreIndex ? "true" : "false"}
          >
            {child}
          </div>
        ))}

        {/* Only a wrapping rail needs this. The extra copy exists purely so
            the lap has somewhere to come back to; it is hidden from
            assistive tech and inert, so nothing in it can be read,
            focused or activated. */}
        {isLoop
          ? items.map((child, i) => (
              <div key={`b${i}`} className={`rail-item ${slideClassName}`} aria-hidden="true" inert>
                {child}
              </div>
            ))
          : null}
      </div>
      </div>

      {/* The arrows. They sit outside the clipped box, so they are
          never cropped, and outside the rail, so they never cover a
          card. On a wide screen they stand in the gutters to the left
          and the right of the cards; below that there is no gutter to
          stand in, so the same pair drops below the rail and centres
          itself there instead. Each press moves the rail exactly one
          stride and holds the automatic drift for a few seconds — see
          `nudge`. */}
      {controls ? (
        <div className="mt-6 flex items-center justify-center gap-3 xl:absolute xl:inset-y-0 xl:-left-14 xl:-right-14 xl:mt-0 xl:justify-between">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label={`Previous ${label.toLowerCase()}`}
            className="carousel-arrow"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label={`Next ${label.toLowerCase()}`}
            className="carousel-arrow"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}