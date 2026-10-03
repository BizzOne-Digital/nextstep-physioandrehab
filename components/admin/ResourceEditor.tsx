"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import { AdminApiError, adminFetch } from "@/components/admin/api";
import { RESOURCES, type ResourceKey } from "@/lib/resource-config";

export function ResourceEditor({ resourceKey, id }: { resourceKey: ResourceKey; id?: string }) {
  const config = RESOURCES[resourceKey];
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(id ? null : { ...config.defaults });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    adminFetch<{ item: Record<string, unknown> }>(`/api/admin/${resourceKey}/${id}`)
      .then(({ item }) => {
        // Selects store strings; normalise numbers (e.g. ratings) for the form.
        if (typeof item.rating === "number") item.rating = String(item.rating);
        setInitial(item);
      })
      .catch((e) => setError((e as Error).message));
  }, [id, resourceKey]);

  async function save(values: Record<string, unknown>) {
    try {
      if (id) {
        await adminFetch(`/api/admin/${resourceKey}/${id}`, { method: "PUT", body: JSON.stringify(values) });
        toast.success(`${config.singular} saved.`);
        router.refresh();
      } else {
        const res = await adminFetch<{ item: { _id: string } }>(`/api/admin/${resourceKey}`, { method: "POST", body: JSON.stringify(values) });
        toast.success(`${config.singular} created.`);
        router.replace(`/admin/${resourceKey}/${res.item._id}`);
      }
    } catch (e) {
      const err = e as AdminApiError;
      toast.error(err.message);
      if (err.fields) return { fields: err.fields };
    }
  }

  async function remove() {
    if (!id) return;
    const ok = await confirm({ title: `Delete ${config.singular.toLowerCase()}?`, message: "This cannot be undone.", confirmLabel: "Delete" });
    if (!ok) return;
    try {
      await adminFetch(`/api/admin/${resourceKey}/${id}`, { method: "DELETE" });
      toast.success(`${config.singular} deleted.`);
      router.replace(`/admin/${resourceKey}`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const title = initial ? String(initial[config.titleField] ?? "") : "";
  const live = initial && id ? config.publicPath?.(initial) : null;

  return (
    <>
      <Link href={`/admin/${resourceKey}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-navy-900">
        <ArrowLeft className="size-4" aria-hidden="true" /> {config.label}
      </Link>
      <AdminPageHeader
        title={id ? title || `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}
        actions={
          id && (
            <>
              {live && initial?.published !== false && (
                <a href={live} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-navy-900 ring-1 ring-line hover:bg-sky-50">
                  <ExternalLink className="size-4" aria-hidden="true" /> View live
                </a>
              )}
              <button type="button" onClick={remove} className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50">
                <Trash2 className="size-4" aria-hidden="true" /> Delete
              </button>
            </>
          )
        }
      />
      {error ? (
        <ErrorState message={error} />
      ) : !initial ? (
        <LoadingState />
      ) : (
        <ResourceForm key={String(initial._id ?? "new")} sections={config.sections} initialValues={initial} onSubmit={save} submitLabel={id ? "Save changes" : `Create ${config.singular.toLowerCase()}`} />
      )}
    </>
  );
}
