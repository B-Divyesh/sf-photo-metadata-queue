# Adversarial first-read review 3 — Caption Queue

Reviewed 2026-09-02 UTC against <https://photo-metadata-queue.sociobot.in/> and repository commit `4b6bd5c24abb730785f23f292c37be10ebb62096`. The deployed product assets identify candidate `60f7ba60947b90a92cff8e50839ce233e878880a`; later repository commits change only `.factory` documentation.

## Verdict: FAIL

The first screen, demo, sandbox, declared claim commands, routes, accessibility checks, and every earlier finding pass. Four copy/claim-accounting findings remain. None is blocking by itself, but the required verdict is `PASS` only with zero findings and no untested claim.

## Findings

Findings are ordered by severity.

### F-3-1 — Medium — The documented CSV import contract is an unlisted claim

- Exact quotes/location: README, Capabilities: “Import a photo folder or a CSV with a required `filename` column.” README, immediately below the capability list: “Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`.”
- Evidence: `.factory/claims.json` has `photo-import` for selected photos and `free-limit` for CSV row limits. Neither claim states the required column or the documented header mapping. The untagged unit test checks only `filename`, `title`, `caption`, `keywords`, and `photographer`; it does not prove the complete documented mapping through the demo entry point.
- Why this matters: a user can build a CSV from this sentence and rely on every listed field being imported. The claims register does not contain that promise, so the required clean-sandbox claim run cannot verify it.
- Concrete fix: add a `csv-import-schema` claim for the required `filename` column and the complete listed mapping. Add exactly one `@claim:csv-import-schema` browser test that enters through `/demo`, starts for real, imports a row containing every documented heading and alias, checks every resulting field, and separately confirms the missing-`filename` error.

### F-3-2 — Medium — The listed token claim test proves only one of four documented tokens

- Exact quote/location: README, Capabilities: “Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens.”
- Evidence: the declared `metadata-tools` command passes, but its tagged test clicks only `{filename}`. `{sequence}`, `{shoot}`, and `{date}` are covered only partly or not at all by unrelated tests; the claim test does not assert the complete visitor-facing promise.
- Why this matters: the claims contract requires the tagged test to prove the promised observable result, not one example from a documented four-item set.
- Concrete fix: extend the single `@claim:metadata-tools` test to insert all four tokens into a clean sample record and assert the exact rendered filename, padded sequence, shoot name, and date. Keep one tagged test for the claim.

### F-3-3 — Minor — The online-status label can imply cloud storage

- Exact quote/location: desktop header before scrolling, “Local & online.”
- Why this matters: the phrase joins a storage mode and a network state. Beside “Photos and metadata stay on this device,” it can make a first-time visitor wonder whether the workspace is also online or synced.
- Proposed rewrite: “Online · data stays local.” Keep the existing offline state “Offline · work is saved.”

### F-3-4 — Minor — The pricing dialog uses payment jargon

- Exact quote/location: pricing dialog opened from the landing page, “Sociobot/Dodo is the merchant of record. Refunds are handled there and revoke the license.”
- Why this matters: “merchant of record” is a legal/payment term that a photographer must translate. The second sentence also uses “there” without naming who handles the refund.
- Proposed rewrite: “Sociobot/Dodo handles payment and refunds. A refund cancels the license.”

## First screen, before scrolling

### 390 × 844 phone

- What it does, in my words: it turns a large photo shoot into a caption and metadata queue, then creates separate XMP files without changing the photos.
- For whom: photographers handling large shoots from a folder or CSV.
- What I should click first: **Try it with sample data**. The adjacent text says it opens three edited sample records.
- Result: pass. The headline, audience sentence, primary action, action result, all three facts, and real import actions fit before the fold. There was no horizontal overflow, console error, or page error.

### 1440 × 900 desktop

- What it does, for whom, and what to click first are equally clear.
- Result: pass. The same text and the product-specific field-desk image are visible before scrolling. F-3-3 records the ambiguous connection label, but it does not prevent the three required first-read answers.

The exact orienting text is “Caption large shoots without changing originals,” “For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files,” and “Try it with sample data.”

## Copy audit — landing page

Counts treat numbers, abbreviations, paths, hyphenated terms, and code tokens as one word. Repeated navigation labels are listed once with their locations. The table includes visible shell copy, the image alternative, controls, headings, and the pricing dialog reachable from the landing page.

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass; result-naming link |
| Caption Queue | 2 | Pass; wordmark |
| Demo | 1 | Pass; destination link, repeated in footer |
| Privacy | 1 | Pass; destination link, repeated in footer |
| Local & online | 2 | **F-3-3** |
| Change color theme | 3 | Pass; accessible name for the icon button |
| View pricing | 2 | Pass; result-naming action |
| Local photo metadata queue | 4 | Pass |
| Caption large shoots without changing originals | 6 | Pass; `original-files-unchanged` |
| For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files. | 20 | Pass; output is defined in place |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens three edited sample records. | 5 | Pass; `demo-sandbox` |
| Choose photo folder | 3 | Pass; result-naming action |
| Import CSV | 2 | Pass; result-naming action |
| Restore backup | 2 | Pass; result-naming action |
| Runs offline after the first visit. | 6 | Pass; `offline-reload` |
| Photos and metadata stay on this device. | 7 | Pass; `local-privacy` |
| Free for 25 records per shoot. | 6 | Pass; `free-limit` |
| Field edition costs $24 once. | 5 | Pass; `field-edition` |
| A blank herbarium sheet with a fern, archival sleeves, and an empty contact sheet arranged on a wooden worktable | 19 | Pass; useful image alternative |
| How it works | 3 | Pass |
| Move one photo at a time | 6 | Pass |
| Keep one shoot in view. | 5 | Pass |
| Reuse its terms, check every record, then export metadata files for your photo library. | 14 | Pass |
| Gather | 1 | Pass; step heading |
| Start from a photo folder or a CSV file. | 9 | Pass |
| Annotate | 1 | Pass; step heading |
| Move photo by photo with shared terms and caption tokens. | 10 | Pass |
| Export | 1 | Pass; step heading |
| Review the metadata file and export one `.xmp` file for each photo. | 12 | Pass |
| Privacy and limits | 3 | Pass |
| Your files stay under your control | 6 | Pass; section meaning is clear out of context |
| Caption Queue stores the workspace in this browser. | 8 | Pass; `local-persistence` |
| It sends nothing during the free metadata workflow. | 8 | Pass; `local-privacy` |
| It writes separate `.xmp` metadata files. | 6 | Pass; `xmp-export` |
| It does not change photo files or generate captions. | 9 | Pass; `original-files-unchanged`, `no-generated-captions` |
| Read the privacy details | 4 | Pass; result-naming link |
| One-time license | 2 | Pass |
| Use the free queue or remove its limit | 8 | Pass |
| $24 once | 2 | Pass; `field-edition` |
| Field edition removes the 25-record import limit, adds saved shoots, and enables batch edit patterns. | 15 | Pass; `field-edition` |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 | Pass; `free-core-exports` |
| View Field edition | 3 | Pass; result-naming action |
| Photo metadata stays on this device during the free workflow. | 10 | Pass; `local-privacy` |
| Terms | 1 | Pass; footer destination link |
| Source | 1 | Pass; footer destination link |
| Caption Queue v1.0.0 · Built by Param Factory · Field-desk image generated for this product. | 15 | Pass |

### Pricing dialog opened from the landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Field edition | 2 | Pass |
| Handle shoots above 25 records | 5 | Pass |
| Close | 1 | Pass; accessible name for the icon button |
| $24 one-time purchase | 3 | Pass; `field-edition` |
| No record limit per imported shoot | 6 | Pass; `field-edition` |
| More than one saved shoot | 5 | Pass; `field-edition` |
| Batch title, caption, and keyword patterns | 6 | Pass; `field-edition` |
| The free edition handles one active shoot with up to 25 records. | 12 | Pass; `free-limit` |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 | Pass; `free-core-exports` |
| Buy Field edition | 3 | Pass; result-naming action |
| Have a license? | 3 | Pass |
| Paste it here | 3 | Pass |
| Verify license | 2 | Pass; result-naming action |
| Sociobot/Dodo is the merchant of record. | 6 | **F-3-4** |
| Refunds are handled there and revoke the license. | 8 | **F-3-4** |
| See terms and privacy. | 4 | Pass |

No landing sentence exceeds 22 words or contains a banned marketing word. Apart from F-3-3 and F-3-4, headings make sense out of context, terms stay consistent, and buttons use verbs that name their result.

## Copy audit — README

| Sentence | Words | Result |
| --- | ---: | --- |
| Caption Queue is a local metadata queue for photographers handling large shoots. | 12 | Pass |
| It turns a photo folder or CSV file into a keyboard-friendly review queue. | 13 | Pass; keyboard behavior is declared and tested |
| It exports valid `.xmp` metadata files without changing photos. | 9 | Pass; `xmp-export`, `original-files-unchanged` |
| Live product: `https://photo-metadata-queue.sociobot.in` | 3 | Pass |
| One-click sample: `https://photo-metadata-queue.sociobot.in/demo` | 3 | Pass |
| Photographers, editors, and archive teams who review metadata before sending photos to a library or archive. | 16 | Pass |
| The free edition accepts 25 records per shoot. | 8 | Pass; `free-limit` |
| The optional $24 Field edition is a one-time license. | 9 | Pass; `field-edition` |
| It removes the import limit, adds saved shoots, and enables batch edit patterns. | 13 | Pass; `field-edition` |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 | Pass; `free-core-exports` |
| Try three realistic records at `/demo`; the demo uses a separate browser database. | 13 | Pass; `demo-sandbox` |
| Import a photo folder or a CSV with a required `filename` column. | 12 | **F-3-1** |
| Save metadata in this browser and reopen the queue offline after your first visit. | 14 | Pass; `local-persistence`, `offline-reload` |
| Navigate with the queue, J/K keys, or Previous/Next; save and advance with Cmd/Ctrl+Enter. | 13 | Pass; keyboard claims |
| Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens. | 10 | **F-3-2** |
| Preview well-formed, escaped XMP and validate required editorial fields before marking a record ready. | 14 | Pass; `xmp-export`, `metadata-tools` |
| Write `.xmp` files directly to a chosen folder in supported browsers, or download them elsewhere. | 15 | Pass; direct and download claims |
| Export metadata CSV and JSON workspace backups; restore a JSON backup on another browser. | 14 | Pass; export and backup claims |
| Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`. | 20 | **F-3-1** |
| Requires Node.js 20+. | 3 | Pass; maintainer requirement |
| `npm run build` is the factory work-order build command. | 9 | Pass; maintainer instruction |
| It creates the static deployment at `dist/`, with `dist/index.html` at its root. | 12 | Pass; verified by the build |
| Browser tests use Playwright 1.58.2 and the preinstalled Chromium build. | 10 | Pass; package lock matches |
| Every production build writes `dist/release.json` with its Git commit. | 9 | Pass; build and unit test verify this |
| After pushing and deploying `main`, run `npm run test:live -- https://photo-metadata-queue.sociobot.in/`. | 11 | Pass; maintainer instruction |
| The command fails if the live marker, local source, and `origin/main` disagree. | 12 | Pass; release-provenance test verifies this behavior |
| There are no analytics, trackers, third-party fonts, or third-party runtime scripts. | 11 | Pass; `local-privacy` and live request log |
| The free metadata workflow contacts only this site's own servers. | 10 | Pass; `local-privacy` |
| Only a pasted paid-license token is sent to the Sociobot licensing endpoint for verification. | 14 | Pass; `license-verification-privacy` |
| See `/privacy` and `/terms` in the app for the full policies. | 11 | Pass; both links return 200 |
| Deploy the contents of `dist/` to a static host. | 9 | Pass; maintainer instruction |
| The Azure Static Web Apps configuration routes `/demo`, `/privacy`, and `/terms` to the app. | 14 | Pass; static config and live deep links verified |
| Unknown paths use the designed 404 page. | 7 | Pass; live HTTP 404 verified |
| Documents and `sw.js` revalidate, while `/assets/*` uses one-year immutable caching. | 10 | Pass; response policy verified |
| Serve HTTPS for service workers, installability, and directory writing. | 9 | Pass; maintainer instruction |
| Do not configure secrets in the client bundle. | 8 | Pass; maintainer instruction |
| Every visitor-facing product promise and its clean demo test are listed in `.factory/claims.json`. | 13 | Fails in practice because of **F-3-1** and **F-3-2** |
| Demo isolation and reset behavior are documented in `.factory/demo.md`. | 9 | Pass |
| MIT. | 1 | Pass |
| Generated artwork provenance is recorded in `.factory/design.md`. | 7 | Pass |

README headings — “Who it is for,” “Capabilities,” “Develop and verify,” “Privacy and data ownership,” “Deployment,” and “License” — name their sections. No README sentence exceeds 22 words or contains a banned marketing word. Source media remains “photo,” a queued unit “record,” a group “shoot,” the ordered work “queue,” the sample mode “demo,” and the paid tier “Field edition.”

## Demo and sandbox

- One-click entry: pass. A cold click from `/` reaches `/demo`.
- Immediate use: pass. The first demo viewport already shows “Salt marsh bird survey,” “Photo 1 of 3,” a realistic filename, populated title and caption, ready state, progress, and queue controls.
- Banner: pass. It remains visible and says “Demo — sample data, nothing is saved,” with **Reset demo** and **Start for real**.
- Reset: pass. Changing the first title and choosing Reset restored “Great blue heron lifting from reeds.”
- Isolation: pass. A separately seeded real `caption-queue` workspace retained “Private client shoot” and “Private title” after demo editing and reset. Starting for real deleted `demo:caption-queue`, opened the private real workspace, and left only the real database.
- Privacy: pass. The cold landing, one-click demo, edit, and reset request log contained only `https://photo-metadata-queue.sociobot.in` requests. No model, analytics, font, script, or storage origin was contacted.
- Offline: pass. The exact `offline-reload` claim uses its own context and verifies both demo and saved real queues after offline reload.

## Claims audit

Every `test` string in `.factory/claims.json` was run separately and unchanged after `npm ci` in the clean clone `/tmp/cq-review3-lGTGI5/repo`. Each command selected one tagged test.

| Claim id | Result | Observable assertion |
| --- | --- | --- |
| `demo-sandbox` | Pass | One-click entry, three records, reset, real-data isolation, discard |
| `offline-reload` | Pass | Edited demo and real queues reopen offline |
| `local-privacy` | Pass | Demo edit/export traffic stays same-origin |
| `xmp-export` | Pass | Export parses as XML and sensitive characters are escaped |
| `original-files-unchanged` | Pass | Source hashes and names remain unchanged across every export path |
| `photo-import` | Pass | Two undecodable photo fixtures become queue records |
| `no-generated-captions` | Pass | Empty captions stay empty and no model endpoint is requested |
| `metadata-tools` | Pass with coverage finding | Filename token, controlled term, and validation are asserted; **F-3-2** records the other documented tokens |
| `bulk-xmp` | Pass | Three named `.xmp` downloads |
| `free-core-exports` | Pass | Unlicensed real workspace exports XMP, CSV, and JSON backup |
| `free-limit` | Pass | 25 CSV rows are accepted and 26 are rejected |
| `field-edition` | Pass | Price, larger import, saved shoots, and batch pattern fixture paths |
| `local-persistence` | Pass | Edited title survives reload |
| `csv-export` | Pass | Header plus three sample rows |
| `backup-restore` | Pass | Exported backup restores changed demo data |
| `backup-cross-browser` | Pass | Backup restores in a separate browser context |
| `direct-sidecar-write` | Pass | Recorded directory handle receives three named files |
| `keyboard-save-next` | Pass | Previous/Next and Ctrl+Enter move and save |
| `license-verification-privacy` | Pass | Bodyless GET carries only the pasted license token value |
| `keyboard-controls` | Pass | J/K and keyboard file-picker activation |

No declared command failed. F-3-1 is an unlisted claim; F-3-2 is a listed claim whose tagged test does not cover the full documented token matrix. Therefore the review still has untested claim content.

## Earlier-finding closure

Every finding in `.factory/review-1.md` and `.factory/review-2.md`, both polish reports, and the current handoff was read. Each finding below was checked again on the live site and in current source; this table does not rely on the polish reports' status labels.

| Earlier id | Current confirmation |
| --- | --- |
| F-1-1 | Pass: live 390 px Back/Forward restores route, focused h1, and saved scroll; source uses manual per-entry restoration. |
| F-1-2 | Pass: `original-files-unchanged` exists, hashes source fixtures, and passed. |
| F-1-3 | Pass: unknown live URL returns HTTP 404 with the shared shell, plain h1, metadata, Privacy, and Terms. |
| F-1-4 | Pass: `no-generated-captions` exists, rejects model requests, and passed. |
| F-1-5 | Pass: live demo says “1 record still needs review.” |
| F-1-6 | Pass: live demo says “Photo 1 of 3.” |
| F-1-7 | Pass: live demo says “Required metadata.” |
| F-1-8 | Pass: live demo says “Required metadata complete.” |
| F-1-9 | Pass: live demo heading is “Reusable terms.” |
| F-1-10 | Pass: live demo label is “XMP exports.” |
| F-1-11 | Pass: live demo uses “Export this shoot” and “Export 3 `.xmp` files.” |
| F-1-12 | Pass: source and live DOM have no hero figcaption, plate label, or slogan. |
| F-1-13 | Pass: first-screen sentence defines separate XMP metadata files. |
| F-1-14 | Pass: landing uses “photo library,” not DAM. |
| F-1-15 | Pass: export step names one `.xmp` file for each photo. |
| F-1-16 | Pass: privacy boundary defines separate `.xmp` metadata files. |
| F-1-17 | Pass: README introduction is split and defines `.xmp` metadata files. |
| F-1-18 | Pass: README says “library or archive,” not DAM. |
| F-1-19 | Pass: README says “separate browser database”; the namespace stays in demo documentation. |
| F-1-20 | Pass: README says “this browser,” not IndexedDB. |
| F-1-21 | Pass: README leads with the direct-folder result, not an API name. |
| F-1-22 | Pass: README says the free workflow contacts this site's own servers. |
| F-1-23 | Pass: routing and 404 behavior are two sentences below the hard cap. |
| F-1-24 | Pass: live/source copy consistently uses “photo” for media and “record” for a queued item. |
| F-2-1 | Pass: `free-core-exports` now declares and proves all three unlicensed exports. |
| F-2-2 | Pass: live demo says “Creator, copyright, and location fields”; the IPTC helper is absent. |

The handoff's low-priority note about a once-flaky exact Forward-scroll assertion did not reproduce. The focused route and saved position restored in the live rerun, and `test:polish-live` passed.

## Structure, routing, accessibility, and visual identity

| Check | Result |
| --- | --- |
| Titles | Pass: `/` uses “Caption Queue — Write photo metadata offline”; Demo, Privacy, Terms, and 404 use route-specific patterns, all under 60 characters. |
| Semantic structure | Pass: one h1 and one main per route; header, navigation, footer, skip link, ordered headings, and `lang="en"` are present. |
| Metadata | Pass: description, canonical, Open Graph, Twitter card, 1200×630 product image, SVG favicon, and apple-touch icon are present. |
| Deep links and history | Pass: direct reloads, push-state navigation, Back/Forward scroll, route h1 focus, and polite announcements work. |
| 404 | Pass: designed product-style page, HTTP 404, useful actions, full shell, and policy links. |
| Link crawl | Pass: every discovered internal route, GitHub source link, hosted checkout, robots, sitemap, social image, and icon returned 200 after redirects where applicable. |
| Console and layout | Pass: no cold-load console/page errors and no 390 px horizontal overflow. |
| Accessibility | Pass: Axe found zero violations on `/`, `/demo`, `/privacy`, `/terms`, and the 404 in a mobile dark/reduced-motion context. Full tests cover keyboard, focus, 44 px targets, and 200% text. |
| Performance budget | Pass: built JS is 46.27 kB raw / 15.62 kB gzip; CSS is 20.74 kB raw / 5.32 kB gzip. |
| Visual identity | Pass: herbarium paper, fern ink, editorial serif, ruled sheets, accession details, stamped states, original field-desk art, and the matching 404 are recognizably product-specific rather than a generic SaaS template. |
| Security/privacy structure | Pass: CSP is a response header, no inline-style violation occurred, and no third-party runtime font/script is loaded. |

## Missed leverage

No additional feature finding is warranted. The brief's folder/CSV intake, reusable terms and tokens, validation, XMP preview/export, CSV export, portable backup/restore, and direct-folder writing are present. Cloud sync would conflict with the local-first boundary. Generated captions are explicitly outside the product's stated behavior, and an AI step is not needed to complete the deliberate metadata job. No provider or Azure key is embedded.

## Verification summary

- Clean clone: `npm ci` passed with zero vulnerabilities.
- Every one of the 20 exact claim commands passed independently, one selected test each.
- `npm test`: 18/18 passed.
- `npm run typecheck`: passed.
- `npm run build`: passed and produced `dist/`.
- `npm run test:e2e -- --reporter=line`: 38/38 passed.
- `npm run verify:url -- https://photo-metadata-queue.sociobot.in/`: passed.
- `npm run test:polish-live -- https://photo-metadata-queue.sociobot.in`: passed.
- Independent live Axe: zero violations on all primary routes and the 404.
- Independent live request log: product origin only during cold landing and demo use.

## What would make this perfect

1. Add and pass the clean-demo `csv-import-schema` claim described in F-3-1.
2. Make `@claim:metadata-tools` prove all four documented tokens as described in F-3-2.
3. Replace “Local & online” and the merchant-of-record wording with the proposed plain copy.
4. Repeat the full landing/README copy audit, all exact claim commands, and the live cold/demo check. The next review can pass only if those changes leave no new or remaining finding.
