# Independent verification 13 — FAIL

- **Requested candidate:** `98b01d0d50cb144d87e008865bd13a967205814f`
- **Available and tested source:** `98b01d85bea536ad9cf8ae98258a82c2418ec546`
- **Live URL:** <https://photo-metadata-queue.sociobot.in/>
- **Verified:** 2026-08-30 UTC
- **Scope:** clean-clone product QA; no product code was modified

## Result

**FAIL.** The requested candidate commit does not exist in the supplied clone and cannot be fetched from the configured GitHub origin. `git fetch origin 98b01d0d50cb144d87e008865bd13a967205814f` returned `fatal: remote error: upload-pack: not our ref`, and `git ls-remote origin` contains no such object or ref. The clean clone and `origin/main` instead resolve to `98b01d85bea536ad9cf8ae98258a82c2418ec546`.

The live deployment is healthy and byte-matches the production build from that different, available commit across all 20 deployable artifacts. That is useful product evidence, but it cannot prove that the requested candidate is deployed or equivalent. Release identity is part of the acceptance contract, so the candidate fails even though no product defect was found in the available build.

## Release-blocking finding

| Severity | Finding | Evidence | Required resolution |
| --- | --- | --- | --- |
| Critical | The requested candidate is unavailable and cannot be matched to the live deployment. | Exact-object fetch failed with `not our ref`; local and remote `main` are `98b01d85…`; live matched the 20 artifacts built from `98b01d85…`. | Push the intended commit or correct the candidate SHA, deploy that exact source, then rerun independent verification. |

No high-, medium-, or low-severity product defect was found in the available build.

## Mandatory claims gate

`.factory/claims.json` exists with 20 entries. After `npm ci`, every listed command was run separately from the clean available checkout. Each selected one tagged Playwright test and passed.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `offline-reload` | PASS |
| `local-privacy` | PASS |
| `xmp-export` | PASS |
| `original-files-unchanged` | PASS |
| `photo-import` | PASS |
| `no-generated-captions` | PASS |
| `metadata-tools` | PASS |
| `bulk-xmp` | PASS |
| `free-core-exports` | PASS |
| `free-limit` | PASS |
| `field-edition` | PASS |
| `local-persistence` | PASS |
| `csv-export` | PASS |
| `backup-restore` | PASS |
| `backup-cross-browser` | PASS |
| `direct-sidecar-write` | PASS |
| `keyboard-save-next` | PASS |
| `license-verification-privacy` | PASS |
| `keyboard-controls` | PASS |

Landing, legal-page, and README promises were cross-checked against the manifest. No material unlisted claim was found.

## Cold first-read and demo gate

**PASS on the live site.** In a fresh 1440 × 900 browser context, the first screen says:

- **What:** “Caption large shoots without changing originals,” with a folder/CSV-to-XMP explanation.
- **Who:** “For photographers with large shoots.”
- **First action:** **Try it with sample data**, alongside “Opens three edited sample records.”

The action is visible on the first screen and opens `/demo` in one click. At 390 × 844, the headline, audience sentence, action, outcome, and the offline/privacy/price facts fit in the first viewport. The demo immediately contains three realistic records and displays **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for real**.

## Clean checkout and repository gates

| Check | Result on available commit `98b01d85…` |
| --- | --- |
| Install | `npm ci` installed 60 locked packages; 0 vulnerabilities. |
| Declared claim commands | 20/20 passed individually. |
| Unit/integration | `npm test`: 16/16 passed across four files. |
| Type check | `npm run typecheck`: passed. |
| Lint | `npm run lint --if-present`: completed; no lint script exists. |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities. |
| Exact production build | `npm run build`: passed and produced `dist/`. |
| Full browser/PWA suite | `npm run test:e2e -- --reporter=list`: 38/38 passed. |
| URL verifier | Local preview and live URL both passed desktop semantics and 390 px layout. |
| Live workflow verifier | `npm run test:polish-live -- https://photo-metadata-queue.sociobot.in`: passed. |
| Live artifact verifier | `npm run test:live -- https://photo-metadata-queue.sociobot.in/`: all 20 artifacts matched the build from `98b01d85…`; headers, SPA routes, and HTTP 404 passed. |

The production bundle contains 46,265 B JavaScript (15.62 kB gzip), 20,742 B CSS (5.32 kB gzip), no font payload, and a 32,228 B mobile hero. It meets the 200 kB JS, 50 kB CSS, 120 kB font, and 300 kB mobile-hero budgets.

## End-to-end, boundaries, and recovery

- The live demo edit/export flow downloaded `salt-marsh-bird-survey-metadata.csv` and `BIRDS_1842.xmp`; its only database was `demo:caption-queue`, and no license existed.
- The unfinished sample refused completion, announced “2 required items remain. Add a title,” and moved focus to the validation summary.
- An invalid CSV without a `filename` column reported “Add a filename column to the CSV.” A following valid CSV imported correctly.
- Exact 256-character titles and 2,000-character captions were accepted. Programmatically supplied 257- and 2,001-character values produced both specific length errors, focused the error summary, and succeeded after correction.
- XMP XML escaping, direct-folder sidecars, fallback downloads, CSV export, backup/restore across browser contexts, undecodable-photo import, 25-versus-26 free limits, controlled terms, tokens, and the paid 26-record path all passed in the claim/full suites.
- The brief's human success measure—half the prior metadata time with at least 95% accepted sidecars—still requires a photographer pilot. The product does not present it as a proven claim.

## Privacy, headers, caching, billing, and rate limiting

- A fresh live demo edit, CSV export, XMP export, invalid-record recovery, and storage inspection made four requests, all to `https://photo-metadata-queue.sociobot.in`. There were no analytics, trackers, remote fonts/scripts, uploads, AI calls, or license calls.
- A live invalid-license attempt made one bodyless `GET` to `https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify`, with `license` as its only query key, and displayed a useful invalid-token error.
- A fresh single-client burst received 30 accepted invalid-token responses. Request 31 returned HTTP 429 with `Retry-After: 3`; following requests remained 429. **Observed allowance: 30 accepted verification requests per rate-limit window.**
- Checkout returned HTTP 303 to hosted Dodo checkout. No payment provider is embedded in the app.
- Browser-observed live HTML headers include HSTS, same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, and a restrictive permissions policy.
- HTML, the manifest, and `sw.js` use `no-cache, no-store, must-revalidate`. The hashed JavaScript asset uses `public, max-age=31536000, immutable`. The manifest MIME is `application/manifest+json`.
- `/demo`, `/privacy`, and `/terms` return 200. An unknown path returns the designed HTTP 404.
- This is a static PWA without sign-in or a product backend. Entra, backend concurrency/health/persistence, and library/CLI consumer installation are not applicable.

## Accessibility, mobile, PWA, errors, and performance

- Live Axe scans on `/`, `/demo`, `/privacy`, `/terms`, and the designed 404 found zero serious or critical violations, including dark and reduced-motion mobile contexts.
- Primary routes have `lang=en`, one `<h1>`, one `<main>`, correct title metadata, no 390 px overflow, and no loss at 200% text size.
- Keyboard-only imports, queue movement, validation focus, mobile-drawer focus management, and Ctrl/Cmd+Enter passed. Visible focus uses a 3 px outline. Tested mobile controls meet the 44 px target contract.
- Reduced-motion styling collapses transitions. Normal live product routes produced no console or uncaught page errors.
- A service-worker-controlled live demo preserved its edit and displayed `Offline · work is saved` after an offline reload at 390 px. The same-URL service-worker update test passed, reloaded once under the new controller, removed the old cache, and kept the app usable.
- Lighthouse 12.8.2 mobile: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1,447 ms, LCP 1,591 ms, TBT 50 ms, CLS 0, Speed Index 1,447 ms, total transfer 139,654 B. Lab INP was unavailable; tested interactions responded immediately.

## Deployment identity evidence

The live site is not an unknown or broken deployment. It exactly matches the build from the available commit `98b01d85bea536ad9cf8ae98258a82c2418ec546`:

- `dist/index.html`: `917f1bc02f4442ed5410ce6cde80a5809b750c457cde00a2257c2ae3b5870e01`
- `dist/assets/index-BsKICQpR.js`: `e5b564828127343311207e956ea746a445130811c9099c2ff559ded229bca7a6`
- `dist/assets/index-R1LBD2e0.css`: `0978c6d48481c1e64a9510197dde30bfe5ea0c0faf7b115744596aeebcfc812d`
- `dist/sw.js`: `23cc6343186915bd2d19c399be93011f35754981481c7aefc53a4f85a175ad6b`

This proves the deployment identity of `98b01d85…`, not the nonexistent requested candidate `98b01d0d…`.

## Recommendation

Do not release candidate `98b01d0d50cb144d87e008865bd13a967205814f`. Correct or push the candidate commit, deploy that exact source, and repeat verification. If `98b01d85bea536ad9cf8ae98258a82c2418ec546` was the intended SHA, issue a corrected work order; the available build otherwise passed the full product QA matrix.
