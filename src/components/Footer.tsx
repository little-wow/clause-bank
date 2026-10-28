import Logo from "./Logo";
import { NAV } from "./Header";
import { to } from "../router";
import { BOOK_URL, SPREADSHEET_FILE } from "../content";
import { COPY } from "../copy";
import { README_SECTIONS, SUBTITLE } from "../data";

// Sentences taken from the spreadsheet's Read Me First tab, so they always match it.
const important = README_SECTIONS.find((s) => s.heading === "IMPORTANT!")?.body ?? [];
const about = README_SECTIONS.find((s) => s.heading === "About")?.body ?? [];
const disclaimer = important.find((l) => l.includes("not legal advice")) ?? "";
const copyright = about.find((l) => l.startsWith("©")) ?? "";
const license = about.find((l) => l.startsWith("Licensed for use under")) ?? "";

export default function Footer() {
  return (
    <footer className="mt-24 bg-gradient-to-b from-paper to-white border-t border-[#ddd]">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-4">
            <Logo heightClass="h-12" />
            <p className="text-sm leading-relaxed text-ink/80 max-w-md">{SUBTITLE}</p>
            <p className="text-sm leading-relaxed text-ink/80 max-w-md">
              {COPY.footer.published}{" "}
              <a className="underline underline-offset-2 hover:text-plum" href="https://libraryfutures.net" target="_blank" rel="noopener noreferrer">
                Library Futures
              </a>{" "}
              {COPY.footer.and}{" "}
              <a className="underline underline-offset-2 hover:text-plum" href="https://www.nyuengelberg.org" target="_blank" rel="noopener noreferrer">
                The Engelberg Center on Innovation Law &amp; Policy
              </a>
              .
            </p>
          </div>
          <div className="md:col-span-3">
            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-ink mb-3">{COPY.footer.explore}</h2>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.path}>
                  <a className="hover:text-plum" href={to(n.path)}>
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a className="hover:text-plum" href={BOOK_URL} target="_blank" rel="noopener noreferrer">
                  {COPY.footer.book}
                </a>
              </li>
              <li>
                <a className="hover:text-plum" href={SPREADSHEET_FILE} download>
                  {COPY.nav.download}
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h2 className="text-xs font-black uppercase tracking-[0.14em] text-ink mb-3">{COPY.footer.notLegalAdvice}</h2>
            <p className="text-sm leading-relaxed text-ink/80">{disclaimer}</p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row gap-2 justify-between text-xs text-ink/70">
          <span>{copyright}</span>
          <a className="underline underline-offset-2 hover:text-plum" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
            {license}
          </a>
        </div>
      </div>
    </footer>
  );
}
