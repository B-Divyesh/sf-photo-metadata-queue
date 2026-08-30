# Polish round 2 — cumulative finding closure

Candidate `a8ee7befd517bc9123d5b18d0cc6f937b4888694` was polished against review commit `f47cec09f436950b558d3423e900c9b0b273c900`. Repair implementation: `f50d5ef68312c9e60486992db21af7d39e4f68d1`. Deployment: `13a79133-8be7-4a80-9950-e39e8ef4d599` at <https://photo-metadata-queue.sociobot.in/>.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved manual per-history-entry scroll storage and delayed restoration with heading focus. | `mobile Back and Forward restore route scroll and focus`; live `test:polish-live` Back/Forward check at 390 px; `live-cold-mobile.png`. |
| F-1-2 | Preserved the `original-files-unchanged` claim and source-hash coverage for every XMP path. | `@claim:original-files-unchanged`; all clean-clone claim commands passed. |
| F-1-3 | Preserved the complete styled 404 shell, plain h1, route metadata, legal links, and real HTTP 404 response. | `designed 404 has route metadata...`; `npm run test:live`; `live-404-mobile.png`; live `/not-a-real-route`. |
| F-1-4 | Preserved the `no-generated-captions` boundary and network-negative test. | `@claim:no-generated-captions`; clean clone pass. |
| F-1-5 | Preserved correct singular and plural review status grammar. | `reviewed landing and demo copy uses plain photographer terms and correct grammar`; live `/demo`; `live-demo-mobile.png`. |
| F-1-6 | Preserved “Photo 1 of 3” instead of “Specimen.” | Same reviewed-copy test; live `/demo`; `live-demo-mobile.png`. |
| F-1-7 | Preserved “Required metadata” instead of “Validation ledger.” | Same reviewed-copy test; live `/demo`; `live-demo-mobile.png`. |
| F-1-8 | Preserved “Required metadata complete” instead of “Standards ready.” | Same reviewed-copy test; live `/demo`; `live-demo-mobile.png`. |
| F-1-9 | Preserved “Reusable terms” instead of “Field notes.” | Same reviewed-copy test; live `/demo`; `live-demo-mobile.png`. |
| F-1-10 | Preserved “XMP exports” instead of “Sidecar press.” | Same reviewed-copy test; live `/demo`; `live-demo-mobile.png`. |
| F-1-11 | Preserved “Export this shoot” and count-specific `.xmp` action wording. | Reviewed-copy test, `@claim:bulk-xmp`, and `@claim:direct-sidecar-write`; live `/demo`. |
| F-1-12 | Preserved removal of the decorative hero plate label and slogan while retaining useful alt text. | Reviewed-copy test asserts no `figcaption`; `live-cold-desktop.png`. |
| F-1-13 | Preserved the first-screen definition of separate XMP metadata files. | Reviewed-copy test; `live-cold-mobile.png`; live `/`. |
| F-1-14 | Preserved “photo library” instead of “DAM.” | Reviewed-copy test and `keeps reviewed README...`; live `/`. |
| F-1-15 | Preserved the plain export step: one `.xmp` file for each photo. | Reviewed-copy test; live `/`; `live-cold-desktop.png`. |
| F-1-16 | Preserved “separate `.xmp` metadata files” in the privacy boundary. | Reviewed-copy test and `@claim:xmp-export`; live `/`. |
| F-1-17 | Preserved the split README introduction that defines `.xmp` metadata files. | `keeps reviewed README and catalog wording plain and consistent`; `README.md`. |
| F-1-18 | Preserved “library or archive” in place of the unexplained DAM acronym. | Same README/catalog test; `README.md`. |
| F-1-19 | Preserved the plain “separate browser database” demo explanation; implementation namespace stays in demo docs. | README/catalog test and `@claim:demo-sandbox`; `.factory/demo.md`. |
| F-1-20 | Preserved “in this browser” instead of exposing IndexedDB in capability copy. | README/catalog test and `@claim:local-persistence`; `README.md`. |
| F-1-21 | Preserved result-first folder-writing wording instead of leading with an API name. | README/catalog test and `@claim:direct-sidecar-write`; `README.md`. |
| F-1-22 | Preserved the plain privacy result instead of “same-origin requests.” | README/catalog test and `@claim:local-privacy`; live request-origin check. |
| F-1-23 | Preserved separate, sub-22-word routing and 404 deployment sentences. | README/catalog test and `.factory/copy-audit.md`; live route/404 checks. |
| F-1-24 | Preserved “photo” for source media and “record” for queued items throughout product copy. | Reviewed-copy and README/catalog tests; live `/`, `/demo`, `/privacy`, `/terms`. |
| F-2-1 | Added the `free-core-exports` claim and an unlicensed real-workspace test that imports two records, writes both XMP files, downloads and inspects CSV, parses the JSON backup, and confirms no license exists. Copy now names those three tested exports exactly. | `@claim:free-core-exports`; clean-clone pass; live `test:polish-live` export replay; `live-cold-desktop.png`. |
| F-2-2 | Replaced “Portable IPTC ownership and place fields” with “Creator, copyright, and location fields.” Added positive and negative copy assertions. | `reviewed landing and demo copy uses plain photographer terms and correct grammar`; live `/demo`; `live-demo-mobile.png`. |

## Final evidence

- All 20 claim commands passed independently from fresh clone `/tmp/cq-polish2-clean-mSWcB0/repo`.
- Local gates: 16 unit tests, typecheck, production build, and 38 browser tests passed.
- Live artifact parity: all 20 deployment artifacts matched `dist/`.
- Live cold verification: landing, demo/reset, isolated real workspace, unlicensed exports, privacy traffic, offline reload, route metadata, focus/scroll, legal pages, styled 404, mobile overflow, and serious/critical Axe checks passed.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.4 s, TBT 0 ms, CLS 0.

All 26 findings are closed. No severity is deferred.
