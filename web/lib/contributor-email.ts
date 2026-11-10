import "server-only";

import { createTransport } from "nodemailer";
import { Resend } from "resend";

/**
 * Contributor email (invitation + activation confirmation + rejection)
 * with the provider selected by EMAIL_PROVIDER:
 *
 *   - unset or "resend" → Resend, the official production provider.
 *   - "gmail"           → Gmail SMTP (smtp.gmail.com:465, Google App
 *     Password), DEVELOPMENT ONLY. The flag is ignored in production
 *     (one warning, no secrets) and a hard send-time guard refuses to
 *     transmit from a production build, so Gmail SMTP can never become
 *     the production fallback.
 *   - any other value   → reported unconfigured; nothing is sent.
 *
 * Delivery honesty rules (product requirement):
 *   - `sentStatus` is ACCEPTED only when the provider confirms
 *     acceptance (Resend id / SMTP messageId). FAILED means the mail
 *     was not accepted — never silently marked sent.
 *   - Tokens travel only inside the invitation email link; logs and
 *     responses never carry them. Passwords are never emailed.
 *   - When configuration is missing, `getContributorEmailStatus`
 *     reports it unconfigured and senders record FAILED with an
 *     explicit reason — no fake success anywhere.
 *   - Provider error strings are redacted before they can reach logs,
 *     API responses or the database: the Gmail App Password and the
 *     Resend API key never appear in them.
 */

export type ContributorEmailStatus = {
  configured: boolean;
  missing: string[];
};

type MailProvider = "resend" | "gmail" | "unsupported";

let productionProviderWarningShown = false;

/**
 * Resolves the active mail provider from EMAIL_PROVIDER.
 *
 * Production ALWAYS resolves to Resend: whatever EMAIL_PROVIDER says
 * (a stray "gmail" or a typo), the production build keeps using the
 * official Resend provider and Gmail SMTP stays out of the picture.
 * Gmail is therefore only reachable when NODE_ENV !== "production".
 */
function resolveMailProvider(): MailProvider {
  const wanted = (process.env.EMAIL_PROVIDER ?? "").trim().toLowerCase();
  if (process.env.NODE_ENV === "production") {
    if (wanted && wanted !== "resend" && !productionProviderWarningShown) {
      productionProviderWarningShown = true;
      console.warn(
        `[email] EMAIL_PROVIDER="${wanted}" is ignored in production; using Resend.`,
      );
    }
    return "resend";
  }
  if (wanted === "" || wanted === "resend") return "resend";
  if (wanted === "gmail") return "gmail";
  return "unsupported";
}

export function getContributorEmailStatus(): ContributorEmailStatus {
  const missing: string[] = [];
  const provider = resolveMailProvider();
  if (provider === "gmail") {
    if (!process.env.GMAIL_SMTP_USER?.trim()) missing.push("GMAIL_SMTP_USER");
    if (!process.env.GMAIL_SMTP_APP_PASSWORD?.trim()) missing.push("GMAIL_SMTP_APP_PASSWORD");
  } else if (provider === "resend") {
    if (!process.env.RESEND_API_KEY?.trim()) missing.push("RESEND_API_KEY");
  } else {
    missing.push('EMAIL_PROVIDER (expected "resend" or "gmail")');
  }
  if (!process.env.EMAIL_FROM?.trim()) missing.push("EMAIL_FROM");
  if (!process.env.APP_BASE_URL?.trim()) missing.push("APP_BASE_URL");
  return { configured: missing.length === 0, missing };
}

export type SendResult =
  | { ok: true; providerId: string | null }
  | { ok: false; error: string };

/**
 * Strips secrets from provider error text before it can reach logs,
 * API responses or the `deliveryError` column. Exported so other
 * senders reuse the same guard.
 */
export function sanitizeProviderError(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Mail provider request failed.";
  let message = raw;
  for (const secret of [
    process.env.GMAIL_SMTP_APP_PASSWORD,
    process.env.RESEND_API_KEY,
  ]) {
    const value = secret?.trim();
    if (value && value.length >= 4) {
      message = message.split(value).join("[redacted]");
    }
  }
  return message;
}

type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/** Normalized provider response; `data.id` is the provider's message
 *  identifier (Resend id or SMTP messageId) recorded as `providerId`. */
type ProviderEnvelope = {
  data: { id: string | null } | null;
  error: { message: string } | null;
};

/** Dispatches through the resolved provider. Callers must have checked
 *  `getContributorEmailStatus()` first (each sender keeps its own
 *  not-configured message); this re-check is defense in depth. */
async function sendProviderEmail(payload: MailPayload): Promise<ProviderEnvelope> {
  const status = getContributorEmailStatus();
  if (!status.configured) {
    return {
      data: null,
      error: { message: `Email is not configured (missing ${status.missing.join(", ")}).` },
    };
  }
  const provider = resolveMailProvider();
  if (provider === "gmail") return sendViaGmail(payload);
  return sendViaResend(payload);
}

async function sendViaResend(payload: MailPayload): Promise<ProviderEnvelope> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    return await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
  } catch (error) {
    return { data: null, error: { message: sanitizeProviderError(error) } };
  }
}

/**
 * Gmail SMTP for LOCAL DEVELOPMENT ONLY (EMAIL_PROVIDER=gmail).
 *
 * Uses the Google App Password from GMAIL_SMTP_APP_PASSWORD — never the
 * account password. `logger` stays off so no SMTP traffic (which
 * includes the AUTH exchange) is ever written to the dev server output.
 * Acceptance is reported only when SMTP accepts the recipient and the
 * message; the returned messageId is recorded exactly like a Resend id.
 */
async function sendViaGmail(payload: MailPayload): Promise<ProviderEnvelope> {
  // Hard guard: even if the environment were misconfigured, a
  // production build must never transmit over Gmail SMTP.
  if (process.env.NODE_ENV === "production") {
    return {
      data: null,
      error: { message: "Gmail SMTP is development-only and is disabled in production." },
    };
  }
  const user = process.env.GMAIL_SMTP_USER?.trim();
  // Google app passwords are 16 characters without spaces (the account
  // UI displays them in groups of four). Strip whitespace so the send
  // path authenticates exactly like the pre-send verification
  // handshake does.
  const pass = process.env.GMAIL_SMTP_APP_PASSWORD?.replace(/\s+/g, "");
  const from = process.env.EMAIL_FROM?.trim();
  if (!user || !pass || !from) {
    return {
      data: null,
      error: {
        message:
          "Gmail SMTP is not configured (missing GMAIL_SMTP_USER, GMAIL_SMTP_APP_PASSWORD or EMAIL_FROM).",
      },
    };
  }
  try {
    const transport = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
      logger: false,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    const info = await transport.sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    const rejected = Array.isArray(info.rejected) ? info.rejected : [];
    if (rejected.length > 0) {
      return {
        data: null,
        error: { message: `Gmail SMTP rejected the recipient: ${rejected.join(", ")}` },
      };
    }
    const accepted = Array.isArray(info.accepted) ? info.accepted : [];
    if (accepted.length === 0) {
      return { data: null, error: { message: "Gmail SMTP did not accept the message." } };
    }
    return {
      data: { id: typeof info.messageId === "string" ? info.messageId : null },
      error: null,
    };
  } catch (error) {
    return { data: null, error: { message: sanitizeProviderError(error) } };
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function brandLogoUrl(): string | null {
  const base = process.env.APP_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) return null;
  try {
    new URL(base);
    return `${base}/webeaz-logo.png`;
  } catch {
    return null;
  }
}

function shell(title: string, content: string, footerNote: string): string {
  const logo = brandLogoUrl();
  const logoHtml = logo
    ? `<img src="${escapeHtml(logo)}" alt="WebEaz" width="160" style="display:block;height:auto;border:0;" />`
    : `<p style="margin:0;font-size:22px;font-weight:800;color:#1076bc;">Web<span style="color:#f79522;">Eaz</span></p>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#101418;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e5e8ec;">
<tr><td style="padding:32px 36px 0;">${logoHtml}</td></tr>
<tr><td style="padding:20px 36px 0;"><h1 style="margin:0;font-size:22px;line-height:1.3;color:#0f6aab;">${escapeHtml(title)}</h1></td></tr>
<tr><td style="padding:14px 36px 28px;font-size:15px;line-height:1.65;color:#3a4249;">${content}</td></tr>
<tr><td style="padding:0 36px 32px;border-top:1px solid #eef1f4;"><p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#7a828c;">WebEaz Technologies · <a href="https://www.webeaz.com" style="color:#1076bc;text-decoration:none;">www.webeaz.com</a><br />${escapeHtml(footerNote)}</p></td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function buttonStyle(): string {
  return "display:inline-block;margin:8px 0 4px;padding:14px 26px;border-radius:999px;background:#f79522;color:#111111;font-weight:700;font-size:15px;text-decoration:none;";
}

export async function sendInvitationEmail(input: {
  applicantName: string;
  email: string;
  acceptUrl: string;
}): Promise<SendResult> {
  const status = getContributorEmailStatus();
  if (!status.configured) {
    return {
      ok: false,
      error: `Email is not configured (missing ${status.missing.join(", ")}). The invitation was saved; resend it once email is configured.`,
    };
  }

  try {
    const { data, error } = await sendProviderEmail({
      to: input.email,
      subject: "Your WebEaz Contributor Application Has Been Approved!",
      html: shell(
        "Your WebEaz Contributor Application Has Been Approved!",
        `<p>Hello ${escapeHtml(input.applicantName)},</p>
        <p>Good news! Your application to become a WebEaz contributor has been <strong>approved</strong>.</p>
        <p>We are excited to welcome you to the WebEaz contributor community. To activate your contributor account, please set your password using the button below.</p>
        <p><a href="${escapeHtml(input.acceptUrl)}" style="${buttonStyle()}">Set Up Your Password</a></p>
        <p style="font-size:13px;line-height:1.6;">This invitation link is valid for a limited time (48 hours) and can only be used once.</p>
        <p style="font-size:13px;line-height:1.6;">If you did not submit this application, please contact WebEaz.</p>`,
        "Best regards, WebEaz Team · www.webeaz.com",
      ),
      text: `Hello ${input.applicantName},\n\nGood news! Your application to become a WebEaz contributor has been approved.\n\nSet up your password (link expires in 48 hours, single use):\n${input.acceptUrl}\n\nIf you did not submit this application, please contact WebEaz.\n\nBest regards,\nWebEaz Team\nwww.webeaz.com`,
    });
    if (error) {
      return { ok: false, error: sanitizeProviderError(error.message || "Mail provider rejected the message.") };
    }
    return { ok: true, providerId: data?.id ?? null };
  } catch (error) {
    return { ok: false, error: sanitizeProviderError(error) };
  }
}

export async function sendActivationEmail(input: {
  applicantName: string;
  email: string;
  loginUrl: string;
}): Promise<SendResult> {
  const status = getContributorEmailStatus();
  if (!status.configured) {
    return {
      ok: false,
      error: `Email is not configured (missing ${status.missing.join(", ")}).`,
    };
  }

  try {
    const { data, error } = await sendProviderEmail({
      to: input.email,
      subject: "Your WebEaz Contributor Account Is Now Active",
      html: shell(
        "Your WebEaz Contributor Account Is Now Active",
        `<p>Hello ${escapeHtml(input.applicantName)},</p>
        <p>Your WebEaz contributor account has been successfully activated.</p>
        <p>You can now log in to your contributor dashboard and manage your contributor activities.</p>
        <p><a href="${escapeHtml(input.loginUrl)}" style="${buttonStyle()}">Log In to Your Account</a></p>
        <p>Welcome to the WebEaz contributor community!</p>`,
        "Best regards, WebEaz Team · www.webeaz.com",
      ),
      text: `Hello ${input.applicantName},\n\nYour WebEaz contributor account has been successfully activated.\n\nLog in to your contributor dashboard:\n${input.loginUrl}\n\nWelcome to the WebEaz contributor community!\n\nBest regards,\nWebEaz Team\nwww.webeaz.com`,
    });
    if (error) {
      return { ok: false, error: sanitizeProviderError(error.message || "Mail provider rejected the message.") };
    }
    return { ok: true, providerId: data?.id ?? null };
  } catch (error) {
    return { ok: false, error: sanitizeProviderError(error) };
  }
}

export async function sendRejectionEmail(input: {
  applicantName: string;
  email: string;
  reason: string;
}): Promise<SendResult> {
  const status = getContributorEmailStatus();
  if (!status.configured) {
    return {
      ok: false,
      error: `Email is not configured (missing ${status.missing.join(", ")}).`,
    };
  }

  try {
    const { data, error } = await sendProviderEmail({
      to: input.email,
      subject: "Update on Your WebEaz Contributor Application",
      html: shell(
        "Update on your contributor application",
        `<p>Hello ${escapeHtml(input.applicantName)},</p>
        <p>Thank you for taking the time to apply to contribute to WebEaz. After review, we are not able to approve your application at this time.</p>
        ${input.reason ? `<p style="padding:12px 16px;border:1px solid #e5e8ec;border-radius:12px;background:#f8fafc;">${escapeHtml(input.reason)}</p>` : ""}
        <p>We appreciate your interest and encourage you to apply again in the future.</p>`,
        "Best regards, WebEaz Team · www.webeaz.com",
      ),
      text: `Hello ${input.applicantName},\n\nThank you for applying to contribute to WebEaz. We are not able to approve your application at this time.${input.reason ? `\nFeedback: ${input.reason}` : ""}\n\nWe appreciate your interest.\n\nBest regards,\nWebEaz Team\nwww.webeaz.com`,
    });
    if (error) {
      return { ok: false, error: sanitizeProviderError(error.message || "Mail provider rejected the message.") };
    }
    return { ok: true, providerId: data?.id ?? null };
  } catch (error) {
    return { ok: false, error: sanitizeProviderError(error) };
  }
}
