import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api";
import { parsePublicForm } from "@/lib/public-form";
import { appointmentSchema } from "@/lib/validation";
import { Appointment } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const parsed = await parsePublicForm(request, "appointment", appointmentSchema);
    if (!parsed) return ok({ message: "Thank you" });
    const { consent: _consent, ...data } = parsed.data;
    await connectDB();
    await Appointment.create({ ...data, ip: parsed.ip });
    return ok({ message: "Thank you! Your appointment request has been received." }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
