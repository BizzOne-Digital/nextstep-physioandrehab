"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, type UploadFolder } from "@/lib/fields";
import { resolveImage } from "@/lib/images";
import { cn } from "@/lib/utils";

// Vercel limits serverless request bodies to ~4.5 MB, so large photos are
// resized/re-encoded in the browser before upload (GIFs are sent untouched).
const SAFE_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_DIMENSION = 2400;

async function optimizeImage(file: File): Promise<File> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size <= SAFE_UPLOAD_BYTES) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    for (const quality of [0.86, 0.78, 0.68, 0.58]) {
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", quality));
      if (blob && blob.type === "image/webp" && blob.size <= SAFE_UPLOAD_BYTES) {
        return new File([blob], file.name.replace(/.[a-z0-9]+$/i, "") + ".webp", { type: "image/webp" });
      }
    }
  } catch {
    /* fall back to the original file */
  }
  return file;
}

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  error?: string;
  help?: string;
  required?: boolean;
  compact?: boolean;
  /** Keep previous uploads when replaced (used by the media library). */
  keepReplaced?: boolean;
}

/**
 * Admin image upload field. Uploads to POST /api/upload (MongoDB storage)
 * and stores only the returned public URL string via onChange.
 */
export function LocalImageField({ label, value, onChange, folder, error, help, required, compact = false, keepReplaced = false }: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  // Uploads made in this editing session that have not been saved yet.
  const sessionUploads = useRef<Set<string>>(new Set());

  async function discardIfUnsaved(url: string) {
    if (keepReplaced || !sessionUploads.current.has(url)) return;
    sessionUploads.current.delete(url);
    try {
      await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    } catch {
      /* best effort */
    }
  }

  async function handleFile(input: File) {
    let file = input;
    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      toast.error("Please choose a PNG, JPEG, WebP or GIF image.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error("Images must be 8 MB or smaller.");
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);
    file = await optimizeImage(file);
    if (file.size > SAFE_UPLOAD_BYTES) {
      toast.error(file.type === "image/gif" ? "GIFs must be under 4 MB. Please use a smaller GIF or a still image." : "This image could not be compressed enough. Please use a smaller image.");
      setUploading(false);
      setPreview(null);
      URL.revokeObjectURL(localPreview);
      return;
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || "Upload failed");
      const previous = value;
      sessionUploads.current.add(json.url);
      onChange(json.url);
      if (previous) void discardIfUnsaved(previous);
      toast.success("Image uploaded. Remember to save your changes.");
    } catch (e) {
      toast.error((e as Error).message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setPreview(null);
      URL.revokeObjectURL(localPreview);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove() {
    const previous = value;
    onChange("");
    if (previous) void discardIfUnsaved(previous);
  }

  const shown = preview ?? (value ? resolveImage(value) : "");

  return (
    <div>
      <p id={`${id}-label`} className="mb-2 text-sm font-semibold text-navy-900">
        {label}
        {required && <span className="text-teal-700"> *</span>}
      </p>
      <div
        className={cn(
          "flex gap-4 rounded-2xl border bg-white p-3",
          error ? "border-red-400" : "border-line",
          compact ? "items-center" : "flex-col sm:flex-row sm:items-center",
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-xl bg-sky-50 ring-1 ring-line",
            compact ? "size-16" : "aspect-[16/10] w-full sm:w-48",
          )}
        >
          {shown ? (
            preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shown} alt="" className="size-full object-cover" />
            ) : (
              <Image src={shown} alt="Current image" fill sizes="200px" className="object-cover" />
            )
          ) : (
            <span className="grid size-full place-items-center text-muted">
              <ImagePlus className="size-6" aria-hidden="true" />
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-white/70" role="status" aria-label="Uploading">
              <Loader2 className="size-6 animate-spin text-teal-700" />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(",")}
            className="sr-only"
            aria-labelledby={`${id}-label`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
            disabled={uploading}
          />
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor={id}
              className={cn(
                "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-semibold",
                uploading ? "pointer-events-none bg-sky-50 text-muted" : "bg-teal-700 text-white hover:bg-teal-800",
              )}
            >
              {value ? <RefreshCw className="size-4" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
              {uploading ? "Uploading…" : value ? "Replace" : "Upload image"}
            </label>
            {value && !uploading && (
              <button type="button" onClick={remove} className="inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50">
                <Trash2 className="size-4" aria-hidden="true" /> Remove
              </button>
            )}
          </div>
          {!compact && (
            <p className="mt-2 truncate text-xs text-muted" title={value}>
              {value ? value : "PNG, JPEG, WebP or GIF · max 8 MB"}
            </p>
          )}
        </div>
      </div>
      {help && !error && <p className="mt-1.5 text-xs text-muted">{help}</p>}
      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { LocalImageField as ImageField };
