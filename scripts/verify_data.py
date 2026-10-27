#!/usr/bin/env python3
"""Check src/data.ts against scripts/clause_bank.xlsx: every non-empty cell of
all three tabs must appear in the site's data, verbatim.

Run:  python3 scripts/verify_data.py
"""
import os
import re
import sys

import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(os.path.dirname(HERE), "src", "data.ts")
XLSX = os.path.join(HERE, "clause_bank.xlsx")


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


import json

data = open(DATA, encoding="utf-8").read()
# every string literal in data.ts, decoded, as one whitespace-normalized blob
blob = norm(" ".join(json.loads(m.group(0)) for m in re.finditer(r'"(?:[^"\\\n]|\\.)*"', data)))
SENTENCE = r"(?:(?<=\.)|(?<=\.’)|(?<=\.'))\s+(?=[A-Z'‘“\"])"

skip = {"Clause ID", "Topic", "Theme", "Typical Section", "Common Pro-Vendor Language", "Pro-Library Version",
        "Reasonable Fallback", "Why?", "Watch For", "Companion Doc Ref", "Preservation", "Service Availability",
        "Patron Privacy", "Accessibility", "Resource Sharing", "H", "M"}
problems = 0
wb = openpyxl.load_workbook(XLSX, data_only=True)
for ws in wb.worksheets:
    n = 0
    for row in ws.iter_rows(values_only=True):
        for c in row:
            if c is None or not str(c).strip() or str(c).strip() in skip:
                continue
            n += 1
            for line in re.split(r"\n", str(c)):
                parts = [line] if norm(line) in blob else re.split(SENTENCE, norm(line))
                for part in parts:
                    if norm(part) and norm(part) not in blob:
                        problems += 1
                        print(f"MISSING [{ws.title}]: {norm(part)[:100]!r}")
    print(f"{ws.title}: {n} cells checked")
if problems:
    sys.exit(f"{problems} problem(s)")
print("OK: every cell of all three tabs is on the site")
