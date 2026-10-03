import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCredentials } from "@/lib/auth";
import { fail, getClientIp, handleApiError, readJson } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().trim().max(200),
  password: z.string().max(200),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
    if (!limit.allowed) {
      return fail(`Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.`, 429);
    }

    const { email, password } = schema.parse(await readJson(request));
    const session = await verifyCredentials(email, password);
    if (!session) return fail("Incorrect email or password.", 401);

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, await signSession(session), sessionCookieOptions);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
