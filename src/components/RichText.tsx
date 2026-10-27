import type { ReactNode } from "react";
import type { Block, Run } from "../data";
import { CLAUSE_ID_RE, clauseById } from "../content";
import { to } from "../router";

/** Plain text with clause IDs (GS-LG, AC-PA …) turned into links to their clause. */
export function LinkedText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(CLAUSE_ID_RE)) {
    const id = m[0];
    if (!clauseById.has(id) || m.index === undefined) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <a key={m.index} href={to(`clauses/${id}`)} title={clauseById.get(id)!.topic}>
        {id}
      </a>
    );
    last = m.index + id.length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

function RunText({ run }: { run: Run }) {
  let node: ReactNode = run.href ? run.t : <LinkedText text={run.t} />;
  if (run.b) node = <strong className="font-bold">{node}</strong>;
  if (run.i) node = <em>{node}</em>;
  if (run.href)
    node = (
      <a href={run.href} target="_blank" rel="noopener noreferrer">
        {node}
      </a>
    );
  return <>{node}</>;
}

export function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((r, i) => (
        <RunText key={i} run={r} />
      ))}
    </>
  );
}

/** Book text: paragraphs, bulleted lists, and numbered sub-headings. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-lf text-[1.0625rem] text-ink">
      {blocks.map((b, i) => {
        if (b.k === "p")
          return (
            <p key={i}>
              <Runs runs={b.runs} />
            </p>
          );
        if (b.k === "ul")
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>
                  <Runs runs={it} />
                </li>
              ))}
            </ul>
          );
        return (
          <h2
            key={i}
            id={b.id}
            className="mt-12 mb-1 text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight text-ink"
          >
            {b.num && <span className="text-plum mr-2">{b.num}</span>}
            {b.text}
          </h2>
        );
      })}
    </div>
  );
}
