import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth (Auth.js) catch-all route handler.
 *
 * Next.js 16 passes dynamic route params as a Promise, so the context type
 * below reflects that. The second argument is the route context, which is what
 * the installed next-auth@4 App Router handler expects.
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ nextauth: string[] }> },
) {
  return NextAuth(req, ctx, authOptions);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ nextauth: string[] }> },
) {
  return NextAuth(req, ctx, authOptions);
}
