import type { JSX } from "react";
import {
  README_TITLE,
  README_SUBTITLE,
  README_SECTIONS,
  THEME_ORDER,
  CLAUSES,
  PRIORITY_LABELS,
  PRIORITY_KEYS,
} from "../data";
import type { TabId } from "./Navbar";
import {
  Layers,
  FileText,
  AlertTriangle,
  ArrowRight,
  ShieldQuestion,
} from "lucide-react";

interface OverviewProps {
  goTo: (tab: TabId) => void;
}

const SHORT_LABEL = /^([A-Z][A-Za-z' ?]{2,45}):\s+(.+)$/;

/** Render a paragraph, bolding a leading "Label: ..." definition when present. */
function Paragraph({ text }: { text: string }): JSX.Element {
  const m = text.match(SHORT_LABEL);
  if (m) {
    return (
      <p className="text-sm sm:text-[0.95rem] leading-relaxed text-slate-600">
        <span className="font-semibold text-[#9a1866]">{m[1]}:</span> {m[2]}
      </p>
    );
  }
  return (
    <p className="text-sm sm:text-[0.95rem] leading-relaxed text-slate-600">{text}</p>
  );
}

export default function Overview({ goTo }: OverviewProps) {
  const intro = README_SECTIONS.find((s) => s.heading === "Intro");
  const important = README_SECTIONS.find((s) => s.heading === "IMPORTANT!");
  const about = README_SECTIONS.find((s) => s.heading === "About");
  const body = README_SECTIONS.filter(
    (s) => !["Intro", "IMPORTANT!", "About"].includes(s.heading)
  );

  return (
    <div className="space-y-10 fade-in">
      {/* Hero */}
      <section className="space-y-5 border-b border-slate-100 pb-8">
        <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#85346a] bg-[#85346a]/10 border border-[#85346a]/20 rounded-full px-3 py-1">
          Library Futures · Negotiation Reference
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#222222] tracking-tight leading-[1.05]">
          {README_TITLE}
        </h2>
        <p className="font-serif text-lg sm:text-xl text-slate-700 max-w-3xl leading-relaxed">
          {README_SUBTITLE}
        </p>
        {intro && (
          <div className="space-y-3 max-w-3xl pt-1">
            {intro.body.map((p, i) => (
              <Paragraph key={i} text={p} />
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={() => goTo("clauses")}
            className="inline-flex items-center gap-2 bg-[#9a1866] text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-md shadow-[#9a1866]/20 hover:bg-[#85346a] transition-colors"
          >
            <Layers className="h-4 w-4" />
            Open the Clause Bank
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => goTo("companion")}
            className="inline-flex items-center gap-2 bg-white text-[#9a1866] font-semibold text-sm px-5 py-3 rounded-xl border border-[#9a1866]/20 hover:bg-[#9a1866]/5 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Read the Companion Guide
          </button>
        </div>
      </section>

      {/* Stat strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { n: String(CLAUSES.length), l: "Negotiable clauses" },
          { n: String(THEME_ORDER.length), l: "Thematic groups" },
          { n: "3", l: "Versions per clause" },
          { n: "5", l: "Priority lenses" },
        ].map((s) => (
          <div
            key={s.l}
            className="bg-slate-50/80 border border-slate-100 rounded-2xl p-5 text-center"
          >
            <div className="font-display text-3xl font-black text-[#9a1866]">{s.n}</div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mt-1">
              {s.l}
            </div>
          </div>
        ))}
      </section>

      {/* Three-version legend */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            tag: "Common Pro-Vendor Language",
            tone: "rose",
            desc: "The version you are likely to find in a vendor template.",
          },
          {
            tag: "Pro-Library Version",
            tone: "violet",
            desc: "The version drafted to favor the library — your opening counter.",
          },
          {
            tag: "Reasonable Fallback",
            tone: "emerald",
            desc: "Language either side could defend as fair — the likely landing place.",
          },
        ].map((c) => {
          const tones: Record<string, string> = {
            rose: "border-rose-200 bg-rose-50/60",
            violet: "border-[#9a1866]/20 bg-[#9a1866]/5",
            emerald: "border-emerald-200 bg-emerald-50/60",
          };
          const dot: Record<string, string> = {
            rose: "bg-rose-500",
            violet: "bg-[#9a1866]",
            emerald: "bg-emerald-500",
          };
          return (
            <div key={c.tag} className={`rounded-2xl border p-5 ${tones[c.tone]}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`h-2.5 w-2.5 rounded-full ${dot[c.tone]}`} />
                <h3 className="font-display font-bold text-sm uppercase tracking-wide text-[#222222]">
                  {c.tag}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">{c.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Narrative sections */}
      <section className="space-y-6">
        {body.map((sec) => (
          <div
            key={sec.heading}
            className="bg-white border border-slate-200/60 rounded-2xl p-6 sm:p-7 shadow-sm"
          >
            <h3 className="font-display text-xl font-extrabold text-[#222222] tracking-tight mb-4 flex items-center gap-2">
              <span className="h-5 w-1 rounded-full bg-[#9a1866] inline-block" />
              {sec.heading}
            </h3>
            <div className="space-y-3">
              {sec.body.map((p, i) => (
                <Paragraph key={i} text={p} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* IMPORTANT callout */}
      {important && (
        <section className="rounded-2xl border-2 border-amber-200 bg-amber-50/70 p-6 sm:p-7">
          <h3 className="font-display text-lg font-black uppercase tracking-wide text-amber-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Important
          </h3>
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

      {/* About */}
      {about && (
        <section className="rounded-2xl bg-[#222222] text-slate-200 p-6 sm:p-7">
          <h3 className="font-display text-base font-bold uppercase tracking-wide text-[#c77fae] mb-3 flex items-center gap-2">
            <ShieldQuestion className="h-5 w-5" />
            About this resource
          </h3>
          <div className="space-y-2.5">
            {about.body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-slate-300">
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Priority lens legend */}
      <section className="bg-slate-50/80 border border-slate-100 rounded-2xl p-6">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#9a1866] mb-4">
          The five priority lenses
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PRIORITY_KEYS.map((k) => (
            <div
              key={k}
              className="flex items-center gap-2 bg-white border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-700"
            >
              <span className="font-mono text-[10px] font-bold text-white bg-[#85346a] rounded px-1.5 py-0.5">
                H / M
              </span>
              {PRIORITY_LABELS[k]}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Markers are sparse: only clauses where the need genuinely drives the priority
          are flagged. <strong>H</strong> means high priority; <strong>M</strong> means
          medium priority.
        </p>
      </section>
    </div>
  );
}
