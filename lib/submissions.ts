import "server-only";
import { Appointment, ContactSubmission } from "@/models";

export const SUBMISSION_TYPES = {
  appointments: {
    model: Appointment,
    statuses: ["new", "contacted", "scheduled", "completed", "cancelled"],
    searchFields: ["fullName", "email", "phone", "service"],
  },
  contacts: {
    model: ContactSubmission,
    statuses: ["new", "read", "replied", "archived"],
    searchFields: ["name", "email", "phone", "subject"],
  },
} as const;
