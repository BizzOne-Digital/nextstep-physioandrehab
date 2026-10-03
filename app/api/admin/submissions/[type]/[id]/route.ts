import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError, ok, readJson } from "@/lib/api";
import { SUBMISSION_TYPES } from "@/lib/submissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolve(ctx: RouteContext<"/api/admin/submissions/[type]/[id]">) {
  const { type, id } = await ctx.params;
  const def = SUBMISSION_TYPES[type as keyof typeof SUBMISSION_TYPES];
  if (!def) throw new ApiError("Unknown submission type", 404);
  if (!isValidObjectId(id)) throw new ApiError("Invalid identifier", 400);
  return { def, id };
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/submissions/[type]/[id]">) {
  try {
    await requireAdmin();
    const { def, id } = await resolve(ctx);
    const schema = z.object({
      status: z.enum(def.statuses as unknown as [string, ...string[]]).optional(),
      notes: z.string().max(5000).optional(),
    });
    const data = schema.parse(await readJson(request));
    await connectDB();
    const item = await def.model.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!item) throw new ApiError("Not found", 404);
    return ok({ item });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/submissions/[type]/[id]">) {
  try {
    await requireAdmin();
    const { def, id } = await resolve(ctx);
    await connectDB();
    const item = await def.model.findByIdAndDelete(id).lean();
    if (!item) throw new ApiError("Not found", 404);
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
