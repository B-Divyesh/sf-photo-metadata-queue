# Caption Queue — build handoff

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
npm install
npm test
npm run build
npm run test:e2e
```

Static output is `dist/`; `dist/index.html` is present at its root. The hosting layer should route extensionless paths such as `/privacy` and `/terms` to that file.

Verification on 2026-08-28:

- `npm test`: 8 unit tests passed (CSV edge cases, XMP escaping/validation, sidecar naming, token rendering).
- `npm run build`: passed with TypeScript strict checks; initial application assets are 36.7 KB JS and 17.8 KB CSS uncompressed (13.0 KB and 4.8 KB gzip).
- `npm run test:e2e`: 3 Playwright tests passed on Chromium 1.58.2, covering CSV → edit → validate → XMP download, light/dark axe scans, single-h1 semantics, console errors, and persisted 390 px offline reload.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Lighthouse 13 mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 2.0 s, FCP 0.9 s, CLS 0, total blocking time 0 ms.
- Generated hero derivatives: 71 KB desktop WebP and 32 KB mobile WebP. Source and generation prompt are under `assets/src/`; provenance is in `.factory/design.md`.

## Known gaps and next steps

- Bulk direct-to-folder writing uses Chromium's File System Access API. Firefox and Safari receive standards-valid individual browser downloads instead; browsers may request permission for multiple downloads.
- Browser-only apps cannot decode every proprietary RAW format. Unsupported previews show a clear file tile while metadata editing and XMP output remain available.
- The factory must register and smoke-test the production billing product/return URL. No product ID or payment-provider secret is embedded here.
- INP has no lab value in Lighthouse; total blocking time was 0 ms. Collect field INP after deployment if the factory operates privacy-respecting aggregate performance monitoring.
