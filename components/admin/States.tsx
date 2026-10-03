import { Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-3xl border border-line bg-white p-12 text-muted" role="status">
      <Loader2 className="size-5 animate-spin text-teal-600" aria-hidden="true" />
      {label}
    </div>
  );
}

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-sky-50 text-teal-700">{icon ?? <Inbox className="size-6" aria-hidden="true" />}</span>
      <p className="mt-4 font-display text-lg font-bold text-navy-900">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700" role="alert">
      <p className="font-semibold">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 font-semibold underline underline-offset-2">
          Try again
        </button>
      )}
    </div>
  );
}
