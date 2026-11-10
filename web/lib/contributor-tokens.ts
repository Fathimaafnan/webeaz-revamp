import "server-only";

import { createHash, randomBytes } from "node:crypto";

/**
 * Invitation token helpers. Tokens are 32 random bytes (base64url);
 * only the sha-256 hex digest is stored. The plaintext token exists
 * solely in the invitation email URL — the database, logs, audits and
 * API responses never carry it.
 */

export function generateInvitationToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function invitationExpiresAt(): Date {
  // Default expiry per spec: 48 hours.
  return new Date(Date.now() + 48 * 60 * 60 * 1000);
}

export function buildAcceptUrl(token: string): string | null {
  const base = process.env.APP_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) return null;
  try {
    new URL(base);
    return `${base}/contributor/accept-invitation?token=${encodeURIComponent(token)}`;
  } catch {
    return null;
  }
}

export function buildLoginUrl(): string | null {
  const base = process.env.APP_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) return null;
  try {
    new URL(base);
    return `${base}/user/login`;
  } catch {
    return null;
  }
}
