# Independent verification 11 — FAIL

- **Candidate:** `a9c7cbfa060a96713f535d48715065cb938ba76b`
- **Live URL:** <https://photo-metadata-queue.sociobot.in/>
- **Verified:** 2026-08-29 UTC
- **Scope:** clean-checkout independent product QA; product code was not modified

## Result

**FAIL.** The candidate and live deployment are otherwise strong: all 19 mandatory claim tests, the cold first-read gate, the complete local build/test suite, the core 100-record workflow, privacy boundaries, accessibility scans, billing allowance, offline reload, service-worker update, and performance budgets pass. The live deployment byte-matches the candidate.

Release acceptance is blocked by one reproducible mobile PWA defect. At 390 px, the app hides its only online/offline status. An offline reload works and preserves the queue, but the user receives no visible offline feedback. This fails the attached mobile and offline-state contract.

## Blocking defect

### Medium — the offline state is hidden on mobile

Fresh live reproduction in Chromium 1.58.2:

1. Open `/demo` at 390 × 844 and wait for service-worker control.
2. Edit the current title, set the browser context offline, and reload.
3. The workbench and edit reload successfully; `navigator.onLine` is `false`.
4. `#connection` contains `Offline · work is saved`, but it is not visible and its computed `display` is `none`.

The cause is the responsive rule in `src/styles.css`: at widths up to 820 px, `.connection, .nav-privacy { display: none; }`. There is no other visible mobile offline state. The same run proved the saved edit survived, `<main>` remained usable, and the service-worker update prompt/refresh path worked without console or page errors.

This is material because offline use is a primary product promise and the PWA/design acceptance contract requires offline state to be first-class on mobile. Keep a compact offline status visible below 820 px, then add a 390 px regression that asserts visibility after a real offline reload. Evidence: [`verification-evidence-11/mobile-offline-hidden.png`](verification-evidence-11/mobile-offline-hidden.png).

## Mandatory claims gate

`.factory/claims.json` exists and contains 19 entries. After `npm ci`, every listed `test` command was run separately from the candidate checkout. Each selected one tagged Playwright test and passed:

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

Per-claim output is in [`verification-evidence-11/claims/`](verification-evidence-11/claims/). Landing, legal-page, and README promises were cross-checked against the manifest; no material unlisted claim was found.

## Mandatory cold first-read gate

**PASS.** A new live context with no storage answers all three questions in plain words:

- **What:** “Caption large shoots without changing originals,” followed by the folder/CSV and XMP explanation.
- **Who:** “For photographers with large shoots.”
- **First action:** **Try it with sample data**, beside “Opens three edited sample records.”

The action opens `/demo` in one click with three realistic records, the persistent demo banner, **Reset demo**, and **Start for real**. At 390 × 844, the headline, audience sentence, action, explanation, and all three facts are visible in the first viewport; the facts end at y=791.83 px. Evidence: [`live-first-read-desktop.png`](verification-evidence-11/live-first-read-desktop.png) and [`live-first-read-mobile.png`](verification-evidence-11/live-first-read-mobile.png).

## Clean checkout and quality gates

| Check | Fresh result |
| --- | --- |
| Candidate identity | Initial `HEAD` was exactly `a9c7cbfa060a96713f535d48715065cb938ba76b`; worktree was clean. |
| Install | `npm ci` installed 60 locked packages; 0 vulnerabilities. |
| Unit/integration | `npm test`: 16/16 tests passed in four files. |
| Type/lint | `npm run typecheck` passed. `npm run lint --if-present` completed; no lint script exists. |
| Dependency audit | `npm audit --audit-level=high` found 0 vulnerabilities. |
| Production build | `npm run build` passed and produced `dist/index.html`. |
| Full browser/PWA suite | `npm run test:e2e -- --reporter=list`: 37/37 passed. |
| URL verifier | `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed desktop semantics and 390 px layout. |
| Live artifact | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` matched all 20 artifacts and passed response policy, SPA routes, and HTTP 404 checks. |

Fresh production sizes are 46,170 B JavaScript (15.65 kB gzip), 20,602 B CSS (5.29 kB gzip), no font payload, and a 32,228 B mobile hero. They are inside the 200 KB JS, 50 KB CSS, 120 KB font, and 300 KB hero budgets.

## Independent workflow and recovery evidence

- The live demo opened three “Salt marsh bird survey” records in only `demo:caption-queue`; the real database was absent.
- The unfinished record refused completion, announced “2 required items remain. Add a title,” and moved focus to the validation summary.
- Exact 256-character title and 2,000-character caption boundaries were accepted. Values of 257 and 2,001 characters produced both specific validation errors and recovered after correction.
- `Heron & <returning> "quoted"` exported as `BIRDS_1842.xmp`, with XML-sensitive text escaped; the result parsed as XML.
- The corrected title survived a reload. J/K moved between records. The 3-record CSV and backup/direct/fallback sidecar paths passed the claim suite.
- Malformed JSON produced an error and left the current three-record queue intact.
- A CSV without `filename` produced “Add a filename column to the CSV.” A later quoted CSV preserved a comma in its title and a newline in its caption.
- Fresh isolated workspaces proved the free boundary: 26 records were rejected and exactly 25 were accepted.
- A recorded valid license verdict exercised the researched 100-record scale: import rendered in 208 ms, the title pattern produced `Catalog 001 — FRAME_001`, CSV export contained 101 rows, and direct-folder writing produced 100 valid XMP files from `FRAME_001.xmp` through `FRAME_100.xmp`.
- The human success measure—half the photographer's prior time with at least 95% accepted sidecars—still needs a pilot and baseline. The product does not claim that result as proven.

## Privacy, billing, headers, and links

- The complete free demo edit/export flow requested only `https://photo-metadata-queue.sociobot.in`. No analytics, trackers, remote fonts/scripts, photo uploads, AI/model calls, or license calls occurred.
- A live invalid-license attempt sent one bodyless `GET` with only the `license` query value to the documented Sociobot endpoint, displayed a useful rejection, and kept Field edition locked.
- A bounded single-client live burst received 30 accepted invalid-token responses. Request 31 returned HTTP `429` with `Retry-After: 3` and CORS for the product origin. **Observed allowance: 30 accepted requests per rate-limit window.**
- Checkout returned HTTP `303` to hosted Dodo checkout. No payment provider is embedded in the app.
- Live HTML sends HSTS, same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, COOP/CORP, and restrictive permissions policy.
- HTML, manifest, and `sw.js` use `no-cache, no-store, must-revalidate`; hashed JavaScript and CSS use one-year immutable caching. The manifest MIME is `application/manifest+json`.
- All rendered internal, legal, source, and checkout links returned their expected 200 or 303 response. An unknown path returned the designed HTTP 404.
- The product has no sign-in or product backend, so Entra authority, backend concurrency/health, and remote persistence checks are not applicable.

## Accessibility, mobile, PWA, and performance

- Fresh dark/reduced-motion Axe scans at 390 × 844 found zero serious/critical findings on `/`, `/demo`, `/privacy`, `/terms`, and the designed 404. Normal app routes had zero console/page errors.
- Every tested route had `lang=en`, one `<h1>`, one `<main>`, route metadata, and no horizontal overflow.
- All visible mobile links/buttons were at least 44 × 44 px. The populated demo reflowed at 200% text with `scrollWidth=390`.
- The skip link received a visible 3 px focus ring. Keyboard focus reached the sample action; J/K moved the queue; the mobile queue and license dialog returned focus to their openers.
- Reduced motion was active and computed transition/animation durations were `1e-05s`.
- Offline reload preserved the edited queue, and a same-URL service-worker update reached waiting state, showed **An update is ready**, refreshed once, and retained a usable `<main>`. The missing visible mobile offline status is the blocker described above.
- Lighthouse 12.8.2 live mobile: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1,341 ms, LCP 1,516 ms, TBT 58 ms, CLS 0, Speed Index 1,432 ms, transfer 139,639 B. Lab INP was unavailable; tested interactions gave immediate feedback.

## Deployment identity

The live deployment is this candidate, not a stale or missing deployment. All 20 deployable artifacts matched the fresh `dist` byte-for-byte.

- `dist/index.html`: `6c0c061c2a1ee391dc7d27a658fd2671af4fac998736208c2be54ca4041d7321`
- `dist/assets/index-BtbOnIRR.js`: `9c3a8410bdf74b30b0d5bfa94255daa98230c3a96c6c1b6c142f706ac90f6bad`
- `dist/assets/index-CP7PjjS0.css`: `4b659223205c212d56a2d76dde21f9ca29a3fb47bfe5fea0bbb800500f7bba50`
- `dist/sw.js`: `23cc6343186915bd2d19c399be93011f35754981481c7aefc53a4f85a175ad6b`

## Defects by severity

| Severity | Count | Finding |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 0 | None |
| Medium | 1 | Mobile hides the only offline-state status. |
| Low | 0 | None |

## Required next step

Keep an offline status visible in the 390 px workbench, add a real offline-reload visibility regression, redeploy, and repeat independent verification.
