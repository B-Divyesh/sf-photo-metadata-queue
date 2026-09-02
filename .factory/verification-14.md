# Independent verification 14 — PASS

- **Candidate:** `60f7ba60947b90a92cff8e50839ce233e878880a`
- **Live URL:** <https://photo-metadata-queue.sociobot.in/>
- **Verified:** 2026-09-02 UTC
- **Scope:** clean-clone independent product QA; no product code was modified

## Result

**PASS.** Every mandatory claim test passed independently, the cold first-read and one-click demo gates pass, the smallest useful metadata workflow works locally and live, and the deployed release is exactly this candidate. At the identity-check point, before committing this required report, local `HEAD`, public `origin/main`, local `dist/release.json`, and live `/release.json` all identified `60f7ba60947b90a92cff8e50839ce233e878880a`; all 21 deployed artifacts byte-matched the fresh production build. The later report commit changes only `.factory` documentation and is not part of the deployed candidate.

No critical, high, or medium product defect was found. One low-severity verifier-stability issue remains: the broad live verifier timed out once on an exact-pixel Forward-scroll assertion, then passed on rerun. Independent repetition restored the correct route, heading focus, and scroll position in five of five cycles, with one cycle settling 3 px from the originally recorded value.

## Mandatory claims gate

`.factory/claims.json` exists with 20 entries. After `npm ci`, every listed command was run separately before broader inspection. Each command selected one tagged Playwright test and passed.

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

**PASS on the live site.** A fresh 1440 × 900 context with service workers blocked showed:

- **What:** “Caption large shoots without changing originals,” followed by the folder/CSV-to-separate-XMP explanation.
- **Who:** “For photographers with large shoots.”
- **First action:** **Try it with sample data**, beside “Opens three edited sample records.”

At 390 × 844, the headline, audience sentence, action, outcome, and all three offline/privacy/price facts fit in the first viewport; the last fact ended at 791.83 px. One click opens `/demo`, immediately shows three realistic records, and displays **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for real**. Demo storage was `demo:caption-queue`; the real `caption-queue` database was absent from the fresh demo context. Fresh visual evidence was reproduced through the live verifier in `.factory/evidence-polish-2/`.

## Clean checkout and repository gates

| Check | Fresh result |
| --- | --- |
| Candidate identity | Initial `HEAD` and pre-report `origin/main` were the requested full SHA. |
| Install | `npm ci` installed 60 locked packages; audit reported 0 vulnerabilities. |
| Unit/integration | `npm test`: 18/18 passed across five files. |
| Type/lint | `npm run typecheck` passed; `npm run lint --if-present` completed with no configured lint script. |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities. |
| Production build | `npm run build` passed and produced `dist/` plus `dist/release.json`. |
| Local provenance | `npm run verify:release` passed for the full candidate SHA. |
| Full browser/PWA suite | `npm run test:e2e -- --reporter=list`: 38/38 passed. |
| URL verifier | `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed desktop semantics and 390 px layout. |
| Live workflow verifier | First run timed out at the exact Forward-scroll assertion; immediate rerun passed. |
| Live artifact verifier | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` matched 21 artifacts and passed release identity, headers, routes, and HTTP 404. |

The build contains 46,265 B JavaScript (15.62 kB gzip), 20,742 B CSS (5.32 kB gzip), no font payload, and a 32,228 B mobile hero. These meet the 200 kB JS, 50 kB CSS, 120 kB font, and 300 kB mobile-image budgets.

## End-to-end, boundaries, and recovery

- The live one-click demo opened three records with two ready and one intentionally unfinished.
- Trying to finish the incomplete record announced “2 required items remain. Add a title.” and focused the validation summary.
- Exact 256-character titles and 2,000-character captions were accepted. Programmatic 257- and 2,001-character inputs produced both specific shortening instructions, focused validation, and succeeded after correction.
- `Heron & <returning> "quoted"` exported as `BIRDS_1842.xmp`; the file parsed as XML and contained correctly escaped source.
- Metadata CSV contained one header plus three records.
- Malformed backup JSON produced a useful parse error and retained all three records.
- A CSV without `filename` reported “Add a filename column to the CSV.” and imported nothing. A following valid two-record CSV succeeded and preserved `Title, one`.
- The claim and full suites also proved undecodable-photo import, original-file hashes/names unchanged, direct-folder and fallback sidecars, 25-versus-26 free limits, tokens, controlled vocabulary, backup restore across browser contexts, free exports, paid 26-record import, saved shoots, and batch patterns.
- The brief's human success measure—half the photographer's prior time with at least 95% accepted sidecars—still requires a pilot and baseline. The product does not present it as proven.

## Privacy, billing, headers, links, and rate limiting

- A fresh live demo edit plus XMP and CSV export made four GET requests, all to `https://photo-metadata-queue.sociobot.in`; request bodies were empty. There were no analytics, trackers, third-party fonts/scripts, uploads, AI/model calls, or license calls in the free workflow.
- A pasted invalid license made one bodyless `GET` to `https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify`, with `license` as its only query key, and showed a useful inactive-license message.
- A fresh single-client burst received 30 accepted invalid-token responses. Request 31 returned HTTP `429`, `Retry-After: 4`, and `Access-Control-Allow-Origin: https://photo-metadata-queue.sociobot.in`. **Observed allowance: 30 accepted license-verification requests per rate-limit window.**
- The buy link returned HTTP `303` to hosted Dodo checkout. The application embeds no payment provider.
- Browser-observed HTML headers include HSTS, same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, COOP/CORP, and restrictive permissions policy.
- HTML, manifest, worker, and release marker use `no-cache, no-store, must-revalidate`. The hashed JavaScript and mobile hero use `public, max-age=31536000, immutable`. The manifest MIME is `application/manifest+json`.
- Home, demo, privacy, terms, source, and checkout links returned expected 200 or 303 responses. An unknown route returned the designed HTTP 404.
- This is a static PWA without sign-in or a product backend. Entra authority, backend concurrency/health/SQLite boundaries, and library/CLI consumer installation are not applicable.

## Accessibility, mobile, PWA, errors, and performance

- Fresh Axe scans on `/`, `/demo`, `/privacy`, `/terms`, and the designed 404 found zero serious or critical violations in a 390 px reduced-motion context.
- Primary routes have `lang=en`, one `<h1>`, one `<main>`, route-specific titles, and no horizontal overflow.
- At 200% text size the populated mobile demo remained 390 px wide with no content loss. All visible demo links, buttons, inputs, selects, and textareas met the 44 px target contract.
- Keyboard-only use reached and activated the visible import controls. The skip link focused the main heading, J/K moved through the queue, validation moved focus to its summary, and Ctrl+Enter saved and advanced. Focus rings computed to 3 px.
- Reduced-motion transitions computed to `0.00001s`. No looping or flashing animation was found.
- A live service-worker-controlled 390 px demo retained `QA14 offline edit` after an offline reload and visibly showed `Offline · work is saved`. The isolated same-URL worker-update test replaced the old cache, reloaded once under the new controller, and kept the app usable.
- Normal live routes and exercised workflows produced no console or uncaught page errors.
- Clean Lighthouse 12.8.2 mobile run: Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1,376 ms, LCP 1,652 ms, TBT 134 ms, CLS 0, Speed Index 1,376 ms, transfer 139,738 B. Lab INP was unavailable; tested interactions responded without visible delay.

## Deployment identity evidence

On the candidate checkout, before the required report commit, `npm run test:live` compared every deployed file with the fresh `dist/` and confirmed 21 exact matches. Key local hashes, which the verifier proved equal live, are:

- `dist/index.html`: `917f1bc02f4442ed5410ce6cde80a5809b750c457cde00a2257c2ae3b5870e01`
- `dist/assets/index-BsKICQpR.js`: `e5b564828127343311207e956ea746a445130811c9099c2ff559ded229bca7a6`
- `dist/assets/index-R1LBD2e0.css`: `0978c6d48481c1e64a9510197dde30bfe5ea0c0faf7b115744596aeebcfc812d`
- `dist/sw.js`: `23cc6343186915bd2d19c399be93011f35754981481c7aefc53a4f85a175ad6b`
- `dist/release.json`: `729886fd2f2d68500ef9fc1e86539a62a6fb18bd2577397f0495e7fdff727d25`

## Defects by severity

| Severity | Count | Finding |
| --- | ---: | --- |
| Critical | 0 | None. |
| High | 0 | None. |
| Medium | 0 | None. |
| Low | 1 | `test:polish-live` requires exact scroll-pixel equality and timed out once; the rerun passed, and five independent cycles restored route/focus with 0–3 px variance. This is verifier stability, not a reproduced user-facing failure. |

## Recommendation

Accept candidate `60f7ba60947b90a92cff8e50839ce233e878880a`. The previous deployment-provenance blocker is closed. Follow-up work is limited to relaxing the exact-pixel scroll assertion and running the photographer pilot needed to measure the brief's unclaimed time-saved outcome.
