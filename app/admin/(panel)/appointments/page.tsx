import { Suspense } from "react";
import type { Metadata } from "next";
import { SubmissionsManager } from "@/components/admin/SubmissionsManager";
import { LoadingState } from "@/components/admin/States";

export const metadata: Metadata = { title: "Appointments" };

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SubmissionsManager kind="appointments" />
    </Suspense>
  );
}
