"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { LocalImageField } from "@/components/admin/ImageField";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/States";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import { adminFetch } from "@/components/admin/api";
import { useAdminQuery } from "@/components/admin/useAdminQuery";
import { UPLOAD_FOLDERS, type UploadFolder } from "@/lib/fields";
import { cn, formatDate } from "@/lib/utils";

interface Upload {
  _id: string;
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export function MediaLibrary() {
  const toast = useToast();
  const confirm = useConfirm();
  const [folder, setFolder] = useState("");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState("");
  const [uploadFolder, setUploadFolder] = useState<UploadFolder>("misc");
  const [lastUpload, setLastUpload] = useState("");

  const { data, error, reload: load } = useAdminQuery<{ items: Upload[]; pages: number; total: number; storage: { bytes: number; count: number } }>(
    `/api/admin/media?folder=${folder}&page=${page}`,
  );

  async function copy(url: string) {
    await navigator.clipboard.writeText(url).catch(() => undefined);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  }

  async function remove(item: Upload) {
    const ok = await confirm({ title: "Delete this image?", message: "The file will be permanently removed from the database.", confirmLabel: "Delete" });
    if (!ok) return;
    try {
      await adminFetch(`/api/admin/media/${item._id}`, { method: "DELETE" });
      toast.success("Image deleted.");
      void load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Images & media"
        description="All uploaded images are stored in MongoDB, so they survive redeploys. Images still used on the website are protected from deletion."
      />

      <section className="mb-8 grid gap-4 rounded-3xl border border-line bg-white p-5 sm:p-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-lg font-bold">Upload an image</h2>
          <p className="mt-1 text-sm text-muted">Upload here to get a URL you can reuse. Most images are best uploaded directly in the content you are editing.</p>
          <label htmlFor="media-folder" className="mb-2 mt-4 block text-sm font-semibold">
            Folder
          </label>
          <select id="media-folder" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value as UploadFolder)} className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm capitalize">
            {UPLOAD_FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <LocalImageField
          label="Image"
          folder={uploadFolder}
          keepReplaced
          value={lastUpload}
          onChange={(url) => {
            setLastUpload(url);
            if (url) void load();
          }}
          help={lastUpload ? "Copy the URL above to use this image elsewhere." : undefined}
        />
      </section>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2">
            {["", ...UPLOAD_FOLDERS].map((f) => (
              <button
                key={f || "all"}
                type="button"
                onClick={() => {
                  setFolder(f);
                  setPage(1);
                }}
                aria-pressed={folder === f}
                className={cn("whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize", folder === f ? "bg-navy-900 text-white" : "bg-white text-navy-900 ring-1 ring-line hover:bg-sky-50")}
              >
                {f || "All"}
              </button>
            ))}
          </div>
        </div>
        {data && (
          <p className="text-sm text-muted">
            {data.storage.count} files · {kb(data.storage.bytes)} used
          </p>
        )}
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !data ? (
        <LoadingState />
      ) : data.items.length === 0 ? (
        <EmptyState title="No images yet" description="Images you upload in the admin will appear here." />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.items.map((item) => (
            <li key={item._id} className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="relative aspect-[4/3] bg-sky-50">
                <Image src={item.url} alt={item.filename} fill sizes="(min-width: 1024px) 260px, 50vw" className="object-cover" />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-navy-900" title={item.filename}>
                  {item.filename}
                </p>
                <p className="mt-0.5 text-xs capitalize text-muted">
                  {item.folder} · {kb(item.size)} · {formatDate(item.createdAt, { month: "short", day: "numeric" })}
                </p>
                <div className="mt-2 flex gap-1">
                  <button type="button" onClick={() => copy(item.url)} className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-50 text-xs font-semibold text-navy-900 hover:bg-mint-100">
                    {copied === item.url ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied === item.url ? "Copied" : "Copy URL"}
                  </button>
                  <button type="button" onClick={() => remove(item)} className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-red-50" aria-label={`Delete ${item.filename}`}>
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {data && data.pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-3">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-line disabled:opacity-40" aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm text-muted">
            Page {page} of {data.pages}
          </span>
          <button type="button" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-line disabled:opacity-40" aria-label="Next page">
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </>
  );
}
