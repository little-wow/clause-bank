import {
  README_TITLE,
  README_SUBTITLE,
  README_SECTIONS,
  THEME_ORDER,
  THEME_INDEX,
  THEME_INDEX_TITLE,
  THEME_INDEX_INTRO,
} from "../data";
import type { TabId } from "./Navbar";
import {
  Layers,
  FileText,
  ArrowRight,
  AlertTriangle,
  ListTree,
  ChevronRight,
} from "lucide-react";

interface OverviewProps {
  goTo: (tab: TabId) => void;
  openClause: (id: string) => void;
}

const SHORT_LABEL = /^([A-Z][A-Za-z'’\- ?]{2,45}):\s+(.+)$/;

/**
 * Label colors matched to how each concept is shown elsewhere on the site:
 * vendor = rose, library = brand magenta, fallback = emerald, watch-for = amber.
 */
const LABEL_COLORS: Record<string, string> = {
  "Common Pro-Vendor Language": "text-rose-700",
  "Pro-Library Version": "text-[#b41f6e]",
  "Reasonable Fallback": "text-emerald-700",
  "Why?": "text-[#b41f6e]",
  "Watch For": "text-amber-700",
  "Clause ID": "text-[#b41f6e]",
  "Companion Doc Ref": "text-[#6e2c6a]",
};

function slug(s: string) {
  return (
    "sec-" +
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

/** Render a paragraph, coloring a leading "Label: ..." definition. */
function DefLine({
  text,
  colorMap,
}: {
  text: string;
  colorMap?: Record<string, string>;
}) {
  const m = text.match(SHORT_LABEL);
  if (m) {
    const color = colorMap?.[m[1].trim()] ?? "text-[#b41f6e]";
    return (
      <p className="text-sm sm:text-[0.95rem] leading-relaxed text-slate-600">
        <span className={`font-semibold ${color}`}>{m[1]}:</span> {m[2]}
      </p>
    );
  }
  return (
    <p className="text-sm sm:text-[0.95rem] leading-relaxed text-slate-600">{text}</p>
  );
}

export default function Overview({ goTo, openClause }: OverviewProps) {
  const intro = README_SECTIONS.find((s) => s.heading === "Intro");
  const important = README_SECTIONS.find((s) => s.heading === "IMPORTANT!");
  const about = README_SECTIONS.find((s) => s.heading === "About");
  const body = README_SECTIONS.filter(
    (s) => !["Intro", "IMPORTANT!", "About"].includes(s.heading)
  );

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pageSections = [
    ...body.map((s) => ({ label: s.heading, id: slug(s.heading) })),
    { label: THEME_INDEX_TITLE, id: "theme-index" },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Hero */}
      <section className="space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#222222] tracking-tight leading-[1.05]">
          {README_TITLE}
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl leading-relaxed">
          {README_SUBTITLE}
        </p>
        {intro && (
          <div className="space-y-3 max-w-3xl">
            {intro.body.map((p, i) => (
              <DefLine key={i} text={p} />
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={() => goTo("clauses")}
            className="inline-flex items-center gap-2 bg-[#b41f6e] text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md shadow-[#b41f6e]/20 hover:bg-[#6e2c6a] transition-colors"
          >
            <Layers className="h-4 w-4" />
            Open the Clause Bank
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => goTo("companion")}
            className="inline-flex items-center gap-2 bg-white text-[#b41f6e] font-semibold text-sm px-5 py-3 rounded-xl border border-[#b41f6e]/20 hover:bg-[#b41f6e]/5 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Read the Companion Guide
          </button>
        </div>
      </section>

      {/* On this page — above-the-fold navigation */}
      <section className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#6e2c6a] mb-3">
          On this page
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {pageSections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToId(s.id)}
              className="group flex items-center justify-between gap-2 text-left bg-white border border-slate-100 rounded-lg px-3 py-2.5 hover:border-[#b41f6e]/40 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700 group-hover:text-[#b41f6e] transition-colors">
                {s.label}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#b41f6e] transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* Narrative sections */}
      <section className="space-y-6">
        {body.map((sec) => (
          <div
            key={sec.heading}
            id={slug(sec.heading)}
            className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-7 shadow-sm"
          >
            <h2 className="font-display text-xl font-extrabold text-[#222222] tracking-tight mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#b41f6e] inline-block" />
              {sec.heading}
            </h2>
            <div className="space-y-3">
              {sec.body.map((p, i) => (
                <DefLine
                  key={i}
                  text={p}
                  colorMap={
                    sec.heading === "Notes on Organization: Rows and Columns"
                      ? LABEL_COLORS
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* IMPORTANT callout */}
      {important && (
        <section className="rounded-2xl border-2 border-amber-200 bg-amber-50/70 p-6 sm:p-7">
          <h2 className="font-display text-lg font-black uppercase tracking-wide text-amber-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Important
          </h2>
          <div className="space-y-3">
            {important.body.map((p, i) => {
              const m = p.match(SHORT_LABEL);
              return (
                <p key={i} className="text-sm leading-relaxed text-amber-900/90">
                  {m ? (
                    <>
                      <span className="font-bold">{m[1]}.</span> {m[2]}
                    </>
                  ) : (
                    p
                  )}
                </p>
              );
            })}
          </div>
        </section>
      )}

      {/* Theme Index (third spreadsheet tab) */}
      <section
        id="theme-index"
        className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-7 shadow-sm"
      >
        <h2 className="font-display text-xl font-extrabold text-[#222222] tracking-tight mb-1.5 flex items-center gap-2">
          <ListTree className="h-5 w-5 text-[#b41f6e]" />
          {THEME_INDEX_TITLE}
        </h2>
        <p className="text-sm text-slate-600 mb-5 max-w-3xl">{THEME_INDEX_INTRO}</p>
        <div className="space-y-5">
          {THEME_ORDER.map((theme) => {
            const rows = THEME_INDEX.filter((e) => e.theme === theme);
            if (!rows.length) return null;
            return (
              <div key={theme}>
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#6e2c6a] mb-2">
                  {theme}
                </h3>
                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {rows.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => openClause(e.id)}
                      className="group w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-[#b41f6e]/[0.04] transition-colors"
                      title={`Jump to ${e.id} in the Clause Bank`}
                    >
                      <span className="text-[11px] font-bold text-[#b41f6e] bg-[#b41f6e]/10 rounded px-1.5 py-0.5 w-16 text-center flex-shrink-0">
                        {e.id}
                      </span>
                      <span className="text-sm text-slate-700 flex-grow group-hover:text-[#b41f6e] transition-colors">
                        {e.topic}
                      </span>
                      <span className="hidden sm:block text-[10px] uppercase tracking-wider text-slate-400">
                        {e.section}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#b41f6e] transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About this resource — moved to the bottom of the page */}
      {about && (
        <section className="rounded-2xl bg-[#222222] text-slate-200 p-6 sm:p-7">
          <h2 className="font-display text-base font-bold uppercase tracking-wide text-[#d98cc0] mb-3">
            About this resource
          </h2>
          <div className="space-y-2.5">
            {about.body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-slate-300">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
