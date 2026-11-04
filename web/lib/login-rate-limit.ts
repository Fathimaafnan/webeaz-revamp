/**
 * Basic in-memory login rate limiter for the admin credentials provider.
 *
 * Keyed by lower-cased email. Keeps an in-memory window of failed attempts
 * per key; once the max is reached the key is locked out until the window
 * elapses. Suitable as a lightweight brute-force guard for Phase 1; swap
 * for a shared store (e.g. Upstash / DB backed) when running multiple
 * serverless instances.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type AttemptRecord = { count: number; expiresAt: number };

const attempts = new Map<string, AttemptRecord>();

function isExpired(record: AttemptRecord, now: number) {
  return record.expiresAt <= now;
}

export function isRateLimited(key: string): boolean {
  const record = attempts.get(key);
  if (!record) return false;
  const now = Date.now();
  if (isExpired(record, now)) {
    attempts.delete(key);
    return false;
  }
  if (record.count >= MAX_ATTEMPTS) return true;
  return false;
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const existing = attempts.get(key);
  if (!existing || isExpired(existing, now)) {
    attempts.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return;
  }
  existing.count += 1;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
