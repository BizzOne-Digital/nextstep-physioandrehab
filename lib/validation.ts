import { z } from "zod";

// Public form schemas, shared by the API routes (authoritative) and the
// client forms (instant feedback).

const name = z.string().trim().min(2, "Please enter your name").max(100, "Name is too long");
const email = z.string().trim().max(200).pipe(z.email("Please enter a valid email address"));
const phone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a valid phone number");
const optionalPhone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v === "" || v.replace(/\D/g, "").length >= 10, "Please enter a valid phone number")
  .default("");

export const appointmentSchema = z.object({
  fullName: name,
  email,
  phone,
  service: z.string().trim().max(120).default(""),
  preferredDate: z
    .string()
    .trim()
    .refine((v) => {
      if (!v) return true;
      const d = new Date(`${v}T00:00:00`);
      if (Number.isNaN(d.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d >= today;
    }, "Please choose today or a future date")
    .default(""),
  preferredTime: z.string().trim().max(40).default(""),
  message: z.string().trim().max(2000, "Message is too long").default(""),
  consent: z.literal(true, { message: "Please confirm we can contact you" }),
});

export const contactSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  subject: z.string().trim().max(150).default(""),
  message: z.string().trim().min(10, "Please include a short message").max(3000, "Message is too long"),
});

export const reviewSchema = z.object({
  name,
  email: z.string().trim().max(200).refine((v) => v === "" || z.email().safeParse(v).success, "Please enter a valid email").default(""),
  location: z.string().trim().max(80).default(""),
  service: z.string().trim().max(120).default(""),
  rating: z.coerce.number().int().min(1, "Please choose a rating").max(5),
  review: z.string().trim().min(20, "Please write at least a couple of sentences").max(2000, "Review is too long"),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type ReviewInput = z.input<typeof reviewSchema>;
