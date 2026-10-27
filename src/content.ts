import { CLAUSES, COMPANION, THEME_ORDER } from "./data";
import type { Clause, Section } from "./data";

export const clauseById = new Map(CLAUSES.map((c) => [c.id, c]));

export const themeSlug = (theme: string) =>
  theme.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const clausesByTheme: { theme: string; slug: string; clauses: Clause[] }[] =
  THEME_ORDER.map((theme) => ({
    theme,
    slug: themeSlug(theme),
    clauses: CLAUSES.filter((c) => c.theme === theme),
  }));

/** Companion chapter that discusses a theme (chapters share the themes' names). */
export const chapterForTheme = (theme: string): Section | undefined =>
  COMPANION.find((s) => s.title === theme);

export const chapterLabel = (s: Section) => (s.num ? `${s.num}. ${s.title}` : s.title);

/** Clause IDs as they appear in running text, e.g. GS-LG, TE-AC2. */
export const CLAUSE_ID_RE = /\b(?:GS|AC|FT|DP|RA|TE|DR|GC)-[A-Z0-9]+\b/g;
