/** Fetch wrapper shared by the admin forms. */
export type ApiResult<T = Record<string, unknown>> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function isApiPayload(value: unknown): value is {
  ok?: unknown;
  data?: unknown;
  error?: unknown;
} {
  return typeof value === "object" && value !== null;
}

export async function apiSend<T = Record<string, unknown>>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let payload: unknown;
    try {
      payload = await res.json();
    } catch {
      return { ok: false, error: "The server returned an invalid response." };
    }
    if (!isApiPayload(payload)) {
      return { ok: false, error: "The server returned an invalid response." };
    }
    if (!res.ok || payload.ok !== true) {
      const message =
        typeof payload.error === "string" ? payload.error : undefined;
      return {
        ok: false,
        error: message || `Request failed with status ${res.status}.`,
      };
    }
    if (!("data" in payload)) {
      return { ok: false, error: "The server returned an invalid response." };
    }
    return { ok: true, data: payload.data as T };
  } catch {
    return { ok: false, error: "Network error — the request could not be sent." };
  }
}

export async function apiGet<T = Record<string, unknown>>(
  url: string,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url);
    let payload: unknown;
    try {
      payload = await res.json();
    } catch {
      return { ok: false, error: "The server returned an invalid response." };
    }
    if (!isApiPayload(payload)) {
      return { ok: false, error: "The server returned an invalid response." };
    }
    if (!res.ok || payload.ok !== true) {
      const message =
        typeof payload.error === "string" ? payload.error : undefined;
      return {
        ok: false,
        error: message || `Request failed with status ${res.status}.`,
      };
    }
    if (!("data" in payload)) {
      return { ok: false, error: "The server returned an invalid response." };
    }
    return { ok: true, data: payload.data as T };
  } catch {
    return { ok: false, error: "Network error — the request could not be sent." };
  }
}

/** Shared input styling for the dark admin surface. */
export const inputClass =
  "mt-1 w-full rounded-lg border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-2 focus:outline-offset-1 focus:outline-brand-orange";

export const labelClass = "block text-xs font-semibold uppercase tracking-wide text-white/60";

export const primaryButton =
  "inline-flex items-center justify-center rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-brand-orange-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButton =
  "inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:cursor-not-allowed disabled:opacity-60";

export const panelClass = "rounded-xl border border-white/10 bg-white/5 p-6";
