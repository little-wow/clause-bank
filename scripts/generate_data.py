#!/usr/bin/env python3
"""Generate src/data.ts from the final sources.

  - scripts/book.pdf          The published book (final wording and structure):
                              Introduction, Companion Document, clause order.
  - scripts/clause_bank.xlsx  The Clause Bank workbook: clause fields, priority
                              markers, Read Me First, Theme Index.

Run:  npm run gen   (needs: pip install pdfminer.six openpyxl)

Text is taken verbatim. The book's narrative text is rebuilt from PDF line
positions (paragraph gaps, headings by font size, bullets, bold/italic runs).
"""
import json
import os
import re
import sys

import openpyxl
from pdfminer.high_level import extract_pages, extract_text
from pdfminer.layout import LAParams, LTChar, LTTextContainer, LTTextLine

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PDF = os.path.join(HERE, "book.pdf")
XLSX = os.path.join(HERE, "clause_bank.xlsx")
OUT = os.path.join(ROOT, "src", "data.ts")

# Book pages (1-based PDF page numbers) holding the narrative text. Pages 55-69
# repeat an older draft of the chapters and are intentionally not used.
NARRATIVE_PAGES = [9] + list(range(13, 33))

# External links in the narrative (the only two in that span of the PDF).
LINKS = {
    "Risk Exposure Scorecard": "https://pubs.libraryfutures.net/confidentiality/chapter/risk-assessment-guide/",
    "Understanding Confidentiality and Risk Assessment": "https://pubs.libraryfutures.net/confidentiality/",
}

PARA_GAP = 22.0  # line gap is ~17.1pt inside a paragraph, ~28pt between paragraphs
RIGHT_EDGE_FULL = 515.0  # a line ending past this is a full (non-final) line


def slugify(s):
    s = s.lower().replace("’", "").replace("'", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


# ---------------------------------------------------------------- PDF lines
def read_lines(pages):
    """Return {page: [line dicts]} with text runs (bold/italic) and geometry."""
    wanted = set(pages)
    out = {}
    params = LAParams(char_margin=2.0, word_margin=0.25)
    for pno, page in enumerate(extract_pages(PDF, laparams=params), 1):
        if pno not in wanted:
            continue
        raw = []
        for el in page:
            if not isinstance(el, LTTextContainer):
                continue
            for line in el:
                if not isinstance(line, LTTextLine):
                    continue
                runs, size = [], 0.0
                for ch in line:
                    t = ch.get_text()
                    if t == "\n":
                        continue
                    if isinstance(ch, LTChar):
                        fn = ch.fontname
                        size = max(size, round(ch.size, 1))
                        style = ("SemiBold" in fn or "Bold" in fn, "Italic" in fn)
                    else:
                        style = runs[-1][1] if runs else (False, False)
                    if runs and runs[-1][1] == style:
                        runs[-1][0] += t
                    else:
                        runs.append([t, style])
                if not runs or size < 9:  # drop running headers/footers (8pt)
                    continue
                raw.append(dict(y=line.y0, x=line.x0, x1=line.x1, size=size, runs=runs))
        # merge fragments on the same baseline (justified lines split into boxes)
        raw.sort(key=lambda d: (-round(d["y"]), d["x"]))
        merged = []
        for d in raw:
            if merged and abs(merged[-1]["y"] - d["y"]) < 1.5:
                m = merged[-1]
                m["runs"].append([" ", m["runs"][-1][1]])
                m["runs"].extend(d["runs"])
                m["x1"] = max(m["x1"], d["x1"])
            else:
                merged.append(d)
        out[pno] = merged
    return out


def runs_text(runs):
    return "".join(r[0] for r in runs)


def append_runs(dst, src, joiner):
    """Append line runs to a block's runs, handling end-of-line hyphenation."""
    if dst:
        last = dst[-1]
        last[0] = last[0].rstrip()
        if last[0].endswith("-") and not last[0].endswith(" -"):
            joiner = ""  # 'clause-by-' + 'clause' -> keep the hyphen, no space
        if joiner:
            last[0] += joiner
    for t, style in src:
        if dst and dst[-1][1] == style:
            dst[-1][0] += t
        else:
            dst.append([t, style])


def clean_runs(runs):
    """Normalize whitespace and turn [text,(b,i)] into Run dicts with links."""
    text_runs = []
    for t, (b, it) in runs:
        t = re.sub(r"\s+", " ", t)
        text_runs.append([t, b, it])
    # collapse whitespace across run boundaries and strip edges
    full = "".join(r[0] for r in text_runs)
    # remove the stray space PDF link boxes leave before punctuation: "(GS-LG )"
    out = []
    for t, b, it in text_runs:
        out.append({"t": t, "b": b, "i": it})
    # join, then re-split is simpler: rebuild runs on cleaned string
    cleaned = []
    for r in out:
        t = r["t"]
        if cleaned:
            prev = cleaned[-1]
            if prev["t"].endswith(" ") and t.startswith(" "):
                t = t.lstrip(" ")
        cleaned.append({"t": t, "b": r["b"], "i": r["i"]})
    if cleaned:
        cleaned[0]["t"] = cleaned[0]["t"].lstrip()
        cleaned[-1]["t"] = cleaned[-1]["t"].rstrip()
    for r in cleaned:
        r["t"] = re.sub(r" +([,.;:)])", r"\1", r["t"])
    for i in range(1, len(cleaned)):
        if re.match(r"[,.;:)]", cleaned[i]["t"]) and cleaned[i - 1]["t"].endswith(" "):
            cleaned[i - 1]["t"] = cleaned[i - 1]["t"].rstrip(" ")
    del full
    # merge adjacent runs with the same style, drop empties
    merged = []
    for r in cleaned:
        if not r["t"]:
            continue
        if merged and (merged[-1]["b"], merged[-1]["i"]) == (r["b"], r["i"]):
            merged[-1]["t"] += r["t"]
        else:
            merged.append(dict(r))
    # attach known external links by splitting runs around the link text
    result = []
    for r in merged:
        pieces = [r]
        for label, href in LINKS.items():
            nxt = []
            for p in pieces:
                if "href" in p or label not in p["t"]:
                    nxt.append(p)
                    continue
                before, after = p["t"].split(label, 1)
                if before:
                    nxt.append({**p, "t": before})
                nxt.append({**p, "t": label, "href": href})
                if after:
                    nxt.append({**p, "t": after})
            pieces = nxt
        result.extend(pieces)
    final = []
    for r in result:
        d = {"t": r["t"]}
        if r.get("b"):
            d["b"] = True
        if r.get("i"):
            d["i"] = True
        if r.get("href"):
            d["href"] = r["href"]
        final.append(d)
    return final


def build_narrative():
    pages = read_lines(NARRATIVE_PAGES)
    sections = []  # {id, num, title, blocks}
    cur = None
    block = None  # current open block dict: {k, runs | items}
    prev_line = None
    prev_page = None
    joins = []  # page-break joins, for review

    def close_block():
        nonlocal block
        if block is not None and cur is not None:
            cur["blocks"].append(block)
        block = None

    for pno in NARRATIVE_PAGES:
        lines = pages.get(pno, [])
        for idx, ln in enumerate(lines):
            text = runs_text(ln["runs"]).strip()
            if not text or text == "COMPANION DOCUMENT":
                continue
            size = ln["size"]
            new_page = prev_page is not None and pno != prev_page
            gap = (prev_line["y"] - ln["y"]) if (prev_line and not new_page) else None

            if size >= 25:  # chapter title (h1); may wrap onto two lines
                if block and block["k"] == "h1" and gap is not None and gap < 45:
                    block["text"] += " " + text
                else:
                    close_block()
                    block = {"k": "h1", "text": text}
                prev_line, prev_page = ln, pno
                continue
            if block and block["k"] == "h1":
                title = block["text"]
                m = re.match(r"^(\d+)\.\s+(.*)$", title)
                num, name = (m.group(1), m.group(2)) if m else (None, title)
                cur = {"id": slugify(name), "num": num, "title": name, "blocks": []}
                sections.append(cur)
                block = None

            if size >= 14:  # sub-heading (h2); may wrap
                if block and block["k"] == "h2" and gap is not None and gap < 30:
                    block["text"] += " " + text
                else:
                    close_block()
                    block = {"k": "h2", "text": text}
                prev_line, prev_page = ln, pno
                continue

            is_bullet = text.startswith("•")
            if is_bullet:
                runs = [list(r) for r in ln["runs"]]
                runs[0][0] = runs[0][0].lstrip().lstrip("•").lstrip()
                if block and block["k"] == "ul" and (gap is None or gap < PARA_GAP + 8):
                    block["items"].append(runs)
                else:
                    close_block()
                    block = {"k": "ul", "items": [runs]}
            elif block and block["k"] == "ul" and ln["x"] > 70:
                append_runs(block["items"][-1], ln["runs"], " ")  # bullet wraps
            else:
                continues = False
                if block and block["k"] == "p":
                    if gap is not None:
                        continues = gap < PARA_GAP
                    else:  # first line on a new page: decide if the paragraph runs on
                        prev_txt = runs_text(block["runs"]).rstrip()
                        terminal = prev_txt.endswith((".", "?", "!", ":", "”", '"'))
                        full = prev_line["x1"] > RIGHT_EDGE_FULL
                        continues = (not terminal) or full
                        joins.append((prev_page, pno, continues, prev_txt[-50:], text[:50]))
                if continues:
                    append_runs(block["runs"], ln["runs"], " ")
                else:
                    close_block()
                    block = {"k": "p", "runs": [list(r) for r in ln["runs"]]}
            prev_line, prev_page = ln, pno
    close_block()

    # finalize: clean runs, ids for h2
    for sec in sections:
        fin = []
        for b in sec["blocks"]:
            if b["k"] == "p":
                fin.append({"k": "p", "runs": clean_runs(b["runs"])})
            elif b["k"] == "ul":
                fin.append({"k": "ul", "items": [clean_runs(it) for it in b["items"]]})
            elif b["k"] == "h2":
                t = re.sub(r"\s+", " ", b["text"]).strip()
                m = re.match(r"^(\d+\.\d+)\s+(.*)$", t)
                fin.append({"k": "h2", "id": f"{sec['id']}--{slugify(t)}",
                            "num": m.group(1) if m else None,
                            "text": m.group(2) if m else t})
        sec["blocks"] = fin
    return sections, joins


# --------------------------------------------------------------- workbook
def clean(v):
    if v is None:
        return ""
    return str(v).replace("\r\n", "\n").replace("\r", "\n").strip()


def paragraphs(text):
    text = clean(text)
    if not text:
        return []
    parts = re.split(r"\n\s*\n", text)
    if len(parts) == 1:
        parts = text.split("\n")
    return [p.strip() for p in parts if p.strip()]


def watch_sentences(text):
    text = re.sub(r"\s+", " ", clean(text))
    items = re.split(r"(?:(?<=\.)|(?<=\.’)|(?<=\.'))\s+(?=[A-Z'‘“\"])", text)
    return [i.strip() for i in items if i.strip()]


def alnum(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def book_watch_bullets():
    """{clause id: [bullet text]} as printed in the book's Watch For lists.

    The book bullets the first 26 clauses; the last 10 print Watch For as a
    paragraph, so those are absent here and get one bullet per sentence.
    """
    raw = extract_text(PDF, page_numbers=list(range(32, 148)),
                       laparams=LAParams(char_margin=2.0, word_margin=0.25))
    out = {}
    for m in re.finditer(r"\(([A-Z]{2}-[A-Z0-9]+)\)\s*\n\s*Theme", raw):
        seg = raw[m.end():]
        a = seg.find("Watch For")
        b = seg.find("Companion Doc Ref", a)
        block = seg[a + len("Watch For"):b]
        if "•" not in block:
            continue
        block = re.sub(r"(Laura Crossett|\d+)\s+\|\s+[^\n]*", "", block)
        bullets, pending = [], 0
        for seg_text in block.split("•")[1:]:
            text = re.sub(r"\s+", " ", seg_text).strip()
            if not text:  # a bullet glyph laid out on its own line
                pending += 1
                continue
            if pending:  # stacked glyphs: the next text holds pending+1 items
                parts = watch_sentences(text)
                if len(parts) != pending + 1:
                    sys.exit(f"Watch For for {m.group(1)}: cannot split stacked bullets")
                bullets.extend(parts)
                pending = 0
            else:
                bullets.append(text)
        out[m.group(1)] = bullets
    return out


def watch_items(cid, text, book_bullets):
    """Workbook text, grouped into bullets the way the book groups them."""
    sentences = watch_sentences(text)
    bullets = book_bullets.get(cid)
    if not bullets:
        return sentences
    items, i = [], 0
    for bullet in bullets:
        target, acc = alnum(bullet), []
        while i < len(sentences) and alnum(" ".join(acc)) != target:
            acc.append(sentences[i])
            i += 1
        if alnum(" ".join(acc)) != target:
            sys.exit(f"Watch For for {cid}: could not match book bullet {bullet[:60]!r}")
        items.append(" ".join(acc))
    if i != len(sentences):
        sys.exit(f"Watch For for {cid}: workbook has text the book's bullets don't cover")
    return items


PRIORITY_KEYS = ["preservation", "serviceAvailability", "patronPrivacy", "accessibility", "resourceSharing"]
PRIORITY_LABELS = {
    "preservation": "Preservation",
    "serviceAvailability": "Service Availability",
    "patronPrivacy": "Patron Privacy",
    "accessibility": "Accessibility",
    "resourceSharing": "Resource Sharing",
}


def build_workbook(companion):
    wb = openpyxl.load_workbook(XLSX, data_only=True)

    # Clause Bank
    book_bullets = book_watch_bullets()
    clauses, theme_order, current_theme = [], [], None
    for row in wb["Clause Bank"].iter_rows(values_only=True):
        cells = [clean(c) for c in row] + [""] * 15
        cid = cells[0]
        if not cid or cid == "Clause ID":
            continue
        if not cells[1] and not cells[4] and not cells[5]:
            current_theme = cid
            if cid not in theme_order:
                theme_order.append(cid)
            continue
        theme = cells[2] or current_theme
        if theme not in theme_order:
            theme_order.append(theme)
        clauses.append({
            "id": cid,
            "topic": cells[1],
            "theme": theme,
            "section": cells[3],
            "proVendor": clean(row[4]),
            "proVendorParas": paragraphs(row[4]),
            "proLibrary": clean(row[5]),
            "proLibraryParas": paragraphs(row[5]),
            "fallback": clean(row[6]),
            "fallbackParas": paragraphs(row[6]),
            "why": clean(row[7]),
            "watchFor": watch_items(cid, row[8], book_bullets),
            "companionRefRaw": cells[9],
            "priorities": {k: cells[10 + i] for i, k in enumerate(PRIORITY_KEYS)},
        })

    # Companion Doc Ref: point each clause at the book's matching sub-section,
    # using the book's own heading text (fixes the book's stale 7.x-9.x refs).
    subsections = {}
    for sec in companion:
        for b in sec["blocks"]:
            if b["k"] == "h2" and b.get("num"):
                subsections[b["num"]] = {"chapter": sec["id"], "anchor": b["id"], "title": b["text"]}
    for c in clauses:
        m = re.search(r"(\d+\.\d+)", c["companionRefRaw"])
        ref = subsections.get(m.group(1)) if m else None
        if not ref:
            sys.exit(f"Companion Doc Ref for {c['id']} does not match a book section: {c['companionRefRaw']!r}")
        c["companionRef"] = {"label": f"Section {m.group(1)} ({ref['title']})",
                             "chapter": ref["chapter"], "anchor": ref["anchor"]}
        del c["companionRefRaw"]

    # Read Me First
    lines = [clean(r[0]) for r in wb["Read Me First"].iter_rows(values_only=True)]
    lines = [l for l in lines if l]
    headings = {"Intro", "Notes on Organization: Rows and Columns", "Notes on Organization: Priority",
                "How You Can Use This Resource", "Working with the Risk Exposure Scorecard",
                "Color Coding", "IMPORTANT!", "About"}
    readme_title, readme_subtitle = lines[0], lines[1]
    last_updated = next((l for l in lines if l.startswith("Last updated")), "")
    readme, cur = [], None
    for line in lines[2:]:
        if line == last_updated:
            continue
        if line in headings:
            cur = {"heading": line, "body": []}
            readme.append(cur)
        elif cur is not None:
            cur["body"].append(line)

    # Theme Index
    ws = wb["Theme Index"]
    ti_lines = [clean(r[0]) for r in ws.iter_rows(min_col=1, max_col=1, values_only=True)]
    ti_lines = [l for l in ti_lines if l]
    ti_title, ti_intro = ti_lines[0], ti_lines[1]
    theme_index, ti_theme = [], None
    for row in ws.iter_rows(min_row=3, values_only=True):
        cells = [clean(c) for c in row] + [""] * 4
        if cells[0] and cells[0] != "Theme":
            ti_theme = cells[0]
        if cells[1] and cells[1] != "Clause ID":
            theme_index.append({"theme": ti_theme, "id": cells[1], "topic": cells[2], "section": cells[3]})

    return dict(clauses=clauses, theme_order=theme_order, readme=readme,
                readme_title=readme_title, readme_subtitle=readme_subtitle,
                last_updated=last_updated, ti_title=ti_title, ti_intro=ti_intro,
                theme_index=theme_index)


# ------------------------------------------------------------------ emit
HEADER = """// AUTO-GENERATED by scripts/generate_data.py — do not edit by hand.
// Sources (verbatim): scripts/book.pdf (the book: final wording and structure)
// and scripts/clause_bank.xlsx (the Clause Bank workbook).
// © 2026 Library Futures / The Engelberg Center on Innovation Law & Policy. CC-BY-4.0.

export type Priority = "H" | "M" | "";
export type PriorityKey =
  | "preservation"
  | "serviceAvailability"
  | "patronPrivacy"
  | "accessibility"
  | "resourceSharing";

export interface Run { t: string; b?: boolean; i?: boolean; href?: string }
export type Block =
  | { k: "p"; runs: Run[] }
  | { k: "ul"; items: Run[][] }
  | { k: "h2"; id: string; num: string | null; text: string };

export interface Section { id: string; num: string | null; title: string; blocks: Block[] }

export interface Clause {
  id: string;
  topic: string;
  theme: string;
  section: string;
  proVendor: string;
  proVendorParas: string[];
  proLibrary: string;
  proLibraryParas: string[];
  fallback: string;
  fallbackParas: string[];
  why: string;
  watchFor: string[];
  companionRef: { label: string; chapter: string; anchor: string };
  priorities: Record<PriorityKey, Priority>;
}

export interface ReadmeSection { heading: string; body: string[] }
export interface ThemeIndexEntry { theme: string; id: string; topic: string; section: string }
"""


def dump(o):
    return json.dumps(o, ensure_ascii=False, indent=2)


def main():
    narrative, joins = build_narrative()
    intro = narrative[0]
    companion = narrative[1:]
    wbd = build_workbook(companion)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(HEADER)
        f.write("\nexport const BOOK_TITLE = \"Digital Content Licensing Clause Bank\";\n")
        f.write(f"export const LAST_UPDATED = {json.dumps(wbd['last_updated'], ensure_ascii=False)};\n")
        f.write(f"export const PRIORITY_KEYS: PriorityKey[] = {dump(PRIORITY_KEYS)};\n")
        f.write(f"export const PRIORITY_LABELS: Record<PriorityKey, string> = {dump(PRIORITY_LABELS)};\n")
        f.write(f"export const INTRODUCTION: Section = {dump(intro)};\n")
        f.write(f"export const COMPANION: Section[] = {dump(companion)};\n")
        f.write(f"export const THEME_ORDER: string[] = {dump(wbd['theme_order'])};\n")
        f.write(f"export const CLAUSES: Clause[] = {dump(wbd['clauses'])};\n")
        f.write(f"export const README_TITLE = {json.dumps(wbd['readme_title'], ensure_ascii=False)};\n")
        f.write(f"export const README_SUBTITLE = {json.dumps(wbd['readme_subtitle'], ensure_ascii=False)};\n")
        f.write(f"export const README_SECTIONS: ReadmeSection[] = {dump(wbd['readme'])};\n")
        f.write(f"export const THEME_INDEX_TITLE = {json.dumps(wbd['ti_title'], ensure_ascii=False)};\n")
        f.write(f"export const THEME_INDEX_INTRO = {json.dumps(wbd['ti_intro'], ensure_ascii=False)};\n")
        f.write(f"export const THEME_INDEX: ThemeIndexEntry[] = {dump(wbd['theme_index'])};\n")
    print(f"introduction blocks: {len(intro['blocks'])}")
    print("companion:", [(s['num'], s['title'], len(s['blocks'])) for s in companion])
    print(f"clauses: {len(wbd['clauses'])}  themes: {len(wbd['theme_order'])}  "
          f"readme sections: {len(wbd['readme'])}  theme index: {len(wbd['theme_index'])}")
    print(f"last updated: {wbd['last_updated']!r}")
    if "--joins" in sys.argv:
        for j in joins:
            print("PAGE-BREAK", j)


if __name__ == "__main__":
    main()
