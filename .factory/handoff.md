# Caption Queue — polish round 2 handoff

## Outcome

**PASS — no review finding remains.** Candidate `a8ee7befd517bc9123d5b18d0cc6f937b4888694` was repaired against review commit `f47cec09f436950b558d3423e900c9b0b273c900`. The implementation commit is `f50d5ef68312c9e60486992db21af7d39e4f68d1`.

Round 2 adds a real `free-core-exports` claim and clean unlicensed-workspace browser test for XMP, CSV, and JSON backup export. It also replaces the demo's unexplained IPTC helper with “Creator, copyright, and location fields.” Every finding from reviews 1 and 2 is mapped in `.factory/polish-2.md`.

## Deployment

- Live URL: <https://photo-metadata-queue.sociobot.in/>
- Static deployment ID: `13a79133-8be7-4a80-9950-e39e8ef4d599`
- `npm run test:live -- https://photo-metadata-queue.sociobot.in/` matched all 20 deployed artifacts to `dist/` and passed headers, SPA rewrites, and HTTP 404 checks.
- Live hashes: `index.html` `917f1bc0…70e01`; `sw.js` `23cc6343…ad6b`; JS `e5b56482…a7a6`; CSS `0978c6d4…812d`.

## Verification

- Fresh clone `/tmp/cq-polish2-clean-mSWcB0/repo`: `npm ci` completed with 0 vulnerabilities; all 20 exact commands from `.factory/claims.json` passed independently.
- `npm test`: 16/16 passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; JS 46,265 bytes raw / 15.62 kB gzip; CSS 20,742 bytes raw / 5.32 kB gzip; mobile hero 32,228 bytes.
- `npm run test:e2e -- --reporter=list`: 38/38 passed. This includes keyboard, mobile touch targets, 200% text reflow, History API focus/scroll, Axe, privacy requests, demo isolation, offline reload, and service-worker update tests.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Local and live `npm run verify:url`: passed desktop semantics and 390 px layout.
- `npm run test:polish-live -- https://photo-metadata-queue.sociobot.in`: passed cold landing, one-click demo, reset, unlicensed exports, route titles, mobile Back/Forward focus and scroll, legal routes, 404, Axe, privacy request origins, and offline persistence/status.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0. Full report: `.factory/evidence-polish-2/lighthouse-live.json`.
- Live screenshots: `.factory/evidence-polish-2/live-cold-desktop.png`, `live-cold-mobile.png`, `live-demo-mobile.png`, `live-demo-offline-mobile.png`, and `live-404-mobile.png`.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run verify:url -- http://127.0.0.1:4173/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
```

## Known gaps and next steps

None. No blocking, high, medium, or minor review item is deferred.
