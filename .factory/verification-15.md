# Independent verification 15 — PASS

- **Candidate:** `f15de814481ccd27de2703a34ecc28602561a1af`
- **Live URL:** <https://photo-metadata-queue.sociobot.in/>
- **Verified:** 2026-09-02 UTC
- **Scope:** independent clean-checkout product QA; no product code was modified

## Result

**PASS.** All 21 mandatory claim commands passed independently before the broader review. The cold first screen explains the job, audience, first action, and outcome in plain words. Its one-click sample opens an isolated, useful three-record queue. The local-first metadata workflow, input failures and recovery, XMP output, offline persistence, accessibility, mobile layout, privacy, paid-license boundary, build, and live deployment all satisfy the acceptance contract.

Before this required report commit, local `HEAD`, `origin/main`, `dist/release.json`, and live `/release.json` all identified the requested candidate. The live verifier byte-compared all 21 deployed artifacts with the fresh production build.

## Mandatory claims gate

`.factory/claims.json` exists and contains 21 entries. After `npm ci`, every listed `test` command was run separately. Every command selected one matching tagged Playwright test and passed.

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
| `csv-import-schema` | PASS |
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

Landing, editor, legal-page, and README promises were cross-checked against the manifest. No material unlisted claim was found.

## Cold first-read and demo gate

**PASS.** A new 1440 × 900 live browser context showed, without scrolling:

- **What:** “Caption large shoots without changing originals,” with the separate-XMP explanation.
- **Who:** “For photographers with large shoots.”
- **First action:** **Try it with sample data**, beside “Opens three edited sample records.”

At 390 × 844 the headline, audience sentence, sample action, action outcome, and three offline/privacy/price facts all fit in the first viewport; the final fact ended at 791.83 px. One click opened `/demo`, showed three realistic records, and exposed **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for real**. Screenshots are in `.factory/qa-15/`.

## Clean checkout and repository gates

| Check | Fresh result |
| --- | --- |
| Candidate identity | Initial `HEAD` and pre-report `origin/main` were the requested full SHA. |
| Install | `npm ci` installed 60 locked packages; no audit finding. |
| Claim commands | 21/21 passed when run separately. |
| Unit/integration | `npm test`: 19/19 passed across five files. |
| Type/lint | `npm run typecheck` passed; `npm run lint --if-present` found no configured lint script. |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities. |
| Production build | `npm run build` passed and produced `dist/` plus the full-SHA release marker. |
| Release provenance | `npm run verify:release` passed for the candidate SHA. |
| Browser/PWA suite | `npm run test:e2e -- --reporter=line`: 40/40 passed. |
| URL verifier | Desktop semantics and 390 px checks passed. |
| Live workflow verifier | Polish-round-three live verification passed. |
| Live artifact verifier | 21 artifacts matched the fresh build; routes, headers, and designed HTTP 404 passed. |

## Product workflow, boundaries, and recovery

- The live sample opened with three records, two ready and one intentionally unfinished.
- Trying to finish the incomplete record announced two missing required fields and focused the validation summary. Adding the title and caption marked it ready and announced success.
- XML-sensitive caption text (`&`, `<`, `>`, and quotes) exported as `BIRDS_1842.xmp`; the source was escaped and the claim test parsed it as XML.
- A malformed backup produced a specific JSON parse error without replacing the queue.
- A CSV without `filename` imported nothing and said to add that column. A following complete CSV succeeded, removed the stale error, and mapped canonical and alias headings.
- The 25-record free boundary succeeded and a 26-record import stopped with the Field-edition explanation.
- The suites also covered undecodable image previews, source-file hashes and names, single/direct-folder/fallback sidecars, all four caption tokens, controlled terms, CSV/JSON exports, cross-browser restore, paid batch patterns, and keyboard save/advance.
- The brief's pilot outcome—half the prior completion time and at least 95% accepted sidecars—still requires a real photographer and baseline. The product does not claim that outcome as proven.

## Privacy, licensing, headers, and links

- A fresh live landing-to-demo edit, validation, XMP export, and malformed-backup flow made four requests. All were same-origin GETs with no bodies. There were no analytics, trackers, third-party scripts/fonts, uploads, or model calls.
- The recorded license claim proved verification sends a bodyless GET whose only query value is the pasted token.
- A fresh single-client burst received 30 invalid-token responses. Request 31 returned `429`, `Retry-After: 4`, and `Access-Control-Allow-Origin: https://photo-metadata-queue.sociobot.in`. **Observed allowance: 30 accepted verification requests per rate-limit window.**
- The purchase URL returned `303` to hosted Dodo checkout. No payment provider is embedded in the app.
- HTML headers include HSTS, same-origin CSP, `frame-ancestors 'none'`, `object-src 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, COOP/CORP, and restrictive permissions policy.
- HTML, the manifest, the worker, and the release marker revalidate. Hashed JavaScript/CSS use `public, max-age=31536000, immutable`. The manifest MIME is `application/manifest+json`.
- Home, demo, privacy, terms, and source returned 200. Checkout returned 303. An unknown route returned the designed HTTP 404.
- This is a static PWA with no sign-in or product backend. Entra authority, server concurrency/health/SQLite, and package-consumer checks do not apply.

## Accessibility, mobile, PWA, and performance

- Fresh Axe scans of `/`, `/demo`, `/privacy`, `/terms`, and the 404 found zero serious or critical violations at 390 px. Fresh dark-theme scans of every real route found no Axe violations at any severity.
- Every checked route has `lang=en`, one `<h1>`, one `<main>`, a route title, and no horizontal overflow.
- At 200% text size the full suite found no route overflow. Mobile touch-target tests passed.
- The skip link showed a 3 px focus ring and moved the next Tab stop into main content. The sample link and visible import buttons each showed a 3 px ring; the import controls measured 358 × 44 px. J/K, Previous/Next, Ctrl/Cmd+Enter, dialog/drawer focus, and validation focus all passed.
- Reduced-motion transitions computed to 0.01 ms. No flashing or looping animation was found.
- A live controlled worker retained `QA15 offline persistence` through an offline reload and showed `Offline · work is saved`. Cache `caption-queue-v5` was active, installability errors were empty, and the clean same-URL update test reloaded once under the replacement worker while keeping the app usable.
- Valid live routes and exercised workflows produced no console or page errors.
- Production JavaScript is 46,307 B raw / 15,590 B gzip; CSS is 20,742 B raw / 5,339 B gzip; there is no font payload; the mobile hero is 32,228 B.
- Fresh Lighthouse 12.8.2 mobile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1,160 ms, LCP 1,390 ms, TBT 0 ms, CLS 0, transfer 139,678 B. The report is `.factory/qa-15/lighthouse.json`.

## Defects by severity

| Severity | Count | Finding |
| --- | ---: | --- |
| Critical | 0 | None. |
| High | 0 | None. |
| Medium | 0 | None. |
| Low | 0 | None. |

## Recommendation

Accept candidate `f15de814481ccd27de2703a34ecc28602561a1af`. No release blocker or product defect was reproduced. The only remaining product-measurement step is the unclaimed photographer pilot described in the researched brief.
