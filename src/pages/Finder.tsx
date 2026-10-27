import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { CLAUSES, LAST_UPDATED, PRIORITY_KEYS, PRIORITY_LABELS, README_SECTIONS, THEME_ORDER } from "../data";
import type { PriorityKey } from "../data";
import { clauseById } from "../content";
import { highlight, search } from "../search";
import type { Hit } from "../search";
import ClauseDetail from "../components/ClauseDetail";
import { to } from "../router";

const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

function Marked({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((p, i) =>
        p.hit ? (
          <mark key={i} className="rounded-sm bg-blush-line/60 px-0.5 text-ink">
            {p.t}
          </mark>
        ) : (
          <span key={i}>{p.t}</span>
        )
      )}
    </>
  );
}

function ResultRow({ hit, query, selected, onPick }: { hit: Hit; query: string; selected: boolean; onPick: () => void }) {
  const c = hit.clause;
  return (
    <li>
      <a
        href={to(`clause/${c.id}`)}
        onClick={onPick}
        aria-current={selected ? "true" : undefined}
        className={`block rounded-xl border-2 px-4 py-3 transition-colors ${
          selected ? "border-plum bg-blush" : "border-transparent hover:border-line hover:bg-paper"
        }`}
      >
        <div className="flex items-baseline gap-3">
          <span className="w-14 shrink-0 text-xs font-black text-plum">
            <Marked text={c.id} query={query} />
          </span>
          <span className="font-bold leading-snug text-ink">
            <Marked text={c.topic} query={query} />
          </span>
        </div>
        <p className="mt-0.5 pl-[4.25rem] text-[13px] text-ink/60">
          {c.section}
          {query && <> · {c.theme}</>}
        </p>
        {hit.snippet && (
          <p className="mt-1.5 pl-[4.25rem] text-[13px] leading-relaxed text-ink/80">
            <span className="font-bold text-plum">{hit.snippet.label}: </span>
            <Marked text={hit.snippet.text} query={query} />
          </p>
        )}
      </a>
    </li>
  );
}

/** Shown in the reading panel before a clause is picked: how a clause is laid out. */
function HowToRead() {
  const notes = README_SECTIONS.find((s) => s.heading === "Notes on Organization: Rows and Columns");
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-plum">Pick a clause to read it here</p>
      <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-ink">{notes?.heading}</h2>
      <div className="mt-4 space-y-3">
        {notes?.body.map((line, i) => {
          const m = line.match(/^([A-Z][A-Za-z'’\- ?]{2,45}):\s+(.+)$/);
          return (
            <p key={i} className="leading-relaxed text-ink">
              {m ? (
                <>
                  <span className="font-bold text-plum">{m[1]}:</span> {m[2]}
                </>
              ) : (
                line
              )}
            </p>
          );
        })}
      </div>
      <p className="mt-6 text-sm">
        <a href={to("how-to-use")} className="font-bold text-plum underline underline-offset-4">
          More on how to use the Clause Bank
        </a>
      </p>
    </div>
  );
}

export default function Finder({ selectedId }: { selectedId?: string }) {
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("All");
  const [prio, setPrio] = useState<PriorityKey | "">("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listScroll = useRef(0);
  const selected = selectedId ? clauseById.get(selectedId) : undefined;

  const hits = useMemo(
    () =>
      search(q).filter(
        (h) => (theme === "All" || h.clause.theme === theme) && (!prio || h.clause.priorities[prio])
      ),
    [q, theme, prio]
  );
  const searching = q.trim().length > 0;
  const filtered = searching || theme !== "All" || prio;

  // Desktop: focus the search box on arrival; "/" jumps back to it from anywhere.
  useEffect(() => {
    if (isDesktop()) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Opening a clause: reset the reading panel (desktop) or the page (phone).
  // Going back on a phone returns to where you were in the list.
  useEffect(() => {
    if (isDesktop()) {
      panelRef.current?.scrollTo({ top: 0 });
    } else if (selectedId) {
      window.scrollTo({ top: 0 });
    } else {
      window.scrollTo({ top: listScroll.current });
    }
  }, [selectedId]);

  const pick = () => {
    listScroll.current = window.scrollY;
  };

  const grouped = !searching
    ? THEME_ORDER.map((t) => ({ theme: t, hits: hits.filter((h) => h.clause.theme === t) })).filter((g) => g.hits.length)
    : null;

  const list = (
    <div className={selected ? "hidden lg:block" : ""}>
      <p className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] text-plum">Clause Bank · {LAST_UPDATED}</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink">Find a clause</h1>

      <div className="sticky top-20 z-10 -mx-1 bg-white px-1 pb-3 pt-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQ("")}
            placeholder="Search by topic, ID, or any word"
            aria-label="Search the Clause Bank"
            className="w-full rounded-full border-2 border-ink bg-white py-3 pl-12 pr-11 text-base placeholder:text-ink/45 focus:border-plum focus:outline-none"
          />
          {q && (
            <button onClick={() => { setQ(""); inputRef.current?.focus(); }} aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 hover:text-plum">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <select value={theme} onChange={(e) => setTheme(e.target.value)} aria-label="Filter by theme" className="min-w-0 rounded-full border-2 border-line bg-white px-3 py-2 text-sm font-semibold focus:border-plum focus:outline-none">
            <option value="All">All themes</option>
            {THEME_ORDER.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select value={prio} onChange={(e) => setPrio(e.target.value as PriorityKey | "")} aria-label="Filter by priority" className="min-w-0 rounded-full border-2 border-line bg-white px-3 py-2 text-sm font-semibold focus:border-plum focus:outline-none">
            <option value="">Any priority</option>
            {PRIORITY_KEYS.map((k) => (
              <option key={k} value={k}>
                {PRIORITY_LABELS[k]} (H or M)
              </option>
            ))}
          </select>
        </div>
        <p className="mt-3 flex items-center justify-between text-[13px] text-ink/70" aria-live="polite">
          <span>
            {filtered ? `${hits.length} of ${CLAUSES.length} clauses` : `${CLAUSES.length} clauses by theme`}
          </span>
          {filtered && (
            <button onClick={() => { setQ(""); setTheme("All"); setPrio(""); }} className="font-bold text-plum underline underline-offset-4">
              Clear
            </button>
          )}
        </p>
      </div>

      {hits.length === 0 ? (
        <p className="mt-6 rounded-xl bg-paper p-5 text-ink/80">
          No clause contains all of those words. Try fewer words, or a clause ID like GS-AU.
        </p>
      ) : grouped ? (
        <div className="space-y-6">
          {grouped.map((g) => (
            <section key={g.theme} aria-label={g.theme}>
              <h2 className="mb-1 border-b-2 border-ink pb-1.5 text-[13px] font-black uppercase tracking-[0.12em] text-ink">{g.theme}</h2>
              <ul>
                {g.hits.map((h) => (
                  <ResultRow key={h.clause.id} hit={h} query="" selected={h.clause.id === selectedId} onPick={pick} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="space-y-1">
          {hits.map((h) => (
            <ResultRow key={h.clause.id} hit={h} query={q} selected={h.clause.id === selectedId} onPick={pick} />
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] lg:gap-10">
      {list}

      {/* Reading panel: beside the list on desktop, the whole page on phones */}
      <div className={selected ? "" : "hidden lg:block"}>
        <div
          ref={panelRef}
          className="lg:sticky lg:top-24 lg:h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:rounded-2xl lg:border-2 lg:border-line lg:p-7"
        >
          {selected ? (
            <>
              <a href={to("")} className="mb-5 inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-4 py-1.5 text-xs font-bold uppercase tracking-wider lg:hidden">
                <ArrowLeft className="h-4 w-4" /> Back to results
              </a>
              <ClauseDetail clause={selected} />
            </>
          ) : selectedId ? (
            <p>
              No clause with ID “{selectedId}”.{" "}
              <a href={to("")} className="text-plum underline">Back to the list</a>
            </p>
          ) : (
            <HowToRead />
          )}
        </div>
      </div>
    </div>
  );
}
