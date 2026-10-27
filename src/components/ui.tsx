import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PRIORITY_KEYS, PRIORITY_LABELS } from "../data";
import type { Priority, PriorityKey } from "../data";

/** Small uppercase label above a title, e.g. "Companion Document". */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-plum mb-3">
      {children}
    </p>
  );
}

/** Library Futures headline: heavy, uppercase, tight. */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-black uppercase tracking-tight leading-[0.95] text-ink text-3xl sm:text-4xl lg:text-5xl">
      {children}
    </h1>
  );
}

/** Black pill button that turns plum on hover (libraryfutures.net style). */
export function PillLink({
  href,
  children,
  download,
  variant = "solid",
}: {
  href: string;
  children: ReactNode;
  download?: string | boolean;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider transition-colors";
  const look =
    variant === "solid"
      ? "bg-ink text-white hover:bg-plum"
      : "border-2 border-ink text-ink hover:border-plum hover:text-plum";
  return (
    <a href={href} download={download} className={`${base} ${look}`}>
      {children}
    </a>
  );
}

/** H = filled plum, M = outlined. Matches the workbook's priority columns. */
export function PriorityMark({ value }: { value: Priority }) {
  if (!value) return <span className="text-line" aria-label="no marker">·</span>;
  const high = value === "H";
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black ${
        high ? "bg-plum text-white" : "border-2 border-plum text-plum"
      }`}
      title={high ? "High priority" : "Medium priority"}
    >
      {value}
    </span>
  );
}

export function PriorityList({ priorities }: { priorities: Record<PriorityKey, Priority> }) {
  const active = PRIORITY_KEYS.filter((k) => priorities[k]);
  if (!active.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {active.map((k) => (
        <li
          key={k}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${
            priorities[k] === "H" ? "bg-plum text-white" : "bg-blush text-plum-dark"
          }`}
        >
          {PRIORITY_LABELS[k]}
          <span className="font-black">{priorities[k] === "H" ? "· High" : "· Medium"}</span>
        </li>
      ))}
    </ul>
  );
}

/** Previous / next links at the foot of a page, book style. */
export function PrevNext({
  prev,
  next,
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  const cls =
    "group flex-1 rounded-xl border-2 border-line p-4 sm:p-5 hover:border-plum transition-colors min-w-0";
  return (
    <nav aria-label="Previous and next" className="mt-16 flex flex-col sm:flex-row gap-3">
      {prev ? (
        <a href={prev.href} className={cls}>
          <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-plum">
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </span>
          <span className="mt-1 block font-bold text-ink group-hover:text-plum">{prev.label}</span>
        </a>
      ) : (
        <span className="flex-1 hidden sm:block" />
      )}
      {next && (
        <a href={next.href} className={`${cls} sm:text-right`}>
          <span className="flex items-center sm:justify-end gap-1 text-xs font-bold uppercase tracking-wider text-plum">
            Next <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 block font-bold text-ink group-hover:text-plum">{next.label}</span>
        </a>
      )}
    </nav>
  );
}

/** Two-column reading layout: contents sidebar (desktop) beside the main text. */
export function WithSidebar({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
      <aside className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-8">{sidebar}</div>
      </aside>
      <div className="min-w-0">
        <details className="lg:hidden mb-8 rounded-xl border-2 border-line">
          <summary className="cursor-pointer px-4 py-3 text-sm font-bold uppercase tracking-wider text-ink">
            Contents
          </summary>
          <div className="px-4 pb-4">{sidebar}</div>
        </details>
        {children}
      </div>
    </div>
  );
}

export const SPREADSHEET_FILE = "/Digital_Content_Licensing_Clause_Bank_20260714.xlsx";
