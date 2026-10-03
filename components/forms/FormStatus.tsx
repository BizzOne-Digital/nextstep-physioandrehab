import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export function FormSuccess({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center rounded-[1.75rem] bg-gradient-to-br from-mint-100 to-aqua-50 px-6 py-12 text-center ring-1 ring-teal-500/20">
      <span className="grid size-16 place-items-center rounded-full bg-teal-700 text-white shadow-soft">
        <CheckCircle2 className="size-8" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-2xl font-bold">{title}</h3>
      <div className="mt-3 max-w-md leading-relaxed text-muted">{children}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700 ring-1 ring-red-200">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {message}
    </div>
  );
}
