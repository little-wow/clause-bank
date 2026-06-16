import { useMemo, useState } from "react";
import {
  COMPANION_TITLE,
  COMPANION_SUBTITLE,
  COMPANION_UPDATED,
  COMPANION_SECTIONS,
} from "../data";
import { List } from "lucide-react";

function slug(s: string) {
  return (
    "g-" +
    s
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}

export default function CompanionGuide() {
  const [active, setActive] = useState<string>("");

  const chapters = useMemo(
    () =>
      COMPANION_SECTIONS.filter((s) => s.level === 1).map((s) => ({
        heading: s.heading,
        id: slug(s.heading),
      })),
    []
  );

  const onJump = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 mb-8">
        <p className="text-xs text-[#85346a] font-semibold uppercase font-mono tracking-wider mb-2">
          {COMPANION_SUBTITLE} · {COMPANION_UPDATED}
        </p>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#222222] tracking-tight">
          {COMPANION_TITLE}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* TOC */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24">
          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4">
            <h3 className="flex items-center gap-1.5 font-display text-[11px] font-bold uppercase tracking-wider text-[#9a1866] border-b border-slate-100 pb-2 mb-2">
              <List className="h-3.5 w-3.5" /> Contents
            </h3>
            <nav className="space-y-0.5">
              {chapters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onJump(c.id)}
                  className={`block w-full text-left text-[13px] leading-snug rounded-md px-2.5 py-1.5 transition-colors ${
                    active === c.id
                      ? "bg-[#9a1866]/10 text-[#9a1866] font-semibold"
                      : "text-slate-600 hover:bg-white hover:text-[#9a1866]"
                  }`}
                >
                  {c.heading}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Body */}
        <article className="lg:col-span-9 max-w-3xl space-y-1">
          {COMPANION_SECTIONS.map((sec, i) => {
            if (sec.level === 1) {
              return (
                <section key={i} id={slug(sec.heading)} className="pt-8 first:pt-0">
                  <h3 className="font-display text-2xl font-black text-[#222222] tracking-tight flex items-center gap-3 mb-4">
                    <span className="h-6 w-1.5 rounded-full bg-[#9a1866] inline-block" />
                    {sec.heading}
                  </h3>
                  <CompanionBody body={sec.body} />
                </section>
              );
            }
            return (
              <section key={i} className="pt-5">
                <h4 className="font-display text-lg font-bold text-[#85346a] tracking-tight mb-3">
                  {sec.heading}
                </h4>
                <CompanionBody body={sec.body} />
              </section>
            );
          })}
        </article>
      </div>
    </div>
  );
}

function CompanionBody({ body }: { body: string[] }) {
  return (
    <div className="space-y-4">
      {body.map((p, i) => (
        <p
          key={i}
          className="font-serif text-[1.05rem] leading-[1.75] text-slate-700"
        >
          {p}
        </p>
      ))}
    </div>
  );
}
