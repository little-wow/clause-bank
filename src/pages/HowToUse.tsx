import { AlertTriangle } from "lucide-react";
import {
  LAST_UPDATED,
  README_SECTIONS,
  README_SUBTITLE,
  README_TITLE,
  THEME_INDEX,
  THEME_INDEX_INTRO,
  THEME_INDEX_TITLE,
  THEME_ORDER,
} from "../data";
import { Kicker, PageTitle, SPREADSHEET_FILE } from "../components/ui";
import { LinkedText } from "../components/RichText";
import { to } from "../router";

const LABEL = /^([A-Z][A-Za-z'’\- ?]{2,45}):\s+(.+)$/;
const slug = (s: string) => "readme-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Purple for a leading "Label:", black for the rest. */
function Line({ text }: { text: string }) {
  const m = text.match(LABEL);
  return (
    <p className="mt-4 first:mt-0 text-[1.0625rem] leading-relaxed text-ink">
      {m ? (
        <>
          <span className="font-bold text-plum">{m[1]}:</span> <LinkedText text={m[2]} />
        </>
      ) : (
        <LinkedText text={text} />
      )}
    </p>
  );
}

export default function HowToUse() {
  const important = README_SECTIONS.find((s) => s.heading === "IMPORTANT!");
  const about = README_SECTIONS.find((s) => s.heading === "About");
  const body = README_SECTIONS.filter((s) => s !== important && s !== about);
  const onPage = [...body.map((s) => s.heading), "Important", THEME_INDEX_TITLE, "About"];

  return (
    <div className="max-w-3xl">
      <Kicker>From the workbook’s Read Me First tab</Kicker>
      <PageTitle>How to Use</PageTitle>
      <p className="mt-5 text-lg font-bold text-ink">{README_TITLE}</p>
      <p className="mt-1 text-lg leading-relaxed text-ink/80">{README_SUBTITLE}</p>
      <p className="mt-2 text-sm font-semibold text-ink/60">{LAST_UPDATED}</p>

      <nav aria-label="On this page" className="mt-10 rounded-2xl bg-blush p-5 sm:p-6">
        <h2 className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-ink">On this page</h2>
        <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {onPage.map((h) => (
            <li key={h}>
              <a href={to("how-to-use", slug(h))} className="text-[15px] font-semibold text-plum hover:underline">
                {h}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {body.map((s) => (
        <section key={s.heading} id={slug(s.heading)} className="mt-14">
          <h2 className="mb-5 text-2xl font-black uppercase tracking-tight text-ink">{s.heading}</h2>
          {s.body.map((p, i) => (
            <Line key={i} text={p} />
          ))}
          {s.heading === "Color Coding" && (
            <p className="mt-4 text-sm text-ink/70">
              <a className="font-semibold text-plum underline underline-offset-4" href={SPREADSHEET_FILE} download>
                Download the spreadsheet (.xlsx)
              </a>
            </p>
          )}
        </section>
      ))}

      {important && (
        <section id={slug("Important")} className="mt-14 rounded-2xl border-2 border-plum bg-blush p-6 sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-plum">
            <AlertTriangle className="h-6 w-6" aria-hidden /> {important.heading}
          </h2>
          {important.body.map((p, i) => (
            <Line key={i} text={p} />
          ))}
        </section>
      )}

      <section id={slug(THEME_INDEX_TITLE)} className="mt-14">
        <h2 className="mb-3 text-2xl font-black uppercase tracking-tight text-ink">{THEME_INDEX_TITLE}</h2>
        <p className="mb-6 text-[1.0625rem] leading-relaxed text-ink">{THEME_INDEX_INTRO}</p>
        <div className="space-y-6">
          {THEME_ORDER.map((theme) => (
            <div key={theme}>
              <h3 className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-plum">{theme}</h3>
              <ul className="divide-y divide-line rounded-xl border-2 border-line">
                {THEME_INDEX.filter((e) => e.theme === theme).map((e) => (
                  <li key={e.id}>
                    <a href={to(`clauses/${e.id}`)} className="group flex flex-wrap items-baseline gap-x-4 gap-y-0.5 px-4 py-3 hover:bg-blush">
                      <span className="w-16 text-xs font-black text-plum">{e.id}</span>
                      <span className="flex-1 font-semibold text-ink group-hover:text-plum">{e.topic}</span>
                      <span className="text-sm text-ink/60">{e.section}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {about && (
        <section id={slug("About")} className="mt-14 border-t-2 border-ink pt-8">
          <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-ink">{about.heading}</h2>
          {about.body.map((p, i) => (
            <Line key={i} text={p} />
          ))}
        </section>
      )}
    </div>
  );
}
