"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadCloud, Loader2 } from "lucide-react";
import { adminFetch } from "@/components/admin/api";
import { useToast } from "@/components/admin/Toast";

export function SeedButton() {
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function run() {
    setBusy(true);
    try {
      await adminFetch("/api/admin/seed", { method: "POST" });
      toast.success("Website content imported.");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={run} disabled={busy} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <DownloadCloud className="size-4" aria-hidden="true" />}
      {busy ? "Importing…" : "Import content"}
    </button>
  );
}
