import { parseContributorApplicationPayload } from "@/lib/cms";
import { isPrismaUniqueError, readJsonRecord, successJson } from "@/lib/admin-api";
import { isPublicSubmitRateLimited } from "@/lib/contributor-rate-limit";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const GENERIC_MESSAGE =
  "Thanks for applying. If your details are eligible, our team may be in touch after review.";

/**
 * Public contributor application submission (unauthenticated).
 *
 * Anti-enumeration contract: the response NEVER reveals whether an
 * email belongs to an existing Admin, BlogUser, or prior application.
 * Every well-formed submission returns the same generic success
 * message; ineligible submissions are quietly discarded.
 *
 * Submission NEVER creates a BlogUser account. Approval creates the
 * inactive account later (admin flow, separately tested).
 */
export async function POST(request: Request) {
  const parsed = await readJsonRecord(request);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;

  // Honeypot: hidden form field. Anything filled means a bot.
  // Strip it before strict parsing — it is not part of the application
  // schema and must not trip the allowlist check for real visitors
  // (who send it as an empty string).
  const { website, ...applicationBody } = body;
  if (typeof website === "string" && website.trim() !== "") {
    return successJson({ message: GENERIC_MESSAGE }, 201);
  }

  const result = parseContributorApplicationPayload(applicationBody);
  if (result.error !== null) return errorJsonSafe(result.error);

  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || null;
  if (isPublicSubmitRateLimited(result.data.email, ip)) {
    return errorJsonSafe("Too many submissions. Please try again later.");
  }

  try {
    // Silent eligibility checks — never surfaced to the applicant.
    const [adminConflict, userConflict, pendingConflict] = await Promise.all([
      prisma.admin.findUnique({
        where: { email: result.data.email },
        select: { id: true },
      }),
      prisma.blogUser.findUnique({
        where: { email: result.data.email },
        select: { id: true },
      }),
      prisma.contributorApplication.findFirst({
        where: { email: result.data.email, status: "PENDING" },
        select: { id: true },
      }),
    ]);

    if (adminConflict || userConflict || pendingConflict) {
      return successJson({ message: GENERIC_MESSAGE }, 201);
    }

    await prisma.contributorApplication.create({
      data: { ...result.data, status: "PENDING" },
    });
    return successJson({ message: GENERIC_MESSAGE }, 201);
  } catch (error) {
    // P2002 can race (partial unique index on PENDING/email).
    if (isPrismaUniqueError(error)) {
      return successJson({ message: GENERIC_MESSAGE }, 201);
    }
    console.error("contributor application create failed:", error);
    return errorJsonSafe("Could not record your application. Please try again.");
  }
}

function errorJsonSafe(message: string) {
  return Response.json({ ok: false, error: message }, { status: statusFor(message) });
}

function statusFor(message: string): number {
  if (message.startsWith("Too many")) return 429;
  return 400;
}
