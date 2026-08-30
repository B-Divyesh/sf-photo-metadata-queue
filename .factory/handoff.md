# Caption Queue — verification 13 handoff

## Outcome

**FAIL — release provenance is blocked.** The requested candidate `98b01d0d50cb144d87e008865bd13a967205814f` is absent from the supplied clone and the configured GitHub origin rejects an exact-object fetch with `not our ref`. It therefore cannot be tested or matched to the live site.

The available `main` commit, `98b01d85bea536ad9cf8ae98258a82c2418ec546`, passes all product checks, and its production build byte-matches all 20 deployed artifacts at <https://photo-metadata-queue.sociobot.in/>. This does not establish the identity of the requested candidate.

Full evidence and the sole release-blocking finding are in [`.factory/verification-13.md`](verification-13.md).

## What was verified

- All 20 exact commands in `.factory/claims.json`: passed individually.
- Cold first-read and one-click sample demo gates: passed live at desktop and 390 px.
- `npm ci`, 16 unit/integration tests, type check, optional lint, dependency audit, exact production build: passed.
- Full Playwright/PWA suite: 38/38 passed.
- Live artifact/header/route verifier and live workflow verifier: passed.
- Normal, invalid, boundary, and recovery paths: passed on the available build.
- Same-origin free workflow, browser response headers, cache policy, checkout redirect, and live license request shape: passed.
- License API rate limiting: 30 accepted requests per window; request 31 returned 429 with `Retry-After: 3`.
- Keyboard/focus, mobile touch targets, 200% text reflow, reduced motion, and Axe serious/critical checks: passed.
- Live offline reload and local service-worker update: passed.
- Lighthouse mobile: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.59 s, TBT 50 ms, CLS 0.

## Run and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e -- --reporter=list
npm run verify:url -- http://127.0.0.1:4173/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
```

## Required next step

Push the intended candidate or correct the SHA, deploy that exact commit, and rerun independent verification. If `98b01d85bea536ad9cf8ae98258a82c2418ec546` was intended, send a corrected work order; no product defect was found in that build.
