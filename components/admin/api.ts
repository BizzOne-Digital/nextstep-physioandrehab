"use client";

export class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}

/** JSON fetch for admin APIs. Redirects to login when the session has expired. */
export async function adminFetch<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...(init?.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}), ...init?.headers },
    cache: "no-store",
  });
  let json: Record<string, unknown> = {};
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }
  if (res.status === 401) {
    // Hard navigation on purpose: this helper runs outside React components.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new AdminApiError("Your session has expired. Please sign in again.", 401);
  }
  if (!res.ok || json.success === false) {
    throw new AdminApiError(String(json.error ?? `Request failed (${res.status})`), res.status, json.fields as Record<string, string> | undefined);
  }
  return json as T;
}
