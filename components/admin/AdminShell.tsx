"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarCheck, ExternalLink, FileText, HelpCircle, Images, Inbox, LayoutDashboard, ListChecks, LogOut, Menu, MessageSquareQuote,
  Newspaper, Settings, Stethoscope, Users, X, type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ToastProvider } from "@/components/admin/Toast";
import { ConfirmProvider } from "@/components/admin/ConfirmModal";
import { cn } from "@/lib/utils";

interface NavGroup {
  label: string;
  items: { href: string; label: string; icon: LucideIcon }[];
}

const NAV: NavGroup[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "Inbox",
    items: [
      { href: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
      { href: "/admin/contacts", label: "Contact messages", icon: Inbox },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/services", label: "Services", icon: Stethoscope },
      { href: "/admin/conditions", label: "Conditions", icon: ListChecks },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
      { href: "/admin/blogs", label: "Blog posts", icon: Newspaper },
      { href: "/admin/gallery", label: "Gallery", icon: Images },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/media", label: "Images & media", icon: Images },
      { href: "/admin/settings", label: "Site settings", icon: Settings },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <nav aria-label="Admin" className="space-y-4">
      {NAV.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/60">{group.label}</p>
          <ul className="mt-1.5 space-y-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active(item.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active(item.href) ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon className={cn("size-[18px]", active(item.href) && "text-teal-400")} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children, adminEmail }: { children: ReactNode; adminEmail: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col bg-navy-950 px-4 py-5">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 px-2">
        <Logo variant="light" className="h-14" />
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white/75">Admin</span>
      </Link>
      <div className="mt-6 flex-1 overflow-y-auto pr-1">
        <NavLinks onNavigate={onNavigate} />
      </div>
      <div className="mt-6 space-y-1 border-t border-white/10 pt-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white">
          <ExternalLink className="size-[18px]" aria-hidden="true" /> View website
        </a>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 hover:bg-white/5 hover:text-white">
          <LogOut className="size-[18px]" aria-hidden="true" /> Sign out
        </button>
        <p className="truncate px-3 pt-2 text-xs text-white/60" title={adminEmail}>
          {adminEmail}
        </p>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <ConfirmProvider>
        <div className="min-h-dvh bg-[#F4F8FB]">
          <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar()}</aside>

          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
            <Link href="/admin" className="flex items-center gap-2.5">
              <Logo className="h-10" />
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-navy-800">Admin</span>
            </Link>
            <button type="button" onClick={() => setOpen(true)} aria-label="Open admin menu" aria-expanded={open} className="grid size-10 place-items-center rounded-full bg-navy-900 text-white">
              <Menu className="size-5" />
            </button>
          </header>

          {open && (
            <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
              <button type="button" aria-label="Close menu" className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-lift">
                {sidebar(() => setOpen(false))}
                <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute right-3 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white">
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}

          <main id="main" className="px-4 py-6 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
