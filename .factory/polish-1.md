# Polish round 1 — finding closure

Polished candidate `b93374b4de77c4786d899e28f6eec6b241f21aae` against adversarial review commit `d3467d4aa861c8770a022ec78d5d3ac2e4702ddf`. Implementation commit: `469df1d37ae35ff2f487745f0663a1312272ef53`. Deployment: `ac9bb780-b427-49ee-993f-b985b7d7fc85` at <https://photo-metadata-queue.sociobot.in/>.

No earlier `.factory/review-*.md` or `.factory/polish-*.md` existed. Every finding in `.factory/review-1.md` is closed below.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Set manual scroll restoration, store coordinates in each history entry, focus headings without scrolling, and restore after two animation frames. | Test: `mobile Back and Forward restore route scroll and focus`; screenshot: `.factory/evidence-polish-1/live-cold-mobile.png`; live: `/ → /privacy → Back → Forward` restored 0 and 280 px with h1 focus. |
| F-1-2 | Added the `original-files-unchanged` claim. Its test hashes source fixtures around import, single export, direct-folder export, and bulk download; every write target must end in `.xmp`. | Test: `@claim:original-files-unchanged`; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/demo` safety replay preserved both source hashes and names. |
| F-1-3 | Rebuilt `404.html` with the shared wordmark/navigation/footer, plain h1, Privacy/Terms links, description, canonical, Open Graph/Twitter metadata, skip link, mobile reflow, and designed focus. | Tests: `designed 404 has route metadata...`, `static deployment response policy`, and `npm run test:live`; screenshot: `.factory/evidence-polish-1/live-404-mobile.png`; live: `/not-a-real-route` returned HTTP 404 with the complete shell. |
| F-1-4 | Retained the useful boundary in plain words and added the `no-generated-captions` claim. The test imports empty records, waits, changes records, and rejects any model request. | Test: `@claim:no-generated-captions`; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: empty captions stayed empty and no model endpoint was requested. |
| F-1-5 | Added singular/plural branching: “1 record still needs review” and “2 records still need review.” | Test: `reviewed landing and demo copy uses plain photographer terms and correct grammar`; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/demo` showed the correct singular form. |
| F-1-6 | Replaced “Specimen 001 / 003” with “Photo 1 of 3.” | Same reviewed-copy test; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/demo` text is `PHOTO 1 OF 3`. |
| F-1-7 | Replaced “Validation ledger” with “Required metadata.” | Same reviewed-copy test; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/demo`. |
| F-1-8 | Replaced “Standards ready” with “Required metadata complete.” | Same reviewed-copy test; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/demo`. |
| F-1-9 | Replaced “Field notes” with “Reusable terms.” | Same reviewed-copy test; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/demo`. |
| F-1-10 | Replaced “Sidecar press” with “XMP exports.” | Same reviewed-copy test; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/demo`. |
| F-1-11 | Replaced “Write the set” with “Export this shoot” and changed the action to “Export N `.xmp` files.” | Same reviewed-copy test plus `@claim:bulk-xmp` and `@claim:direct-sidecar-write`; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/demo`. |
| F-1-12 | Removed the entire decorative hero caption, including “Plate 01” and its slogan, while retaining useful alt text and provenance. | Reviewed-copy test asserts no `figcaption`; screenshot: `.factory/evidence-polish-1/live-cold-mobile.png`; live: `/`. |
| F-1-13 | Rewrote the audience sentence to define the output as separate XMP metadata files. | Reviewed-copy test; screenshot: `.factory/evidence-polish-1/live-cold-mobile.png`; live: `/`. |
| F-1-14 | Replaced “DAM” with “photo library.” | Reviewed-copy test; screenshot: `.factory/evidence-polish-1/live-cold-mobile.png`; live: `/`. |
| F-1-15 | Rewrote the export step as “Review the metadata file and export one `.xmp` file for each photo.” | Reviewed-copy test; screenshot: `.factory/evidence-polish-1/live-cold-mobile.png`; live: `/`. |
| F-1-16 | Rewrote the privacy boundary as “It writes separate `.xmp` metadata files.” | Reviewed-copy test plus `@claim:xmp-export`; screenshot: `.factory/evidence-polish-1/live-cold-mobile.png`; live: `/`. |
| F-1-17 | Split the README introduction and define `.xmp` metadata files before later shorthand. | Test: `keeps reviewed README and catalog wording plain and consistent`; screenshot: `.factory/evidence-polish-1/live-cold-desktop.png`; live output terminology matches at `/`. |
| F-1-18 | Replaced the README's “DAM handoff” with “sending photos to a library or archive.” | Same README/catalog unit test; screenshot: `.factory/evidence-polish-1/live-cold-desktop.png`; live terminology matches at `/`. |
| F-1-19 | Described the demo as using a separate browser database; kept the exact namespace only in `.factory/demo.md`. | Same README/catalog unit test and `@claim:demo-sandbox`; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live: `/?demo=1`. |
| F-1-20 | Replaced the user-facing IndexedDB reference with “Save metadata in this browser.” | Same README/catalog unit test and `@claim:local-persistence`; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live persistence verified at `/demo`. |
| F-1-21 | Described direct folder writing by its result instead of leading with the browser API name. | Same README/catalog unit test and `@claim:direct-sidecar-write`; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live folder-write fixture at `/demo`. |
| F-1-22 | Replaced “same-origin requests” with “contacts only this site's own servers.” | Same README/catalog unit test and `@claim:local-privacy`; screenshot: `.factory/evidence-polish-1/live-demo-mobile.png`; live demo edit traffic stayed on the product origin. |
| F-1-23 | Split the 24-word deployment sentence into separate routing and 404 sentences. | Same README/catalog unit test and `.factory/copy-audit.md`; screenshot: `.factory/evidence-polish-1/live-404-mobile.png`; live routes and 404 passed `npm run test:live`. |
| F-1-24 | Standardized visible source-media copy on “photo” and queued items on “record,” including landing, editor, legal pages, batch placeholder, and README. | Reviewed-copy browser test plus README/catalog unit test; screenshots: `.factory/evidence-polish-1/live-cold-mobile.png` and `live-demo-mobile.png`; live: `/`, `/demo`, `/privacy`, `/terms`. |

## Verification

- Fresh clone `/tmp/caption-queue-polish-I2NZM9`: `npm ci`, 16 unit tests, typecheck, build, and 37 browser tests passed.
- Every exact `.factory/claims.json` command passed separately: 19/19, each selecting one tagged test.
- Built JS is 46,170 bytes raw / 15.65 kB gzip; CSS is 20,602 bytes raw / 5.29 kB gzip; mobile hero is 32,228 bytes.
- Local and live `verify:url` passed at desktop and 390 px. Playwright Axe found no serious or critical issue, including the 404.
- Live release verification byte-matched all 20 deployed artifacts and confirmed headers, known-route rewrites, caching, manifest MIME, and HTTP 404 behavior.
- Live Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- Cold live checks repeated first-screen fit, revised copy, history focus/scroll, `?demo=1`, reset, demo database, titles, legal routes, 404 metadata/shell, privacy traffic, source hashes, and caption non-generation.

All 24 findings are closed. No severity is deferred.
