"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ConditionGroup {
  category: string;
  items: { name: string; slug: string }[];
}

/** Desktop "Conditions" mega menu: categories as columns, opens on hover or click. */
export function ConditionsMenu({ groups, total, linkClassName }: { groups: ConditionGroup[]; total: number; linkClassName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedByHover = useRef(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  };
  const hide = () => {
    openedByHover.current = false;
    closeTimer.current = setTimeout(() => setOpen(false), 160);
  };
  const toggle = () => {
    if (openedByHover.current) {
      openedByHover.current = false;
      setOpen(true);
      return;
    }
    setOpen((v) => !v);
  };

  return (
    <li ref={ref} onMouseEnter={show} onMouseLeave={hide}>
      <div className="flex items-center">
        <Link href="/conditions" className={cn(linkClassName, "pr-1")}>
          Conditions
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="conditions-menu"
          aria-label="Show conditions menu"
          onClick={toggle}
          className="rounded-full p-1.5 text-navy-900 hover:text-teal-700"
        >
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <div id="conditions-menu" className="absolute inset-x-0 top-full flex justify-center px-4">
          <div className="w-full max-w-[1080px] overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
            <div className="grid grid-cols-4 gap-x-6 gap-y-6 p-6">
              {groups.map((g) => (
                <div key={g.category}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700">{g.category}</p>
                  <ul className="mt-2.5 space-y-0.5">
                    {g.items.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/conditions/${c.slug}`} className="block rounded-lg px-2 py-1.5 text-sm text-navy-900 hover:bg-sky-50 hover:text-teal-700">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-line bg-sky-50 px-6 py-4">
              <p className="text-sm text-muted">Don&apos;t see your condition? We treat many more.</p>
              <Link href="/conditions" className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800">
                View all {total} conditions <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

/** Mobile drawer version: expandable list grouped by category. */
export function MobileConditionsMenu({ groups, active }: { groups: ConditionGroup[]; active: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center">
        <Link href="/conditions" className={cn("flex-1 rounded-xl px-4 py-3 text-base font-semibold", active ? "bg-mint-100 text-teal-800" : "text-navy-900")}>
          Conditions
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Show conditions"
          className="grid size-11 place-items-center rounded-xl text-navy-900"
        >
          <ChevronDown className={cn("size-5 transition-transform", open && "rotate-180")} />
        </button>
      </div>
      {open && (
        <div className="mb-2 ml-4 space-y-3 border-l-2 border-mint-100 pl-3">
          {groups.map((g) => (
            <div key={g.category}>
              <p className="px-2 pt-1 text-[0.7rem] font-bold uppercase tracking-wider text-teal-700">{g.category}</p>
              <ul>
                {g.items.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/conditions/${c.slug}`} className="block rounded-lg px-2 py-2 text-sm text-navy-900">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Link href="/conditions" className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-teal-700">
            View all conditions <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}
