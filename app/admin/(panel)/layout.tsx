import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts already guards /admin; this server-side check is defence in depth.
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return <AdminShell adminEmail={session.email}>{children}</AdminShell>;
}
