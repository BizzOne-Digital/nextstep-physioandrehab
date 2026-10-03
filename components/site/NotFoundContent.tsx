import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function NotFoundContent() {
  const links = [
    { href: "/services", label: "Our services" },
    { href: "/conditions", label: "Conditions we treat" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact us" },
  ];
  return (
    <section className="bg-soft-gradient">
      <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-white text-teal-700 shadow-soft">
          <Search className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-6 font-display text-7xl font-extrabold text-teal-500/30">404</p>
        <h1 className="display-md mt-2">We couldn&apos;t find that page</h1>
        <p className="mt-4 max-w-md text-lg text-muted">The page may have moved after our website update. Try one of these instead:</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-900 ring-1 ring-line hover:text-teal-700">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href="/" className="mt-8">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
        </ButtonLink>
      </div>
    </section>
  );
}
