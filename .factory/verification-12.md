# Independent verification 12 — PASS

- **Candidate:** `a8ee7befd517bc9123d5b18d0cc6f937b4888694`
- **Live URL:** <https://photo-metadata-queue.sociobot.in/>
- **Verified:** 2026-08-30 UTC
- **Scope:** clean-checkout independent product QA; product code was not modified

## Result

**PASS.** The live deployment byte-matches the candidate. Every mandatory claim test passed independently, the cold first-read and one-click demo gates pass, and the complete local and live product workflow meets the researched brief. The previous mobile offline-state blocker is fixed: at 390 px an offline reload preserves the edit and visibly renders `Offline · work is saved`.

One low-severity test-stability observation remains. The first complete 37-test browser run timed out once in the transient mobile toast test because `#batch-title` was hidden after opening Batch edit. The same test then passed three isolated repetitions, a second complete 37/37 run, and ten more isolated repetitions. No equivalent product failure reproduced in the live or local workflow. No claim test failed, so this does not block acceptance, but the test should be watched for recurrence.

## Mandatory claims gate

`.factory/claims.json` exists and contains 19 entries. After `npm ci`, every listed command was run separately from the candidate checkout and selected exactly one tagged Playwright test.

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

Landing, legal-page, and README promises were cross-checked against this manifest. No material unlisted claim was found.

## Cold first-read and demo gate

**PASS.** A new live context with no storage answers all three required questions in the first viewport:

- **What:** “Caption large shoots without changing originals,” followed by the folder/CSV and separate-XMP explanation.
- **Who:** “For photographers with large shoots.”
- **First action:** **Try it with sample data**, beside “Opens three edited sample records.”

At 390 × 844, the headline, audience sentence, action, explanation, and all three privacy/offline/price facts are visible; the fact list ends at 791.83 px. One click opens `/demo` with three realistic records and the persistent **Demo — sample data, nothing is saved**, **Reset demo**, and **Start for real** controls. Evidence: [`verification-artifacts/live-cold-desktop.png`](verification-artifacts/live-cold-desktop.png), [`verification-artifacts/live-cold-mobile.png`](verification-artifacts/live-cold-mobile.png), and [`verification-artifacts/live-demo-after-one-click.png`](verification-artifacts/live-demo-after-one-click.png).

## Clean checkout and repository gates

| Check | Fresh result |
| --- | --- |
| Candidate identity | Initial `HEAD` was exactly `a8ee7befd517bc9123d5b18d0cc6f937b4888694`. |
| Install | `npm ci` installed 60 locked packages; 0 vulnerabilities. |
| Unit/integration | `npm test`: 16/16 passed across four files. |
| Type/lint | `npm run typecheck` passed. `npm run lint --if-present` completed; no lint script exists. |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities. |
| Production build | `npm run build` passed and produced `dist/index.html`. |
| Browser/PWA suite | First run: 36/37 passed with one timeout. Immediate full rerun: 37/37 passed. The case then passed 13/13 isolated repetitions. |
| URL verifier | `npm run verify:url -- https://photo-metadata-queue.sociobot.in` passed desktop semantics and 390 px layout. |
| Live identity | `npm run test:live` matched all 20 deployable artifacts and passed headers, SPA routes, and designed HTTP 404 checks. |

The production build is 46,245 B JavaScript (15,617 B gzip), 20,742 B CSS (5,339 B gzip), no font payload, and a 32,228 B mobile hero. These are comfortably inside the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## End-to-end workflow, boundaries, and recovery

- The live demo used only the `demo:caption-queue` IndexedDB database; the real workspace database was absent.
- The unfinished sample refused completion, announced “2 required items remain. Add a title,” and moved focus to the validation summary.
- Exact 256-character title and 2,000-character caption boundaries were accepted. Injected 257- and 2,001-character values produced both specific validation errors and recovered after correction.
- `Heron & <returning> "quoted"` exported as `BIRDS_1844.xmp` with XML-sensitive characters escaped and a valid XMP/RDF structure. The edit survived reload.
- Metadata CSV export contained one header and three sample rows. Malformed JSON reported a parse error and left all three records intact.
- A CSV without `filename` reported “Add a filename column to the CSV.” A following valid CSV imported two records and preserved a quoted comma in `Title, one`.
- The claim suite proved the free boundary: exactly 25 records import and 26 are rejected. It also proved backup restore, cross-browser restore, direct-folder and fallback sidecar paths, undecodable photo import, token/vocabulary behavior, and keyboard save/advance.
- A recorded fresh paid verdict exercised the researched 100-record scale against the live app. Import took 129 ms, `Catalog {sequence} — {filename}` rendered `Catalog 001 — FRAME_001`, CSV contained 101 rows, and direct-folder writing created 100 valid files from `FRAME_001.xmp` through `FRAME_100.xmp`.
- The brief's human outcome—half the photographer's prior time with at least 95% accepted sidecars—still needs a pilot and baseline. The product does not present it as a proven claim.

## Privacy, paid unlock, headers, and links

- The full live free demo edit/export/reload flow requested only `https://photo-metadata-queue.sociobot.in`. There were no analytics, trackers, remote fonts/scripts, photo uploads, AI/model calls, or licensing calls.
- A live invalid-license attempt sent one bodyless `GET` with only the `license` query key to the Sociobot verification endpoint. It displayed “That license is not active. Check the token and try again.”
- A fresh bounded burst from one client received 30 accepted invalid-token responses. Request 31 returned HTTP `429`, `Retry-After: 4`, and the product-origin CORS header. **Observed allowance: 30 accepted requests per rate-limit window.**
- Checkout returned HTTP `303` to hosted Dodo checkout. The application embeds no payment provider.
- Live HTML sends HSTS, same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, COOP/CORP, and restrictive permissions policy.
- HTML, manifest, and `sw.js` revalidate with `no-cache, no-store, must-revalidate`; hashed assets use one-year immutable caching. The manifest MIME is `application/manifest+json`.
- All rendered home, demo, privacy, terms, source, and checkout links returned expected 200 or 303 responses. An unknown path returned the designed HTTP 404.
- This is a static PWA without sign-in or a product backend. Entra authority, backend concurrency/health, and remote persistence checks are not applicable. Library/CLI packaging checks are also not applicable.

## Accessibility, mobile, PWA, and performance

- Independent dark/reduced-motion Axe scans at 390 × 844 found zero serious/critical findings on `/`, `/demo`, `/privacy`, and `/terms`; the suite's designed-404 Axe check also passed.
- Every primary route had `lang=en`, one `<h1>`, one `<main>`, route-specific metadata, and no horizontal overflow. The populated demo reflowed at 200% text with `scrollWidth=390`.
- The skip link received a visible 3 px focus ring. Keyboard import, queue movement, validation focus, mobile drawer focus management, and Ctrl/Cmd+Enter behavior passed. All visible mobile links/buttons and transient actions met the 44 px target contract on successful runs.
- Reduced-motion styles computed to `0.00001s`; there is no looping or flashing motion.
- After a real service-worker-controlled mobile reload offline, the saved title remained, the workbench stayed usable, and the offline status rendered as `display:flex`, 139.02 × 14 px. Evidence: [`verification-artifacts/live-mobile-offline.png`](verification-artifacts/live-mobile-offline.png).
- A same-URL service-worker update reached waiting state, showed **An update is ready**, changed controller once, reloaded once, removed the old cache, and kept the app usable.
- Live pages and workflows produced no console or uncaught page errors.
- Lighthouse 13.4.1 mobile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1,121 ms, LCP 1,523 ms, TBT 47 ms, CLS 0, Speed Index 1,474 ms, transfer 139,692 B. Lab INP was unavailable; tested actions gave immediate feedback.

## Deployment identity

The live release is this candidate, not a stale or missing deployment. All 20 deployable files matched the fresh `dist` byte-for-byte.

- `dist/index.html`: `174bb248adc7f324ba494ca467e9151f08f70a02bfdcd863b8a721f22e10c7b5`
- `dist/assets/index-alud-cB5.js`: `b248727f944b23846eea5c9926f50222a5b744efabb4ff56ff781eb608453e5b`
- `dist/assets/index-R1LBD2e0.css`: `0978c6d48481c1e64a9510197dde30bfe5ea0c0faf7b115744596aeebcfc812d`
- `dist/sw.js`: `23cc6343186915bd2d19c399be93011f35754981481c7aefc53a4f85a175ad6b`

## Defects by severity

| Severity | Count | Finding |
| --- | ---: | --- |
| Critical | 0 | None. |
| High | 0 | None. |
| Medium | 0 | None. |
| Low | 1 | One non-reproducing timeout in the first full browser run; the same case passed the complete rerun and 13 isolated repetitions. |

## Recommendation

Accept candidate `a8ee7befd517bc9123d5b18d0cc6f937b4888694`. Monitor the mobile toast test for recurrence and run a photographer pilot to measure the brief's unclaimed time-saved outcome.
