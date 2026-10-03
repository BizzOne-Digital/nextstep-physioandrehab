import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError, ok, readJson } from "@/lib/api";
import { SETTINGS_SECTIONS, allFields } from "@/lib/resource-config";
import { buildObject } from "@/lib/schema-builder";
import { revalidatePublicSite } from "@/lib/resources.server";
import { cleanupReplacedUploads } from "@/lib/uploads";
import { defaultSettings } from "@/content/settings";
import { SiteSetting } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const settingsSchema = buildObject(allFields(SETTINGS_SECTIONS));

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const doc = await SiteSetting.findOne({ key: "global" }).lean<{ data?: Record<string, unknown> }>();
    return ok({ settings: { ...defaultSettings, ...(doc?.data ?? {}) } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const data = settingsSchema.parse(await readJson(request));
    const embed = String(data.mapEmbedUrl ?? "");
    if (embed && !embed.startsWith("https://www.google.com/maps/embed")) {
      throw new ApiError("Please check the highlighted fields.", 422, { mapEmbedUrl: "Must be a Google Maps embed URL" });
    }
    await connectDB();
    const before = await SiteSetting.findOne({ key: "global" }).lean();
    const doc = await SiteSetting.findOneAndUpdate({ key: "global" }, { $set: { data } }, { upsert: true, new: true }).lean();
    await cleanupReplacedUploads(before, doc);
    revalidatePublicSite();
    return ok({ settings: (doc as { data?: unknown } | null)?.data ?? data });
  } catch (error) {
    return handleApiError(error);
  }
}
