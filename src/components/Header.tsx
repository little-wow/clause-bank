import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { to } from "../router";

export const NAV = [
  { path: "", label: "Introduction" },
  { path: "companion", label: "Companion" },
  { path: "clauses", label: "Clause Bank" },
  { path: "spreadsheet", label: "Spreadsheet" },
  { path: "how-to-use", label: "How to Use" },
];

export default function Header({ section }: { section: string }) {
  const [open, setOpen] = useState(false);
  const link = (n: (typeof NAV)[number], mobile = false) => {
    const active = section === n.path;
    return (
      <a
        key={n.path}
        href={to(n.path)}
        onClick={() => setOpen(false)}
        aria-current={active ? "page" : undefined}
        className={
          mobile
            ? `block rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider ${
                active ? "bg-blush text-plum" : "text-ink hover:bg-paper"
              }`
            : `relative py-2 text-[13px] font-bold uppercase tracking-wider transition-colors ${
                active
                  ? "text-plum after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-plum"
                  : "text-ink hover:text-plum"
              }`
        }
      >
        {n.label}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-line shadow-sm">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 bg-ink text-white px-4 py-2 rounded-full">
        Skip to content
      </a>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          <a href={to("")} className="flex items-center gap-4 min-w-0" aria-label="Clause Bank home">
            <Logo heightClass="h-10" />
            <span className="hidden sm:block h-9 w-px bg-line" />
            <span className="hidden sm:block text-[13px] font-black uppercase leading-tight tracking-wide text-ink">
              Digital Content
              <br />
              Licensing Clause Bank
            </span>
          </a>
          <nav aria-label="Main" className="hidden lg:flex items-center gap-7">
            {NAV.map((n) => link(n))}
          </nav>
          <button
            className="lg:hidden inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-wider"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />} Menu
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="lg:hidden border-t border-line bg-white px-4 py-3 space-y-1">
          {NAV.map((n) => link(n, true))}
        </nav>
      )}
    </header>
  );
}
