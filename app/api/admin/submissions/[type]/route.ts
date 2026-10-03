import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError, ok } from "@/lib/api";
import { SUBMISSION_TYPES } from "@/lib/submissions";
import { escapeRegExp } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, ctx: RouteContext<"/api/admin/submissions/[type]">) {
  try {
    await requireAdmin();
    const { type } = await ctx.params;
    const def = SUBMISSION_TYPES[type as keyof typeof SUBMISSION_TYPES];
    if (!def) throw new ApiError("Unknown submission type", 404);

    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? "";
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = 20;

    const filter: Record<string, unknown> = {};
    if (status && (def.statuses as readonly string[]).includes(status)) filter.status = status;
    if (q) filter.$or = def.searchFields.map((f) => ({ [f]: { $regex: escapeRegExp(q), $options: "i" } }));

    await connectDB();
    const [items, total, counts] = await Promise.all([
      def.model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      def.model.countDocuments(filter),
      def.model.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    const statusCounts = Object.fromEntries(counts.map((c: { _id: string; count: number }) => [c._id, c.count]));
    return ok({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)), statusCounts });
  } catch (error) {
    return handleApiError(error);
  }
}
