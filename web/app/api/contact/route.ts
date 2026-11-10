import { errorJson, readJsonRecord } from "@/lib/admin-api";

export const dynamic = "force-dynamic";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Public contact enquiry endpoint.
 *
 * Validation is real; delivery is not. There is NO email/CRM
 * integration configured anywhere in this app, so after strict
 * validation this route returns 503 with an honest message rather
 * than pretending a message was sent or storing it anywhere.
 *
 * To enable delivery: add a provider adapter here (Resend/mailgun/
 * webhooks) behind environment-secrecy rules, then return 201.
 */
export async function POST(request: Request) {
  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;

  const body = parsed.value;
  const errors: Record<string, string> = {};

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) errors.name = "Your name is required.";

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) errors.email = "Your email is required.";
  else if (!emailRe.test(email)) errors.email = "Enter a valid email address.";

  const company = typeof body.company === "string" ? body.company.trim() : "";
  if (company.length > 100) errors.company = "Company name too long.";

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) errors.message = "Please include a few details about your project.";
  else if (message.length > 2000) errors.message = "Message too long (max 2000 characters).";

  const unknown = Object.keys(body).find(
    (key) => !["name", "email", "company", "message"].includes(key),
  );
  if (unknown) {
    return errorJson(`Unexpected field: "${unknown}".`, 400);
  }

  if (Object.keys(errors).length > 0) {
    // Structured field errors for the form, plus the existing single
    // `error` string for backward compatibility.
    return Response.json(
      { ok: false, error: Object.values(errors)[0], errors },
      { status: 400 },
    );
  }

  return errorJson(
    "Enquiry delivery is not configured yet. Please contact us through one of the channels on this page.",
    503,
  );
}
