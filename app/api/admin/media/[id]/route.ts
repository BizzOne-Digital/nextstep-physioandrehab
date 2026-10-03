import { isValidObjectId } from "mongoose";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError, ok } from "@/lib/api";
import { isUploadInUse } from "@/lib/uploads";
import { StoredUpload } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(request: Request, ctx: RouteContext<"/api/admin/media/[id]">) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) throw new ApiError("Invalid identifier", 400);
    const force = new URL(request.url).searchParams.get("force") === "1";

    await connectDB();
    const file = await StoredUpload.findById(id).select("-data").lean();
    if (!file) throw new ApiError("Not found", 404);
    const url = `/api/uploads/${file.folder}/${file.filename}`;
    if (!force && (await isUploadInUse(url))) {
      throw new ApiError("This image is still used on the website. Remove it from that content first.", 409);
    }
    await StoredUpload.deleteOne({ _id: id });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
