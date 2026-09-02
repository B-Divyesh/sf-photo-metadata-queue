# Adversarial first-read review 5 — Caption Queue

Reviewed 2026-09-02 UTC against <https://photo-metadata-queue.sociobot.in/> at 390 × 844 and 1440 × 900. Repository head is `cac63ab403028ca8cbdf1037fb4fb874c51968bf`; the live release marker is `fa6306f62029c4c257eef44ca2d2c0b43118f46a`. The intervening change is only `.factory` evidence and handoff documentation; `git diff` confirms no product-file difference.

## Verdict: PASS

There are zero findings. All declared claims were exercised independently from a fresh clone. The landing, demo, privacy boundary, routes, metadata, accessibility checks, historic fixes, and product-specific visual system all pass this review.

## First screen, before scrolling

### 390 × 844 phone

- What it does: turns a large photo shoot from a folder or CSV into a metadata queue and exports separate `.xmp` files without changing photos.
- For whom: photographers handling large shoots.
- What to click first: **Try it with sample data**; the adjacent result says “Opens three edited sample records.”
- Result: pass. The headline, audience sentence, action, result, three facts, and real import choices fit in the first viewport. No overflow, console error, or page error occurred.

### 1440 × 900 desktop

- What it does, who it is for, and the first action are equally clear.
- Result: pass. The original field-desk image supports the photographic classification task without replacing necessary copy.

The exact orienting text is “Caption large shoots without changing originals,” “For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files,” and “Try it with sample data.”

## Findings

None.

## Copy audit

Counts treat abbreviations, paths, numbers, and hyphenated terms as one word. Every landing and README sentence is at most 22 words. No sentence uses a banned marketing adjective, vague slogan, inconsistent product term, or a non-result-naming control.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| Caption Queue | 2 |
| Demo | 1 |
| Privacy | 1 |
| Online · data stays local | 4 |
| Change color theme | 3 |
| View pricing | 2 |
| Local photo metadata queue | 4 |
| Caption large shoots without changing originals | 6 |
| For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files. | 20 |
| Try it with sample data | 5 |
| Opens three edited sample records. | 5 |
| Choose photo folder | 3 |
| Import CSV | 2 |
| Restore backup | 2 |
| Runs offline after the first visit. | 6 |
| Photos and metadata stay on this device. | 7 |
| Free for 25 records per shoot. | 6 |
| Field edition costs $24 once. | 5 |
| A blank herbarium sheet with a fern, archival sleeves, and an empty contact sheet arranged on a wooden worktable | 19 |
| How it works | 3 |
| Move one photo at a time | 6 |
| Keep one shoot in view. | 5 |
| Reuse its terms, check every record, then export metadata files for your photo library. | 14 |
| Gather | 1 |
| Start from a photo folder or a CSV file. | 9 |
| Annotate | 1 |
| Move photo by photo with shared terms and caption tokens. | 10 |
| Export | 1 |
| Review the metadata file and export one `.xmp` file for each photo. | 12 |
| Privacy and limits | 3 |
| Your files stay under your control | 6 |
| Caption Queue stores the workspace in this browser. | 8 |
| It sends nothing during the free metadata workflow. | 8 |
| It writes separate `.xmp` metadata files. | 6 |
| It does not change photo files or generate captions. | 9 |
| Read the privacy details | 4 |
| One-time license | 2 |
| Use the free queue or remove its limit | 8 |
| $24 once | 2 |
| Field edition removes the 25-record import limit, adds saved shoots, and enables batch edit patterns. | 15 |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 |
| View Field edition | 3 |
| Photo metadata stays on this device during the free workflow. | 10 |
| Terms | 1 |
| Source | 1 |
| Caption Queue v1.0.0 · Built by Param Factory · Field-desk image generated for this product. | 15 |

The reachable pricing dialog also passes: its longest sentence, “The free edition handles one active shoot with up to 25 records,” has 12 words. “Sociobot/Dodo handles payment and refunds. A refund cancels the license.” names the result without merchant jargon.

### README

| Sentence or label | Words |
| --- | ---: |
| Caption Queue is a local metadata queue for photographers handling large shoots. | 12 |
| It turns a photo folder or CSV file into a keyboard-friendly review queue. | 13 |
| It exports valid `.xmp` metadata files without changing photos. | 9 |
| Live product: `https://photo-metadata-queue.sociobot.in` | 3 |
| One-click sample: `https://photo-metadata-queue.sociobot.in/demo` | 3 |
| Photographers, editors, and archive teams who review metadata before sending photos to a library or archive. | 16 |
| The free edition accepts 25 records per shoot. | 8 |
| The optional $24 Field edition is a one-time license. | 9 |
| It removes the import limit, adds saved shoots, and enables batch edit patterns. | 13 |
| XMP, metadata CSV, and workspace backup exports remain free. | 9 |
| Try three realistic records at `/demo`; the demo uses a separate browser database. | 13 |
| Import a photo folder or a CSV with a required `filename` column. | 12 |
| Save metadata in this browser and reopen the queue offline after your first visit. | 14 |
| Navigate with the queue, J/K keys, or Previous/Next; save and advance with Cmd/Ctrl+Enter. | 13 |
| Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens. | 10 |
| Preview well-formed, escaped XMP and validate required editorial fields before marking a record ready. | 14 |
| Write `.xmp` files directly to a chosen folder in supported browsers, or download them elsewhere. | 15 |
| Export metadata CSV and JSON workspace backups; restore a JSON backup on another browser. | 14 |
| Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`. | 20 |
| Requires Node.js 20+. | 3 |
| `npm run build` is the factory work-order build command. | 9 |
| It creates the static deployment at `dist/`, with `dist/index.html` at its root. | 12 |
| Browser tests use Playwright 1.58.2 and the preinstalled Chromium build. | 10 |
| Every production build writes `dist/release.json` with its Git commit. | 9 |
| After pushing and deploying `main`, run `npm run test:live -- https://photo-metadata-queue.sociobot.in/`. | 11 |
| The command fails if the live marker, local source, and `origin/main` disagree. | 12 |
| There are no analytics, trackers, third-party fonts, or third-party runtime scripts. | 11 |
| The free metadata workflow contacts only this site's own servers. | 10 |
| Only a pasted paid-license token is sent to the Sociobot licensing endpoint for verification. | 14 |
| See `/privacy` and `/terms` in the app for the full policies. | 11 |
| Deploy the contents of `dist/` to a static host. | 9 |
| The Azure Static Web Apps configuration routes `/demo`, `/privacy`, and `/terms` to the app. | 14 |
| Unknown paths use the designed 404 page. | 7 |
| Documents and `sw.js` revalidate, while `/assets/*` uses one-year immutable caching. | 10 |
| Serve HTTPS for service workers, installability, and directory writing. | 9 |
| Do not configure secrets in the client bundle. | 8 |
| Every visitor-facing product promise and its clean demo test are listed in `.factory/claims.json`. | 13 |
| Demo isolation and reset behavior are documented in `.factory/demo.md`. | 9 |
| MIT. | 1 |
| Generated artwork provenance is recorded in `.factory/design.md`. | 7 |

Terminology remains consistent: **photo** is source media, **record** is one queued item, **shoot** is a group, **queue** is ordered work, **demo** is the isolated sample, and **Field edition** is the paid tier.

## Demo, privacy, and claims

- The first-screen sample action opens `/demo` in one click with the realistic three-record “Salt marsh bird survey” already in use.
- The persistent banner says “Demo — sample data, nothing is saved” and presents working **Reset demo** and **Start for real** actions.
- Reset restored “Great blue heron lifting from reeds.” The `demo:caption-queue` database is discarded on reset/exit and the separate `caption-queue` real workspace remains untouched.
- The live Playwright request log for the demo edit/offline flow contained only `https://photo-metadata-queue.sociobot.in`; an offline reload retained the edited record and showed “Offline · work is saved.”
- Every claim-like landing and README statement maps to an entry in `.factory/claims.json`. The 21 exact listed commands each selected one tagged test and passed from fresh clone `/tmp/photo-metadata-queue-review5-VgTNhu/repo`.

| Claims passed | Claims passed |
| --- | --- |
| demo-sandbox; offline-reload; local-privacy; xmp-export; original-files-unchanged; photo-import; no-generated-captions | metadata-tools; csv-import-schema; bulk-xmp; free-core-exports; free-limit; field-edition; local-persistence |
| csv-export; backup-restore; backup-cross-browser; direct-sidecar-write; keyboard-save-next; license-verification-privacy; keyboard-controls | All 21 passed |

## Earlier finding closure

Every earlier review, polish report, and handoff was read. The live site and source were checked rather than accepting a prior status label.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | 390 px Back/Forward restores saved scroll, focus, and route announcement. |
| F-1-2 | Hash-based test proves original photo bytes/names remain unchanged through every export path. |
| F-1-3 | Unknown routes return the styled HTTP 404 with shell, metadata, Privacy, and Terms. |
| F-1-4 | Empty captions stay empty and no model request is made. |
| F-1-5 | Singular status is “1 record still needs review.” |
| F-1-6 | The queue says “Photo 1 of 3.” |
| F-1-7 | The heading is “Required metadata.” |
| F-1-8 | Completion says “Required metadata complete.” |
| F-1-9 | Vocabulary is “Reusable terms.” |
| F-1-10 | Export section is “XMP exports.” |
| F-1-11 | Action is “Export this shoot” with a record-specific `.xmp` count. |
| F-1-12 | Hero plate label/slogan is absent; useful image alt remains. |
| F-1-13 | First-screen copy defines separate XMP metadata files. |
| F-1-14 | Copy says “photo library,” not DAM. |
| F-1-15 | Export step names one `.xmp` file for each photo. |
| F-1-16 | Privacy boundary defines separate `.xmp` metadata files. |
| F-1-17 | README introduction is split and defines the output. |
| F-1-18 | README says “library or archive.” |
| F-1-19 | README says “separate browser database.” |
| F-1-20 | README says “this browser,” not IndexedDB. |
| F-1-21 | Folder writing is explained by its result. |
| F-1-22 | Privacy text says the free workflow contacts only this site’s servers. |
| F-1-23 | Routing and 404 text are separate sub-22-word sentences. |
| F-1-24 | Source media and queued-work terms remain photo and record. |
| F-2-1 | Unlicensed XMP, CSV, and JSON exports are declared and tested. |
| F-2-2 | Demo names “Creator, copyright, and location fields.” |
| F-3-1 | CSV filename requirement, headings, and aliases are declared and tested. |
| F-3-2 | All four documented tokens have exact output assertions. |
| F-3-3 | Status says “Online · data stays local.” |
| F-3-4 | Payment/refund wording is plain and explicit. |
| F-4-1 | Demo wordmark now goes home, focuses the landing h1, removes only demo data, and preserves a real-workspace sentinel. |

## Structure and product fit

- `/`, `/demo`, `/privacy`, `/terms`, and the designed 404 have route-specific titles, one h1, meta description, canonical, Open Graph/Twitter data, favicon, `lang="en"`, consistent shell, and no 390 px overflow.
- Deep links, browser Back/Forward, keyboard paths, visible focus, 44 px targets, reduced motion, 200% text, and serious/critical Axe scans passed. `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed.
- The static 404 returns HTTP 404 with working Home and demo links. The link/route checks found no dead internal links.
- The herbarium-paper palette, fern ink, editorial serif/sans pairing, ruled annotation sheets, and original field-desk image are recognizably specific to a photo-metadata queue, not a generic SaaS layout.
- The brief does not imply a missing AI feature: folder/CSV import, vocabulary/tokens, validation, XMP/CSV/JSON export and restore, and local-first storage cover the stated job. Generated captions would contradict the explicit product boundary.

## Verification summary

- Fresh clone: `npm ci` completed with zero vulnerabilities.
- `npm test` passed 19 tests; `npm run typecheck` passed; `npm run build` produced `dist/` (46.29 kB raw / 15.62 kB gzip JavaScript).
- 21 individually run claim tests and 20 other browser tests passed. `npm run test:polish-live` and `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed.
- `npm run test:live -- https://photo-metadata-queue.sociobot.in/` stops only at its intended provenance guard because live is `fa6306f` and head is the later documentation-only `cac63ab`; no product artifact differs.

## What would make this perfect

The current product meets the zero-finding acceptance condition. Preserve the one-click demo and its isolated namespace when making future changes, then repeat the clean-clone claim run and live mobile route check before release.
