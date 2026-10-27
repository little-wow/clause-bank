import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { CLAUSES } from "../data";
import type { Clause } from "../data";
import { Kicker, PageTitle, PriorityList } from "../components/ui";
import { chapterForTheme, chapterLabel, clausesByTheme } from "../content";
import { to } from "../router";

function ClauseRow({ c }: { c: Clause }) {
  return (
    <li>
      <a
        href={to(`clauses/${c.id}`)}
        className="group block rounded-xl border-2 border-line bg-white p-4 sm:p-5 transition-all hover:border-plum hover:shadow-md"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-xs font-black tracking-wide text-plum">{c.id}</span>
          <span className="text-lg font-bold text-ink group-hover:text-plum">{c.topic}</span>
          <span className="text-sm text-ink/60">{c.section}</span>
        </div>
        <div className="mt-3">
          <PriorityList priorities={c.priorities} />
        </div>
      </a>
    </li>
  );
}

export default function ClauseIndex() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (!query) return [];
    return CLAUSES.filter((c) =>
      [c.id, c.topic, c.theme, c.section, c.proVendor, c.proLibrary, c.fallback, c.why, ...c.watchFor]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [query]);

  return (
    <div className="max-w-4xl">
      <Kicker>Clause Bank</Kicker>
      <PageTitle>Clause Bank</PageTitle>
      <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink/80">
        {CLAUSES.length} clauses in {clausesByTheme.length} themes. Each one shows the Common Pro-Vendor
        Language, the Pro-Library Version, and the Reasonable Fallback.
      </p>

      <div className="relative mt-8">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search all clause text, e.g. perpetual access, ILL, GS-AU"
          aria-label="Search clauses"
          className="w-full rounded-full border-2 border-line bg-white py-3.5 pl-12 pr-12 text-base placeholder:text-ink/40 focus:border-plum focus:outline-none"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 hover:text-plum">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {query ? (
        <section className="mt-8" aria-live="polite">
          <p className="mb-4 text-sm font-bold uppercase tracking-wider text-ink/60">
            {results.length} {results.length === 1 ? "clause matches" : "clauses match"}
          </p>
          <ul className="grid gap-3">{results.map((c) => <ClauseRow key={c.id} c={c} />)}</ul>
        </section>
      ) : (
        <div className="mt-12 space-y-14">
          {clausesByTheme.map((t) => {
            const chapter = chapterForTheme(t.theme);
            return (
              <section key={t.slug} id={t.slug} aria-labelledby={`${t.slug}-h`}>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-2 border-ink pb-3">
                  <h2 id={`${t.slug}-h`} className="text-2xl font-black uppercase tracking-tight text-ink">
                    {t.theme}
                  </h2>
                  {chapter && (
                    <a href={to(`companion/${chapter.id}`)} className="inline-flex items-center gap-1 text-sm font-bold text-plum hover:underline">
                      Read {chapterLabel(chapter)} <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <ul className="grid gap-3">{t.clauses.map((c) => <ClauseRow key={c.id} c={c} />)}</ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
