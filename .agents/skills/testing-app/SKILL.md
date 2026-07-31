---
name: testing-app
description: Test the our-twenty-years Next.js site end-to-end, especially the markdown renderer / reflection section. Use when verifying UI or content-rendering changes.
---

# Testing our-twenty-years

Static Next.js (App Router) site — no backend, DB, or API routes. A 20-year scroll timeline (2006–2026) ending with a "Looking Back" reflection section and footer.

## Run locally
```bash
npm install
npm run dev   # http://localhost:3000
```
`npm run build` also runs type-checking + lint. `next lint` standalone prompts for interactive ESLint setup (no config committed) — rely on the build instead.

## Markdown renderer
- `src/components/markdown.tsx` is a minimal renderer (regex for `#`/`##`/`###` headings, `**bold**`, `*italic*`) that outputs via `dangerouslySetInnerHTML`. It escapes HTML entities before applying inline transforms, so raw HTML in content renders as literal text.
- The ONLY consumer is the reflection section (`src/components/reflection.tsx`, rendered on the home page after all year chapters and the "By the Numbers" block). Content comes from `content/reflection.md` (read server-side by `src/lib/get-reflection.ts`).

### How to test rendering / escaping
- Temporarily append test lines to `content/reflection.md` (e.g. `**BOLD** and *ITALIC*` plus a raw HTML payload like `<img src=x onerror="document.title='XSS'"> <b>RAWBOLD</b>`), reload, then `git checkout content/reflection.md` to revert.
- The reflection section is near the very bottom — scroll all the way down (past ~20 chapters). Framer-motion `whileInView` fades sections in, so scroll DOWN through the page (don't jump with End) so the section animates into view; if you jump, content can stay at opacity 0.
- Pass criteria: markdown formatting still styles bold/italic; raw HTML shows as literal `<...>` text (no bold, no img element, tab title unchanged). You can also grep the served HTML / `read_dom` to confirm entities are escaped (`&lt;img&gt;`).

## Known quirks
- The Next dev server may throw a transient `ChunkLoadError` (chunk load timeout) while scrolling a freshly-edited page; a plain reload (Ctrl+R) fixes it. It's a dev-server artifact, not a product bug.

## Security scanning notes
- No secrets, SQL, CORS, auth, or debug endpoints exist (static site). `npm audit` is the main dependency check; postcss is pinned via an `overrides` block in package.json.

## Devin Secrets Needed
- None. Everything runs locally with no credentials.
