import { Fragment, useMemo, useState } from "react";
import { ArrowDown, ChevronDown, Download, Search } from "lucide-react";
import { CLAUSES, PRIORITY_KEYS, PRIORITY_LABELS, THEME_ORDER } from "../data";
import type { Clause, PriorityKey } from "../data";
import { Kicker, PageTitle, PillLink, PriorityMark } from "../components/ui";
import { SPREADSHEET_FILE } from "../content";
import { to } from "../router";

const RANK = { H: 0, M: 1, "": 2 } as const;

function Detail({ c }: { c: Clause }) {
  return (
    <div className="space-y-6 bg-paper p-5 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {(
          [
            ["Common Pro-Vendor Language", c.proVendor, false],
            ["Pro-Library Version", c.proLibrary, true],
            ["Reasonable Fallback", c.fallback, false],
          ] as const
        ).map(([label, paras, hl]) => (
          <div key={label} className={`rounded-xl p-4 ${hl ? "bg-blush border-2 border-blush-line" : "bg-white border-2 border-line"}`}>
            <h3 className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-plum">{label}</h3>
            <div className="space-y-2 text-[15px] leading-relaxed text-ink">
              {paras.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-plum">Why?</h3>
          <p className="text-[15px] leading-relaxed text-ink">{c.why}</p>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-plum">Watch For</h3>
          <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-ink marker:text-plum">
            {c.watchFor.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-sm">
        <a className="font-bold text-plum underline underline-offset-4" href={to(`clause/${c.id}`)}>
          Open this clause
        </a>
        <span>
          <span className="font-bold text-plum">Companion Doc Ref:</span> {c.companionRef}
        </span>
      </div>
    </div>
  );
}

export default function Table() {
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("All");
  const [prio, setPrio] = useState<PriorityKey | null>(null);
  const [highOnly, setHighOnly] = useState(false);
  const [full, setFull] = useState(false);
  const [sortKey, setSortKey] = useState<PriorityKey | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = CLAUSES.filter((c) => {
      if (theme !== "All" && c.theme !== theme) return false;
      if (prio && !c.priorities[prio]) return false;
      if (highOnly && !(prio ? c.priorities[prio] === "H" : Object.values(c.priorities).includes("H"))) return false;
      if (!query) return true;
      return [c.id, c.topic, c.theme, c.section, c.proVendor, c.proLibrary, c.fallback, c.why, ...c.watchFor]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
    return sortKey ? [...list].sort((a, b) => RANK[a.priorities[sortKey]] - RANK[b.priorities[sortKey]]) : list;
  }, [q, theme, prio, highOnly, sortKey]);

  const toggleRow = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const filtered = q || theme !== "All" || prio || highOnly;
  const colCount = full ? 15 : 9;
  const th = "px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.1em] text-white align-bottom";

  return (
    <div>
      <div className="max-w-4xl">
        <Kicker>Clause Bank</Kicker>
        <PageTitle>Table</PageTitle>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink/80">
          All {CLAUSES.length} clauses in one table, with the five priority columns. Filter by a priority to
          get the shortlist for one need, or read across a row to see how much rides on a single clause.{" "}
          <a className="font-semibold text-plum underline underline-offset-4" href={to("how-to-use", "readme-notes-on-organization-priority")}>
            How the priority columns work
          </a>
          .
        </p>
        <div className="mt-6">
          <PillLink href={SPREADSHEET_FILE} download>
            <Download className="h-4 w-4" /> Download the spreadsheet (.xlsx)
          </PillLink>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 space-y-4 rounded-2xl border-2 border-line p-4 sm:p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search all text"
              aria-label="Search the spreadsheet"
              className="w-full rounded-full border-2 border-line bg-white py-2.5 pl-12 pr-4 focus:border-plum focus:outline-none"
            />
          </div>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            aria-label="Theme"
            className="rounded-full border-2 border-line bg-white px-4 py-2.5 font-semibold focus:border-plum focus:outline-none"
          >
            <option value="All">All themes</option>
            {THEME_ORDER.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-black uppercase tracking-[0.12em] text-ink/60">Priority</span>
          {PRIORITY_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setPrio(prio === k ? null : k)}
              aria-pressed={prio === k}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold border-2 transition-colors ${
                prio === k ? "bg-plum border-plum text-white" : "border-line text-ink hover:border-plum hover:text-plum"
              }`}
            >
              {PRIORITY_LABELS[k]}
            </button>
          ))}
          <label className="ml-1 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={highOnly} onChange={(e) => setHighOnly(e.target.checked)} className="h-4 w-4 accent-plum" />
            High (H) only
          </label>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
          <span aria-live="polite">
            Showing <strong>{rows.length}</strong> of {CLAUSES.length}
            {filtered && (
              <button
                className="ml-3 font-bold text-plum underline underline-offset-4"
                onClick={() => {
                  setQ("");
                  setTheme("All");
                  setPrio(null);
                  setHighOnly(false);
                  setSortKey(null);
                }}
              >
                Clear filters
              </button>
            )}
          </span>
          <label className="inline-flex cursor-pointer items-center gap-2 font-semibold">
            <input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} className="h-4 w-4 accent-plum" />
            Show every column (full clause text, like the workbook)
          </label>
        </div>
      </div>

      {/* Legend */}
      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/80">
        <span className="inline-flex items-center gap-2"><PriorityMark value="H" /> high priority</span>
        <span className="inline-flex items-center gap-2"><PriorityMark value="M" /> medium priority</span>
        <span>Click a priority heading to sort by it. {full ? "Click a clause ID to open it." : "Click a row to read the full clause."}</span>
      </p>

      {/* Table */}
      {/* Summary view scrolls with the page (header sticks under the site menu on
          wide screens); the full-text view is wide, so it scrolls in its own frame. */}
      <div
        className={`mt-4 rounded-xl border-2 border-ink ${
          full ? "max-h-[80vh] overflow-auto" : "overflow-x-auto lg:overflow-x-visible"
        }`}
      >
        <table className={`w-full border-collapse text-[15px] ${full ? "min-w-[2600px]" : "min-w-[940px]"}`}>
          <thead className={`sticky z-20 bg-ink ${full ? "top-0" : "top-0 lg:top-20"}`}>
            <tr>
              <th className={`${th} sticky left-0 z-30 bg-ink w-24`}>Clause ID</th>
              <th className={`${th} min-w-[13rem]`}>Topic</th>
              <th className={`${th} min-w-[9rem]`}>Theme</th>
              <th className={`${th} min-w-[9rem]`}>Typical Section</th>
              {full &&
                ["Common Pro-Vendor Language", "Pro-Library Version", "Reasonable Fallback", "Why?", "Watch For", "Companion Doc Ref"].map((h) => (
                  <th key={h} className={`${th} ${h === "Companion Doc Ref" ? "min-w-[12rem]" : "min-w-[24rem]"}`}>
                    {h}
                  </th>
                ))}
              {PRIORITY_KEYS.map((k) => (
                <th key={k} className={`${th} w-24 text-center`}>
                  <button
                    onClick={() => setSortKey(sortKey === k ? null : k)}
                    className="inline-flex flex-col items-center gap-1 uppercase hover:text-blush-line"
                    aria-label={`Sort by ${PRIORITY_LABELS[k]}`}
                    aria-pressed={sortKey === k}
                  >
                    {PRIORITY_LABELS[k]}
                    <ArrowDown className={`h-3.5 w-3.5 ${sortKey === k ? "opacity-100" : "opacity-30"}`} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c, i) => {
              const isOpen = !full && open.has(c.id);
              const zebra = i % 2 ? "bg-paper" : "bg-white";
              return (
                <Fragment key={c.id}>
                  <tr
                    className={`${zebra} border-t border-line align-top ${full ? "" : "cursor-pointer hover:bg-blush"} ${isOpen ? "bg-blush" : ""}`}
                    onClick={full ? undefined : () => toggleRow(c.id)}
                  >
                    <td className={`sticky left-0 z-10 px-3 py-3 font-black text-plum ${isOpen ? "bg-blush" : zebra}`}>
                      {full ? (
                        <a href={to(`clause/${c.id}`)} className="underline underline-offset-4">{c.id}</a>
                      ) : (
                        <button
                          className="inline-flex items-center gap-1"
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? "Hide" : "Show"} full text of ${c.topic}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(c.id);
                          }}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                          {c.id}
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-3 font-bold text-ink">{c.topic}</td>
                    <td className="px-3 py-3 text-ink/80">{c.theme}</td>
                    <td className="px-3 py-3 text-ink/80">{c.section}</td>
                    {full && (
                      <>
                        {[c.proVendor, c.proLibrary, c.fallback].map((paras, j) => (
                          <td key={j} className={`px-3 py-3 text-sm leading-relaxed ${j === 1 ? "bg-blush/60" : ""}`}>
                            {paras.map((p, k) => (
                              <p key={k} className={k ? "mt-2" : ""}>{p}</p>
                            ))}
                          </td>
                        ))}
                        <td className="px-3 py-3 text-sm leading-relaxed">{c.why}</td>
                        <td className="px-3 py-3 text-sm leading-relaxed">
                          <ul className="list-disc space-y-1 pl-4 marker:text-plum">
                            {c.watchFor.map((w, k) => (
                              <li key={k}>{w}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-3 py-3 text-sm">{c.companionRef}</td>
                      </>
                    )}
                    {PRIORITY_KEYS.map((k) => (
                      <td key={k} className="px-3 py-3 text-center">
                        <PriorityMark value={c.priorities[k]} />
                      </td>
                    ))}
                  </tr>
                  {isOpen && (
                    <tr className="border-t border-blush-line">
                      <td colSpan={colCount} className="p-0">
                        <div className="sticky left-0 max-w-[calc(100vw-3rem)] lg:max-w-none">
                          <Detail c={c} />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-10 text-center text-ink/70">
                  No clauses match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
