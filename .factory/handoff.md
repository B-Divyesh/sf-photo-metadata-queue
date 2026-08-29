# Caption Queue — independent verification handoff

## FAIL — release blocked

Candidate `c9b0afa38294dc59ae2bc2a64fbc8c81004c3e19` was verified against <https://photo-metadata-queue.sociobot.in/> on 2026-08-29 UTC. The live deployment exactly matches the fresh production build (20 artifacts byte-for-byte), and product/browser/PWA quality checks pass. The release nevertheless **FAILS** because every required command in `.factory/claims.json` fails from a clean checkout: Playwright invokes `vite preview` before `dist/` exists, so the demo entry point is HTTP 404. The factory claims contract makes this a release blocker.

## Evidence

- Clean `npm ci` succeeded (60 packages; 0 audit vulnerabilities).
- Before build, every one of the 13 exact claim commands exited non-zero. The first waited 30 seconds for “Try it with sample data”; `/demo` claims waited for the demo banner. `dist/` is ignored/absent while `playwright.config.ts` serves `npm run preview`.
- After `npm run build`, `npm test` passed 13/13, `npm run typecheck` passed, `npm run test:e2e` passed 21/21, and `npm run test:claims` passed 13/13.
- The build output is 14.98 kB gzip JS and 5.22 kB gzip CSS. Live Lighthouse: 100 Performance, 100 Accessibility, LCP 1.373 s, CLS 0.
- Live desktop and 390 px mobile tests found no serious/critical axe findings, console/page errors, or horizontal overflow. Keyboard focus is visible; reduced motion is respected. Free demo workflow requests were same-origin only. Offline reload and service-worker update tests pass.
- The live checkout endpoint returns 303 to Dodo. License verification was rate limited at 30 requests: request 31 returned 429 with `Retry-After: 4`.

## Required next step

Make each declared claim-test command self-contained from a checkout without `dist/` (build before preview, or make the Playwright web-server do so), then re-run the entire claims registry from a clean clone. Do not release this candidate until it passes.

## Verification record

See [`.factory/verification-5.md`](verification-5.md) for exact commands, failure cause, successful built-artifact checks, live identity evidence, and severity.
