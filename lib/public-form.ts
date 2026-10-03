import "server-only";
import type { ZodType } from "zod";
import { ApiError, getClientIp, readJson } from "@/lib/api";
import { looksLikeSpam, rateLimit } from "@/lib/rate-limit";

/**
 * Common handling for public form submissions: rate limiting, spam checks
 * and validation. Returns `null` for spam so callers can respond with a
 * generic success (bots learn nothing from the response).
 */
export async function parsePublicForm<T>(
  request: Request,
  key: string,
  schema: ZodType<T>,
): Promise<{ data: T; ip: string } | null> {
  const ip = getClientIp(request);
  const limit = rateLimit(`${key}:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) throw new ApiError("You've sent a few requests already. Please try again shortly or give us a call.", 429);

  const body = (await readJson(request)) as Record<string, unknown>;
  if (!body || typeof body !== "object") throw new ApiError("Invalid request", 400);
  if (looksLikeSpam(body)) return null;

  return { data: schema.parse(body), ip };
}
