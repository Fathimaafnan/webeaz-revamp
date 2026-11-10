/**
 * Public rate limiter for unauthenticated contributor application
 * submissions (anti-spam + enumeration friction).
 *
 * In-memory per-process window store, mirroring lib/login-rate-limit:
 * 5 submissions per hour per email, 20 per hour per client IP.
 * Never blocks newer requests silently — callers return 429 with a
 * generic message.
 */

const EMAIL_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_MAX = 5;
const IP_WINDOW_MS = 60 * 60 * 1000;
const IP_MAX = 20;

type AttemptRecord = { count: number; expiresAt: number };

const byEmail = new Map<string, AttemptRecord>();
const byIp = new Map<string, AttemptRecord>();

function read(map: Map<string, AttemptRecord>, key: string, windowMs: number) {
  const record = map.get(key);
  const now = Date.now();
  if (!record || record.expiresAt <= now) {
    map.set(key, { count: 1, expiresAt: now + windowMs });
    return false;
  }
  record.count += 1;
  return record.count > (key.startsWith("email:") ? EMAIL_MAX : IP_MAX);
}

function gc(map: Map<string, AttemptRecord>) {
  const now = Date.now();
  for (const [key, record] of map) {
    if (record.expiresAt <= now) map.delete(key);
  }
}

let lastGc = 0;
function maybeGc() {
  const now = Date.now();
  if (now - lastGc > 10 * 60 * 1000) {
    gc(byEmail);
    gc(byIp);
    lastGc = now;
  }
}

/** Returns true when a submission must be rejected with 429. */
export function isPublicSubmitRateLimited(email: string, ip: string | null): boolean {
  maybeGc();
  const emailKey = `email:${email}`;
  const ipKey = `ip:${ip ?? "unknown"}`;
  if (read(byEmail, emailKey, EMAIL_WINDOW_MS)) return true;
  if (ip && read(byIp, ipKey, IP_WINDOW_MS)) return true;
  return false;
}
