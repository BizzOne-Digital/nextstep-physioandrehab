"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Loader2, Save } from "lucide-react";
import type { FieldSection } from "@/lib/fields";
import { FieldRenderer, getPath, setPath } from "@/components/admin/FieldRenderer";
import { cn } from "@/lib/utils";

interface Props {
  sections: FieldSection[];
  initialValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<{ fields?: Record<string, string> } | void>;
  submitLabel?: string;
  extraActions?: ReactNode;
}

/** Reusable admin form generated from field definitions. */
export function ResourceForm({ sections, initialValues, onSubmit, submitLabel = "Save changes", extraActions }: Props) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initialValues));
  const dirty = useMemo(() => JSON.stringify(values) !== baseline, [values, baseline]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function validate(): Record<string, string> {
    const found: Record<string, string> = {};
    for (const field of sections.flatMap((s) => s.fields)) {
      if (!field.required) continue;
      const v = getPath(values, field.name);
      if (v === undefined || v === null || (typeof v === "string" && v.trim() === "")) found[field.name] = `${field.label} is required`;
    }
    return found;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const local = validate();
    setErrors(local);
    if (Object.keys(local).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setSaving(true);
    try {
      const result = await onSubmit(values);
      if (result?.fields) setErrors(result.fields);
      else setBaseline(JSON.stringify(values));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {sections.map((section) => (
        <section key={section.title} className="rounded-3xl border border-line bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold">{section.title}</h2>
          {section.description && <p className="mt-1 text-sm text-muted">{section.description}</p>}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.name} className={cn((field.wide || ["repeater", "richtext", "list", "image"].includes(field.type)) && "md:col-span-2")}>
                <FieldRenderer
                  field={field}
                  value={getPath(values, field.name)}
                  values={values}
                  error={errors[field.name]}
                  errors={errors}
                  onChange={(v) => setValues((prev) => setPath(prev, field.name, v))}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <p className="text-sm text-muted" aria-live="polite">
          {Object.keys(errors).length ? (
            <span className="font-medium text-red-600">Please fix {Object.keys(errors).length} highlighted field{Object.keys(errors).length > 1 ? "s" : ""}.</span>
          ) : dirty ? (
            "You have unsaved changes"
          ) : (
            "All changes saved"
          )}
        </p>
        <div className="flex gap-2">
          {extraActions}
          <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-full bg-teal-700 px-6 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            {saving ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
