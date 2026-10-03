// Lightweight client-side checks for instant form feedback. They mirror the
// Zod schemas in lib/validation.ts, which remain authoritative on the server.
// Kept dependency-free so public pages don't ship Zod to the browser.

export type FieldErrors = Record<string, string>;
type Values = Record<string, unknown>;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const phoneDigits = (v: string) => v.replace(/\D/g, "").length;

function name(errors: FieldErrors, key: string, v: unknown) {
  const s = str(v);
  if (s.length < 2) errors[key] = "Please enter your name";
  else if (s.length > 100) errors[key] = "Name is too long";
}

export function validateAppointment(v: Values): FieldErrors {
  const e: FieldErrors = {};
  name(e, "fullName", v.fullName);
  if (!isEmail(str(v.email))) e.email = "Please enter a valid email address";
  if (phoneDigits(str(v.phone)) < 10) e.phone = "Please enter a valid phone number";
  const date = str(v.preferredDate);
  if (date) {
    const d = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(d.getTime()) || d < today) e.preferredDate = "Please choose today or a future date";
  }
  if (str(v.message).length > 2000) e.message = "Message is too long";
  if (v.consent !== true) e.consent = "Please confirm we can contact you";
  return e;
}

export function validateContact(v: Values): FieldErrors {
  const e: FieldErrors = {};
  name(e, "name", v.name);
  if (!isEmail(str(v.email))) e.email = "Please enter a valid email address";
  const phone = str(v.phone);
  if (phone && phoneDigits(phone) < 10) e.phone = "Please enter a valid phone number";
  const message = str(v.message);
  if (message.length < 10) e.message = "Please include a short message";
  else if (message.length > 3000) e.message = "Message is too long";
  return e;
}

export function validateReview(v: Values): FieldErrors {
  const e: FieldErrors = {};
  name(e, "name", v.name);
  const email = str(v.email);
  if (email && !isEmail(email)) e.email = "Please enter a valid email";
  const rating = Number(v.rating);
  if (!(rating >= 1 && rating <= 5)) e.rating = "Please choose a rating";
  const review = str(v.review);
  if (review.length < 20) e.review = "Please write at least a couple of sentences";
  else if (review.length > 2000) e.review = "Review is too long";
  return e;
}
