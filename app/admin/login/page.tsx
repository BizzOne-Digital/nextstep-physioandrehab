import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/admin") && !sp.next.startsWith("//") ? sp.next : "/admin";

  return (
    <main className="bg-soft-gradient grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-24" priority />
          <h1 className="mt-5 text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-muted">Next Step Physio &amp; Rehab Clinic</p>
        </div>
        <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
          <LoginForm next={next} />
        </div>
        <p className="mt-6 text-center text-xs text-muted">Authorized staff only. Activity on this page is rate-limited.</p>
      </div>
    </main>
  );
}
