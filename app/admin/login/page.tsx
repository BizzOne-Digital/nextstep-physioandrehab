import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/ui/Logo";
import { getConfigIssues } from "@/lib/config-check";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const issues = getConfigIssues();
  const next = typeof sp.next === "string" && sp.next.startsWith("/admin") && !sp.next.startsWith("//") ? sp.next : "/admin";

  return (
    <main className="bg-soft-gradient grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-24" priority />
          <h1 className="mt-5 text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1.5 text-sm text-muted">Next Step Physio &amp; Rehab Clinic</p>
        </div>
        {issues.length > 0 && (
          <div role="alert" className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Admin is not fully configured on this server:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {issues.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p className="mt-2">Add these in the hosting environment variables (e.g. Vercel → Settings → Environment Variables), then redeploy.</p>
          </div>
        )}
        <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
          <LoginForm next={next} />
        </div>
        <p className="mt-6 text-center text-xs text-muted">Authorized staff only. Activity on this page is rate-limited.</p>
      </div>
    </main>
  );
}
