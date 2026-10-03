import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function Eyebrow({ children, className, light }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em]",
        light ? "bg-white/10 text-teal-400 ring-1 ring-white/15" : "bg-mint-100 text-teal-800",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", light ? "bg-teal-400" : "bg-teal-500")} aria-hidden="true" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "", className)}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <Heading className={cn("display-lg mt-4 text-balance", light && "text-white")}>{title}</Heading>
      {description && (
        <p className={cn("mt-4 text-pretty text-lg leading-relaxed", light ? "text-white/75" : "text-muted")}>{description}</p>
      )}
    </Reveal>
  );
}
