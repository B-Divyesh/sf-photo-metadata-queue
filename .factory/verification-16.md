# Independent verification 16 — PASS

- **Candidate:** `fa6306f62029c4c257eef44ca2d2c0b43118f46a`
- **Live URL:** <https://photo-metadata-queue.sociobot.in/>
- **Verified:** 2026-09-02 UTC
- **Scope:** clean-checkout independent QA; no product source was changed

## Result

**PASS.** Caption Queue meets the researched brief as a local-first photo-metadata queue: it imports photo folders or CSVs, supports deliberate per-image metadata review, validates fields, and exports separate escaped XMP sidecars without changing originals. The live deployment byte-matches the fresh candidate build and identifies the requested full commit.

## Mandatory claims gate

`.factory/claims.json` is present with 21 entries. After `npm ci`, I ran each entry's exact declared command separately, from the demo-capable production preview:

`npm run test:e2e -- --grep @claim:<id>`

All 21 passed: `demo-sandbox`, `offline-reload`, `local-privacy`, `xmp-export`, `original-files-unchanged`, `photo-import`, `no-generated-captions`, `metadata-tools`, `csv-import-schema`, `bulk-xmp`, `free-core-exports`, `free-limit`, `field-edition`, `local-persistence`, `csv-export`, `backup-restore`, `backup-cross-browser`, `direct-sidecar-write`, `keyboard-save-next`, `license-verification-privacy`, and `keyboard-controls`. The combined 21-claim run also passed. No visitor-facing material claim in the landing page or README was missing from the register.

## Cold read and live workflow

**PASS.** In a fresh 1440 px browser context, the first screen said “Caption large shoots without changing originals,” identified “photographers with large shoots,” and offered **Try it with sample data** with the immediate outcome “Opens three edited sample records.” It therefore answers what it does, for whom, and what to click first in plain words.

The one-click live demo opened `/demo` with the realistic three-record “Salt marsh bird survey,” the persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real**. A live editor check saved with Ctrl+Enter, moved the queue, and downloaded `BIRDS_1843.xmp`. The claim suite additionally covered invalid CSV recovery, missing-required-field recovery, the 25/26 record boundary, controlled terms and tokens, invalid backup recovery, CSV/JSON restore, direct-folder and download sidecars, unlicensed exports, paid fixture behavior, undecodable previews, and source-photo hashes.

## Local quality gates

| Check | Result |
| --- | --- |
| `npm ci` | 60 locked packages installed; audit reported 0 vulnerabilities. |
| `npm test` | PASS — 19 tests in 5 files. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS — produced `dist/` and candidate release marker. |
| `npm run test:e2e` | PASS — 41/41 browser tests. |
| `npm run verify:url -- https://photo-metadata-queue.sociobot.in` | PASS — semantics, console, routes, Axe serious/critical checks, desktop and 390 px. |
| `npm run test:live` | PASS — 21 published artifacts byte-match fresh `dist/`, including `/release.json`, headers, cache policies, routes, manifest, worker, and HTTP 404. |
| `npm run test:polish-live` | PASS — cumulative live workflow and safe demo-wordmark exit. |

The fresh build is 46.29 kB JavaScript (15.62 kB gzip) and 20.74 kB CSS (5.32 kB gzip), within the static PWA budget.

## Privacy, PWA, accessibility, and deployment

- The fresh live free-demo workflow requested only same-origin document and static assets; no analytics, third-party runtime code, photo upload, or model endpoint was observed. The recorded licensing claim proves a pasted token is sent only as a bodyless verification GET.
- HTML response headers included same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, HSTS, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, COOP/CORP, and restrictive permissions policy. Documents and `sw.js` revalidate; hashed JS/CSS are one-year immutable.
- The live demo was service-worker controlled and retained an edited title after an offline reload. The passing PWA update test confirms a same-URL worker update presents the refresh action, reloads once under the new controller, and remains usable.
- Axe found no violations on the live landing; the URL verifier found zero serious/critical findings across `/`, `/demo`, `/privacy`, and `/terms` at desktop and 390 px. The live 390 px page had no horizontal overflow; the first keyboard Tab landed on the visible skip link with a 3 px focus ring. No console or page errors were observed in manual live desktop/mobile/demo/offline checks.
- The deployment is the requested candidate: live `/release.json` is `fa6306f62029c4c257eef44ca2d2c0b43118f46a`; `npm run test:live` confirmed all 21 artifacts match the fresh build.

## License request allowance

This static PWA has no product backend, sign-in, health endpoint, concurrency store, or Entra flow. Its only product-scoped server call is the Sociobot Field-edition verification endpoint. From one client, 30 invalid-token verification requests were accepted; request 31 returned **HTTP 429** with **`Retry-After: 3`** (and `x-ratelimit-after: 3`). Observed allowance: **30 verification requests per rate-limit window**.

## Defects by severity

| Severity | Count | Finding |
| --- | ---: | --- |
| Critical | 0 | None. |
| High | 0 | None. |
| Medium | 0 | None. |
| Low | 0 | None. |

## Known gap / next step

The brief's pilot outcome (a 100-image shoot completed in less than half the prior time with at least 95% accepted sidecars) needs a real photographer baseline and pilot. It is not claimed as proven by the product and is not a release blocker.

