# Independent verification 7 — FAIL

**Date:** 2026-08-29 UTC

**Candidate:** `7a816f38c160310d32fdd5b9df45654fa66586a9`

**Live URL:** <https://photo-metadata-queue.sociobot.in/>

**Scope:** claims, clean install/build, live identity, core workflows, invalid and boundary input, privacy, accessibility, desktop/mobile, PWA, headers/caching, endpoint limits, and performance.

## Verdict

**FAIL — do not release this candidate.** The live site is deployed and byte-for-byte matches the candidate, so this is not the previously reported deployment-only failure. All 17 declared claim tests pass after the required clean install, and the product's core local workflow works. Release is blocked by a reproducible failure in the repository's default browser-test command and two explicit mobile accessibility contract failures.

## Release-blocking defects

### Major — the documented default browser suite fails reproducibly

`npm run test:e2e` failed on both full-suite runs: 26 tests passed and `installed shell announces a waiting service-worker update` timed out after 30 seconds waiting for `navigator.serviceWorker.controller`.

- The same test passes when run alone.
- `npm run test:e2e -- --workers=1` passes all 27 tests.
- Independent live checks prove that offline reload, the update prompt, and applying the waiting worker work.

This isolates the defect to parallel test setup/state rather than the deployed PWA, but the exact quality-gate command in `README.md` is still red and nondeterministic. Evidence: `evidence-7/e2e.log`, `evidence-7/e2e-rerun.log`, `evidence-7/sw-update-retry.log`, and `evidence-7/e2e-workers-1.log`.

### Major — 200% text sizing causes horizontal overflow

At a 390 × 844 viewport, setting the root text size to 200% produces horizontal page overflow on every primary route:

| Route | Document width | Overflow |
| --- | ---: | ---: |
| `/` | 492 px | 102 px |
| `/demo` | 609 px | 219 px |
| `/privacy` | 492 px | 102 px |
| `/terms` | 492 px | 102 px |

The landing header and footer extend beyond the viewport; the demo is worse. This fails the attached accessibility baseline that text resize to 200% must not lose content or require two-dimensional scrolling. Evidence: `evidence-7/text-resize-all-routes.log`, `evidence-7/mobile-zoom-overflow.log`, and `evidence-7/live-mobile-text-200.png`.

### Major — multiple mobile touch targets are below 44 × 44 CSS pixels

Fresh 390 px measurements found undersized interactive targets on every route, including:

- Header wordmark: 144.8 × 30 px.
- Header **Demo** link: 39.4 × 44 px.
- Footer **Demo**: 38 × 15 px; **Privacy**: 46.3 × 15 px; **Terms**: 37.7 × 15 px; **Source**: 44 × 15 px.
- The landing-page **Read the privacy details** link is 193.8 × 19 px.

Primary workflow buttons meet the target size, but the product contract requires all touch targets to be at least 44 × 44 px. Evidence: `evidence-7/mobile-touch-targets.log`.

## Lower-severity findings

### Low — validation-summary focus call has no effect

Submitting the unfinished sample announces “2 required items remain. Add a title.” in a live status message, and recovery works. However, `markReadyAndMove()` calls `.focus()` on `.validation`, which is not focusable. Focus remains on **Mark ready & next** instead of moving to the intended summary. Evidence: `evidence-7/core-live-clean.log`.

### Low — the browser cannot read the API's four-second retry allowance

The real license endpoint returned `429` with `Retry-After: 4`, but did not expose that header through CORS. The live app therefore used its 60-second fallback and told the user to wait 60 seconds. It correctly remained locked. This is safe but needlessly delays recovery and does not reflect the server's actual allowance. Evidence: `evidence-7/license-429-headers.log`, `evidence-7/license-429-cors-headers.log`, and `evidence-7/live-license-429-ui.log`.

## Mandatory first gates

### Claims — PASS after clean install

`.factory/claims.json` exists with 17 entries. After `npm ci`, every listed command was run separately and every uniquely tagged test passed. A combined `npm run test:claims` also passed 17/17. Evidence: `evidence-7/exact-claim-commands.log` and `evidence-7/claims-after-install.log`.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `offline-reload` | PASS |
| `local-privacy` | PASS |
| `xmp-export` | PASS |
| `photo-import` | PASS |
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

Each claim id occurs exactly once in the browser tests. Landing/README promises are represented by the claims manifest. No unlisted material product claim was found.

### Cold first-read — PASS

The untouched live first screen answers the required questions in plain words:

- **What:** “Caption large shoots without changing originals,” with a folder/CSV-to-XMP explanation.
- **Who:** “For photographers with large shoots.”
- **First click:** **Try it with sample data**, immediately followed by “Opens three edited sample records.”

The action opens `/demo` in one click. The persistent demo banner says sample data is used, and includes **Reset demo** and **Start for real**. At 390 × 844, the headline, audience sentence, action, explanation, and all three fact lines end by y=755.64 px. Evidence: `evidence-7/live-cold-desktop.png`, `evidence-7/live-cold-mobile.png`, and `evidence-7/mobile-first-screen-and-zoom.log`.

## Clean checkout and build

| Check | Result |
| --- | --- |
| Candidate identity | PASS — HEAD exactly `7a816f38c160310d32fdd5b9df45654fa66586a9` before verification changes |
| Install | PASS — `npm ci`, 60 packages, 0 vulnerabilities |
| Unit/integration | PASS — `npm test`, 14/14 tests in 4 files |
| Type checking | PASS — `npm run typecheck` |
| Lint | Not available; no lint script is defined |
| Production build | PASS — `npm run build`, `dist/` produced |
| Default browser suite | **FAIL twice** — 26/27; service-worker controller timeout |
| Serial browser suite | PASS — 27/27 with `--workers=1` |
| URL verifier | PASS locally and against live desktop/390 px |
| Live release verifier | PASS — 20 deployable artifacts and response policies match |

Production output is 45,310 B JavaScript (15.42 kB gzip) and 20,046 B CSS (5.22 kB gzip). There are no font files. The desktop/mobile hero files are 72,452 B and 32,228 B. All are below the stated static-product budgets.

## Independent product workflow

- Live `/demo` opens three realistic salt-marsh records in `demo:caption-queue`; no real database is read.
- An unfinished record reports both required fields. Exact 256-character title and 2,000-character caption boundaries save, and recovery reaches 3/3 ready.
- `Heron & <returning>` exports as escaped XMP and parses without an XML error.
- Metadata CSV contains one header plus three records.
- A damaged JSON backup reports a parse error and retains the existing workspace.
- CSVs without a filename column or with an empty filename are rejected. A quoted comma and embedded newline import correctly afterward.
- A fresh free workspace rejects 26 records and accepts exactly 25.
- Claim tests also cover image-folder import, token/vocabulary edits, backup restore across browser contexts, direct and fallback sidecar writes, paid batch patterns with a recorded valid verdict, persistence, and keyboard save/navigation.
- The brief's human success measure—100 photos in less than half prior time with 95% accepted sidecars—still needs a photographer pilot and baseline; it is not claimed as proven.

Evidence: `evidence-7/core-live-clean.log`, `evidence-7/input-boundaries-clean.log`, and the claim output.

## Privacy, licensing, and endpoint behavior

- A complete live demo edit/export flow requested only `https://photo-metadata-queue.sociobot.in`, created only `demo:caption-queue`, stored no license, and logged no console/page error.
- Source/build inspection found no analytics, tracking, remote fonts, third-party scripts, raw AI keys, or image upload path.
- License verification is a GET to the Sociobot product endpoint with only the encoded `license` query value and no body.
- Fresh real endpoint test: requests 1–30 returned `200` invalid verdicts; request 31 returned `429` with `Retry-After: 4`. Observed allowance: **30 accepted requests per rate-limit window**.
- A real browser request during the 429 remained on **View pricing**, showed no active Field edition state, and cached no valid verdict. The repaired gate fails closed.
- Checkout returns `303` to the hosted Dodo checkout; no payment provider is embedded.
- The product has no sign-in, so Microsoft Entra authority validation is not applicable.

## Accessibility, mobile, PWA, and response policy

- Axe found zero serious/critical findings on `/`, `/demo`, `/privacy`, and `/terms` across desktop/mobile and light/dark treatments.
- Every checked route has `lang=en`, a route-specific title, exactly one `h1`, one `main`, no normal-size horizontal overflow, and no console/page errors.
- Keyboard checks passed for the skip link, sample action, J/K queue movement, and the mobile queue drawer; focus outlines are 3 px with at least 4.51:1 contrast on light surfaces.
- Reduced motion yields 0.00001-second transitions/animations.
- The designed 404 returns HTTP 404, has one `h1` and `main`, offers home/demo routes, and has zero serious/critical Axe findings.
- Live offline reload retained an edited demo title. A query-version worker produced the update prompt; **Refresh** activated the new controller.
- HTML, manifest, and service worker revalidate. Hashed JS/CSS/images return one-year immutable caching.
- Security headers include same-origin CSP defaults, `frame-ancestors 'none'`, HSTS, `nosniff`, DENY framing, strict referrer policy, COOP/CORP, and restrictive permissions policy.
- All discovered internal/source links return 200; the purchase link returns the expected 303.

## Performance

Lighthouse 12.8.2 live mobile: Performance 96, Accessibility 100, Best Practices 100, SEO 100; FCP 1.3 s, LCP 1.5 s, CLS 0, TBT 220 ms, Speed Index 1.3 s, total transfer 136 KiB. Lighthouse did not provide field INP; direct interactions completed without observable delay.

## Deployment identity

`npm run test:live` passed. All 20 deployable files match the fresh production build byte-for-byte. Key hashes:

- `index.html`: `eb2372b6cc0173955a088d07fd9bc592299826030fb0c248c094ab10d07347de`
- `assets/index-DMq9IRqJ.js`: `f93d040c5866a2cb412a9e3953cc8de99714b57cffd90972cbbf69e944a755a5`
- `sw.js`: `3d2d6e9c20c10ea8f3d4df23f9479e7e25dfc0ef6af0d292936143aab96fbafd`

The live deployment therefore matches candidate `7a816f38c160310d32fdd5b9df45654fa66586a9`; deployment is not the reason for this FAIL.

## Required next steps

1. Make the default parallel `npm run test:e2e` deterministic; isolate service-worker registration/state or configure the documented suite for one worker.
2. Reflow the header, demo workbench, and footer at 200% text sizing on a 390 px viewport without horizontal overflow.
3. Give every actionable header/footer/content target a 44 × 44 px touch area.
4. Make the validation summary focusable before focusing it, or move focus to the first invalid field.
5. Expose `Retry-After` from the licensing API through CORS, or align the client fallback copy with the enforced delay.
6. Re-run independent verification against the repaired commit and deployment.
