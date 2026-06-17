# Digital Content Licensing Clause Bank for Libraries

An interactive web version of the **Digital Content Licensing Clause Bank for
Libraries** and its **Companion Document**, published by
[Library Futures](https://libraryfutures.net) and the
[Engelberg Center on Innovation Law & Policy](https://nyuengelberg.org) at NYU Law.

All clause and companion language is taken **verbatim** from the source documents.
The site is designed to be readable and easily scannable for library negotiators.

## What's here

- **Overview** — the "Read Me First" guidance: how the bank is organized, how to use
  it, the five priority lenses, and the important caveats.
- **Clause Bank** — 36 negotiable clauses across 8 themes. Search and filter by theme
  or by library priority. Each clause expands to show three versions side by side
  (Common Pro-Vendor Language · Pro-Library Version · Reasonable Fallback), plus
  *Why?*, *Watch For*, priority badges, and a pointer into the Companion Guide. Each
  version can be copied to the clipboard.
- **Companion Guide** — the full companion document, organized by its eight theme
  chapters with a sticky table of contents.

## Tech

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`)
- [lucide-react](https://lucide.dev) icons

The visual design follows the
[Interactive Copyright Tools](https://github.com/little-wow/Interactive-Copyright-Tools)
brand system (palette, typography, layout).

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
npm run gen      # reads scripts/*.xlsx + scripts/*.docx -> src/data.ts
```

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
