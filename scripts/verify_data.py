#!/usr/bin/env python3
"""Check src/data.ts against the sources: every word of the book's narrative is
present (and nothing extra), and every clause matches the workbook and the book.

Run:  python3 scripts/verify_data.py
"""
import json
import os
import re
import sys

import openpyxl
from pdfminer.high_level import extract_text
from pdfminer.layout import LAParams

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PDF = os.path.join(HERE, "book.pdf")
XLSX = os.path.join(HERE, "clause_bank.xlsx")
DATA = os.path.join(ROOT, "src", "data.ts")

data_src = open(DATA, encoding="utf-8").read()


def const(name):
    i = data_src.index(f"export const {name}")
    i = data_src.index("=", i) + 1
    return json.JSONDecoder().raw_decode(data_src[i:].lstrip())[0]


def norm(s):
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r" +([,.;:)])", r"\1", s)
    return s.strip()


def pdf_text(pages):
    raw = extract_text(PDF, page_numbers=[p - 1 for p in pages],
                       laparams=LAParams(char_margin=2.0, word_margin=0.25))
    lines = [l for l in raw.split("\n")
             if not re.match(r"^\s*(\d+|[ivx]+)\s+\|\s+Digital Content", l)
             and not re.match(r"^\s*Laura Crossett\s+\|", l)
             and l.strip() not in ("COMPANION DOCUMENT",)]
    t = "\n".join(lines)
    t = re.sub(r"(?<! )-\s*\n\s*", "-", t)  # end-of-line hyphenation keeps the hyphen
    return norm(t.replace("•", " "))


def words(s):
    return re.findall(r"[A-Za-z0-9'\"$%()§.,;:?!/-]+", s)


problems = 0

# Typos in the book's clause pages; the site keeps the workbook's spelling.
KNOWN_BOOK_TYPOS = [("charge addtional fees", "charge additional fees")]


def fail(msg):
    global problems
    problems += 1
    print("FAIL:", msg)


# 1. Narrative: book pages vs generated sections, word for word
def section_text(sec):
    parts = [sec["title"] if not sec.get("num") else f"{sec['num']}. {sec['title']}"]
    for b in sec["blocks"]:
        if b["k"] == "p":
            parts.append("".join(r["t"] for r in b["runs"]))
        elif b["k"] == "ul":
            parts.extend("".join(r["t"] for r in it) for it in b["items"])
        else:
            parts.append(f"{b['num']} {b['text']}" if b.get("num") else b["text"])
    return norm(" ".join(parts))


intro = const("INTRODUCTION")
companion = const("COMPANION")
generated = " ".join(section_text(s) for s in [intro] + companion)
book = pdf_text([9] + list(range(13, 33)))

import difflib

gw, bw = words(generated), words(book)
sm = difflib.SequenceMatcher(None, bw, gw, autojunk=False)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op != "equal":
        fail(f"narrative {op}: book={' '.join(bw[max(0,i1-5):i2+5])!r}\n      site={' '.join(gw[max(0,j1-5):j2+5])!r}")
print(f"narrative: {len(bw)} words in book, {len(gw)} words generated")

# 2. Clauses: workbook fields, and the book's clause pages
wb = openpyxl.load_workbook(XLSX, data_only=True)["Clause Bank"]
rows = {r[0]: r for r in wb.iter_rows(values_only=True) if r[0] and r[4] and r[0] != "Clause ID"}
clauses = const("CLAUSES")
if len(clauses) != 36:
    fail(f"expected 36 clauses, got {len(clauses)}")
book_clauses = pdf_text(list(range(33, 149)))
for c in clauses:
    r = rows[c["id"]]
    for key, col in (("proVendor", 4), ("proLibrary", 5), ("fallback", 6), ("why", 7)):
        if norm(c[key]) != norm(str(r[col] or "")):
            fail(f"{c['id']} {key} differs from workbook")
        book_val = norm(c[key])
        for wrong, right in KNOWN_BOOK_TYPOS:  # spelled correctly on the site
            book_val = book_val.replace(right, wrong) if wrong in book_clauses else book_val
        if book_val not in book_clauses:
            fail(f"{c['id']} {key} not found verbatim in the book")
    if norm(" ".join(c["watchFor"])) != norm(str(r[8])):
        fail(f"{c['id']} watchFor differs from workbook")
    # bullets: the book prints Watch For as one bullet per item
    for item in c["watchFor"]:
        if norm(item) not in book_clauses:
            fail(f"{c['id']} Watch For item not in book: {item[:60]!r}")
print(f"clauses: {len(clauses)} checked")

# Watch For bullet counts vs the book's bullet glyphs per clause page
raw = extract_text(PDF, page_numbers=list(range(32, 148)), laparams=LAParams(char_margin=2.0, word_margin=0.25))
unbulleted = []
for c in clauses:
    m = re.search(r"\(" + re.escape(c["id"]) + r"\)\s*\n\s*Theme", raw)
    if not m:
        fail(f"{c['id']} clause page not found in the book")
        continue
    seg = raw[m.start():]
    a = seg.find("Watch For")
    b = seg.find("Companion Doc Ref", a)
    n = seg[a:b].count("•")  # bullet glyphs, including ones laid out on their own line
    # The book prints the last 10 clauses' Watch For as a paragraph (0 bullets);
    # the site bullets those one item per sentence for consistency.
    if n and n != len(c["watchFor"]):
        fail(f"{c['id']} Watch For: book has {n} bullets, site has {len(c['watchFor'])}")
    if not n:
        unbulleted.append(c["id"])

print(f"Watch For printed as a paragraph in the book (bulleted on the site): {', '.join(unbulleted)}")

if problems:
    print(f"\n{problems} problem(s)")
    sys.exit(1)
print("\nOK: all text matches the book and the workbook")
