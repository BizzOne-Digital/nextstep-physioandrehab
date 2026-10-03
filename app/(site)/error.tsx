"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SiteError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry?: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
        <TriangleAlert className="size-7" aria-hidden="true" />
      </span>
      <h1 className="display-md mt-6">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">We&apos;re sorry — this page couldn&apos;t load. Please try again, or call us if you need help right away.</p>
      <div className="mt-8 flex gap-3">
        <Button onClick={() => (unstable_retry ? unstable_retry() : window.location.reload())}>
          <RefreshCw className="size-4" aria-hidden="true" /> Try again
        </Button>
        <Link href="/" className="inline-flex h-12 items-center rounded-full px-6 font-semibold text-navy-900 ring-1 ring-line hover:text-teal-700">
          Go home
        </Link>
      </div>
    </section>
  );
}
