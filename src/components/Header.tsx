import { useState } from "react";
import { Download, ExternalLink, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { PillLink } from "./ui";
import { BOOK_URL, SPREADSHEET_FILE } from "../content";
import { to } from "../router";

export const NAV = [
  { path: "", label: "Find a clause" },
  { path: "table", label: "Table" },
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
            ? `block rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider ${active ? "bg-blush text-plum" : "text-ink hover:bg-paper"}`
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
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 shadow-sm backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 rounded-full bg-ink px-4 py-2 text-white">
        Skip to content
      </a>
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          <a href={to("")} className="flex min-w-0 items-center gap-4" aria-label="Clause Bank home">
            <Logo heightClass="h-10" />
            <span className="hidden h-9 w-px bg-line sm:block" />
            <span className="hidden text-[13px] font-black uppercase leading-tight tracking-wide text-ink sm:block">
              Digital Content
              <br />
              Licensing Clause Bank
            </span>
          </a>
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => link(n))}
            <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 py-2 text-[13px] font-bold uppercase tracking-wider text-ink hover:text-plum">
              Read the book <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <PillLink href={SPREADSHEET_FILE} download>
              <Download className="h-4 w-4" /> .xlsx
            </PillLink>
          </nav>
          <button
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-wider lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />} Menu
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="space-y-1 border-t border-line bg-white px-4 py-3 lg:hidden">
          {NAV.map((n) => link(n, true))}
          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider text-ink hover:bg-paper">
            Read the book <ExternalLink className="h-4 w-4" />
          </a>
          <a href={SPREADSHEET_FILE} download className="flex items-center gap-1.5 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider text-ink hover:bg-paper">
            <Download className="h-4 w-4" /> Download the spreadsheet (.xlsx)
          </a>
        </nav>
      )}
    </header>
  );
}
