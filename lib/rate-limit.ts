import "server-only";

/**
 * Best-effort in-memory sliding window limiter. On serverless platforms each
 * warm instance keeps its own window, which is still effective against basic
 * abuse of public forms and the login endpoint.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { allowed: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { allowed: true, retryAfter: 0 };
}

/**
 * Spam heuristics for public forms: a hidden honeypot field must stay empty
 * and the form must not be submitted implausibly fast after rendering.
 */
export function looksLikeSpam(body: Record<string, unknown>): boolean {
  if (typeof body.website === "string" && body.website.trim() !== "") return true;
  const started = Number(body.startedAt);
  if (Number.isFinite(started) && started > 0) {
    const elapsed = Date.now() - started;
    if (elapsed < 2500) return true;
  }
  return false;
}
