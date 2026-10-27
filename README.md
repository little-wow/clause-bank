# Digital Content Licensing Clause Bank

The searchable, view-only version of the **Digital Content Licensing Clause Bank for
Libraries** spreadsheet, published by [Library Futures](https://libraryfutures.net)
and the [Engelberg Center on Innovation Law & Policy](https://www.nyuengelberg.org).
The companion document (the book) lives at
[pubs.libraryfutures.net/clausebank](https://pubs.libraryfutures.net/clausebank).

All text comes **verbatim** from the spreadsheet (`scripts/clause_bank.xlsx`) and its
three tabs: Clause Bank, Read Me First, and Theme Index.

## What's here

- **Find a clause** (home): search by topic, clause ID, contract section, or any word
  in the clause. Results show where the words matched. With no search, clauses are
  listed by theme. The full clause opens beside the list (on phones, full screen),
  with copy buttons and a shareable link (`#/clause/GS-LG`).
- **Table**: the whole spreadsheet as a table: filter by theme or priority, sort by a
  priority column, expand a row to compare versions, show every column, or download
  the `.xlsx`.
- **How to Use**: the Read Me First tab and the Theme Index.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build to dist/
npm run lint     # type-check
```

## Updating the content

Replace `scripts/clause_bank.xlsx` (and the download copy in `public/`) with the new
spreadsheet, then:

```bash
pip install openpyxl
npm run gen                       # scripts/clause_bank.xlsx -> src/data.ts
python3 scripts/verify_data.py    # every cell of all three tabs is on the site
```

## Deploy (Cloudflare)

```bash
npm run build
npx wrangler deploy
```

`wrangler.jsonc` serves `dist/` as a Worker with static assets. `.node-version` pins
Node 22 (Wrangler 4 needs it).

## License

© 2026 Library Futures / The Engelberg Center on Innovation Law & Policy, licensed
under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

> This workbook is a general reference, not legal advice. Leverage, jurisdiction,
> library type, and the specific resource being licensed all change what is
> reasonable in your situation. When in doubt, consult counsel.
