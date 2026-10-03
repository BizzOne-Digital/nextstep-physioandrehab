import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FileText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PAGE_DEFINITIONS } from "@/content/pages";

export const metadata: Metadata = { title: "Pages" };

export default function PagesIndex() {
  return (
    <>
      <AdminPageHeader title="Pages" description="Edit headings, text, images and SEO for each page. Services, team, FAQs and blog posts are managed in their own sections." />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PAGE_DEFINITIONS.map((p) => (
          <li key={p.key}>
            <Link href={`/admin/pages/${p.key}`} className="group flex h-full items-center gap-4 rounded-3xl border border-line bg-white p-5 transition-shadow hover:shadow-card">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mint-100 text-teal-700">
                <FileText className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy-900">{p.label}</span>
                <span className="block truncate text-sm text-muted">{p.path}</span>
              </span>
              <ArrowRight className="size-5 text-muted transition-transform group-hover:translate-x-1 group-hover:text-teal-700" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
