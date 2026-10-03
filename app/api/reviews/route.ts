import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api";
import { parsePublicForm } from "@/lib/public-form";
import { reviewSchema } from "@/lib/validation";
import { Testimonial } from "@/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public review submissions are stored unpublished until an admin approves them. */
export async function POST(request: Request) {
  try {
    const parsed = await parsePublicForm(request, "review", reviewSchema);
    if (!parsed) return ok({ message: "Thank you" });
    await connectDB();
    await Testimonial.create({ ...parsed.data, source: "website", published: false });
    return ok({ message: "Thank you for sharing your experience!" }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
