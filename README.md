# Digital Content Licensing Clause Bank for Libraries

An interactive web version of the **Digital Content Licensing Clause Bank for
Libraries** and its **Companion Document**, published by
[Library Futures](https://libraryfutures.net) and the
[Engelberg Center on Innovation Law & Policy](https://nyuengelberg.org) at NYU Law.

The book (`scripts/book.pdf`) is the final word on wording and structure; the
workbook (`scripts/clause_bank.xlsx`) supplies the priority markers, Read Me First,
and Theme Index. All language is taken **verbatim** from those sources.

## What's here

- **Introduction** — the book's Introduction, with links to each part of the site.
- **Companion** — Negotiating with Vendors and the eight numbered chapters, one page
  each, with a contents sidebar, linked clause IDs, and previous/next.
- **Clause Bank** — 36 clauses in book order, grouped by theme and searchable. Each
  clause page shows the three versions (stacked, or side by side), Why?, Watch For,
  its priority markers, and a link to its Companion Doc Ref section.
- **Spreadsheet** — every clause and the five priority columns in one table: filter
  by theme or priority, sort by a priority column, expand a row for the full clause,
  show every workbook column, or download the `.xlsx`.
- **How to Use** — the workbook's Read Me First tab and the Theme Index.

Pages are hash routes (`#/clauses/GS-LG`), so every page has a shareable link.

## Tech

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`)
- [lucide-react](https://lucide.dev) icons

The visual design follows [libraryfutures.net](https://libraryfutures.net): one
system sans-serif family, heavy uppercase headings, plum (`#7d1b6e`) accents.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build to dist/
npm run lint     # type-check
```

## Regenerating the data

All content lives in `src/data.ts`, generated **verbatim** from the source files in
`scripts/` so the build is reproducible and the language is never retyped:

```bash
pip install pdfminer.six openpyxl
npm run gen                       # scripts/book.pdf + scripts/clause_bank.xlsx -> src/data.ts
python3 scripts/verify_data.py    # checks every word against the book and workbook
```

The generator uses the book's numbered chapters (PDF pages 17–32) and skips the
older duplicate of those chapters on pages 55–69. Companion Doc Refs are pointed at
the book's actual sections (the book's last ten refs say 7.1–9.4, which don't exist).
Watch For uses the book's bullets; the last ten clauses, which the book prints as a
paragraph, get one bullet per item.

## Deploy (Cloudflare)

This is a static site, so hosting is just "build and serve the `dist/` folder."
It deploys to Cloudflare as a **Worker that serves static assets**, configured by
`wrangler.jsonc` (no backend, no environment variables, no Python at build time —
`src/data.ts` is already committed).

**Cloudflare Workers Builds settings** (entered once in the dashboard):

| Setting        | Value                |
| -------------- | -------------------- |
| Build command  | `npm run build`      |
| Deploy command | `npx wrangler deploy` |

- `.node-version` pins the build image to Node 22 (Wrangler 4 requires Node ≥ 22).
- `wrangler.jsonc` serves `./dist` with `not_found_handling: "single-page-application"`,
  so client routing resolves to the app. (Do **not** add a Pages-style `_redirects`
  file — Workers rejects `/* /index.html 200` as a redirect loop.)
- Every push to the production branch redeploys automatically.

To deploy manually from your own machine: `npm run deploy` (runs the build, then
`wrangler deploy`; first run prompts a browser login to Cloudflare).

## License

Content © 2026 Library Futures / The Engelberg Center on Innovation Law & Policy,
licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

> This is a general reference, not legal advice. Leverage, jurisdiction, library type,
> and the specific resource being licensed all change what is reasonable in your
> situation. When in doubt, consult counsel.
