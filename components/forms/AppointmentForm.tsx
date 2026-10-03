"use client";

import { useState, type FormEvent } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectInput, SpamGuard, TextArea, TextInput, usePublicForm } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { validateAppointment } from "@/lib/form-rules";

const TIMES = ["Morning (11 AM – 1 PM)", "Afternoon (1 PM – 4 PM)", "Evening (4 PM – 7 PM)", "Saturday (10 AM – 2 PM)", "Any time"];

export function AppointmentForm({
  services,
  defaultService = "",
  phone,
  compact = false,
}: {
  services: { slug: string; shortTitle: string }[];
  defaultService?: string;
  phone: string;
  compact?: boolean;
}) {
  const { status, errors, message, submit, setStatus } = usePublicForm("/api/appointments", validateAppointment);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: defaultService,
    preferredDate: "",
    preferredTime: "",
    message: "",
    consent: false,
  });
  const [minDate] = useState(() => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10));

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const okay = await submit(values, e.currentTarget);
    if (okay) setValues((v) => ({ ...v, message: "", preferredDate: "", preferredTime: "" }));
  }

  if (status === "success") {
    return (
      <FormSuccess
        title="Request received"
        action={
          <Button variant="outline" onClick={() => setStatus("idle")}>
            Make another request
          </Button>
        }
      >
        Thank you, {values.fullName.split(" ")[0] || "there"}. Our team will contact you shortly to confirm your appointment. If you
        need to reach us sooner, call <a className="font-semibold text-teal-700" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>.
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5" aria-describedby="appointment-required-note">
      <SpamGuard />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput id="fullName" label="Full name" required autoComplete="name" value={values.fullName} onChange={set("fullName")} error={errors.fullName} wrapClassName="sm:col-span-2" />
        <TextInput id="email" label="Email" type="email" required autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
        <TextInput id="phone" label="Phone" type="tel" required autoComplete="tel" value={values.phone} onChange={set("phone")} error={errors.phone} />
        <SelectInput id="service" label="Service" value={values.service} onChange={set("service")} error={errors.service} wrapClassName={compact ? "sm:col-span-2" : "sm:col-span-2"}>
          <option value="">Not sure — recommend for me</option>
          {services.map((s) => (
            <option key={s.slug} value={s.shortTitle}>
              {s.shortTitle}
            </option>
          ))}
        </SelectInput>
        <TextInput id="preferredDate" label="Preferred date" type="date" min={minDate} value={values.preferredDate} onChange={set("preferredDate")} error={errors.preferredDate} />
        <SelectInput id="preferredTime" label="Preferred time" value={values.preferredTime} onChange={set("preferredTime")} error={errors.preferredTime}>
          <option value="">Select a time</option>
          {TIMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectInput>
        {!compact && (
          <TextArea id="message" label="Anything we should know?" rows={4} placeholder="Briefly describe your concern, injury or insurance details (optional)." value={values.message} onChange={set("message")} error={errors.message} wrapClassName="sm:col-span-2" />
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => setValues((v) => ({ ...v, consent: e.target.checked }))}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 size-5 shrink-0 rounded border-line accent-teal-700"
          />
          <span>I agree to be contacted by Next Step Physio &amp; Rehab Clinic about this request by phone or email.</span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-1.5 text-sm font-medium text-red-600" role="alert">
            {errors.consent}
          </p>
        )}
      </div>

      <FormError message={status === "error" ? message : ""} />

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <CalendarCheck className="size-5" aria-hidden="true" />}
        {status === "submitting" ? "Sending request…" : "Request Appointment"}
      </Button>
      <p id="appointment-required-note" className="text-xs text-muted">
        Fields marked * are required. Please don&apos;t include sensitive medical details — we&apos;ll discuss them during your visit.
      </p>
    </form>
  );
}
