---
name: testing-our-twenty-years
description: Test the "Our Twenty Years" Next.js scroll memoir end-to-end. Use when verifying UI, scroll-reveal animations, counters, or the lightbox in nelsonxw/our-twenty-years.
---

# Testing our-twenty-years

Single-page Next.js (App Router) scroll memoir. `src/app/page.tsx` renders
Hero → 21 YearChapters (2006–2026) → ByTheNumbers → Reflection → Footer.
Animations are Framer Motion scroll-reveals; shared helpers live in `src/lib/animations.ts`
(`reveal()`, `REVEAL_VIEWPORT`).

## Run locally
- `npm install` then `npm run dev` → http://localhost:3000 (verified serves 200).
- Build/type-check: `npm run build` (runs `tsc` too).
- Lint caveat: `npm run lint` (`next lint`) may prompt to configure ESLint interactively because
  the repo has no ESLint config — it can hang a non-interactive shell. Prefer `npx tsc --noEmit`
  + `npm run build` for verification until an eslint config is added.

## Key flows to verify
- **Scroll-reveal**: scroll down; each year chapter's text/milestones/gallery should fade + slide in.
- **By The Numbers counters**: scroll to the navy "By The Numbers" section; four counters animate
  from 0 up to **20 / 7,305 / 4 / 48** (values come from `stats` in `by-the-numbers.tsx`). They use
  `once: true`, so approach slowly to catch the count-up — a mid-count screenshot is strong evidence.
- **Reflection**: "Looking Back" section fades in with markdown paragraphs (content from
  `content/reflection.md`).
- **Lightbox**: clicking a hero/gallery image opens a fullscreen viewer with prev/next + Esc.

## Tips
- There are 21 chapters — scrolling to By The Numbers needs a large `scroll_amount` (~150+ clicks),
  then slow down near the target to capture counter animation.
- Address bar: navigate with a full scheme (`http://localhost:3000/`). Typing bare `localhost:3000`
  can be treated as a Google search.
- Expected benign console warnings: Next.js `Image` `fill` + parent `position: static` warnings on
  the picsum hero images — preexisting, not a regression.

## Devin Secrets Needed
- None. Fully local, no auth or external credentials required.
