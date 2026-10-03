import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  scheduled: "bg-violet-100 text-violet-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-slate-100 text-slate-600",
  read: "bg-sky-100 text-sky-800",
  replied: "bg-emerald-100 text-emerald-800",
  archived: "bg-slate-100 text-slate-600",
  published: "bg-emerald-100 text-emerald-800",
  draft: "bg-slate-100 text-slate-600",
  website: "bg-amber-100 text-amber-800",
  admin: "bg-slate-100 text-slate-600",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize", STYLES[status] ?? "bg-sky-50 text-navy-800", className)}>
      {status}
    </span>
  );
}
