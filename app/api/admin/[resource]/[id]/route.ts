import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError, ok, readJson } from "@/lib/api";
import { getResourceConfig, type ResourceKey } from "@/lib/resource-config";
import { SERVER_RESOURCES, parseResourcePayload, revalidatePublicSite } from "@/lib/resources.server";
import { cleanupReplacedUploads, deleteAllUploadsIn } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolve(ctx: RouteContext<"/api/admin/[resource]/[id]">) {
  const { resource, id } = await ctx.params;
  const config = getResourceConfig(resource);
  if (!config) throw new ApiError("Unknown resource", 404);
  if (!isValidObjectId(id)) throw new ApiError("Invalid identifier", 400);
  return { config, server: SERVER_RESOURCES[config.key as ResourceKey], id };
}

export async function GET(_request: Request, ctx: RouteContext<"/api/admin/[resource]/[id]">) {
  try {
    await requireAdmin();
    const { server, id } = await resolve(ctx);
    await connectDB();
    const item = await server.model.findById(id).lean();
    if (!item) throw new ApiError("Not found", 404);
    return ok({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/[resource]/[id]">) {
  try {
    await requireAdmin();
    const { config, server, id } = await resolve(ctx);
    const data = parseResourcePayload(config.key, await readJson(request));
    await connectDB();
    const before = await server.model.findById(id).lean();
    if (!before) throw new ApiError("Not found", 404);
    const item = await server.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    await cleanupReplacedUploads(before, item);
    revalidatePublicSite();
    return ok({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/[resource]/[id]">) {
  try {
    await requireAdmin();
    const { server, id } = await resolve(ctx);
    await connectDB();
    const item = await server.model.findByIdAndDelete(id).lean();
    if (!item) throw new ApiError("Not found", 404);
    await deleteAllUploadsIn(item);
    revalidatePublicSite();
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
