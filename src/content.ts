import { CLAUSES, THEME_ORDER } from "./data";
import type { Clause } from "./data";

/** The companion document (the book) lives on Library Futures' publishing site. */
export const BOOK_URL = "https://pubs.libraryfutures.net/clausebank";
export const SPREADSHEET_FILE = "/Digital_Content_Licensing_Clause_Bank_20260714.xlsx";

export const clauseById = new Map(CLAUSES.map((c) => [c.id, c]));

export const themeSlug = (theme: string) =>
  theme.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const clausesByTheme: { theme: string; slug: string; clauses: Clause[] }[] = THEME_ORDER.map((theme) => ({
  theme,
  slug: themeSlug(theme),
  clauses: CLAUSES.filter((c) => c.theme === theme),
}));

/** Clause IDs as they appear in running text, e.g. GS-LG, TE-AC2. */
export const CLAUSE_ID_RE = /\b(?:GS|AC|FT|DP|RA|TE|DR|GC)-[A-Z0-9]+\b/g;
