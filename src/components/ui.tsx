import type { ReactNode } from "react";
import { PRIORITY_KEYS, PRIORITY_LABELS } from "../data";
import type { Priority, PriorityKey } from "../data";

/** Small uppercase label above a title. */
export function Kicker({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-plum">{children}</p>;
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
  external,
}: {
  href: string;
  children: ReactNode;
  download?: boolean;
  variant?: "solid" | "outline";
  external?: boolean;
}) {
  const look =
    variant === "solid"
      ? "bg-ink text-white hover:bg-plum"
      : "border-2 border-ink text-ink hover:border-plum hover:text-plum";
  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-colors ${look}`}
    >
      {children}
    </a>
  );
}

/** H = filled plum, M = outlined; blank = faint dot. Matches the workbook's priority columns. */
export function PriorityMark({ value }: { value: Priority }) {
  if (!value) return <span className="text-ink/20" aria-label="no marker">·</span>;
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
