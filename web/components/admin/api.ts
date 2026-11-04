/**
 * Tiny fetch wrapper shared by every admin form. It never throws —
 * callers always receive `{ ok, data | error }` so success and failure
 * feedback can be rendered inline.
 */
export type ApiResult<T = Record<string, unknown>> =
  | { ok: true; data: T }
  | { ok: false; error: string };

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

    const data = (await res.json().catch(() => ({}))) as T & { error?: string };
    if (!res.ok) {
      return {
        ok: false,
        error: data?.error || `Request failed with status ${res.status}.`,
      };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error — the request could not be sent." };
  }
}

export async function apiUpload<T = Record<string, unknown>>(
  url: string,
  form: FormData,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: "POST", body: form });
    const data = (await res.json().catch(() => ({}))) as T & {
      error?: string;
    };
    if (!res.ok) {
      return { ok: false, error: data?.error || `Upload failed (${res.status}).` };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error — the upload could not be sent." };
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
