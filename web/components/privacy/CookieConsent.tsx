"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  DEFAULT_PREFERENCES,
  getConsentServerSnapshot,
  getConsentSnapshot,
  readConsent,
  saveConsent,
  subscribeConsent,
} from "@/lib/cookie-consent";

/**
 * Cookie consent banner + preferences dialog for the public site.
 *
 * Mounted once in the (site) layout. The banner is shown only when
 * no valid consent record is saved; the three actions record the
 * choice (Accept All / Reject Optional / Preferences → Save) and
 * dismiss it. `CookiePreferencesButton` reopens the dialog later
 * via a window event, so the privacy page can offer the entry
 * point without any shared global state.
 *
 * The dialog is a proper modal: role/aria set, focus moves into the
 * panel, Tab is trapped inside it, Escape cancels, and focus
 * returns to the control that opened it.
 */

/** Window event used to reopen preferences from elsewhere on the page. */
const OPEN_EVENT = "webeaz:cookie-preferences";

const primaryBtn =
  "inline-flex items-center justify-center rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";
const secondaryBtn =
  "inline-flex items-center justify-center rounded-lg border border-control bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";
const ghostBtn =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-blue transition-colors hover:text-brand-blue-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

const categoryBox = "mt-3 rounded-xl border border-line p-4 first:mt-0";
const categoryTitle = "block text-sm font-semibold text-ink";
const categoryText = "mt-1 block text-sm leading-6 text-muted";
const checkbox =
  "mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

/**
 * Minimal entry point: reopens the preferences dialog. Used on the
 * privacy page — a plain button that dispatches the window event
 * the banner component listens for.
 */
export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      className={`${secondaryBtn} mt-8`}
    >
      Cookie preferences
    </button>
  );
}

export default function CookieConsent() {
  // Consent state from the external store (lib/cookie-consent.ts):
  // undefined = not read yet (SSR/pre-hydration — render nothing);
  // null = no valid choice saved → show the banner.
  const record = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState({
    analytics: DEFAULT_PREFERENCES.analytics,
    marketing: DEFAULT_PREFERENCES.marketing,
  });

  const openerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hadFocusBeforeOpen = useRef(false);

  // Listen for reopen requests from elsewhere on the page (e.g. the
  // privacy page's "Cookie preferences" button).
  useEffect(() => {
    const onOpenPreferences = () => {
      const current = readConsent();
      openerRef.current = document.activeElement as HTMLElement | null;
      setDraft({
        analytics: current?.preferences.analytics ?? false,
        marketing: current?.preferences.marketing ?? false,
      });
      setDialogOpen(true);
    };

    window.addEventListener(OPEN_EVENT, onOpenPreferences);
    return () => window.removeEventListener(OPEN_EVENT, onOpenPreferences);
  }, []);

  // Focus handling for the dialog: move focus in on open, back to the
  // opener on close.
  useEffect(() => {
    if (dialogOpen) {
      hadFocusBeforeOpen.current = true;
      panelRef.current?.focus();
    } else if (hadFocusBeforeOpen.current) {
      hadFocusBeforeOpen.current = false;
      const opener = openerRef.current;
      if (opener && document.contains(opener)) opener.focus();
    }
  }, [dialogOpen]);

  const startFromBanner = (event: React.MouseEvent<HTMLButtonElement>) => {
    openerRef.current = event.currentTarget;
    setDraft({
      analytics: record?.preferences.analytics ?? false,
      marketing: record?.preferences.marketing ?? false,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  const recordChoice = (analytics: boolean, marketing: boolean) => {
    // Updates the external store (and localStorage) — the banner hides
    // because the snapshot becomes a saved record.
    saveConsent({ necessary: true, analytics, marketing });
    setDialogOpen(false);
  };

  // Escape closes (cancel); Tab is trapped inside the panel.
  const onDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Nothing to show before the saved choice has been read.
  if (record === undefined) return null;

  return (
    <>
      {record === null ? (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-2xl border border-line bg-white p-5 shadow-xl sm:inset-x-4 sm:bottom-4 sm:p-6"
        >
          <h2 className="text-base font-semibold tracking-tight text-ink sm:text-lg">
            Your Privacy Matters
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            We use cookies to improve your browsing experience, analyze website
            traffic and understand how visitors interact with our website.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={() => recordChoice(true, true)} className={primaryBtn}>
              Accept All
            </button>
            <button
              type="button"
              onClick={() => recordChoice(false, false)}
              className={secondaryBtn}
            >
              Reject Optional
            </button>
            <button type="button" onClick={startFromBanner} className={ghostBtn}>
              Preferences
            </button>
          </div>
        </div>
      ) : null}

      {dialogOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-3 backdrop-blur-sm sm:items-center sm:p-6">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            tabIndex={-1}
            onKeyDown={onDialogKeyDown}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-white p-5 shadow-2xl focus:outline-none sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="cookie-preferences-title"
                className="text-lg font-semibold tracking-tight text-ink"
              >
                Cookie Preferences
              </h2>
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close cookie preferences"
                className="-mr-1 -mt-1 rounded-lg p-1.5 text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-sm leading-6 text-muted">
              Choose which cookies you allow. Necessary cookies keep the site
              working and cannot be turned off.
            </p>

            <div className="mt-4 space-y-3">
              <div className={categoryBox}>
                <label className="flex cursor-not-allowed items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    readOnly
                    className={`${checkbox} cursor-not-allowed opacity-60`}
                  />
                  <span>
                    <span className={categoryTitle}>Necessary</span>
                    <span className={categoryText}>
                      Required for sign-in, security and core site functionality.
                      These are always active.
                    </span>
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-brand-blue">
                      Always active
                    </span>
                  </span>
                </label>
              </div>

              <div className={categoryBox}>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={draft.analytics}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, analytics: event.target.checked }))
                    }
                    className={checkbox}
                  />
                  <span>
                    <span className={categoryTitle}>Analytics</span>
                    <span className={categoryText}>
                      Helps us understand how visitors use the website. This site
                      does not currently set analytics cookies — your choice is
                      saved so any future analytics only run with your consent.
                    </span>
                  </span>
                </label>
              </div>

              <div className={categoryBox}>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={draft.marketing}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, marketing: event.target.checked }))
                    }
                    className={checkbox}
                  />
                  <span>
                    <span className={categoryTitle}>Marketing</span>
                    <span className={categoryText}>
                      Used to measure advertising campaigns. This site does not
                      currently set marketing cookies — your choice is saved so
                      any future marketing cookies only run with your consent.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeDialog} className={secondaryBtn}>
                Cancel
              </button>
              <button
                type="button"
                onClick={() => recordChoice(draft.analytics, draft.marketing)}
                className={primaryBtn}
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
