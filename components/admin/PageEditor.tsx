"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { ErrorState, LoadingState } from "@/components/admin/States";
import { useToast } from "@/components/admin/Toast";
import { AdminApiError, adminFetch } from "@/components/admin/api";
import { getPageDefinition } from "@/content/pages";
import type { FieldSection } from "@/lib/fields";
import type { PageKey } from "@/types";

const SEO_SECTION: FieldSection = {
  title: "SEO",
  description: "Shown in Google results and when the page is shared.",
  fields: [
    { name: "seoTitle", label: "SEO title", type: "text", wide: true },
    { name: "seoDescription", label: "Meta description", type: "textarea", rows: 2, wide: true },
  ],
};

export function PageEditor({ pageKey }: { pageKey: PageKey }) {
  const def = getPageDefinition(pageKey)!;
  const toast = useToast();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<{ content: Record<string, unknown>; seoTitle: string; seoDescription: string }>(`/api/admin/pages/${pageKey}`)
      .then((d) => setInitial({ ...d.content, seoTitle: d.seoTitle, seoDescription: d.seoDescription }))
      .catch((e) => setError((e as Error).message));
  }, [pageKey]);

  async function save(values: Record<string, unknown>) {
    const { seoTitle, seoDescription, ...content } = values;
    try {
      await adminFetch(`/api/admin/pages/${pageKey}`, { method: "PUT", body: JSON.stringify({ content, seoTitle, seoDescription }) });
      toast.success(`${def.label} saved. Changes are live.`);
    } catch (e) {
      const err = e as AdminApiError;
      toast.error(err.message);
      if (err.fields) {
        // Server paths are prefixed with "content." — map them back to form fields.
        return { fields: Object.fromEntries(Object.entries(err.fields).map(([k, v]) => [k.replace(/^content\./, ""), v])) };
      }
    }
  }

  return (
    <>
      <Link href="/admin/pages" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-navy-900">
        <ArrowLeft className="size-4" aria-hidden="true" /> Pages
      </Link>
      <AdminPageHeader
        title={def.label}
        description={`Editing ${def.path}`}
        actions={
          <a href={def.path} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-navy-900 ring-1 ring-line hover:bg-sky-50">
            <ExternalLink className="size-4" aria-hidden="true" /> View page
          </a>
        }
      />
      {error ? <ErrorState message={error} /> : !initial ? <LoadingState /> : <ResourceForm sections={[...def.sections, SEO_SECTION]} initialValues={initial} onSubmit={save} />}
    </>
  );
}
