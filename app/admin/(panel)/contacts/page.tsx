import { Suspense } from "react";
import type { Metadata } from "next";
import { SubmissionsManager } from "@/components/admin/SubmissionsManager";
import { LoadingState } from "@/components/admin/States";

export const metadata: Metadata = { title: "Contact messages" };

export default function ContactsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SubmissionsManager kind="contacts" />
    </Suspense>
  );
}
