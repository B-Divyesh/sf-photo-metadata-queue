# Caption Queue — polish round 4 handoff

## Outcome

**PASS.** All 31 cumulative findings from reviews 1–4 are closed. The round-four blocking defect is fixed: the **Caption Queue** wordmark on `/demo` now routes home through the existing safe demo-exit transition.

That transition waits for `demo:caption-queue` deletion, retains `caption-queue`, renders `/`, focuses the landing h1 when the real workspace is empty, and announces the route through the existing live region. The functional repair is commit `e334a3a0e7d9bc0af471999beba2fba878206cdc`.

## What changed

- Set the shared wordmark destination to `/` on every route, including `/demo`.
- Added `demo wordmark exits safely to home, focuses its heading, and deletes only demo data`. It edits the demo, seeds a sentinel in the real database, clicks the wordmark, checks `/`, checks landing-h1 focus, checks demo deletion, and reads the unchanged real sentinel.
- Added a production round-four verifier that repeats the same storage and focus assertions against the live site.
- Updated the catalog description to a verb-first, 87-character sentence.
- Re-audited the copy, demo documentation, claims register, all earlier findings, visual identity, and generated-asset provenance. No new product claim or runtime dependency was introduced.

The complete finding-to-evidence matrix is in `.factory/polish-4.md`.

## Verification

- Clean clone of pushed `origin/main`: `npm ci` completed with zero vulnerabilities. Every one of the 21 exact commands in `.factory/claims.json` passed separately and selected one tagged browser test.
- `npm test`: 19/19 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: produced `dist/index.html`; JavaScript is 46.29 kB raw / 15.62 kB gzip and CSS is 20.74 kB raw / 5.32 kB gzip.
- `npm run test:e2e -- --reporter=line`: 41/41 tests passed.
- `npm run verify:url -- https://photo-metadata-queue.sociobot.in/`: passed desktop semantics, 390 px layout, route structure, console, and serious/critical Axe checks.
- `npm run test:polish-live -- https://photo-metadata-queue.sociobot.in`: passed the cumulative live workflow plus the wordmark storage-isolation regression.
- `npm run test:live -- https://photo-metadata-queue.sociobot.in/`: matched 21 deployment artifacts and verified headers, cache policy, SPA routes, and the real HTTP 404.
- Lighthouse 12.8.2 on the live landing page: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.
- Visual inspection passed for the cold mobile landing, direct demo, reset state, wordmark exit, desktop landing, pricing, offline demo, CSV schema, and styled 404. Evidence is under `.factory/evidence-polish-4/`.

## Deploy and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e -- --reporter=line
/opt/fleet/lib/deploy-static.sh photo-metadata-queue dist
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
```

## Known gaps and next steps

None. No finding of any severity is deferred. Infrastructure, shared services, billing configuration, and other products were not accessed or changed.
