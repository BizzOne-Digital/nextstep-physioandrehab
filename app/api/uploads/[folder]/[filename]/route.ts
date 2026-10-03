import { connectDB } from "@/lib/db";
import { isAllowedFolder, isSafeFilename } from "@/lib/uploads";
import { StoredUpload } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound() {
  return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
}

export async function GET(_request: Request, ctx: RouteContext<"/api/uploads/[folder]/[filename]">) {
  const { folder, filename } = await ctx.params;

  if (!isAllowedFolder(folder) || !isSafeFilename(filename)) return notFound();

  try {
    await connectDB();
    const file = await StoredUpload.findOne({ folder, filename }).lean();
    if (!file?.data) return notFound();

    // Mongoose lean() returns a BSON Binary for Buffer fields.
    const raw = file.data as unknown as { buffer?: Uint8Array } | Buffer;
    const bytes = Buffer.isBuffer(raw) ? raw : Buffer.from((raw as { buffer: Uint8Array }).buffer ?? []);

    return new Response(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": file.mimeType,
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("[uploads] read failed:", (error as Error).message);
    return new Response("Unable to load file", { status: 500 });
  }
}
