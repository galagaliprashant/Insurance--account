"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/protections", label: "Protection Inventory" },
  { href: "/family", label: "Family" },
  { href: "/emergency", label: "Emergency Mode" },
  { href: "/documents", label: "Documents" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-xs font-bold text-white">PP</span>
          <span className="text-sm font-semibold text-ink">Protection Passport</span>
        </Link>
        <nav className="flex gap-1 overflow-x-auto text-sm">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 font-medium transition ${
                  active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
