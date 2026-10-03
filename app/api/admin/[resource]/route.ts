import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError, ok, readJson } from "@/lib/api";
import { getResourceConfig, type ResourceKey } from "@/lib/resource-config";
import { SERVER_RESOURCES, parseResourcePayload, revalidatePublicSite } from "@/lib/resources.server";
import { escapeRegExp } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolve(resource: string) {
  const config = getResourceConfig(resource);
  if (!config) throw new ApiError("Unknown resource", 404);
  return { config, server: SERVER_RESOURCES[config.key as ResourceKey] };
}

export async function GET(request: Request, ctx: RouteContext<"/api/admin/[resource]">) {
  try {
    await requireAdmin();
    const { resource } = await ctx.params;
    const { config, server } = resolve(resource);
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit")) || 25));

    const filter = q
      ? { $or: config.searchFields.map((f) => ({ [f]: { $regex: escapeRegExp(q), $options: "i" } })) }
      : {};

    await connectDB();
    const projection = config.key === "blogs" ? "-content" : "";
    const [items, total] = await Promise.all([
      server.model.find(filter).select(projection).sort(server.sort).skip((page - 1) * limit).limit(limit).lean(),
      server.model.countDocuments(filter),
    ]);
    return ok({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, ctx: RouteContext<"/api/admin/[resource]">) {
  try {
    await requireAdmin();
    const { resource } = await ctx.params;
    const { config, server } = resolve(resource);
    const data = parseResourcePayload(config.key, await readJson(request));
    await connectDB();
    const created = await server.model.create(data);
    revalidatePublicSite();
    return ok({ item: created.toObject() }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
