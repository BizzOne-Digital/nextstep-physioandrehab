import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Next Step Physio & Rehab Clinic | Physiotherapy in Brampton",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Next Step Physio & Rehab Clinic offers physiotherapy, massage therapy, chiropractic care, acupuncture and rehabilitation in Brampton, ON. Direct billing available.",
  applicationName: SITE_NAME,
  formatDetection: { telephone: false },
  openGraph: { siteName: SITE_NAME, locale: "en_CA", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#0A2D50",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JavaScript runs. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
