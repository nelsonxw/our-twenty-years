---
name: testing-our-twenty-years
description: Test the "Our Twenty Years" Next.js timeline app end-to-end (video autoplay-on-scroll, reflection markdown loading, error handling). Use when verifying UI or error-handling changes in nelsonxw/our-twenty-years.
---

# Testing "Our Twenty Years"

Next.js (App Router) single-page scroll timeline (2006–2026). No auth, no backend, no CI. No Devin secrets needed.

## Run it
```bash
npm install
npm run dev   # http://localhost:3000
```
`npm run build` also runs the typecheck. `npm run lint` is NOT preconfigured — `next lint` prompts interactively on first run; skip it and rely on `npm run build` for type/compile checks.

## Key facts about the app
- Only year **2006** has a real `<video>` (`/videos/marriedvideo.mp4`, ~570MB). All other years render images. So video-autoplay tests must target `#year-2006`.
- Video autoplay/pause is driven by scroll visibility (`useInView`) in `src/components/year-chapter.tsx`. Before it enters view / when scrolled away it shows a rose-pattern maroon background, which is easy to mistake for "not loaded".
- The "Looking Back" reflection is read server-side from `content/reflection.md` via `src/lib/get-reflection.ts` and rendered by a tiny custom markdown parser (`src/components/markdown.tsx`).

## How to verify video autoplay (objective, not vibes)
Screenshots can't distinguish playing vs paused. Use the console instead:
```js
(() => { const v=document.querySelector('#year-2006 video');
  return JSON.stringify({paused:v.paused, currentTime:+v.currentTime.toFixed(2), muted:v.muted}); })()
```
Navigate with the hash anchor to jump precisely: `http://localhost:3000/#year-2006`. Scroll down ~35 clicks to move to a later year (e.g. 2010) to test pause, then re-navigate to `#year-2006` to test resume. Expected: in-view `paused=false`, scrolled-away `paused=true` (time frozen), back-in-view `paused=false` (time advanced).

## How to test the reflection error path
Temporarily rename the file, reload, then restore:
```bash
mv content/reflection.md content/reflection.md.bak   # trigger error
mv content/reflection.md.bak content/reflection.md   # restore
```
In `next dev` a read failure shows a full-screen error overlay. Good error handling shows a contextual message (e.g. "Failed to read reflection content at <path>"); a bare `ENOENT` means context was lost.

## Expected console noise (ignore)
Next.js logs `<Image> ... has "fill" and parent element with invalid "position" ... static` warnings for the picsum hero images. These are preexisting and unrelated to error-handling changes. A genuinely relevant error to watch for is any `Unexpected error while playing media` (logged by `playMediaSafely` in `src/lib/utils.ts`).

## Recording tips
Maximize first: `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`. Record only the browser tests (autoplay + reflection); the generate-script test is shell-only — capture its output as text, don't record it.
