import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api";
import { seedDatabase } from "@/lib/seed";
import { revalidatePublicSite } from "@/lib/resources.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Imports the migrated website content into empty collections. Never overwrites. */
export async function POST() {
  try {
    await requireAdmin();
    await connectDB();
    const result = await seedDatabase({ force: false });
    revalidatePublicSite();
    return ok({ result });
  } catch (error) {
    return handleApiError(error);
  }
}
