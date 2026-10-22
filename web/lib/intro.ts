export const INTRO_STORAGE_KEY = "webeaz_intro_seen";

export function introAlreadySeen(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      sessionStorage.getItem(INTRO_STORAGE_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // sessionStorage unavailable (private mode etc.) — intro simply replays.
  }
}

export function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * External store coordinating the intro splash and the hero
 * entrance. Shared via useSyncExternalStore so no component
 * needs setState-in-effect. `introDone` is initialised from
 * sessionStorage on the client, so returning visitors are
 * instantly "done" without ever painting the splash.
 */
let introDone =
  typeof window !== "undefined" && introAlreadySeen();

const listeners = new Set<() => void>();

export function markIntroDone(): void {
  if (introDone) return;
  introDone = true;
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeIntro(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function getIntroSnapshot(): boolean {
  return introDone;
}

export function getIntroServerSnapshot(): boolean {
  return false;
}

/**
 * The navigation intro — a second, much shorter run of the same
 * brand reveal, played when a visitor moves between pages.
 *
 * The destination is held HERE while the animation plays, rather
 * than in a component, because the navigation itself has to wait
 * for the reveal to resolve. Performing it at that moment is what
 * makes the destination appear to emerge from the intro rather than
 * cut to it.
 *
 * The phase lives here too, so the component can derive everything
 * it needs from a single store read instead of keeping its own copy
 * of the state and syncing the two.
 */
export type NavIntroRequest = {
  /** Where the visitor asked to go, as a path, query and hash. */
  href: string;
  /** Distinguishes this request from the next one. */
  id: number;
  /** "enter" while the reveal plays, "exit" once it has resolved. */
  phase: "enter" | "exit";
  /**
   * The route the visitor was on when the navigation was performed.
   * The new page is compared against it to know when the destination
   * has actually rendered underneath the overlay.
   */
  fromPath: string | null;
};

let navRequest: NavIntroRequest | null = null;
let navSeq = 0;
const navListeners = new Set<() => void>();

const notifyNav = () => {
  for (const listener of navListeners) {
    listener();
  }
};

/**
 * Ask for the navigation intro.
 *
 * A request that arrives while another is still pending is ignored,
 * so one click that happens to fire more than one handler can never
 * start two animations on top of each other.
 */
export function requestNavIntro(href: string): void {
  if (navRequest) return;
  navRequest = { href, id: ++navSeq, phase: "enter", fromPath: null };
  notifyNav();
}

/** Record the route the navigation was performed from. */
export function markNavIntroNavigating(fromPath: string): void {
  if (!navRequest || navRequest.fromPath) return;
  navRequest = { ...navRequest, fromPath };
  notifyNav();
}

/** The reveal has resolved — lift the overlay. */
export function advanceNavIntro(): void {
  if (!navRequest || navRequest.phase === "exit") return;
  navRequest = { ...navRequest, phase: "exit" };
  notifyNav();
}

export function getNavIntroRequest(): NavIntroRequest | null {
  return navRequest;
}

export function getNavIntroServerSnapshot(): NavIntroRequest | null {
  return null;
}

/** Release the request once the intro has finished with it. */
export function clearNavIntroRequest(): void {
  if (!navRequest) return;
  navRequest = null;
  notifyNav();
}

export function subscribeNavIntro(callback: () => void): () => void {
  navListeners.add(callback);
  return () => {
    navListeners.delete(callback);
  };
}
