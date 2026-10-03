"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectInput, SpamGuard, TextArea, TextInput, usePublicForm } from "@/components/forms/fields";
import { FormError, FormSuccess } from "@/components/forms/FormStatus";
import { validateReview } from "@/lib/form-rules";
import { cn } from "@/lib/utils";

const EMPTY = { name: "", email: "", location: "", service: "", rating: 0, review: "" };

export function ReviewForm({ services }: { services: string[] }) {
  const { status, errors, message, submit } = usePublicForm("/api/reviews", validateReview);
  const [values, setValues] = useState(EMPTY);
  const [hover, setHover] = useState(0);
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (await submit(values, e.currentTarget)) setValues(EMPTY);
  }

  if (status === "success") {
    return (
      <FormSuccess title="Thank you for your feedback">
        We appreciate you taking the time to share your experience. Reviews are checked by our team before they appear on the website.
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <SpamGuard />
      <fieldset>
        <legend className="mb-2 block text-sm font-semibold text-navy-900">
          Your rating <span className="text-teal-700" aria-hidden="true">*</span>
        </legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                checked={values.rating === n}
                onChange={() => setValues((v) => ({ ...v, rating: n }))}
                className="peer sr-only"
              />
              <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
              <Star
                aria-hidden="true"
                className={cn(
                  "size-9 rounded transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-teal-500",
                  (hover || values.rating) >= n ? "fill-amber-400 text-amber-400" : "fill-transparent text-line",
                )}
              />
            </label>
          ))}
        </div>
        {errors.rating && (
          <p className="mt-1.5 text-sm font-medium text-red-600" role="alert">
            {errors.rating}
          </p>
        )}
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput id="review-name" name="name" label="Name" required autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} />
        <TextInput id="review-email" name="email" label="Email (not published)" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
        <TextInput id="review-location" name="location" label="Location" placeholder="Brampton, ON" value={values.location} onChange={set("location")} error={errors.location} />
        <SelectInput id="review-service" name="service" label="Service received" value={values.service} onChange={set("service")}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectInput>
        <TextArea id="review-text" name="review" label="Your review" required rows={5} value={values.review} onChange={set("review")} error={errors.review} wrapClassName="sm:col-span-2" />
      </div>
      <FormError message={status === "error" ? message : ""} />
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
        {status === "submitting" ? "Submitting…" : "Submit Review"}
      </Button>
    </form>
  );
}
