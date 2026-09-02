# Polish round 4 — cumulative finding closure

Released candidate `f15de814481ccd27de2703a34ecc28602561a1af` was repaired against review commit `4fc137279c291ef178695a76cc9db564e9744040`. The functional repair is `e334a3a0e7d9bc0af471999beba2fba878206cdc`.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved manual per-history scroll storage, delayed restoration, and route-heading focus. | Test `mobile Back and Forward restore route scroll and focus`; screenshot `.factory/evidence-polish-4/live-cold-mobile.png`; live `/ → /privacy → Back → Forward`. |
| F-1-2 | Preserved the source-hash claim for import and every XMP export path. | Test `@claim:original-files-unchanged`; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-3 | Preserved the complete styled 404 shell, metadata, legal links, and HTTP 404 response. | Tests `designed 404 has route metadata...` and `test:live`; screenshot `.factory/evidence-polish-4/live-404-mobile.png`; live `/not-a-real-route`. |
| F-1-4 | Preserved the no-generated-captions boundary and negative model-request assertion. | Test `@claim:no-generated-captions`; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-5 | Preserved singular and plural review-status grammar. | Test `reviewed landing and demo copy...`; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-6 | Preserved “Photo 1 of 3.” | Test `reviewed landing and demo copy...`; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-7 | Preserved “Required metadata.” | Test `reviewed landing and demo copy...`; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-8 | Preserved “Required metadata complete.” | Test `reviewed landing and demo copy...`; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-9 | Preserved “Reusable terms.” | Test `reviewed landing and demo copy...`; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-10 | Preserved “XMP exports.” | Test `reviewed landing and demo copy...`; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-11 | Preserved “Export this shoot” and the exact record-specific XMP count. | Tests `@claim:bulk-xmp`, `@claim:direct-sidecar-write`, and reviewed copy; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-1-12 | Kept the decorative plate label and slogan removed while retaining useful alt text. | Reviewed-copy test; screenshot `.factory/evidence-polish-4/live-cold-desktop.png`; live `/`. |
| F-1-13 | Preserved the first-screen definition of separate XMP metadata files. | Reviewed-copy test; screenshot `.factory/evidence-polish-4/live-cold-mobile.png`; live `/`. |
| F-1-14 | Preserved “photo library” instead of “DAM.” | Reviewed-copy and README tests; screenshot `.factory/evidence-polish-4/live-cold-desktop.png`; live `/`. |
| F-1-15 | Preserved the export step naming one `.xmp` file per photo. | Reviewed-copy test; screenshot `.factory/evidence-polish-4/live-cold-desktop.png`; live `/`. |
| F-1-16 | Preserved the privacy boundary defining separate `.xmp` metadata files. | Reviewed-copy test and `@claim:xmp-export`; screenshot `.factory/evidence-polish-4/live-cold-desktop.png`; live `/`. |
| F-1-17 | Preserved the split README introduction that defines `.xmp` metadata files. | Unit test `keeps reviewed README and catalog wording plain and consistent`; live wording at `/`. |
| F-1-18 | Preserved “library or archive” instead of “DAM” in the README. | Same README/catalog unit test; live terminology at `/`. |
| F-1-19 | Preserved the plain separate-browser-database explanation and isolated namespace. | Tests `@claim:demo-sandbox` and README/catalog wording; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/?demo=1`. |
| F-1-20 | Preserved “in this browser” instead of exposing IndexedDB in user copy. | Tests `@claim:local-persistence` and README/catalog wording; live `/demo`. |
| F-1-21 | Preserved result-first direct-folder wording. | Test `@claim:direct-sidecar-write`; live `/demo`. |
| F-1-22 | Preserved plain privacy wording and same-origin request proof. | Test `@claim:local-privacy`; screenshot `.factory/evidence-polish-4/live-demo-offline-mobile.png`; live `/demo`. |
| F-1-23 | Preserved separate routing and 404 sentences below 22 words. | README/catalog test, copy audit, and `test:live`; screenshot `.factory/evidence-polish-4/live-404-mobile.png`; live legal and unknown routes. |
| F-1-24 | Preserved “photo” for source media and “record” for queued work. | Reviewed-copy and README tests; screenshots `.factory/evidence-polish-4/live-cold-mobile.png` and `live-demo-mobile.png`; live `/` and `/demo`. |
| F-2-1 | Preserved the declared unlicensed XMP, CSV, and JSON backup entitlement. | Test `@claim:free-core-exports`; screenshot `.factory/evidence-polish-4/live-csv-schema-desktop.png`; live demo-to-real export replay. |
| F-2-2 | Preserved “Creator, copyright, and location fields.” | Reviewed-copy test; screenshot `.factory/evidence-polish-4/live-demo-mobile.png`; live `/demo`. |
| F-3-1 | Preserved the declared CSV schema claim, missing-filename rejection, aliases, and complete mapping. | Test `@claim:csv-import-schema`; screenshot `.factory/evidence-polish-4/live-csv-schema-desktop.png`; live `/?demo=1` replay. |
| F-3-2 | Preserved exact assertions for `{filename}`, `{sequence}`, `{shoot}`, and `{date}`. | Test `@claim:metadata-tools`; screenshot `.factory/evidence-polish-4/live-demo-tokens-mobile.png`; live `/demo`. |
| F-3-3 | Preserved “Online · data stays local” and “Offline · work is saved.” | Reviewed-copy test; screenshots `.factory/evidence-polish-4/live-cold-desktop.png` and `live-demo-offline-mobile.png`; live `/`. |
| F-3-4 | Preserved plain payment and refund wording without merchant jargon. | Test `pricing explains payment and refunds without merchant jargon`; screenshot `.factory/evidence-polish-4/live-pricing-desktop.png`; live `/` pricing and `/terms`. |
| F-4-1 | Changed the demo wordmark to `/`, using the safe route transition that deletes only demo storage. Added local and live tests for the destination, focused landing h1, demo deletion, and preservation of a real-database sentinel. | Test `demo wordmark exits safely to home, focuses its heading, and deletes only demo data`; production verifier `verify-polish-4.mjs`; screenshots `.factory/evidence-polish-4/live-demo-wordmark-mobile.png` and `live-wordmark-home-mobile.png`; live `/demo → /`. |

## Final evidence

- A clean clone of pushed `origin/main` installed with zero vulnerabilities. All 21 exact `.factory/claims.json` commands passed separately, one tagged test each.
- Local gates passed: 19 unit tests, typecheck, production build, and 41 browser tests.
- Browser coverage passed for Axe, keyboard, visible focus, dialog/drawer focus, 44 px targets, 200% text, privacy traffic, offline demo and real reloads, and service-worker replacement.
- Production JS is 46.29 kB raw / 15.62 kB gzip. CSS is 20.74 kB raw / 5.32 kB gzip. The mobile hero remains 32.23 kB.
- Live artifact verification matched 21 deployed files. Titles, metadata, deep links, legal routes, CSP, cache policy, and the designed HTTP 404 passed.
- Live Lighthouse 12.8.2: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.
- The cold production inspection and screenshots show the product-specific herbarium desk identity unchanged.

All 31 cumulative findings are closed. No severity is deferred.
