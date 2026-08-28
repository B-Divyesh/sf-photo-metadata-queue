# Caption Queue — build handoff

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
