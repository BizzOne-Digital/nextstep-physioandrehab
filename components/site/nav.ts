export interface NavItem {
  label: string;
  href: string;
  /** Hidden on laptop widths (moved into the "More" menu) to keep the bar uncluttered. */
  secondary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", secondary: true },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Conditions", href: "/conditions" },
  { label: "Our Team", href: "/our-team" },
  { label: "Testimonials", href: "/testimonials", secondary: true },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq", secondary: true },
  { label: "Contact", href: "/contact" },
];

export interface NavService {
  slug: string;
  shortTitle: string;
  icon: string;
  tagline: string;
}
