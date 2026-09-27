import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fashion Brand — Affordable Style",
  description: "Affordable, fashionable, good-quality clothing for students and young professionals."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-10 border-b border-charcoal/10 bg-light/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <a href="/" className="font-display text-lg font-black">FASHION<span className="text-forest">.</span></a>
            <nav className="flex gap-4 text-sm font-semibold">
              <a href="/" className="hover:text-forest">Home</a>
              <a href="/collections" className="hover:text-forest">Shop</a>
              <a href="/design" className="hover:text-forest">Design</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-charcoal/10 py-8 text-center text-sm text-steel">
          Phase 1 prototype — static mock data, no checkout yet.
        </footer>
      </body>
    </html>
  );
}
