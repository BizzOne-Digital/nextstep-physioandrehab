"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Loader2, Mail, Phone, Search, Stethoscope, Trash2, X } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/admin/States";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useConfirm } from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/Toast";
import { adminFetch } from "@/components/admin/api";
import { useAdminQuery, useDebounced } from "@/components/admin/useAdminQuery";
import { inputCls } from "@/components/admin/FieldRenderer";
import { cn, formatDate, phoneHref } from "@/lib/utils";

type Kind = "appointments" | "contacts";
type Item = Record<string, string> & { _id: string; status: string; createdAt: string };

const CONFIG: Record<Kind, { title: string; description: string; statuses: string[]; nameKey: string }> = {
  appointments: {
    title: "Appointment requests",
    description: "Requests submitted through the booking form. Contact the patient, then update the status so everyone knows where it stands.",
    statuses: ["new", "contacted", "scheduled", "completed", "cancelled"],
    nameKey: "fullName",
  },
  contacts: {
    title: "Contact messages",
    description: "Messages from the contact form. Mark them as replied once a team member has responded.",
    statuses: ["new", "read", "replied", "archived"],
    nameKey: "name",
  },
};

function formatDateTime(v: string) {
  const d = new Date(v);
  return d.toLocaleString("en-CA", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Toronto" });
}

export function SubmissionsManager({ kind }: { kind: Kind }) {
  const cfg = CONFIG[kind];
  const params = useSearchParams();
  const toast = useToast();
  const confirm = useConfirm();
  const [status, setStatus] = useState(params.get("status") ?? "");
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query);
  const [pageState, setPageState] = useState({ filter: "", page: 1 });
  const filterKey = `${status}|${debounced}`;
  // Return to page 1 whenever the status filter or search changes.
  const page = pageState.filter === filterKey ? pageState.page : 1;
  const setPage = (fn: (p: number) => number) => setPageState({ filter: filterKey, page: fn(page) });
  const [selected, setSelected] = useState<Item | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, error, reload: load, mutate } = useAdminQuery<{ items: Item[]; pages: number; total: number; statusCounts: Record<string, number> }>(
    `/api/admin/submissions/${kind}?status=${status}&q=${encodeURIComponent(debounced)}&page=${page}`,
  );

  async function update(item: Item, patch: Record<string, string>, quiet = false) {
    setSaving(true);
    try {
      const { item: updated } = await adminFetch<{ item: Item }>(`/api/admin/submissions/${kind}/${item._id}`, { method: "PATCH", body: JSON.stringify(patch) });
      mutate((d) => ({ ...d, items: d.items.map((i) => (i._id === item._id ? updated : i)) }));
      setSelected((s) => (s?._id === item._id ? updated : s));
      if (!quiet) toast.success("Updated.");
      if (patch.status) void load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function open(item: Item) {
    setSelected(item);
    setNotes(item.notes ?? "");
    if (kind === "contacts" && item.status === "new") void update(item, { status: "read" }, true);
  }

  async function remove(item: Item) {
    const ok = await confirm({ title: "Delete this submission?", message: "It will be permanently removed. This cannot be undone.", confirmLabel: "Delete" });
    if (!ok) return;
    try {
      await adminFetch(`/api/admin/submissions/${kind}/${item._id}`, { method: "DELETE" });
      toast.success("Deleted.");
      setSelected(null);
      void load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  const counts = data?.statusCounts ?? {};
  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <AdminPageHeader title={cfg.title} description={cfg.description} />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="tablist" aria-label="Filter by status">
          <div className="flex w-max gap-2">
            {["", ...cfg.statuses].map((s) => (
              <button
                key={s || "all"}
                type="button"
                role="tab"
                aria-selected={status === s}
                onClick={() => setStatus(s)}
                className={cn("flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold capitalize", status === s ? "bg-navy-900 text-white" : "bg-white text-navy-900 ring-1 ring-line hover:bg-sky-50")}
              >
                {s || "All"}
                <span className={cn("rounded-full px-1.5 text-xs", status === s ? "bg-white/20" : "bg-sky-50")}>{s ? counts[s] ?? 0 : allCount}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="sub-search" className="sr-only">
            Search
          </label>
          <input id="sub-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone…" className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15" />
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !data ? (
        <LoadingState />
      ) : data.items.length === 0 ? (
        <EmptyState title="Nothing here yet" description={status ? `No ${status} submissions.` : "New submissions will appear here."} />
      ) : (
        <ul className="space-y-3">
          {data.items.map((item) => (
            <li key={item._id}>
              <button
                type="button"
                onClick={() => open(item)}
                className={cn("flex w-full flex-col gap-2 rounded-2xl border bg-white p-4 text-left transition-shadow hover:shadow-card sm:flex-row sm:items-center sm:gap-4", item.status === "new" ? "border-teal-500/40" : "border-line")}
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    {item.status === "new" && <span className="size-2 rounded-full bg-teal-500" aria-label="New" />}
                    <span className="truncate font-semibold text-navy-900">{item[cfg.nameKey]}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-muted">
                    {kind === "appointments" ? [item.service || "Any service", item.preferredDate && formatDate(item.preferredDate + "T12:00:00", { month: "short", day: "numeric" }), item.preferredTime].filter(Boolean).join(" · ") : item.subject || item.message?.slice(0, 80)}
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="whitespace-nowrap text-xs text-muted">{formatDateTime(item.createdAt)}</span>
                  <StatusBadge status={item.status} />
                </span>
              </button>
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

      {selected && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="sub-title">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-navy-950/50" onClick={() => setSelected(null)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-white shadow-lift">
            <div className="flex items-start justify-between gap-4 border-b border-line p-5">
              <div>
                <h2 id="sub-title" className="text-xl font-bold">
                  {selected[cfg.nameKey]}
                </h2>
                <p className="mt-1 text-sm text-muted">Received {formatDateTime(selected.createdAt)}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="grid size-10 place-items-center rounded-full bg-sky-50" aria-label="Close" autoFocus>
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="grid gap-2 sm:grid-cols-2">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 rounded-xl bg-sky-50 p-3 text-sm font-medium text-navy-900 hover:bg-mint-100">
                  <Mail className="size-4 shrink-0 text-teal-700" aria-hidden="true" /> <span className="truncate">{selected.email}</span>
                </a>
                {selected.phone && (
                  <a href={phoneHref(selected.phone)} className="flex items-center gap-2 rounded-xl bg-sky-50 p-3 text-sm font-medium text-navy-900 hover:bg-mint-100">
                    <Phone className="size-4 shrink-0 text-teal-700" aria-hidden="true" /> {selected.phone}
                  </a>
                )}
              </div>
              {kind === "appointments" ? (
                <dl className="grid gap-3 rounded-2xl border border-line p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="size-4 text-teal-700" aria-hidden="true" />
                    <dt className="text-muted">Service:</dt>
                    <dd className="font-medium">{selected.service || "Not specified"}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-teal-700" aria-hidden="true" />
                    <dt className="text-muted">Preferred date:</dt>
                    <dd className="font-medium">{selected.preferredDate ? formatDate(selected.preferredDate + "T12:00:00") : "Flexible"}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-teal-700" aria-hidden="true" />
                    <dt className="text-muted">Preferred time:</dt>
                    <dd className="font-medium">{selected.preferredTime || "Flexible"}</dd>
                  </div>
                </dl>
              ) : (
                selected.subject && (
                  <p className="text-sm">
                    <span className="text-muted">Subject:</span> <span className="font-semibold">{selected.subject}</span>
                  </p>
                )
              )}
              {selected.message && (
                <div>
                  <p className="mb-2 text-sm font-semibold">Message</p>
                  <p className="whitespace-pre-wrap rounded-2xl bg-sky-50 p-4 text-sm leading-relaxed text-navy-900">{selected.message}</p>
                </div>
              )}
              <div>
                <label htmlFor="sub-status" className="mb-2 block text-sm font-semibold">
                  Status
                </label>
                <select id="sub-status" value={selected.status} onChange={(e) => update(selected, { status: e.target.value })} disabled={saving} className={cn(inputCls, "border-line capitalize")}>
                  {cfg.statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {kind === "appointments" && (
                <div>
                  <label htmlFor="sub-notes" className="mb-2 block text-sm font-semibold">
                    Internal notes
                  </label>
                  <textarea id="sub-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className={cn(inputCls, "border-line")} placeholder="e.g. Called 2 PM, booked Tue 5 PM with Priya" />
                  <button type="button" onClick={() => update(selected, { notes })} disabled={saving || notes === (selected.notes ?? "")} className="mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-teal-700 px-4 text-sm font-semibold text-white disabled:opacity-50">
                    {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />} Save notes
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-line p-5">
              <button type="button" onClick={() => remove(selected)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
                <Trash2 className="size-4" aria-hidden="true" /> Delete submission
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
