/**
 * Cookie consent state for the public website.
 *
 * Audit note (Task 10): the site currently sets only *necessary*
 * cookies — the NextAuth session, callback-url and CSRF cookies.
 * There are no analytics or marketing scripts anywhere in the
 * codebase (no gtag/GTM, no pixels, no analytics SDK), so no
 * optional cookie is set today. The optional categories below are
 * therefore consent *gates*: `hasConsent()` is the single check a
 * future optional script must pass before it may load or set a
 * cookie. Nothing optional runs today because nothing optional
 * exists — not because it is silently blocked.
 *
 * Consent is recorded in localStorage rather than a cookie, so
 * saving a choice never itself sets a cookie. The record holds
 * only the category booleans, a format version and a timestamp —
 * no personal information.
 *
 * All functions are safe to call during SSR (they return the
 * "no consent" state on the server).
 */

/** Storage key for the consent record. */
export const CONSENT_STORAGE_KEY = "webeaz-cookie-consent";

/**
 * Consent format version. Stored with each record; a record written
 * by an older format is treated as "no choice" so visitors are
 * asked again after a material change to this model.
 */
export const CONSENT_VERSION = 1;

/** Optional categories that require consent before use. */
export type OptionalConsentCategory = "analytics" | "marketing";

/** Every category, including the non-optional one. */
export type ConsentCategory = "necessary" | OptionalConsentCategory;

export type ConsentPreferences = {
  /** Essential cookies (authentication, security, session). Always on. */
  necessary: true;
  /** Analytics cookies/scripts — off until explicitly consented. */
  analytics: boolean;
  /** Marketing cookies/scripts — off until explicitly consented. */
  marketing: boolean;
};

export type ConsentRecord = {
  /** Format version of this record (see CONSENT_VERSION). */
  v: number;
  /** ISO-8601 timestamp of when the choice was made. */
  ts: string;
  preferences: ConsentPreferences;
};

/** Preferences used before any choice exists: optional categories off. */
export const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Partial<ConsentRecord>;
  if (record.v !== CONSENT_VERSION) return false;
  if (typeof record.ts !== "string" || Number.isNaN(Date.parse(record.ts))) return false;
  const preferences = record.preferences as Partial<ConsentPreferences> | undefined;
  if (typeof preferences !== "object" || preferences === null) return false;
  return (
    preferences.necessary === true &&
    typeof preferences.analytics === "boolean" &&
    typeof preferences.marketing === "boolean"
  );
}

/**
 * Read the saved consent record, or null when none exists yet
 * (or the stored value is corrupt / from an older format).
 */
export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isConsentRecord(parsed) ? parsed : null;
  } catch {
    // localStorage unavailable (private mode etc.) — treated as no choice.
    return null;
  }
}

/**
 * In-memory consent store: read once from storage when the client
 * bundle loads, then kept up to date by saveConsent. Exposed as a
 * useSyncExternalStore trio (mirroring lib/intro.ts) so components
 * can read it without setState-in-effect.
 *
 * The server snapshot is `undefined` ("not read yet"), so SSR never
 * paints the banner; after hydration the client snapshot resolves to
 * null (show banner) or a record (stay hidden) without a mismatch.
 */
let consentRecord: ConsentRecord | null = readConsent();

const consentListeners = new Set<() => void>();

function notifyConsentChanged(): void {
  for (const listener of consentListeners) {
    listener();
  }
}

/** Subscribe to consent changes (for useSyncExternalStore). */
export function subscribeConsent(callback: () => void): () => void {
  consentListeners.add(callback);
  return () => {
    consentListeners.delete(callback);
  };
}

/** Client snapshot: the current record, or null when no choice is saved. */
export function getConsentSnapshot(): ConsentRecord | null {
  return consentRecord;
}

/** Server snapshot: unknown before hydration — renders nothing. */
export function getConsentServerSnapshot(): undefined {
  return undefined;
}

/**
 * Persist a consent choice and return the stored record.
 * The in-memory store is updated even if localStorage is unavailable
 * (private mode etc.), so the visitor's decision still applies for
 * this page view; only cross-visit persistence is lost.
 */
export function saveConsent(preferences: ConsentPreferences): ConsentRecord {
  const record: ConsentRecord = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    preferences,
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Best-effort persistence; see above.
    }
  }
  consentRecord = record;
  notifyConsentChanged();
  return record;
}

/**
 * The consent gate. Necessary cookies are always permitted.
 * An optional category is permitted only when a valid saved record
 * explicitly enables it. Any future analytics/marketing script must
 * call this (or an equivalent) before loading, e.g.:
 *
 *   if (hasConsent("analytics")) { loadAnalytics(); }
 */
export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  const record = readConsent();
  return record !== null && record.preferences[category] === true;
}
