import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "@/lib/auth";

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
    public details?: Record<string, string>,
  ) {
    super(message);
  }
}

export function ok<T extends Record<string, unknown>>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, ...data }, init);
}

export function fail(message: string, status = 400, details?: Record<string, string>) {
  return NextResponse.json({ success: false, error: message, ...(details ? { fields: details } : {}) }, { status });
}

export function zodFieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

/** Converts any thrown value into a safe JSON error response. */
export function handleApiError(error: unknown) {
  if (error instanceof AuthError) return fail("Authentication required", 401);
  if (error instanceof ApiError) return fail(error.message, error.status, error.details);
  if (error instanceof ZodError) return fail("Please check the highlighted fields.", 422, zodFieldErrors(error));
  const e = error as { code?: number; keyValue?: Record<string, unknown>; name?: string; message?: string };
  if (e?.code === 11000) {
    const field = Object.keys(e.keyValue ?? {})[0] ?? "field";
    return fail(`That ${field} is already in use.`, 409, { [field]: "Must be unique" });
  }
  if (e?.name === "CastError") return fail("Invalid identifier.", 400);
  console.error("[api] unexpected error:", error);
  if (e?.message?.includes("MONGODB_URI")) return fail("The database is not configured.", 503);
  return fail("Something went wrong. Please try again.", 500);
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
