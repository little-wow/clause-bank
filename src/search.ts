import { CLAUSES } from "./data";
import type { Clause } from "./data";

/** Lowercase and straighten quotes so "vendor’s" matches "vendor's". */
export const fold = (s: string) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"');

export const tokens = (q: string) => fold(q).split(/\s+/).filter(Boolean);

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const patterns = new Map<string, RegExp>();
/** Matches a word at the start of a word ("ill" finds "ILL", not "will"). */
function wordStart(w: string): RegExp {
  let re = patterns.get(w);
  if (!re) {
    re = /^[a-z0-9]/.test(w) ? new RegExp(`(?<![a-z0-9])${esc(w)}`, "g") : new RegExp(esc(w), "g");
    patterns.set(w, re);
  }
  re.lastIndex = 0;
  return re;
}
const has = (text: string, w: string) => wordStart(w).test(text);
const firstAt = (text: string, w: string) => {
  const m = wordStart(w).exec(text);
  return m ? m.index : -1;
};

const FIELDS: { key: string; label: string; get: (c: Clause) => string }[] = [
  { key: "proVendor", label: "Common Pro-Vendor Language", get: (c) => c.proVendor.join(" ") },
  { key: "proLibrary", label: "Pro-Library Version", get: (c) => c.proLibrary.join(" ") },
  { key: "fallback", label: "Reasonable Fallback", get: (c) => c.fallback.join(" ") },
  { key: "why", label: "Why?", get: (c) => c.why },
  { key: "watchFor", label: "Watch For", get: (c) => c.watchFor.join(" ") },
];

const index = CLAUSES.map((c) => ({
  clause: c,
  id: fold(c.id),
  topic: fold(c.topic),
  section: fold(c.section),
  theme: fold(c.theme),
  fields: FIELDS.map((f) => ({ label: f.label, raw: f.get(c), folded: fold(f.get(c)) })),
}));

export interface Hit {
  clause: Clause;
  /** where the words matched, when it wasn't the title */
  snippet?: { label: string; text: string };
}

/**
 * Every word must appear somewhere in the clause. Clauses whose ID, topic, or
 * typical section match rank first; otherwise book order.
 */
export function search(query: string): Hit[] {
  const words = tokens(query);
  if (!words.length) return CLAUSES.map((clause) => ({ clause }));
  const hits: (Hit & { score: number; order: number })[] = [];
  index.forEach((e, order) => {
    let score = 0;
    for (const w of words) {
      let s = 0;
      if (e.id === w) s += 100;
      else if (has(e.id, w)) s += 40;
      if (has(e.topic, w)) s += 20;
      if (has(e.section, w)) s += 8;
      if (has(e.theme, w)) s += 4;
      for (const f of e.fields) if (has(f.folded, w)) s += 1;
      if (!s) return; // a word that appears nowhere rules the clause out
      score += s;
    }
    let snippet: Hit["snippet"];
    const inTitle = words.every((w) => has(e.topic, w) || has(e.id, w));
    if (!inTitle) {
      const w = words.find((x) => !has(e.topic, x) && !has(e.id, x)) ?? words[0];
      const f = e.fields.find((x) => has(x.folded, w));
      if (f) {
        const at = firstAt(f.folded, w);
        const start = Math.max(0, f.raw.lastIndexOf(" ", Math.max(0, at - 70)) + 1);
        const endSpace = f.raw.indexOf(" ", Math.min(f.raw.length, at + w.length + 90));
        const end = endSpace === -1 ? f.raw.length : endSpace;
        snippet = {
          label: f.label,
          text: `${start > 0 ? "…" : ""}${f.raw.slice(start, end)}${end < f.raw.length ? "…" : ""}`,
        };
      }
    }
    hits.push({ clause: e.clause, snippet, score, order });
  });
  return hits.sort((a, b) => b.score - a.score || a.order - b.order);
}

/** Split text into plain and matched pieces for <mark> highlighting. */
export function highlight(text: string, query: string): { t: string; hit: boolean }[] {
  const words = tokens(query).filter((w) => w.length > 1);
  if (!words.length) return [{ t: text, hit: false }];
  const folded = fold(text);
  const marks = new Array(text.length).fill(false);
  for (const w of words) {
    for (const m of folded.matchAll(wordStart(w))) {
      for (let k = m.index!; k < m.index! + w.length; k++) marks[k] = true;
    }
  }
  const out: { t: string; hit: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    if (out.length && out[out.length - 1].hit === marks[i]) out[out.length - 1].t += text[i];
    else out.push({ t: text[i], hit: marks[i] });
  }
  return out;
}
