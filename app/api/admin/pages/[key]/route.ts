import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError, ok, readJson } from "@/lib/api";
import { getPageDefinition } from "@/content/pages";
import { buildObject } from "@/lib/schema-builder";
import { revalidatePublicSite } from "@/lib/resources.server";
import { cleanupReplacedUploads } from "@/lib/uploads";
import { Page } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: RouteContext<"/api/admin/pages/[key]">) {
  try {
    await requireAdmin();
    const { key } = await ctx.params;
    const def = getPageDefinition(key);
    if (!def) throw new ApiError("Unknown page", 404);
    await connectDB();
    const page = await Page.findOne({ key }).lean<{ content?: Record<string, unknown>; seoTitle?: string; seoDescription?: string }>();
    return ok({
      content: { ...def.defaults, ...(page?.content ?? {}) },
      seoTitle: page?.seoTitle || def.seoTitle,
      seoDescription: page?.seoDescription || def.seoDescription,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/pages/[key]">) {
  try {
    await requireAdmin();
    const { key } = await ctx.params;
    const def = getPageDefinition(key);
    if (!def) throw new ApiError("Unknown page", 404);

    const schema = z.object({
      content: buildObject(def.sections.flatMap((s) => s.fields)),
      seoTitle: z.string().trim().max(200).default(""),
      seoDescription: z.string().trim().max(400).default(""),
    });
    const data = schema.parse(await readJson(request));

    await connectDB();
    const before = await Page.findOne({ key }).lean();
    const page = await Page.findOneAndUpdate({ key }, { $set: { key, ...data } }, { upsert: true, new: true }).lean();
    await cleanupReplacedUploads(before, page);
    revalidatePublicSite();
    return ok({ page });
  } catch (error) {
    return handleApiError(error);
  }
}
