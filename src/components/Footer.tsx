import Logo from "./Logo";
import { NAV } from "./Header";
import { to } from "../router";
import { SPREADSHEET_FILE } from "./ui";

export default function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-b from-paper to-white border-t border-[#ddd]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <Logo heightClass="h-12" />
            <p className="text-sm leading-relaxed text-ink/80 max-w-md">
              A working reference for libraries negotiating licenses to digital content, databases, and
              platforms, published by{" "}
              <a className="underline underline-offset-2 hover:text-plum" href="https://libraryfutures.net" target="_blank" rel="noopener noreferrer">
                Library Futures
              </a>{" "}
              and{" "}
              <a className="underline underline-offset-2 hover:text-plum" href="https://www.nyuengelberg.org" target="_blank" rel="noopener noreferrer">
                The Engelberg Center on Innovation Law &amp; Policy
              </a>
              .
            </p>
          </div>
          <div className="md:col-span-3">
            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-ink mb-3">Explore</h2>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.path}>
                  <a className="hover:text-plum" href={to(n.path)}>
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a className="hover:text-plum" href={SPREADSHEET_FILE} download>
                  Download the spreadsheet (.xlsx)
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-ink mb-3">Not legal advice</h2>
            <p className="text-sm leading-relaxed text-ink/80">
              This document is general reference, not legal advice. Leverage, jurisdiction, library type, and the
              specific resource you’re licensing all change what’s reasonable in any given negotiation.
              When you need it, consult counsel.
            </p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row gap-2 justify-between text-xs text-ink/70">
          <span>© 2026 Library Futures / The Engelberg Center on Innovation Law &amp; Policy</span>
          <span>
            Licensed for use under{" "}
            <a className="underline underline-offset-2 hover:text-plum" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
              CC-BY-4.0
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
