import { useMemo, useState } from "react";
import {
  CLAUSES,
  THEME_ORDER,
  PRIORITY_LABELS,
  PRIORITY_KEYS,
} from "../data";
import type { Clause, ClausePriorities } from "../data";
import {
  Search,
  X,
  ChevronDown,
  Copy,
  Check,
  Eye,
  AlertCircle,
  BookMarked,
  Filter,
} from "lucide-react";

/* ---------------------------------------------------------------- helpers */

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#9a1866] transition-colors"
      title={`Copy the ${label} text`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" /> Copy
        </>
      )}
    </button>
  );
}

const VERSION_STYLES = {
  vendor: {
    label: "Common Pro-Vendor Language",
    head: "text-rose-700",
    ring: "border-rose-200",
    bg: "bg-rose-50/40",
    dot: "bg-rose-500",
  },
  library: {
    label: "Pro-Library Version",
    head: "text-[#9a1866]",
    ring: "border-[#9a1866]/25",
    bg: "bg-[#9a1866]/[0.04]",
    dot: "bg-[#9a1866]",
  },
  fallback: {
    label: "Reasonable Fallback",
    head: "text-emerald-700",
    ring: "border-emerald-200",
    bg: "bg-emerald-50/40",
    dot: "bg-emerald-500",
  },
} as const;

function VersionColumn({
  kind,
  paras,
  raw,
}: {
  kind: keyof typeof VERSION_STYLES;
  paras: string[];
  raw: string;
}) {
  const s = VERSION_STYLES[kind];
  return (
    <div className={`rounded-xl border ${s.ring} ${s.bg} p-4 flex flex-col`}>
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/70">
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${s.dot}`} />
          <h4
            className={`font-display text-[11px] font-bold uppercase tracking-wider ${s.head}`}
          >
            {s.label}
          </h4>
        </div>
        <CopyButton text={raw} label={s.label} />
      </div>
      <div className="space-y-2 text-[13px] leading-relaxed text-slate-700">
        {paras.length ? (
          paras.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="italic text-slate-400">—</p>
        )}
      </div>
    </div>
  );
}

function PriorityBadges({ priorities }: { priorities: ClausePriorities }) {
  const active = PRIORITY_KEYS.filter((k) => priorities[k]);
  if (!active.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {active.map((k) => {
        const high = priorities[k] === "H";
        return (
          <span
            key={k}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
              high
                ? "bg-[#9a1866]/10 text-[#9a1866] border-[#9a1866]/20"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }`}
            title={`${PRIORITY_LABELS[k]}: ${high ? "High" : "Medium"} priority`}
          >
            {PRIORITY_LABELS[k]}
            <span className="font-mono font-bold">{priorities[k]}</span>
          </span>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- card */

function ClauseCard({
  clause,
  open,
  onToggle,
}: {
  clause: Clause;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      id={clause.id}
      className={`bg-white border rounded-2xl shadow-sm transition-colors ${
        open ? "border-[#9a1866]/30" : "border-slate-200/60 hover:border-slate-300"
      }`}
    >
      {/* Header (click to toggle) */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 sm:p-6 flex items-start gap-4"
        aria-expanded={open}
      >
        <span className="flex-shrink-0 font-mono text-xs font-bold text-white bg-[#9a1866] rounded-lg px-2.5 py-1.5 mt-0.5">
          {clause.id}
        </span>
        <div className="flex-grow min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-display text-lg font-extrabold text-[#222222] tracking-tight">
              {clause.topic}
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              {clause.section}
            </span>
          </div>
          <PriorityBadges priorities={clause.priorities} />
          {!open && (
            <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2 pt-0.5">
              {clause.why}
            </p>
          )}
        </div>
        <ChevronDown
          className={`flex-shrink-0 h-5 w-5 text-slate-400 transition-transform duration-300 mt-1 ${
            open ? "rotate-180 text-[#9a1866]" : ""
          }`}
        />
      </button>

      {/* Body */}
      {open && (
        <div className="px-5 sm:px-6 pb-6 space-y-5 fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <VersionColumn
              kind="vendor"
              paras={clause.proVendorParas}
              raw={clause.proVendor}
            />
            <VersionColumn
              kind="library"
              paras={clause.proLibraryParas}
              raw={clause.proLibrary}
            />
            <VersionColumn
              kind="fallback"
              paras={clause.fallbackParas}
              raw={clause.fallback}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50/80 border border-slate-100 p-4">
              <h4 className="flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-[#9a1866] mb-2">
                <Eye className="h-3.5 w-3.5" /> Why?
              </h4>
              <p className="text-[13px] leading-relaxed text-slate-600">{clause.why}</p>
            </div>
            <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-4">
              <h4 className="flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-2">
                <AlertCircle className="h-3.5 w-3.5" /> Watch For
              </h4>
              <p className="text-[13px] leading-relaxed text-slate-600">
                {clause.watchFor}
              </p>
            </div>
          </div>

          {clause.companionRef && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <BookMarked className="h-3.5 w-3.5 text-[#85346a]" />
              Full discussion in the Companion Guide —{" "}
              <span className="font-semibold text-[#85346a]">{clause.companionRef}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- container */

export default function ClauseBank() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<string>("All");
  const [priority, setPriority] = useState<keyof ClausePriorities | "All">("All");
  const [open, setOpen] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLAUSES.filter((c) => {
      if (theme !== "All" && c.theme !== theme) return false;
      if (priority !== "All" && !c.priorities[priority]) return false;
      if (!q) return true;
      const hay = [
        c.id,
        c.topic,
        c.theme,
        c.section,
        c.proVendor,
        c.proLibrary,
        c.fallback,
        c.why,
        c.watchFor,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, theme, priority]);

  const grouped = useMemo(() => {
    const map = new Map<string, Clause[]>();
    for (const c of filtered) {
      if (!map.has(c.theme)) map.set(c.theme, []);
      map.get(c.theme)!.push(c);
    }
    return THEME_ORDER.filter((t) => map.has(t)).map((t) => ({
      theme: t,
      items: map.get(t)!,
    }));
  }, [filtered]);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => setOpen(new Set(filtered.map((c) => c.id)));
  const collapseAll = () => setOpen(new Set());

  const hasFilters = query || theme !== "All" || priority !== "All";

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#222222] tracking-tight">
            Clause Bank
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase font-mono tracking-wider">
            {CLAUSES.length} negotiable clauses · three versions each
          </p>
        </div>
        <div className="text-xs text-[#85346a] bg-[#85346a]/10 py-1.5 px-3 rounded-lg font-sans font-semibold border border-[#85346a]/20 self-start md:self-auto">
          Compare vendor language against library-favorable alternatives
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clauses — topic, language, clause ID (e.g. perpetual access, ILL, GS-AU)…"
          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-11 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9a1866]/30 focus:border-[#9a1866]/40 shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Theme filter */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="All themes"
            active={theme === "All"}
            onClick={() => setTheme("All")}
          />
          {THEME_ORDER.map((t) => (
            <FilterChip
              key={t}
              label={t}
              active={theme === t}
              onClick={() => setTheme(theme === t ? "All" : t)}
            />
          ))}
        </div>
        {/* Priority filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-slate-400 mr-1">
            <Filter className="h-3.5 w-3.5" /> Priority
          </span>
          <FilterChip
            label="Any"
            small
            active={priority === "All"}
            onClick={() => setPriority("All")}
          />
          {PRIORITY_KEYS.map((k) => (
            <FilterChip
              key={k}
              label={PRIORITY_LABELS[k]}
              small
              active={priority === k}
              onClick={() => setPriority(priority === k ? "All" : k)}
            />
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-[#9a1866]">{filtered.length}</strong> of{" "}
          {CLAUSES.length} clauses
          {hasFilters && (
            <button
              onClick={() => {
                setQuery("");
                setTheme("All");
                setPriority("All");
              }}
              className="ml-3 text-[#9a1866] hover:underline font-semibold"
            >
              Reset filters
            </button>
          )}
        </span>
        <div className="flex items-center gap-3">
          <button onClick={expandAll} className="hover:text-[#9a1866] font-semibold">
            Expand all
          </button>
          <span className="text-slate-300">|</span>
          <button onClick={collapseAll} className="hover:text-[#9a1866] font-semibold">
            Collapse all
          </button>
        </div>
      </div>

      {/* Results */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-slate-500">No clauses match your filters.</p>
          <p className="text-sm">Try a different search term or reset the filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <section key={group.theme} className="space-y-3">
              <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-slate-500 sticky top-[5.25rem] bg-[#f6f6f6]/95 backdrop-blur-sm py-1.5 z-10">
                <span className="h-4 w-1 rounded-full bg-[#9a1866] inline-block" />
                {group.theme}
                <span className="font-mono text-[10px] text-slate-400 normal-case">
                  ({group.items.length})
                </span>
              </h3>
              <div className="space-y-3">
                {group.items.map((c) => (
                  <ClauseCard
                    key={c.id}
                    clause={c}
                    open={open.has(c.id)}
                    onToggle={() => toggle(c.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  small,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full font-semibold transition-all border ${
        small ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs"
      } ${
        active
          ? "bg-[#9a1866] text-white border-[#9a1866] shadow-sm shadow-[#9a1866]/20"
          : "bg-white text-slate-600 border-slate-200 hover:border-[#9a1866]/40 hover:text-[#9a1866]"
      }`}
    >
      {label}
    </button>
  );
}
