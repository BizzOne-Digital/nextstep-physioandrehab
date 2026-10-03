"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConditionItem } from "@/types";

export function ConditionsExplorer({ conditions, categories }: { conditions: ConditionItem[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Support deep links such as /conditions?q=Sciatica from the homepage.
  // The page is statically cached, so the URL can only be read after hydration.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL on mount
    if (q) setQuery(q.slice(0, 80));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return conditions.filter(
      (c) =>
        (category === "All" || c.category === category) &&
        (!q || c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)),
    );
  }, [conditions, query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, ConditionItem[]>();
    for (const c of filtered) map.set(c.category, [...(map.get(c.category) ?? []), c]);
    return categories.filter((cat) => map.has(cat)).map((cat) => [cat, map.get(cat)!] as const)
      .concat([...map.entries()].filter(([cat]) => !categories.includes(cat)));
  }, [filtered, categories]);

  const usedCategories = categories.filter((cat) => conditions.some((c) => c.category === cat));

  return (
    <div>
      <div className="sticky top-[72px] z-20 -mx-4 bg-white/90 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-[1.5rem] sm:px-5 sm:shadow-card sm:ring-1 sm:ring-line">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative lg:w-80 lg:shrink-0">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="condition-search" className="sr-only">
              Search conditions
            </label>
            <input
              id="condition-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. sciatica, knee…"
              className="h-12 w-full rounded-full border border-line bg-white pl-12 pr-11 text-[0.95rem] focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-sky-50 text-muted hover:text-navy-900">
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0" role="group" aria-label="Filter by category">
            <div className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
              {["All", ...usedCategories].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={category === cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    category === cat ? "bg-teal-700 text-white" : "bg-sky-50 text-navy-900 hover:bg-mint-100",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        Showing {filtered.length} of {conditions.length} conditions
      </p>

      {grouped.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] bg-sky-50 p-10 text-center">
          <p className="font-display text-xl font-bold text-navy-900">No matching conditions found</p>
          <p className="mt-2 text-muted">Don&apos;t see your condition? Contact us — we treat many more concerns than we can list.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {grouped.map(([cat, items]) => (
            <section key={cat} aria-labelledby={`cat-${cat}`}>
              <h2 id={`cat-${cat}`} className="flex items-center gap-3 text-xl font-bold">
                {cat}
                <span className="rounded-full bg-mint-100 px-2.5 py-0.5 font-sans text-xs font-semibold text-teal-800">{items.length}</span>
              </h2>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {items.map((c) => (
                  <li
                    key={c.slug}
                    className="group relative flex min-h-[7.5rem] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 px-4 py-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:from-teal-700 hover:to-teal-800 hover:shadow-lift sm:min-h-[8.5rem] sm:px-5"
                  >
                    <span className="absolute -right-6 -top-6 size-20 rounded-full bg-white/5 transition-transform duration-500 group-hover:scale-150" aria-hidden="true" />
                    <span className="relative font-display text-[0.95rem] font-bold leading-snug text-white sm:text-lg">{c.name}</span>
                    <span className="relative mt-3 h-0.5 w-8 rounded-full bg-teal-400 transition-all duration-300 group-hover:w-14 group-hover:bg-white" aria-hidden="true" />
                    {c.description && (
                      <p className="relative mt-3 hidden text-sm leading-relaxed text-white/75 sm:block">{c.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
