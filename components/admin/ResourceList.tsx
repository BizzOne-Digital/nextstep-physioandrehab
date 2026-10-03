"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/States";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import { adminFetch } from "@/components/admin/api";
import { useAdminQuery, useDebounced } from "@/components/admin/useAdminQuery";
import { RESOURCES, type ResourceKey } from "@/lib/resource-config";

type Row = Record<string, unknown> & { _id: string };

export function ResourceList({ resourceKey }: { resourceKey: ResourceKey }) {
  const config = RESOURCES[resourceKey];
  const confirm = useConfirm();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query);
  const [pageState, setPageState] = useState({ q: "", page: 1 });
  // Reset to page 1 whenever the search changes.
  const page = pageState.q === debounced ? pageState.page : 1;
  const setPage = (fn: (p: number) => number) => setPageState({ q: debounced, page: fn(page) });

  const { data, error, loading, reload, mutate } = useAdminQuery<{ items: Row[]; pages: number; total: number }>(
    `/api/admin/${resourceKey}?q=${encodeURIComponent(debounced)}&page=${page}&limit=25`,
  );
  const rows = data?.items ?? [];
  const pages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  async function remove(row: Row) {
    const name = String(row[config.titleField] ?? config.singular);
    const ok = await confirm({
      title: `Delete ${config.singular.toLowerCase()}?`,
      message: `"${name}" will be permanently deleted, along with any images uploaded only for it. This cannot be undone.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await adminFetch(`/api/admin/${resourceKey}/${row._id}`, { method: "DELETE" });
      toast.success(`${config.singular} deleted.`);
      mutate((d) => ({ ...d, items: d.items.filter((x) => x._id !== row._id), total: d.total - 1 }));
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const iconBtn = "grid size-9 place-items-center rounded-lg text-muted hover:bg-sky-50 hover:text-navy-900";

  return (
    <>
      <AdminPageHeader
        title={config.label}
        description={config.description}
        actions={
          <Link href={`/admin/${resourceKey}/new`} className="inline-flex h-11 items-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800">
            <Plus className="size-4" aria-hidden="true" /> New {config.singular.toLowerCase()}
          </Link>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="resource-search" className="sr-only">
            Search {config.label}
          </label>
          <input
            id="resource-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${config.label.toLowerCase()}…`}
            className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
          />
        </div>
        <p className="text-sm text-muted">{total} total</p>
      </div>

      {loading && !data ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={debounced ? "No matches found" : `No ${config.label.toLowerCase()} yet`}
          description={debounced ? "Try a different search." : `Create your first ${config.singular.toLowerCase()} to get started.`}
          action={
            !debounced && (
              <Link href={`/admin/${resourceKey}/new`} className="inline-flex h-10 items-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-semibold text-white">
                <Plus className="size-4" aria-hidden="true" /> New {config.singular.toLowerCase()}
              </Link>
            )
          }
        />
      ) : (
        <DataTable
          columns={config.columns}
          rows={rows}
          titleKey={config.titleField}
          actions={(row) => {
            const live = config.publicPath?.(row);
            const isLive = live && (row.published !== false);
            return (
              <>
                {isLive && (
                  <a href={live} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="View on website" title="View on website">
                    <ExternalLink className="size-4" />
                  </a>
                )}
                <Link href={`/admin/${resourceKey}/${row._id}`} className={iconBtn} aria-label={`Edit ${String(row[config.titleField] ?? "")}`} title="Edit">
                  <Pencil className="size-4" />
                </Link>
                <button type="button" onClick={() => remove(row)} className={`${iconBtn} hover:text-red-600`} aria-label={`Delete ${String(row[config.titleField] ?? "")}`} title="Delete">
                  <Trash2 className="size-4" />
                </button>
              </>
            );
          }}
        />
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-3">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-line disabled:opacity-40" aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm text-muted">
            Page {page} of {pages}
          </span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="grid size-10 place-items-center rounded-full bg-white ring-1 ring-line disabled:opacity-40" aria-label="Next page">
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </>
  );
}
