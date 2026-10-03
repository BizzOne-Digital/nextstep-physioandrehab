import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api";
import { isAllowedFolder } from "@/lib/uploads";
import { StoredUpload } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const folder = url.searchParams.get("folder") ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = 48;
    const filter = isAllowedFolder(folder) ? { folder } : {};

    await connectDB();
    const [items, total, totals] = await Promise.all([
      StoredUpload.find(filter).select("-data").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      StoredUpload.countDocuments(filter),
      StoredUpload.aggregate([{ $group: { _id: null, bytes: { $sum: "$size" }, count: { $sum: 1 } } }]),
    ]);
    return ok({
      items: items.map((i) => ({ ...i, url: `/api/uploads/${i.folder}/${i.filename}` })),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      storage: { bytes: totals[0]?.bytes ?? 0, count: totals[0]?.count ?? 0 },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
