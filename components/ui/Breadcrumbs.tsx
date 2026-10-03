import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ items, light = false, className }: { items: Crumb[]; light?: boolean; className?: string }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbSchema(all)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", light ? "text-white/70" : "text-muted")}>
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />}
                {last ? (
                  <span aria-current="page" className={cn("font-medium", light ? "text-white" : "text-navy-900")}>
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className={cn("transition-colors", light ? "hover:text-white" : "hover:text-teal-700")}>
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
