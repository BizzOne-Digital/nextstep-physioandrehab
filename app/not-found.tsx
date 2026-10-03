import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { NotFoundContent } from "@/components/site/NotFoundContent";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

// Handles any URL that doesn't match a route, with the full site chrome.
export default function RootNotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
