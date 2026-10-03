import type { Metadata } from "next";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata: Metadata = { title: "Images & media" };

export default function MediaPage() {
  return <MediaLibrary />;
}
