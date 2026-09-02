# Adversarial first-read review 4 — Caption Queue

Reviewed 2026-09-02 UTC against <https://photo-metadata-queue.sociobot.in/> and repository commit `14c72659ae899c60cc3c84793bc9a4acc4cd1d73`. The deployed product files identify commit `f15de814481ccd27de2703a34ecc28602561a1af`; the only changes between that commit and the reviewed repository head are prior verification documents and screenshots.

## Verdict: FAIL

The first screen, one-click demo, sandbox, all 21 declared claims, copy, accessibility, metadata, links, and earlier finding fixes pass. One blocking routing finding remains. Under the required zero-finding rule, the product does not pass.

## First screen, before scrolling

### 390 × 844 phone

- What it does, in my words: it turns a folder or CSV from a large photo shoot into a metadata queue and exports separate XMP files without changing the photos.
- For whom: photographers processing large shoots.
- What I should click first: **Try it with sample data**. The adjacent text says it opens three edited sample records.
- Result: pass. The headline, audience sentence, primary action, result, privacy/offline/price facts, and real import choices are visible without scrolling.

### 1440 × 900 desktop

- What it does, for whom, and what to click first are equally clear.
- Result: pass. The same copy and the product-specific field-desk image are visible before scrolling.

The exact orienting text is “Caption large shoots without changing originals,” “For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files,” and “Try it with sample data.” Neither viewport produced horizontal overflow, a console error, or a page error.

## Findings

### F-4-1 — BLOCKING — The demo wordmark does not link home

- Exact quote/location: `/demo`, header link “Caption Queue.” Its live `href` is `/demo`, and `src/main.ts:77` sets the brand destination to `${demoMode ? '/demo' : '/'}`.
- Evidence: opening `/demo` directly and activating the wordmark leaves both the URL and h1 on `/demo` / “Salt marsh bird survey.” The demo has no Home link. The same wordmark correctly points to `/` on the other app routes and on the static 404.
- Why this fails: the required shared header contract says the wordmark leads home. A first-time visitor who opens the demo directly cannot use the standard site control to return to the landing page. This is broken routing, which the work order classifies as blocking.
- Concrete fix: make the demo wordmark navigate to `/` through the existing route transition. That transition must discard `demo:caption-queue`, load the untouched real namespace, and show the landing page when the real workspace is empty. Add a browser test that opens `/demo` directly, clicks “Caption Queue,” asserts `/`, checks focus on the landing h1, and confirms demo data was discarded without changing seeded real data.

## Copy audit — landing page

Counts treat numbers, abbreviations, paths, and hyphenated terms as one word. The audit includes the visible shell, headings, controls, image alternative, and the pricing dialog reachable from the landing page. No item exceeds 22 words, uses a banned marketing adjective, changes an established term, or needs a rewrite.

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Caption Queue | 2 | Pass; wordmark copy, with routing defect F-4-1 only on `/demo` |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Online · data stays local | 4 | Pass |
| Change color theme | 3 | Pass |
| View pricing | 2 | Pass |
| Local photo metadata queue | 4 | Pass |
| Caption large shoots without changing originals | 6 | Pass |
| For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files. | 20 | Pass |
| Try it with sample data | 5 | Pass |
| Opens three edited sample records. | 5 | Pass |
| Choose photo folder | 3 | Pass |
| Import CSV | 2 | Pass |
| Restore backup | 2 | Pass |
| Runs offline after the first visit. | 6 | Pass |
| Photos and metadata stay on this device. | 7 | Pass |
| Free for 25 records per shoot. | 6 | Pass |
| Field edition costs $24 once. | 5 | Pass |
| A blank herbarium sheet with a fern, archival sleeves, and an empty contact sheet arranged on a wooden worktable | 19 | Pass; image alternative |
| How it works | 3 | Pass |
| Move one photo at a time | 6 | Pass |
| Keep one shoot in view. | 5 | Pass |
| Reuse its terms, check every record, then export metadata files for your photo library. | 14 | Pass |
| Gather | 1 | Pass |
| Start from a photo folder or a CSV file. | 9 | Pass |
| Annotate | 1 | Pass |
| Move photo by photo with shared terms and caption tokens. | 10 | Pass |
| Export | 1 | Pass |
| Review the metadata file and export one `.xmp` file for each photo. | 12 | Pass |
| Privacy and limits | 3 | Pass |
| Your files stay under your control | 6 | Pass |
| Caption Queue stores the workspace in this browser. | 8 | Pass |
| It sends nothing during the free metadata workflow. | 8 | Pass |
| It writes separate `.xmp` metadata files. | 6 | Pass |
| It does not change photo files or generate captions. | 9 | Pass |
| Read the privacy details | 4 | Pass |
| One-time license | 2 | Pass |
| Use the free queue or remove its limit | 8 | Pass |
| $24 once | 2 | Pass |
| Field edition removes the 25-record import limit, adds saved shoots, and enables batch edit patterns. | 15 | Pass |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 | Pass |
| View Field edition | 3 | Pass |
| Photo metadata stays on this device during the free workflow. | 10 | Pass |
| Terms | 1 | Pass |
| Source | 1 | Pass |
| Caption Queue v1.0.0 · Built by Param Factory · Field-desk image generated for this product. | 15 | Pass |

### Pricing dialog

| Copy | Words | Result |
| --- | ---: | --- |
| Field edition | 2 | Pass |
| Handle shoots above 25 records | 5 | Pass |
| Close | 1 | Pass |
| $24 one-time purchase | 3 | Pass |
| No record limit per imported shoot | 6 | Pass |
| More than one saved shoot | 5 | Pass |
| Batch title, caption, and keyword patterns | 6 | Pass |
| The free edition handles one active shoot with up to 25 records. | 12 | Pass |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 | Pass |
| Buy Field edition | 3 | Pass |
| Have a license? | 3 | Pass |
| Paste it here | 3 | Pass |
| Verify license | 2 | Pass |
| Sociobot/Dodo handles payment and refunds. | 5 | Pass |
| A refund cancels the license. | 5 | Pass |
| See terms and privacy. | 4 | Pass |

## Copy audit — README

Headings (“Who it is for,” “Capabilities,” “Develop and verify,” “Privacy and data ownership,” “Deployment,” and “License”) name their sections. Commands in the code block are not prose sentences. No sentence exceeds 22 words or contains a banned marketing word.

| Sentence | Words | Result |
| --- | ---: | --- |
| Caption Queue is a local metadata queue for photographers handling large shoots. | 12 | Pass |
| It turns a photo folder or CSV file into a keyboard-friendly review queue. | 13 | Pass |
| It exports valid `.xmp` metadata files without changing photos. | 9 | Pass |
| Live product: `https://photo-metadata-queue.sociobot.in` | 3 | Pass |
| One-click sample: `https://photo-metadata-queue.sociobot.in/demo` | 3 | Pass |
| Photographers, editors, and archive teams who review metadata before sending photos to a library or archive. | 16 | Pass |
| The free edition accepts 25 records per shoot. | 8 | Pass |
| The optional $24 Field edition is a one-time license. | 9 | Pass |
| It removes the import limit, adds saved shoots, and enables batch edit patterns. | 13 | Pass |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 | Pass |
| Try three realistic records at `/demo`; the demo uses a separate browser database. | 13 | Pass |
| Import a photo folder or a CSV with a required `filename` column. | 12 | Pass |
| Save metadata in this browser and reopen the queue offline after your first visit. | 14 | Pass |
| Navigate with the queue, J/K keys, or Previous/Next; save and advance with Cmd/Ctrl+Enter. | 13 | Pass |
| Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens. | 10 | Pass |
| Preview well-formed, escaped XMP and validate required editorial fields before marking a record ready. | 14 | Pass |
| Write `.xmp` files directly to a chosen folder in supported browsers, or download them elsewhere. | 15 | Pass |
| Export metadata CSV and JSON workspace backups; restore a JSON backup on another browser. | 14 | Pass |
| Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`. | 20 | Pass |
| Requires Node.js 20+. | 3 | Pass |
| `npm run build` is the factory work-order build command. | 9 | Pass |
| It creates the static deployment at `dist/`, with `dist/index.html` at its root. | 12 | Pass |
| Browser tests use Playwright 1.58.2 and the preinstalled Chromium build. | 10 | Pass |
| Every production build writes `dist/release.json` with its Git commit. | 9 | Pass |
| After pushing and deploying `main`, run `npm run test:live -- https://photo-metadata-queue.sociobot.in/`. | 11 | Pass; maintainer instruction |
| The command fails if the live marker, local source, and `origin/main` disagree. | 12 | Pass; observed against the later documentation-only head |
| There are no analytics, trackers, third-party fonts, or third-party runtime scripts. | 11 | Pass |
| The free metadata workflow contacts only this site's own servers. | 10 | Pass |
| Only a pasted paid-license token is sent to the Sociobot licensing endpoint for verification. | 14 | Pass |
| See `/privacy` and `/terms` in the app for the full policies. | 11 | Pass |
| Deploy the contents of `dist/` to a static host. | 9 | Pass |
| The Azure Static Web Apps configuration routes `/demo`, `/privacy`, and `/terms` to the app. | 14 | Pass |
| Unknown paths use the designed 404 page. | 7 | Pass |
| Documents and `sw.js` revalidate, while `/assets/*` uses one-year immutable caching. | 10 | Pass |
| Serve HTTPS for service workers, installability, and directory writing. | 9 | Pass |
| Do not configure secrets in the client bundle. | 8 | Pass |
| Every visitor-facing product promise and its clean demo test are listed in `.factory/claims.json`. | 13 | Pass |
| Demo isolation and reset behavior are documented in `.factory/demo.md`. | 9 | Pass |
| MIT. | 1 | Pass |
| Generated artwork provenance is recorded in `.factory/design.md`. | 7 | Pass |

Terminology is consistent: source media is “photo,” a queued unit is a “record,” a group is a “shoot,” ordered work is a “queue,” sample mode is the “demo,” and the paid tier is “Field edition.” Buttons use verbs that name the result. No copy finding remains.

## Demo and sandbox

- One-click entry: pass. A cold landing-page click opens `/demo`.
- Immediate use: pass. The first demo viewport shows “Salt marsh bird survey,” “Photo 1 of 3,” `BIRDS_1842.JPG`, populated metadata, ready status, progress, and queue controls.
- Banner: pass. “Demo — sample data, nothing is saved” remains visible with **Reset demo** and **Start for real**.
- Reset: pass. Changing the first title and choosing Reset restores “Great blue heron lifting from reeds.”
- Isolation: pass. The declared test seeds a private real workspace, edits and resets the demo, then confirms the real workspace is unchanged. Leaving demo deletes `demo:caption-queue` and preserves `caption-queue`.
- Privacy: pass. The independent live request log for landing, demo entry, edit, and reset contains only `https://photo-metadata-queue.sociobot.in`.
- Offline: pass. The exact offline claim test uses its own context and confirms edited demo and real queues reload offline.

F-4-1 concerns the surrounding header route, not the demo workspace, sample quality, reset, or storage isolation.

## Claims audit

Every exact `test` string in `.factory/claims.json` ran separately and unchanged after `npm ci` in fresh clone `/tmp/cq-review4-Xx7hIi/repo`. All 21 commands selected one tagged test and passed.

| Claim id | Result | Observable result checked |
| --- | --- | --- |
| `demo-sandbox` | Pass | One-click three-record demo, reset, real-data isolation, and discard |
| `offline-reload` | Pass | Edited demo and real queues reload offline |
| `local-privacy` | Pass | Demo edit/export traffic is same-origin and uses demo storage |
| `xmp-export` | Pass | XML parses and sensitive characters are escaped |
| `original-files-unchanged` | Pass | Source hashes and names survive every export path |
| `photo-import` | Pass | Two undecodable photo fixtures become queue records |
| `no-generated-captions` | Pass | Empty captions stay empty and no model endpoint is requested |
| `metadata-tools` | Pass | All four tokens, a controlled term, and validation are exercised |
| `csv-import-schema` | Pass | Missing filename is rejected; all documented headings and aliases map |
| `bulk-xmp` | Pass | Three named `.xmp` files download |
| `free-core-exports` | Pass | An unlicensed real workspace exports XMP, CSV, and JSON |
| `free-limit` | Pass | 25 rows are accepted and 26 are rejected |
| `field-edition` | Pass | Price, larger import, saved shoots, and batch patterns work with the fixture |
| `local-persistence` | Pass | Edited metadata survives reload |
| `csv-export` | Pass | CSV contains its header and three sample rows |
| `backup-restore` | Pass | Exported JSON restores changed demo data |
| `backup-cross-browser` | Pass | JSON restores into a separate browser workspace |
| `direct-sidecar-write` | Pass | A compatible directory handle receives three named files |
| `keyboard-save-next` | Pass | Previous/Next and Ctrl+Enter move and save |
| `license-verification-privacy` | Pass | Verification sends a bodyless GET with only the pasted token value |
| `keyboard-controls` | Pass | J/K and keyboard file-picker activation work |

No listed claim is untested or failing. Every claim-like sentence on the live landing page and in the README maps to the relevant declared claim above or to a directly verified build/deployment fact.

## Earlier-finding closure

All three earlier reviews, all three polish reports, and the prior handoff were read. Each earlier finding was checked against the current live site and source, not accepted from its status label.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: mobile Back/Forward restores route, saved scroll, focused h1, and announcement; the full browser test passes. |
| F-1-2 | Fixed: `original-files-unchanged` hashes fixtures and covers every export path. |
| F-1-3 | Fixed: unknown URLs return the designed HTTP 404 with complete shell and metadata. |
| F-1-4 | Fixed: `no-generated-captions` checks empty captions and rejects model requests. |
| F-1-5 | Fixed: the live demo says “1 record still needs review.” |
| F-1-6 | Fixed: the live demo says “Photo 1 of 3.” |
| F-1-7 | Fixed: the live heading is “Required metadata.” |
| F-1-8 | Fixed: the live result is “Required metadata complete.” |
| F-1-9 | Fixed: the live heading is “Reusable terms.” |
| F-1-10 | Fixed: the live label is “XMP exports.” |
| F-1-11 | Fixed: the live action is “Export this shoot” / “Export 3 `.xmp` files.” |
| F-1-12 | Fixed: no hero caption, plate label, or slogan remains; useful alt text remains. |
| F-1-13 | Fixed: the first-screen sentence defines separate XMP metadata files. |
| F-1-14 | Fixed: landing copy says “photo library,” not “DAM.” |
| F-1-15 | Fixed: the export step names one `.xmp` file for each photo. |
| F-1-16 | Fixed: the boundary copy defines separate `.xmp` metadata files. |
| F-1-17 | Fixed: the README introduction is split and defines `.xmp` metadata files. |
| F-1-18 | Fixed: the README says “library or archive,” not “DAM.” |
| F-1-19 | Fixed: the README says “separate browser database”; implementation naming stays in demo documentation. |
| F-1-20 | Fixed: capability copy says “this browser,” not “IndexedDB.” |
| F-1-21 | Fixed: direct folder writing is described by its result, not an API name. |
| F-1-22 | Fixed: privacy copy says the free workflow contacts only this site's servers. |
| F-1-23 | Fixed: the deployment and 404 statements are separate and within the word cap. |
| F-1-24 | Fixed: live/source copy uses “photo” for media and “record” for queued work. |
| F-2-1 | Fixed: `free-core-exports` declares and proves all three unlicensed exports. |
| F-2-2 | Fixed: the demo says “Creator, copyright, and location fields.” |
| F-3-1 | Fixed: `csv-import-schema` declares and proves the required column and complete documented mapping. |
| F-3-2 | Fixed: `metadata-tools` asserts exact output for all four documented tokens. |
| F-3-3 | Fixed: the live status is “Online · data stays local.” |
| F-3-4 | Fixed: pricing says “Sociobot/Dodo handles payment and refunds. A refund cancels the license.” |

No earlier finding regressed. F-4-1 is a newly identified route defect.

## Structure, routing, accessibility, and visual identity

| Check | Result |
| --- | --- |
| Titles and h1 | Pass: `/`, `/demo`, `/privacy`, `/terms`, and 404 have route-specific titles under 60 characters and exactly one h1. |
| Metadata | Pass: descriptions, canonicals, Open Graph/Twitter data, 1200×630 social art, favicon, apple-touch icon, theme color, and `lang="en"` are present. |
| Landmarks and shell | Pass except F-4-1: skip link, main, header, footer, Privacy, and Terms are present on every route. |
| Deep links and history | Pass except F-4-1: known routes reload; Back/Forward restore focus and route scroll. The demo brand route is wrong. |
| 404 | Pass: a product-styled page returns HTTP 404 and offers Home and sample actions. |
| Link crawl | Pass: every distinct internal route, source link, checkout redirect, robots file, sitemap, social image, and favicon returned 200. |
| Accessibility | Pass: independent Axe scans found zero violations on all four routes and the 404 in a 390 px dark, reduced-motion context. Full tests cover keyboard use, focus, touch targets, and 200% text. |
| Console and layout | Pass: primary routes have no console/page errors and no 390 px overflow. The unknown route emits only the expected network 404 message. |
| Security and privacy | Pass: CSP is a response header; no inline violation appeared; runtime demo traffic was same-origin only. |
| Performance budget | Pass: the clean build emits 46.31 kB raw / 15.63 kB gzip JavaScript and 20.74 kB raw / 5.32 kB gzip CSS. |
| Visual identity | Pass: herbarium paper, fern ink, editorial serif type, ruled sheets, stamped status, and original field-desk art are specific to this product. |

## Missed leverage

No additional feature finding is warranted. Folder and CSV import, reusable vocabulary and tokens, validation, XMP preview/export, metadata CSV export, JSON backup/restore, and direct-folder writing cover the useful job in the brief. Cloud sync would weaken the local-first boundary. Generated captions are expressly outside the brief, so an AI feature would not be justified. No provider key or decorative AI feature exists.

## Verification summary

- Clean clone: `npm ci` passed with zero vulnerabilities.
- All 21 exact claim commands passed independently.
- `npm test`: 19/19 passed.
- `npm run typecheck`: passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e -- --reporter=line`: 40/40 passed.
- `npm run verify:url -- https://photo-metadata-queue.sociobot.in/`: passed.
- `npm run test:polish-live -- https://photo-metadata-queue.sociobot.in`: passed.
- Independent live Axe checks: zero violations on `/`, `/demo`, `/privacy`, `/terms`, and an unknown route.
- Live artifact verification: rebuilding deployed source commit `f15de814481ccd27de2703a34ecc28602561a1af` matched all 21 deployed artifacts and response policies.
- Repository-head `test:live` stops at its intentional strict provenance check because the live marker is `f15de81` while current `main` is the later documentation-only `14c7265`; `git diff f15de81..14c7265` contains only `.factory` verification files.

## What would make this perfect

1. Fix F-4-1 so the Caption Queue wordmark on `/demo` returns to `/` and safely leaves the demo namespace.
2. Add the direct `/demo` wordmark-routing regression test described in F-4-1.
3. Re-run the complete checklist. With no new or remaining finding, the next adversarial round can pass.
