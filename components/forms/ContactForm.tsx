"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SpamGuard, TextArea, TextInput, usePublicForm } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { validateContact } from "@/lib/form-rules";

const EMPTY = { name: "", email: "", phone: "", subject: "", message: "" };

export function ContactForm() {
  const { status, errors, message, submit, setStatus } = usePublicForm("/api/contact", validateContact);
  const [values, setValues] = useState(EMPTY);
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (await submit(values, e.currentTarget)) setValues(EMPTY);
  }

  if (status === "success") {
    return (
      <FormSuccess
        title="Message sent"
        action={
          <Button variant="outline" onClick={() => setStatus("idle")}>
            Send another message
          </Button>
        }
      >
        Thanks for reaching out. A member of our team will get back to you as soon as possible.
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <SpamGuard />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput id="name" label="Name" required autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} />
        <TextInput id="email" label="Email" type="email" required autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
        <TextInput id="phone" label="Phone" type="tel" autoComplete="tel" value={values.phone} onChange={set("phone")} error={errors.phone} />
        <TextInput id="subject" label="Subject" value={values.subject} onChange={set("subject")} error={errors.subject} />
        <TextArea id="message" label="Message" required rows={5} value={values.message} onChange={set("message")} error={errors.message} wrapClassName="sm:col-span-2" />
      </div>
      <FormError message={status === "error" ? message : ""} />
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
