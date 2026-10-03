import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white" | "navy";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-teal-700 text-white shadow-[0_10px_24px_-10px_rgb(11_127_121/0.7)] hover:bg-teal-800 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-12px_rgb(11_127_121/0.8)]",
  navy: "bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-0.5 shadow-[0_10px_24px_-12px_rgb(10_45_80/0.6)]",
  secondary: "bg-mint-100 text-navy-900 hover:bg-aqua-50 hover:-translate-y-0.5",
  outline: "border border-navy-900/15 bg-white text-navy-900 hover:border-teal-500 hover:text-teal-700 hover:-translate-y-0.5",
  ghost: "text-navy-900 hover:bg-sky-50",
  white: "bg-white text-navy-900 hover:bg-mint-100 hover:-translate-y-0.5 shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
