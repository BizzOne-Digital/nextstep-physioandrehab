import crypto from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { ApiError, handleApiError, ok } from "@/lib/api";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/fields";
import { deleteStoredUploadByUrl, isAllowedFolder, isUploadInUse, parseUploadUrl } from "@/lib/uploads";
import { StoredUpload } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EXTENSIONS: Record<(typeof ALLOWED_IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Confirms the bytes match the declared type, so renamed files are rejected. */
function matchesSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false;
  switch (mimeType) {
    case "image/jpeg":
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case "image/png":
      return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "image/gif":
      return buffer.subarray(0, 6).toString("ascii") === "GIF87a" || buffer.subarray(0, 6).toString("ascii") === "GIF89a";
    case "image/webp":
      return buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
    default:
      return false;
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      throw new ApiError("Expected multipart form data.", 400);
    }

    const file = form.get("file");
    const folder = String(form.get("folder") ?? "");

    if (!isAllowedFolder(folder)) throw new ApiError("Invalid upload folder.", 400);
    if (!(file instanceof File)) throw new ApiError("No file was provided.", 400);

    const mimeType = file.type as (typeof ALLOWED_IMAGE_TYPES)[number];
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      throw new ApiError("Only PNG, JPEG, WebP and GIF images are allowed.", 415);
    }
    if (file.size <= 0) throw new ApiError("The file is empty.", 400);
    if (file.size > MAX_UPLOAD_BYTES) throw new ApiError("Images must be 8 MB or smaller.", 413);

    const data = Buffer.from(await file.arrayBuffer());
    if (!matchesSignature(data, mimeType)) throw new ApiError("The file content does not match its image type.", 415);

    const ext = EXTENSIONS[mimeType];
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

    await connectDB();
    await StoredUpload.create({ folder, filename, mimeType, size: data.length, data });

    return ok(
      { url: `/api/uploads/${folder}/${filename}`, filename, size: data.length, folder },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Discards an upload made during an editing session that was replaced or
 * removed before saving. Never deletes an image that saved content uses.
 */
export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json().catch(() => ({}))) as { url?: unknown };
    if (!parseUploadUrl(body.url)) throw new ApiError("Invalid upload URL.", 400);
    await connectDB();
    const url = String(body.url);
    if (await isUploadInUse(url)) return ok({ deleted: false, reason: "in-use" });
    return ok({ deleted: await deleteStoredUploadByUrl(url) });
  } catch (error) {
    return handleApiError(error);
  }
}
