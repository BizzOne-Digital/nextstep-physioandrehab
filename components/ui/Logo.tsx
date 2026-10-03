import Image from "next/image";
import { cn } from "@/lib/utils";

// Clinic logo (public/logo.png, trimmed and optimized). Stacked mark + wordmark.
const LOGO = { src: "/images/brand/logo.webp", width: 273, height: 200 };
// Same logo with the navy parts turned white, for dark backgrounds.
const LOGO_LIGHT = { src: "/images/brand/logo-light.webp", width: 273, height: 200 };

/**
 * Brand logo. Uses the clinic's logo file; an admin-uploaded logo
 * (Site settings → Logo) replaces it on light backgrounds.
 */
export function Logo({
  src,
  variant = "dark",
  className,
  priority = false,
}: {
  src?: string;
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
}) {
  const logo = variant === "light" ? LOGO_LIGHT : LOGO;
  const custom = variant === "dark" && src ? src : "";
  return (
    <Image
      src={custom || logo.src}
      alt="Next Step Physio & Rehab Clinic"
      width={logo.width}
      height={logo.height}
      priority={priority}
      sizes="160px"
      className={cn("h-14 w-auto object-contain", className)}
    />
  );
}
