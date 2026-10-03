"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import type { FieldErrors } from "@/lib/form-rules";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-2xl border bg-white px-4 py-3.5 text-[0.95rem] text-navy-900 placeholder:text-muted/70 transition-colors focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15";

interface WrapProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ id, label, error, required, hint, children, className }: WrapProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy-900">
        {label}
        {required && (
          <span className="text-teal-700" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type Base = { id: string; label: string; error?: string; hint?: string; wrapClassName?: string };

export function TextInput({ id, label, error, hint, required, wrapClassName, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Field id={id} label={label} error={error} required={required} hint={hint} className={wrapClassName}>
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, error ? "border-red-400" : "border-line")}
        {...rest}
      />
    </Field>
  );
}

export function TextArea({ id, label, error, hint, required, wrapClassName, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Field id={id} label={label} error={error} required={required} hint={hint} className={wrapClassName}>
      <textarea
        id={id}
        name={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "min-h-32 resize-y", error ? "border-red-400" : "border-line")}
        {...rest}
      />
    </Field>
  );
}

export function SelectInput({
  id, label, error, hint, required, wrapClassName, children, ...rest
}: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Field id={id} label={label} error={error} required={required} hint={hint} className={wrapClassName}>
      <select
        id={id}
        name={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(control, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-11", error ? "border-red-400" : "border-line")}
        {...rest}
      >
        {children}
      </select>
    </Field>
  );
}

/** Hidden honeypot field; must stay empty (checked server-side). */
export function SpamGuard() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

/** Shared submit flow for public forms: client validation, POST, field errors. */
export function usePublicForm(endpoint: string, validate: (values: Record<string, unknown>) => FieldErrors) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  // When the form became interactive; very fast submissions are treated as bots.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function submit(values: Record<string, unknown>, form: HTMLFormElement) {
    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(fieldErrors)[0]}"]`);
      first?.focus();
      return false;
    }

    setStatus("submitting");
    setErrors({});
    setMessage("");
    const fd = new FormData(form);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: fd.get("website") ?? "", startedAt: startedAt.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        setErrors(json.fields ?? {});
        setStatus("error");
        setMessage(json.error ?? "Something went wrong. Please try again or call us.");
        return false;
      }
      setStatus("success");
      setMessage(json.message ?? "Thank you!");
      return true;
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Please check your connection or call us.");
      return false;
    }
  }

  return { status, errors, message, submit, setStatus };
}
