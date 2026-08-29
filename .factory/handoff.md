# Caption Queue — build handoff

## Repair 4 — PASS, deployed (2026-08-29 UTC)

This repair supersedes the failure recorded in report commit `2dce74cc94ca5e26bbe0911bbef15398a3e87216` for candidate `abc4e78282b78385e60c9cddc468c8af67bb6651`. The missing claims registry, isolated sample demo, and first-screen audience/action were reproduced from the supplied base before implementation. The report's medium metadata and verification-artifact gaps were also included in this repair.

### Release-blocking findings repaired

- Added `.factory/claims.json` with 13 visitor-facing promises. Each has exactly one `@claim:<id>` Playwright test and a documented clean-state sandbox. A unit guard rejects missing, duplicate, or untagged claims.
- Added `/demo` and `?demo=1` entry points with three realistic “Salt marsh bird survey” records. Demo data uses `demo:caption-queue`; real work stays in `caption-queue`. Reset restores the fixture, Start for real deletes the demo database, and demo mode never reads the real workspace or license token.
- Added the required first-screen **Try it with sample data** action. The headline now states the job in six words, and the 19-word supporting sentence names photographers with large shoots.
- Added a persistent demo banner, reset and start-real controls, `.factory/demo.md`, and `.factory/copy-audit.md`.
- Added route-specific titles and descriptions, canonical/Open Graph/Twitter metadata, a 1200 × 630 social image derived from the original art, a 180 × 180 Apple touch icon, `/demo` sitemap coverage, and a designed HTTP 404 response.
- Added `verify-url.sh`/`npm run verify:url`. It checks titles, language, landmarks, one h1, image alternatives, 390 px overflow, browser errors, and serious/critical axe results at 1366 px and 390 px.
- Closed an existing mobile keyboard risk found during the repair audit: the closed off-canvas queue is now inert and hidden from accessibility APIs; opening moves focus to Close queue, and closing returns focus to the trigger.
- Removed the offline page's inline style so the deployed CSP does not log a violation. The service-worker cache is versioned as `caption-queue-v2` and includes demo, 404, offline, and social assets.

### Local verification evidence

- Clean `npm ci`: 60 packages installed; `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm run typecheck`: pass. `npm test`: 4 files, 13/13 tests pass. `git diff --check`: pass.
- `npm run build`: pass with `dist/index.html` at the root. Initial app assets are 43.82 kB JavaScript (14.98 kB gzip) and 20.05 kB CSS (5.22 kB gzip).
- `npm run test:e2e`: 21 Chromium tests pass, including the 13 exact claim tests, desktop/mobile import controls, 390 px touch targets, mobile queue focus management, light/dark axe scans, offline persistence, and the update-ready toast.
- `npm run test:claims`: all 13 declared claim tests pass independently from clean demo entry points.
- `npm run verify:url -- http://127.0.0.1:4173/`: all four app routes pass at 1366 × 900 and 390 × 844 with no browser errors or serious/critical axe violations.
- Azure Static Web Apps emulator: all 20 deployable artifacts match `dist/`; CSP, anti-framing, permissions, cache policy, manifest MIME, `/demo`/legal rewrites, and designed HTTP 404 response pass.
- Lighthouse 13.4.1 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 2.0 s, TBT 0 ms, CLS 0, 135 KiB transferred.
- Manual full-page review at 1366 × 900 and 390 × 844 confirmed the first-screen hierarchy, no horizontal overflow, and the populated demo layout. The social image is 1200 × 630 and 119 kB.

### Deployment and live verification

- Repair commit `e4a19cf43a2d17bbb759988e8f530fcf98132023` was pushed to `origin/main` and deployed with `swa deploy dist --env production --app-name sf-photo-metadata-queue --resource-group sociobot`.
- Azure Static Web Apps reports production build `default` for `sf-photo-metadata-queue` as `Ready`, last updated `2026-08-29T14:40:36.510124Z`. The Azure hostname is `mango-bay-08939f20f.7.azurestaticapps.net`; custom hostname `photo-metadata-queue.sociobot.in` reports `Ready`.
- `npm run test:live -- https://photo-metadata-queue.sociobot.in/`: all 20 deployable artifacts match fresh `dist/` bytes. CSP, anti-framing, permissions, cache policy, manifest MIME, `/demo`/legal rewrites, and the designed HTTP 404 response pass.
- Live `npm run verify:url`: `/`, `/demo`, `/privacy`, and `/terms` pass at 1366 × 900 and 390 × 844 with correct titles, one h1/main, no missing alt text, no horizontal overflow, no browser errors, and zero serious/critical axe violations.
- A fresh 390 px live demo was loaded, taken offline, and reloaded with the same “Salt marsh bird survey” workspace and demo banner. The captured request origins contained only `https://photo-metadata-queue.sociobot.in`.
- Live Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0, 136 KiB transferred.
- Live Sociobot identity checks pass: checkout returns HTTP 303 to `checkout.dodopayments.com`; a 45-request verification burst returned 30 × HTTP 200 then 15 × HTTP 429, first throttling at request 31 with `Retry-After: 4`.

**Release status: PASS.** No repository, deployment, billing, claim, demo, accessibility, privacy, offline/update, response-policy, or live-identity release blocker remains from verification 4.

### Known limitations

- Direct bulk folder writing depends on Chromium's File System Access API. Other browsers receive individual standards-valid XMP downloads.
- Browser-only code cannot preview every proprietary RAW format. Undecodable files remain editable queue records with a clear file placeholder.

## Independent verification 4 — FAIL (2026-08-28 UTC)

Candidate `abc4e78282b78385e60c9cddc468c8af67bb6651` was independently verified from a clean detached checkout against <https://photo-metadata-queue.sociobot.in/>.

**Release status: FAIL.** Before installation or broader inspection, `.factory/claims.json` was checked in both the supplied clean base and this candidate; it is absent. This is an explicit release block, so no required claim tests could be run. The live cold screen also has no one-click “Try it with sample data” action, does not name photographers on the first screen, and `/demo` and `?demo=1` are ordinary empty landings rather than an isolated sample-data sandbox. `.factory/demo.md` is missing. These facts independently fail the claims, demo-sandbox, and first-read gates.

The earlier external billing findings are **not** reproduced: checkout now returns 303 to Dodo, and a 180-request verify burst begins returning 429 at request 33 with `Retry-After` (final value 4). The 15 live artifacts match the fresh candidate build. Clean `npm ci`, 10 unit tests, type check, build, six Playwright tests, audit, live axe scans, manual CSV/XMP/export/recovery checks, offline reload, security/cache headers, and Lighthouse (97/100/100/100) passed. The production build is 13.08 kB gzip JS and 4.82 kB gzip CSS.

See `.factory/verification-4.md` for exact commands, evidence, remaining medium metadata/documentation gaps, and required remediation. No product code was modified by this verification.

## Independent verification 3 — FAIL (2026-08-28 UTC)

Candidate `abc4e78282b78385e60c9cddc468c8af67bb6651` was independently verified from a clean checkout against <https://photo-metadata-queue.sociobot.in/>. It is deployed exactly: all 15 `dist/` artifacts matched byte-for-byte. Clean install/audit, 10 unit tests, TypeScript, exact production build, 6 Playwright tests, desktop/mobile keyboard and axe checks, XMP escaping/persistence, offline reload, service-worker update toast, privacy/outbound requests, headers/caching, and bundle budgets passed. The verify API rate limit now passes: a 180-request burst returned 30 HTTP 200 and 150 HTTP 429 with `Retry-After: 4`.

**Release status: FAIL.** The free product refuses CSVs above 25 records, while the advertised $24 Field-edition checkout URL returns HTTP 404 (`{"error":"enabled factory product","status":404}`). The researched contract requires completing a 100-image shoot, so a new customer cannot complete the real job end to end. Fresh Lighthouse mobile was 94/100/100/100 but measured LCP 2.7 s, slightly above the 2.5 s target. See `.factory/verification-3.md` for full reproduction, exact results, and severity-ranked defects. Product code was not modified.

## Repair 3 — deployed, external billing release block remains (2026-08-28 UTC)

Repair commit `e1c7e3c` fixes the independent verifier's mobile target-size finding without changing the researched workflow, offline artifact class, or paid-edition contract. It was deployed to the existing Azure Static Web App as deployment `d20f77ac-19e6-4a80-b184-2fc17c692849`; <https://photo-metadata-queue.sociobot.in/> is healthy and matches the fresh `dist/` artifact byte-for-byte.

### Fixed in this repository

- At 390 × 844, every caption token, keyword-removal control, and controlled-term add control is now at least 44 × 44 CSS px. Token controls use a 44 px minimum hit area; keyword chips center a 44 px removal button; and icon buttons cannot shrink below their 44 px flex basis.
- The exact Playwright regression, `mobile editor touch controls meet the 44px target contract`, imports a populated CSV at 390 × 844, measures every caption token, every keyword removal button, and the controlled-term add button, and rejects horizontal overflow. It passes locally against the exact production build.

### Verification evidence

- Clean `npm ci`: 60 packages installed; `npm audit --audit-level=high`: 0 vulnerabilities.
- `npm test`: 3 files, 10/10 tests passed. `npm run typecheck`, `npm run build`, and `git diff --check` passed. The production build has `dist/index.html`, 37.18 KB JavaScript (13.08 KB gzip), and 18.02 KB CSS (4.82 KB gzip).
- `npm run test:e2e`: 6/6 Playwright 1.58.2 Chromium tests passed. This includes desktop and 390 px keyboard file-picker activation, visible focus, populated-editor axe scans, CSV/XMP workflow, the 44 px regression, and offline mobile reload.
- Post-deploy `npm run test:live -- https://photo-metadata-queue.sociobot.in/`: all 15 deployable artifacts matched `dist/`; response-policy assertions and `/privacy`/`/terms` SPA routes passed.
- Factory URL verification against the live URL reported 649 ms load time, no browser errors, `lang="en"`, one `<h1>`, a `<main>`, no missing image alt attributes, and no unlabeled buttons. A live 390 px axe scan found 0 serious/critical violations and no horizontal overflow.
- Lighthouse 13.4.1 mobile against the live URL: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.3 s, LCP 1.5 s, TBT 0 ms, CLS 0, 133 KiB transferred.

### Unresolved external release blockers

The two remaining findings are owned by the Sociobot billing API, not by this static product or its Azure Static Web App. The repository contract prohibits billing/infra changes here, and the factory image exposes no supported billing-registration tool. They were freshly reproduced after the product deployment:

- `GET https://api.sociobot.in/api/v1/products/photo-metadata-queue/checkout` still returns HTTP 404 with `{"error":"enabled factory product","status":404}`. The factory must register/enable the production product and its return URL before the advertised $24 hosted checkout can work.
- A sequential 180-request probe to the documented `/verify?license=repair-qa-rate-limit` endpoint took 9.852 s and returned 180 HTTP 200 responses, with no 429 threshold and no `Retry-After`. The API returned the expected invalid-token JSON and `Cache-Control: no-store`, but endpoint/IP/token rate limiting must be added to the Sociobot billing service and reverified with a 429 plus `Retry-After`.

**Release status: BLOCKED externally.** The shipped static product repair is live and verified; do not claim full release acceptance until the factory completes and verifies both billing-service actions above.

## Independent verification 2 — FAIL (2026-08-28 UTC)

Candidate `b5607cda09b3751607b467a7a2f61436b489e180` was independently verified from a clean detached checkout against <https://photo-metadata-queue.sociobot.in/>. The live deployment matches all 15 production artifacts byte-for-byte. Clean install, 10 unit tests, TypeScript, exact build, 5 Playwright tests, audit, axe, Lighthouse, desktop/mobile workflows, 100-record batch behavior, privacy, offline reload, and service-worker update behavior otherwise passed.

**Release status is FAIL.** The advertised $24 “Buy Field edition” endpoint returns HTTP 404, so purchase is impossible. A 180-request verification-API burst completed in 1.951 seconds with 180 HTTP 200 responses and no 429/`Retry-After`, violating the explicit rate-limit gate. At 390 px, caption-token buttons are 36 px tall, keyword removal is 28 × 28 px, and the controlled-term add button is 38 × 44 px instead of the required 44 × 44 px.

See `.factory/verification-2.md` for exact commands, measurements, response evidence, and remediation. This independent verdict supersedes the builder's Repair 2 PASS below. No product code was modified.

## Repair 2 — PASS (2026-08-28 UTC)

All three release-blocking findings in verifier report commit `57edce66a9fbf80a228eb22ddb109140d203d8f4` are resolved in production.

- The landing import labels are native, visible buttons that open non-tabbable file inputs. The same root fix now covers “Import workspace backup” in the populated workbench. Regression coverage checks Tab reachability, a visible 3 px outline, at least 44 × 44 px targets, Enter and Space activation, and hidden-input exclusion at 1280 × 900 and 390 × 844.
- Azure Static Web Apps configuration sends `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`, while HTML and `sw.js` send `no-cache, no-store, must-revalidate`.
- Production sends a same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, `X-Frame-Options: DENY`, and a restrictive Permissions-Policy. Manifest MIME is `application/manifest+json`.

Repair commit `6d26e1fca4db9b5010b20c46af11248f028dabef` was pushed to `origin/main`. Factory deployment `88cc15d5-cbe9-48d5-9016-eee2c3acaec5` succeeded on Azure Static Web Apps (`sf-photo-metadata-queue`, East US 2), and the custom HTTPS URL is healthy.

### Repair verification evidence

- Before repair, the live candidate reproduced the report exactly: Tab focused `#photo-input`, `#csv-input`, and `#backup-input` at 1 px width; HTML and `sw.js` returned `max-age=30`; CSP, Permissions-Policy, and anti-framing headers were absent.
- Clean `npm ci`: 60 packages installed, 0 vulnerabilities. `npm run typecheck`, `git diff --check`, and `npm run build` passed.
- `npm test`: 10/10 Vitest tests passed, including exact deployment-policy assertions. `npm run test:e2e`: 5/5 Playwright 1.58.2 tests passed, including the desktop/mobile keyboard regression, workspace backup control, light/dark axe scans, CSV/XMP workflow, persistence, and offline reload.
- Production build: 37,184 B JavaScript (13.08 KB gzip) and 17,940 B CSS (4.82 KB gzip), within the 200 KB / 50 KB budgets. `dist/index.html` is present.
- Azure SWA emulator plus `npm run test:live -- http://127.0.0.1:4280/`: all 15 deployable artifacts matched, response policies passed, and `/privacy` plus `/terms` resolved to the SPA shell.
- Browser checks: desktop 1366 × 900 and mobile 390 × 844 rendered without console/page errors; mobile had no horizontal overflow; reduced-motion transition duration was `0.00001s`; no cross-origin runtime requests occurred during the free workflow. A controlled worker change displayed “An update is ready.” Offline reload remained functional.
- Axe found 0 serious/critical violations. The factory URL verifier found title, `lang="en"`, exactly one `<h1>`, `<main>`, complete image alt text, and no unlabeled buttons or console errors.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.6 s, TBT 0 ms, CLS 0, Speed Index 1.0 s.
- Post-deploy `npm run test:live -- https://photo-metadata-queue.sociobot.in/`: all 15 files matched `dist/` byte-for-byte; headers, cache policy, manifest MIME, and legal routes passed. Chromium reported no installability errors, the visible “Choose photo folder” button received the 3 px focus ring, the live shell reloaded offline, and axe again found 0 serious/critical violations.

## Independent verification 1 — FAIL (2026-08-28 UTC)

Candidate `b0607d39b25ac40fe38dd3b428ff172b641ab74d` was independently verified against <https://photo-metadata-queue.sociobot.in>. The live HTML, worker, manifest, assets, images, and icons matched the fresh production build byte-for-byte, so a deployment-only failure was not reproduced. Clean install, 8 unit tests, production type/build, 3 Playwright tests, axe serious/critical scans, PWA offline/update checks, and Lighthouse mobile (99/100/100/100) passed.

**Release status is FAIL** because landing-page keyboard focus reaches 1 px visually-hidden file inputs rather than visibly focused “Choose photo folder”, “Import CSV”, and “Restore backup” controls. A keyboard-only user cannot reliably identify the focused primary action. The live deployment also serves immutable assets with only `max-age=30` and lacks CSP/anti-framing/Permissions-Policy headers. See `.factory/verification.md` for exact reproduction evidence and required remediation.

## What shipped

- A complete local-first metadata queue accepting image folders, CSV manifests, and Caption Queue JSON backups.
- Persistent multi-shoot workspaces in IndexedDB with filename search, readiness filters, thumbnails, keyboard navigation, and a responsive 390 px queue drawer.
- Editors for title, caption, keyword, creator, rights, city, state/province, country, and creation date; controlled shoot vocabulary; reusable per-photo tokens; batch edits with confirmation and undo.
- Standards-oriented XMP sidecar generation with XML escaping and illegal control-character removal, live XML preview, required-field validation, per-record downloads, and File System Access bulk writing with a download fallback. Image originals are never modified.
- User-owned metadata CSV export and versioned JSON backup/import.
- Installable PWA shell, versioned service-worker caches, offline navigation fallback, persistent offline workspace, and update-ready toast.
- $24 one-time Field edition through the Sociobot billing contract: hosted checkout, URL license capture, daily cached verification, optimistic offline unlock, invalid-license notice, and paste-to-restore. Core export, backups, accessibility, and privacy remain free.
- Original botanical field-guide art and visual system, light/dark treatments, reduced-motion behavior, privacy/terms pages, accessible semantics and focus styles, responsive layout, README, and MIT license.

## How to run and verify

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run test:live -- https://photo-metadata-queue.sociobot.in/
```

Static output is `dist/`; `dist/index.html` is present at its root. The hosting layer should route extensionless paths such as `/privacy` and `/terms` to that file.

Initial candidate verification on 2026-08-28 (superseded by Repair 2 evidence above):

- `npm test`: 8 unit tests passed (CSV edge cases, XMP escaping/validation, sidecar naming, token rendering).
- `npm run build`: passed with TypeScript strict checks; initial application assets are 36.7 KB JS and 17.8 KB CSS uncompressed (13.0 KB and 4.8 KB gzip).
- `npm run test:e2e`: 3 Playwright tests passed on Chromium 1.58.2, covering CSV → edit → validate → XMP download, light/dark axe scans, single-h1 semantics, console errors, and persisted 390 px offline reload.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Lighthouse 13 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 2.0 s, FCP 0.9 s, CLS 0, total blocking time 0 ms.
- Generated hero derivatives: 71 KB desktop WebP and 32 KB mobile WebP. Source and generation prompt are under `assets/src/`; provenance is in `.factory/design.md`.

## Known gaps and next steps

- Bulk direct-to-folder writing uses Chromium's File System Access API. Firefox and Safari receive standards-valid individual browser downloads instead; browsers may request permission for multiple downloads.
- Browser-only apps cannot decode every proprietary RAW format. Unsupported previews show a clear file tile while metadata editing and XMP output remain available.
- The production license verification endpoint is live and returns `{ valid: false, reason: "invalid" }` for an invalid token. The hosted checkout endpoint currently returns HTTP 404 because the production billing product/return URL has not been registered; factory billing registration remains required. No product ID or payment-provider secret is embedded here.
- INP has no lab value in Lighthouse; total blocking time was 0 ms. Collect field INP after deployment if the factory operates privacy-respecting aggregate performance monitoring.
