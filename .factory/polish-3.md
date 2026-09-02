# Polish round 3 — cumulative finding closure

Candidate `4b6bd5c24abb730785f23f292c37be10ebb62096` was repaired against review commit `3555d94f9437b0b68be2ec8a01e139e8efce4f9f`. The implementation commit is `fe82d713af0cbdfdb8e24ed55759915654653f17`; the final release also contains this report, handoff evidence, and the stale-error cleanup found during visual review.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved manual history scroll storage, delayed restoration, route-heading focus, and announcements. | Test: `mobile Back and Forward restore route scroll and focus`; screenshot: `.factory/evidence-polish-3/live-cold-mobile.png`; live: `/ → /privacy → Back → Forward`. |
| F-1-2 | Preserved the source-hash claim across photo import and every XMP export path. | Test: `@claim:original-files-unchanged`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo` export panel states originals are never changed. |
| F-1-3 | Preserved the complete product-styled 404 shell, route metadata, legal links, and real HTTP 404. | Tests: `designed 404 has route metadata...` and `test:live`; screenshot: `.factory/evidence-polish-3/live-404-mobile.png`; live: `/not-a-real-route`. |
| F-1-4 | Preserved the no-generated-captions boundary and negative model-request assertion. | Test: `@claim:no-generated-captions`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-5 | Preserved singular/plural review status grammar. | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-6 | Preserved “Photo 1 of 3.” | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-7 | Preserved “Required metadata.” | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-8 | Preserved “Required metadata complete.” | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-9 | Preserved “Reusable terms.” | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-10 | Preserved “XMP exports.” | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-11 | Preserved “Export this shoot” and the record-specific XMP count. | Tests: reviewed copy, `@claim:bulk-xmp`, and `@claim:direct-sidecar-write`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-12 | Preserved removal of the decorative plate label and slogan while retaining useful alt text. | Reviewed-copy test; screenshot: `.factory/evidence-polish-3/live-cold-desktop.png`; live: `/`. |
| F-1-13 | Preserved the first-screen definition of separate XMP metadata files. | Test: `reviewed landing and demo copy...`; screenshots: `.factory/evidence-polish-3/live-cold-desktop.png` and `live-cold-mobile.png`; live: `/`. |
| F-1-14 | Preserved “photo library” instead of “DAM.” | Tests: `reviewed landing and demo copy...` and `keeps reviewed README...`; screenshot: `.factory/evidence-polish-3/live-cold-desktop.png`; live: `/`. |
| F-1-15 | Preserved the plain export step naming one `.xmp` file for each photo. | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-cold-desktop.png`; live: `/`. |
| F-1-16 | Preserved the plain privacy boundary defining separate `.xmp` metadata files. | Tests: `reviewed landing and demo copy...` and `@claim:xmp-export`; screenshot: `.factory/evidence-polish-3/live-cold-desktop.png`; live: `/`. |
| F-1-17 | Preserved the split README introduction that defines `.xmp` metadata files. | Test: `keeps reviewed README and catalog wording plain and consistent`; screenshot: `.factory/evidence-polish-3/live-cold-desktop.png`; live output terminology matches `/`. |
| F-1-18 | Preserved “library or archive” instead of “DAM” in the README. | Test: `keeps reviewed README and catalog wording plain and consistent`; screenshot: `.factory/evidence-polish-3/live-cold-desktop.png`; live terminology matches `/`. |
| F-1-19 | Preserved the plain separate-browser-database explanation and isolated demo namespace. | Tests: `keeps reviewed README...` and `@claim:demo-sandbox`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/?demo=1` redirects to `/demo`. |
| F-1-20 | Preserved “in this browser” instead of exposing IndexedDB in user copy. | Tests: `keeps reviewed README...` and `@claim:local-persistence`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-21 | Preserved result-first direct-folder wording. | Tests: `keeps reviewed README...` and `@claim:direct-sidecar-write`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-1-22 | Preserved plain privacy wording and same-origin request proof. | Tests: `keeps reviewed README...` and `@claim:local-privacy`; screenshot: `.factory/evidence-polish-3/live-demo-offline-mobile.png`; live request log at `/demo`. |
| F-1-23 | Preserved separate routing and 404 sentences under 22 words. | Tests: `keeps reviewed README...` and `designed 404...`; screenshot: `.factory/evidence-polish-3/live-404-mobile.png`; live: `/privacy`, `/terms`, and an unknown route. |
| F-1-24 | Preserved “photo” for source media and “record” for queued work. | Tests: `reviewed landing and demo copy...` and `keeps reviewed README...`; screenshots: `.factory/evidence-polish-3/live-cold-mobile.png` and `live-demo-mobile.png`; live: `/` and `/demo`. |
| F-2-1 | Preserved the declared unlicensed XMP, CSV, and JSON backup entitlement with real-workspace coverage. | Test: `@claim:free-core-exports`; screenshot: `.factory/evidence-polish-3/live-csv-schema-desktop.png`; live replay at `/?demo=1` in `test:polish-live`. |
| F-2-2 | Preserved “Creator, copyright, and location fields.” | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-demo-mobile.png`; live: `/demo`. |
| F-3-1 | Added `csv-import-schema` to `.factory/claims.json`. Its single tagged browser test enters through `/demo`, rejects a CSV without `filename`, then checks canonical and alias values for every documented field. The parser now uses the first populated documented alias, and a corrected import clears the earlier error. | Test: `@claim:csv-import-schema`; screenshot: `.factory/evidence-polish-3/live-csv-schema-desktop.png`; live replay: `/?demo=1` in `test:polish-live`. |
| F-3-2 | Expanded the single `metadata-tools` claim test to insert and exactly assert `{filename}`, padded `{sequence}`, `{shoot}`, and `{date}`. | Test: `@claim:metadata-tools`; screenshot: `.factory/evidence-polish-3/live-demo-tokens-mobile.png`; live: `/demo`. |
| F-3-3 | Replaced “Local & online” with “Online · data stays local,” retaining “Offline · work is saved.” | Test: `reviewed landing and demo copy...`; screenshot: `.factory/evidence-polish-3/live-cold-desktop.png`; live: `/`. |
| F-3-4 | Replaced merchant jargon with “Sociobot/Dodo handles payment and refunds. A refund cancels the license.” Updated the terms page to match. | Test: `pricing explains payment and refunds without merchant jargon`; screenshot: `.factory/evidence-polish-3/live-pricing-desktop.png`; live pricing dialog at `/` and `/terms`. |

## Final verification

- A fresh clone of final `origin/main` installed with zero vulnerabilities. Every one of the 21 exact `.factory/claims.json` commands passed separately.
- `npm test` passed 19 tests, `npm run typecheck` passed, `npm run build` produced `dist/`, and all 40 Playwright tests passed.
- Playwright Axe found no serious or critical violations across the landing, editor, dark theme, legal routes, and 404. Keyboard, focus, 44 px targets, 200% text, reduced motion, privacy traffic, offline reload, and PWA update behavior passed.
- Production JS is 46.31 kB raw / 15.63 kB gzip. Main CSS is 20.74 kB raw / 5.32 kB gzip. The mobile hero is 32.23 kB.
- Live Lighthouse 12.8.2 scored 100 Performance, 100 Accessibility, 100 Best Practices, and 100 SEO; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- `test:live`, `verify:url`, and `test:polish-live` passed against <https://photo-metadata-queue.sociobot.in/> after the final deployment.

All 30 cumulative findings are closed. No severity is deferred.
