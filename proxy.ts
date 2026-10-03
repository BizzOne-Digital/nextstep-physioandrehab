import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// First line of defence for the admin area. Every admin API route also
// re-verifies the session itself, so this is not the only check.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/api/admin") || pathname === "/api/upload") {
    if (!session) return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
    // CSRF defence in depth (cookies are already SameSite=Lax): writes must be same-origin.
    if (request.method !== "GET" && request.method !== "HEAD") {
      const origin = request.headers.get("origin");
      if (origin && new URL(origin).host !== request.nextUrl.host) {
        return NextResponse.json({ success: false, error: "Cross-origin request blocked" }, { status: 403 });
      }
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (session) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/upload"],
};
