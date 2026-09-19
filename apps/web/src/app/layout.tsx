import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { DemoBanner } from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "Protection Passport — Know what protects you",
  description: "Personal Protection Intelligence Platform for Indian households.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <DemoBanner />
        <Nav />
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
