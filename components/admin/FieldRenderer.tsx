"use client";

import { useId } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Wand2 } from "lucide-react";
import type { FieldDef } from "@/lib/fields";
import { LocalImageField } from "@/components/admin/ImageField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { SERVICE_ICON_COMPONENTS } from "@/components/ui/Icon";
import { cn, slugify } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-muted/70 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15";

/* ------------------------------ path helpers ------------------------------ */
export function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined), obj);
}

export function setPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const [head, ...rest] = path.split(".");
  if (!rest.length) return { ...obj, [head]: value };
  const child = (obj[head] && typeof obj[head] === "object" ? obj[head] : {}) as Record<string, unknown>;
  return { ...obj, [head]: setPath(child, rest.join("."), value) };
}

interface FieldProps {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  errors?: Record<string, string>;
  errorPrefix?: string;
  /** Full form values (used by slug fields to generate from another field). */
  values?: Record<string, unknown>;
}

function Label({ htmlFor, field }: { htmlFor: string; field: FieldDef }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-navy-900">
      {field.label}
      {field.required && <span className="text-teal-700"> *</span>}
    </label>
  );
}

function Help({ field, error, id }: { field: FieldDef; error?: string; id: string }) {
  if (error)
    return (
      <p id={`${id}-err`} className="mt-1.5 text-sm font-medium text-red-600" role="alert">
        {error}
      </p>
    );
  return field.help ? <p className="mt-1.5 text-xs text-muted">{field.help}</p> : null;
}

export function FieldRenderer({ field, value, onChange, error, errors = {}, errorPrefix = "", values = {} }: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-err` : undefined;
  const border = error ? "border-red-400" : "border-line";

  switch (field.type) {
    case "image":
      return (
        <LocalImageField
          label={field.label}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          folder={field.folder ?? "misc"}
          error={error}
          help={field.help}
          required={field.required}
        />
      );

    case "richtext":
      return <RichTextEditor id={id} label={field.label} value={typeof value === "string" ? value : ""} onChange={onChange} error={error} />;

    case "boolean":
      return (
        <div>
          <label htmlFor={id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
            <span className="relative inline-flex">
              <input id={id} type="checkbox" className="peer sr-only" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
              <span className="h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-teal-700 peer-focus-visible:ring-4 peer-focus-visible:ring-teal-500/30" />
              <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
            <span className="text-sm font-semibold text-navy-900">{field.label}</span>
          </label>
          <Help field={field} error={error} id={id} />
        </div>
      );

    case "select":
      return (
        <div>
          <Label htmlFor={id} field={field} />
          <select id={id} value={value == null ? "" : String(value)} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={describedBy} className={cn(inputCls, border)}>
            {!field.required && <option value="">—</option>}
            {(field.options ?? []).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help field={field} error={error} id={id} />
        </div>
      );

    case "icon": {
      const current = typeof value === "string" ? value : "";
      return (
        <div>
          <p className="mb-2 text-sm font-semibold text-navy-900">{field.label}</p>
          <div role="radiogroup" aria-label={field.label} className="grid grid-cols-6 gap-1.5 rounded-xl border border-line bg-white p-2 sm:grid-cols-8">
            {(field.options ?? []).map((o) => {
              const Cmp = SERVICE_ICON_COMPONENTS[o.value];
              const active = current === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={o.label}
                  aria-label={o.label}
                  onClick={() => onChange(o.value)}
                  className={cn("grid aspect-square place-items-center rounded-lg transition-colors", active ? "bg-teal-700 text-white" : "text-navy-900 hover:bg-sky-50")}
                >
                  {Cmp ? <Cmp className="size-5" aria-hidden="true" /> : o.label.slice(0, 2)}
                </button>
              );
            })}
          </div>
          <Help field={field} error={error} id={id} />
        </div>
      );
    }

    case "slug": {
      const source = field.from ? String(getPath(values, field.from) ?? "") : "";
      return (
        <div>
          <Label htmlFor={id} field={field} />
          <div className="flex gap-2">
            <input
              id={id}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-{2,}/g, "-"))}
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
              className={cn(inputCls, border, "font-mono")}
              spellCheck={false}
            />
            {field.from && (
              <button
                type="button"
                onClick={() => onChange(slugify(source))}
                disabled={!source}
                title="Generate from title"
                aria-label="Generate slug from title"
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-mint-100 text-teal-800 hover:bg-teal-700 hover:text-white disabled:opacity-40"
              >
                <Wand2 className="size-4" />
              </button>
            )}
          </div>
          <Help field={field} error={error} id={id} />
        </div>
      );
    }

    case "list": {
      const items = Array.isArray(value) ? (value as string[]) : [];
      const update = (next: string[]) => onChange(next);
      return (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-navy-900">{field.label}</legend>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                {field.rows ? (
                  <textarea
                    aria-label={`${field.label} ${i + 1}`}
                    rows={field.rows}
                    value={item}
                    onChange={(e) => update(items.map((x, j) => (j === i ? e.target.value : x)))}
                    className={cn(inputCls, errors[`${errorPrefix}${field.name}.${i}`] ? "border-red-400" : "border-line")}
                  />
                ) : (
                  <input
                    aria-label={`${field.label} ${i + 1}`}
                    value={item}
                    onChange={(e) => update(items.map((x, j) => (j === i ? e.target.value : x)))}
                    className={cn(inputCls, "border-line")}
                  />
                )}
                <RowControls
                  onUp={i > 0 ? () => update(move(items, i, i - 1)) : undefined}
                  onDown={i < items.length - 1 ? () => update(move(items, i, i + 1)) : undefined}
                  onRemove={() => update(items.filter((_, j) => j !== i))}
                  label={`item ${i + 1}`}
                />
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => update([...items, ""])} className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-teal-700 ring-1 ring-teal-500/30 hover:bg-mint-100">
            <Plus className="size-4" aria-hidden="true" /> Add item
          </button>
          <Help field={field} error={error} id={id} />
        </fieldset>
      );
    }

    case "repeater": {
      const rows = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      const update = (next: Record<string, unknown>[]) => onChange(next);
      const sub = field.fields ?? [];
      return (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-navy-900">{field.label}</legend>
          <ul className="space-y-3">
            {rows.map((row, i) => (
              <li key={i} className="rounded-2xl border border-line bg-sky-50/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">#{i + 1}</span>
                  <RowControls
                    onUp={i > 0 ? () => update(move(rows, i, i - 1)) : undefined}
                    onDown={i < rows.length - 1 ? () => update(move(rows, i, i + 1)) : undefined}
                    onRemove={() => update(rows.filter((_, j) => j !== i))}
                    label={`row ${i + 1}`}
                  />
                </div>
                <div className={cn("grid gap-3", sub.length > 2 && "sm:grid-cols-2", sub.length === 2 && sub.every((s) => s.type !== "textarea") && "sm:grid-cols-2")}>
                  {sub.map((sf) => (
                    <FieldRenderer
                      key={sf.name}
                      field={sf}
                      value={row[sf.name]}
                      error={errors[`${errorPrefix}${field.name}.${i}.${sf.name}`]}
                      onChange={(v) => update(rows.map((r, j) => (j === i ? { ...r, [sf.name]: v } : r)))}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => update([...rows, Object.fromEntries(sub.map((s) => [s.name, s.type === "boolean" ? false : ""]))])}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-teal-700 ring-1 ring-teal-500/30 hover:bg-mint-100"
          >
            <Plus className="size-4" aria-hidden="true" /> Add {field.label.toLowerCase().replace(/s$/, "")}
          </button>
          <Help field={field} error={error} id={id} />
        </fieldset>
      );
    }

    case "textarea":
      return (
        <div>
          <Label htmlFor={id} field={field} />
          <textarea
            id={id}
            rows={field.rows ?? 4}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            placeholder={field.placeholder}
            className={cn(inputCls, border, "resize-y")}
          />
          <Help field={field} error={error} id={id} />
          {field.name.toLowerCase().includes("seodescription") && typeof value === "string" && (
            <p className={cn("mt-1 text-xs", value.length > 160 ? "text-amber-600" : "text-muted")}>{value.length} / 160 characters</p>
          )}
        </div>
      );

    default: {
      const type = field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "url" ? "url" : field.type === "date" ? "date" : field.type === "time" ? "time" : "text";
      const display = field.type === "date" && typeof value === "string" ? value.slice(0, 10) : value ?? "";
      return (
        <div>
          <Label htmlFor={id} field={field} />
          <input
            id={id}
            type={type}
            value={String(display)}
            min={field.min}
            max={field.max}
            onChange={(e) => onChange(field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            placeholder={field.placeholder}
            className={cn(inputCls, border)}
          />
          <Help field={field} error={error} id={id} />
          {field.name.toLowerCase().includes("seotitle") && typeof value === "string" && (
            <p className={cn("mt-1 text-xs", value.length > 60 ? "text-amber-600" : "text-muted")}>{value.length} / 60 characters</p>
          )}
        </div>
      );
    }
  }
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function RowControls({ onUp, onDown, onRemove, label }: { onUp?: () => void; onDown?: () => void; onRemove: () => void; label: string }) {
  const btn = "grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-white hover:text-navy-900 disabled:opacity-30";
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button type="button" className={btn} onClick={onUp} disabled={!onUp} aria-label={`Move ${label} up`}>
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className={btn} onClick={onDown} disabled={!onDown} aria-label={`Move ${label} down`}>
        <ArrowDown className="size-4" />
      </button>
      <button type="button" className={cn(btn, "hover:text-red-600")} onClick={onRemove} aria-label={`Remove ${label}`}>
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
