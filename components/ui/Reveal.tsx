"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Lightweight scroll reveal using IntersectionObserver + CSS (see globals.css).
 * Content stays visible without JavaScript and for reduced-motion users.
 */
export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  className,
  imageReveal = false,
}: {
  children: ReactNode;
  as?: ElementType;
  direction?: "up" | "left" | "right" | "zoom";
  delay?: number;
  className?: string;
  imageReveal?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cls = [imageReveal ? "img-reveal" : "", className].filter(Boolean).join(" ") || undefined;

  return (
    <Tag
      ref={ref}
      data-reveal={direction === "up" ? "" : direction}
      className={cls}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
