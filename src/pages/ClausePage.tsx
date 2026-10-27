import { useState } from "react";
import type { ReactNode } from "react";
import { Check, Columns3, Copy, Rows3 } from "lucide-react";
import { CLAUSES, COMPANION } from "../data";
import type { Clause } from "../data";
import { Kicker, PageTitle, PrevNext, PriorityList, WithSidebar } from "../components/ui";
import { clauseById, clausesByTheme } from "../content";
import { to } from "../router";

function Contents({ activeId }: { activeId: string }) {
  return (
    <nav aria-label="Clause Bank contents" className="space-y-5">
      {clausesByTheme.map((t) => (
        <div key={t.slug}>
          <a href={to("clauses", t.slug)} className="mb-1.5 block text-xs font-black uppercase tracking-[0.14em] text-ink hover:text-plum">
            {t.theme}
          </a>
          <ul className="space-y-0.5">
            {t.clauses.map((c) => {
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <a
                    href={to(`clauses/${c.id}`)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-1.5 text-sm leading-snug ${
                      active ? "bg-blush font-bold text-plum" : "text-ink/85 hover:text-plum"
                    }`}
                  >
                    {c.topic}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-ink/60 hover:bg-white hover:text-plum"
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function Version({ label, paras, raw, highlight }: { label: string; paras: string[]; raw: string; highlight?: boolean }) {
  return (
    <section className={`rounded-2xl p-5 sm:p-6 ${highlight ? "bg-blush border-2 border-blush-line" : "border-2 border-line"}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.12em] text-plum">{label}</h2>
        <CopyButton text={raw} />
      </div>
      <div className="space-y-3 text-[1.0625rem] leading-relaxed text-ink">
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-plum">{label}</h2>
      <div className="text-[1.0625rem] leading-relaxed text-ink">{children}</div>
    </section>
  );
}

export default function ClausePage({ id }: { id: string }) {
  const [sideBySide, setSideBySide] = useState(false);
  const clause: Clause | undefined = clauseById.get(id);
  if (!clause) {
    return (
      <p className="text-lg">
        No clause with ID “{id}”. <a className="text-plum underline" href={to("clauses")}>Browse the Clause Bank</a>.
      </p>
    );
  }
  const idx = CLAUSES.indexOf(clause);
  const theme = clausesByTheme.find((t) => t.theme === clause.theme)!;
  const ref = clause.companionRef;
  const prevC = CLAUSES[idx - 1];
  const nextC = CLAUSES[idx + 1];
  const lastChapter = COMPANION[COMPANION.length - 1];

  return (
    <WithSidebar sidebar={<Contents activeId={clause.id} />}>
      <article className="max-w-4xl">
        <Kicker>
          <a href={to("clauses", theme.slug)} className="hover:underline">
            {clause.theme}
          </a>
        </Kicker>
        <PageTitle>{clause.topic}</PageTitle>

        <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-3 border-y-2 border-line py-4 text-[15px]">
          <div>
            <dt className="text-xs font-black uppercase tracking-[0.12em] text-ink/60">Clause ID</dt>
            <dd className="mt-0.5 font-bold text-ink">{clause.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-[0.12em] text-ink/60">Theme</dt>
            <dd className="mt-0.5 font-bold text-ink">{clause.theme}</dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-[0.12em] text-ink/60">Typical Section</dt>
            <dd className="mt-0.5 font-bold text-ink">{clause.section}</dd>
          </div>
        </dl>

        {Object.values(clause.priorities).some(Boolean) && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-ink/60">Priority</span>
            <PriorityList priorities={clause.priorities} />
          </div>
        )}

        <div className="mt-10 mb-4 hidden lg:flex justify-end">
          <button
            onClick={() => setSideBySide(!sideBySide)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:border-plum hover:text-plum"
            aria-pressed={sideBySide}
          >
            {sideBySide ? <Rows3 className="h-4 w-4" /> : <Columns3 className="h-4 w-4" />}
            {sideBySide ? "Show one under another" : "Compare side by side"}
          </button>
        </div>
        <div className={`grid gap-4 mt-6 lg:mt-0 ${sideBySide ? "lg:grid-cols-3" : ""}`}>
          <Version label="Common Pro-Vendor Language" paras={clause.proVendorParas} raw={clause.proVendor} />
          <Version label="Pro-Library Version" paras={clause.proLibraryParas} raw={clause.proLibrary} highlight />
          <Version label="Reasonable Fallback" paras={clause.fallbackParas} raw={clause.fallback} />
        </div>

        <Field label="Why?">
          <p>{clause.why}</p>
        </Field>
        <Field label="Watch For">
          <ul className="list-disc space-y-2 pl-6 marker:text-plum">
            {clause.watchFor.map((w, i) => (
              <li key={i} className="pl-1">
                {w}
              </li>
            ))}
          </ul>
        </Field>
        <Field label="Companion Doc Ref">
          <a href={to(`companion/${ref.chapter}`, ref.anchor)} className="font-semibold text-plum underline underline-offset-4 hover:text-plum-dark">
            {ref.label}
          </a>
        </Field>

        <PrevNext
          prev={
            prevC
              ? { href: to(`clauses/${prevC.id}`), label: `${prevC.topic} (${prevC.id})` }
              : { href: to(`companion/${lastChapter.id}`), label: `${lastChapter.num}. ${lastChapter.title}` }
          }
          next={nextC ? { href: to(`clauses/${nextC.id}`), label: `${nextC.topic} (${nextC.id})` } : undefined}
        />
      </article>
    </WithSidebar>
  );
}
