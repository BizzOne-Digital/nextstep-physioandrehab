"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  question: string;
  answer: string;
}

/** Accessible FAQ accordion (button + region pattern, keyboard friendly). */
export function FAQAccordion({
  items,
  defaultOpen = 0,
  className,
  tone = "white",
}: {
  items: AccordionItem[];
  defaultOpen?: number | null;
  className?: string;
  tone?: "white" | "tinted";
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div
            key={`${item.question}-${i}`}
            className={cn(
              "rounded-2xl border transition-all duration-300",
              tone === "white" ? "bg-white" : "bg-sky-50/60",
              isOpen ? "border-teal-500/40 shadow-card" : "border-line hover:border-teal-500/30",
            )}
          >
            <h3 className="font-sans text-base tracking-normal">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-5 text-left font-semibold text-navy-900 sm:px-6"
              >
                <span>{item.question}</span>
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300",
                    isOpen ? "rotate-45 bg-teal-700 text-white" : "bg-mint-100 text-teal-800",
                  )}
                  aria-hidden="true"
                >
                  <Plus className="size-4" strokeWidth={2.5} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 leading-relaxed text-muted sm:px-6">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
