import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Link2 } from "lucide-react";
import { CLAUSES } from "../data";
import type { Clause } from "../data";
import { BOOK_URL } from "../content";
import { PriorityList } from "./ui";
import { to } from "../router";
import { COPY } from "../copy";

function useCopied(): [boolean, (text: string) => void] {
  const [done, setDone] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };
  return [done, copy];
}

function CopyButton({ text, label = COPY.clause.copy }: { text: string; label?: string }) {
  const [done, copy] = useCopied();
  return (
    <button
      onClick={() => copy(text)}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-ink/60 hover:bg-white hover:text-plum"
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? COPY.clause.copied : label}
    </button>
  );
}

function Version({ label, paras, highlight }: { label: string; paras: string[]; highlight?: boolean }) {
  return (
    <section className={`rounded-2xl p-5 ${highlight ? "bg-blush border-2 border-blush-line" : "border-2 border-line"}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-black uppercase tracking-[0.12em] text-plum">{label}</h3>
        <CopyButton text={paras.join("\n\n")} />
      </div>
      <div className="space-y-3 text-base leading-relaxed text-ink">
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h3 className="mb-2 text-[13px] font-black uppercase tracking-[0.12em] text-plum">{label}</h3>
      <div className="text-base leading-relaxed text-ink">{children}</div>
    </section>
  );
}

export default function ClauseDetail({ clause, headingLevel = 2 }: { clause: Clause; headingLevel?: 1 | 2 }) {
  const [linkCopied, copyLink] = useCopied();
  const idx = CLAUSES.indexOf(clause);
  const prev = CLAUSES[idx - 1];
  const next = CLAUSES[idx + 1];
  const H = headingLevel === 1 ? "h1" : "h2";

  return (
    <article aria-labelledby={`title-${clause.id}`}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-plum">{clause.theme}</p>
      <H id={`title-${clause.id}`} className="mt-2 text-2xl sm:text-3xl font-black uppercase leading-[1.02] tracking-tight text-ink">
        {clause.topic}
      </H>

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-y-2 border-line py-3 text-[15px]">
        <div>
          <dt className="text-[11px] font-black uppercase tracking-[0.12em] text-ink/60">Clause ID</dt>
          <dd className="font-bold">{clause.id}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-black uppercase tracking-[0.12em] text-ink/60">Typical Section</dt>
          <dd className="font-bold">{clause.section}</dd>
        </div>
        <div className="ml-auto self-center">
          <button
            onClick={() => copyLink(`${window.location.origin}${window.location.pathname}${to(`clause/${clause.id}`)}`)}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-line px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink hover:border-plum hover:text-plum"
          >
            {linkCopied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
            {linkCopied ? COPY.clause.linkCopied : COPY.clause.copyLink}
          </button>
        </div>
      </dl>

      {Object.values(clause.priorities).some(Boolean) && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-ink/60">{COPY.clause.area}</span>
          <PriorityList priorities={clause.priorities} />
        </div>
      )}

      <div className="mt-6 grid gap-4">
        <Version label="Common Pro-Vendor Language" paras={clause.proVendor} />
        <Version label="Pro-Library Version" paras={clause.proLibrary} highlight />
        <Version label="Reasonable Fallback" paras={clause.fallback} />
      </div>

      <Field label="Why?">
        <p>{clause.why}</p>
      </Field>
      <Field label="Watch For">
        <ul className="list-disc space-y-1.5 pl-5 marker:text-plum">
          {clause.watchFor.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </Field>
      <Field label="Companion Doc Ref">
        <p>
          {clause.companionRef}{" "}
          <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-plum underline underline-offset-4">
            {COPY.clause.inCompanion} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </p>
      </Field>

      <nav aria-label="Previous and next clause" className="mt-10 flex gap-3 border-t-2 border-line pt-5 text-sm font-bold">
        {prev && (
          <a href={to(`clause/${prev.id}`)} className="inline-flex min-w-0 items-center gap-1.5 text-ink hover:text-plum">
            <ArrowLeft className="h-4 w-4 shrink-0" /> <span className="truncate">{prev.topic}</span>
          </a>
        )}
        {next && (
          <a href={to(`clause/${next.id}`)} className="ml-auto inline-flex min-w-0 items-center gap-1.5 text-right text-ink hover:text-plum">
            <span className="truncate">{next.topic}</span> <ArrowRight className="h-4 w-4 shrink-0" />
          </a>
        )}
      </nav>
    </article>
  );
}
