import type { Metadata } from "next";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const metadata: Metadata = { title: "Site settings" };

export default function SettingsPage() {
  return <SettingsEditor />;
}
