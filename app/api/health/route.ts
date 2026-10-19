import { NextResponse } from "next/server";
import { connectDB, isDatabaseConfigured } from "@/lib/db";
import { getConfigIssues } from "@/lib/config-check";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Deployment check: reports which settings are present and whether MongoDB connects. No values are exposed. */
export async function GET() {
  const issues = getConfigIssues();
  let database: "connected" | "not configured" | "connection failed" = "not configured";
  if (isDatabaseConfigured()) {
    try {
      await connectDB();
      database = "connected";
    } catch {
      database = "connection failed";
    }
  }
  const ok = issues.length === 0 && database === "connected";
  return NextResponse.json({ ok, database, issues }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
