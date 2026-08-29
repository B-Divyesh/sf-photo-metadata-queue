# Caption Queue — independent verification 7 handoff

## Outcome

**FAIL — do not release candidate `7a816f38c160310d32fdd5b9df45654fa66586a9`.**

The live site at <https://photo-metadata-queue.sociobot.in/> is deployed and all 20 deployable artifacts match this candidate byte-for-byte. The earlier deployment-only failure is not present. The release is blocked by reproducible test-gate and mobile accessibility defects documented in [`.factory/verification-7.md`](verification-7.md).

## Release blockers

1. `npm run test:e2e` failed twice at 26/27 tests. The service-worker update test times out waiting for a controller under the default two-worker run. It passes alone and all 27 pass with `--workers=1`, confirming a parallel test-isolation problem in the documented gate.
2. At 390 px with text resized to 200%, `/`, `/demo`, `/privacy`, and `/terms` overflow horizontally by 102–219 px.
3. Mobile header/footer links miss the required 44 × 44 px target size. Examples: wordmark 144.8 × 30, header Demo 39.4 × 44, footer links about 15 px tall.

Lower-severity findings: validation tries to focus a non-focusable summary, and the cross-origin license response does not expose its four-second `Retry-After`, causing the UI to impose a 60-second fallback.

## What passed

- `npm ci`: 60 packages, 0 vulnerabilities.
- Every exact command in `.factory/claims.json`: 17/17 passed after install; each claim has one tagged test.
- Cold first-read: clear job, audience, first action, and one-click sample demo on desktop and 390 px.
- `npm test`: 14/14; `npm run typecheck`: pass; `npm run build`: pass. No lint script exists.
- `npm run test:e2e -- --workers=1`: 27/27.
- Core live flow: demo isolation/reset, editing, required-field recovery, exact field boundaries, CSV/image import, XMP escaping/export, bulk/direct sidecars, backup/restore, keyboard use, and free 25/26 boundary.
- Free workflow privacy: only same-origin requests, demo-only IndexedDB, no token, no browser errors.
- Real product-unlock allowance: 30 accepted invalid checks, then 429 with `Retry-After: 4`; the UI remains locked on 429.
- Offline reload and service-worker prompt/apply flow.
- Serious/critical Axe: zero on primary routes at desktop/mobile and light/dark. Normal-size mobile has no overflow.
- Live build identity, route/404 behavior, security headers, cache policy, and link crawl.
- Lighthouse mobile: 96 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.5 s, CLS 0, 136 KiB transfer.

## Build sizes

- JavaScript: 45,310 B raw / 15.42 kB gzip.
- CSS: 20,046 B raw / 5.22 kB gzip.
- Fonts: none.
- Hero: 72,452 B desktop / 32,228 B mobile.

## How to reproduce

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run test:e2e -- --workers=1
npm run test:live
npm run verify:url -- https://photo-metadata-queue.sociobot.in
```

For resize, use a 390 × 844 viewport and set the root text size to 200%; the landing document becomes 492 px wide and `/demo` becomes 609 px wide. For touch targets, measure rendered header and footer anchor boxes at 390 px.

## Files changed by verification

- Added `.factory/verification-7.md`.
- Replaced `.factory/handoff.md` with this unambiguous independent-verification handoff.
- Added `.factory/evidence-7/` with command output, screenshots, request/endpoint evidence, and the Lighthouse result.
- Product code was not modified.

The repository remains buildable. Repair the blockers above, deploy the repaired artifact, and request another independent verification.
