import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api";
import { parsePublicForm } from "@/lib/public-form";
import { contactSchema } from "@/lib/validation";
import { ContactSubmission } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const parsed = await parsePublicForm(request, "contact", contactSchema);
    if (!parsed) return ok({ message: "Thank you" });
    await connectDB();
    await ContactSubmission.create({ ...parsed.data, ip: parsed.ip });
    return ok({ message: "Thank you! Your message has been sent." }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
