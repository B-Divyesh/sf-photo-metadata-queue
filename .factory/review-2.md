# Adversarial first-read review 2 — Caption Queue

Reviewed 2026-08-30 UTC against <https://photo-metadata-queue.sociobot.in/> and local commit `a93d85b88f0e290458075d74c1be05293fa64fb7`.

## Verdict: FAIL

The product is clear, usable, isolated in demo mode, and technically well verified. All 19 declared claims passed their exact clean-sandbox commands. Two minor findings remain. The required verdict rule is zero findings, so this is not a PASS.

## First screen, before scrolling

### 390 × 844 phone

- What it does: Caption Queue lets photographers prepare captions and other metadata for a large photo shoot, then export separate metadata files without changing photos.
- For whom: photographers with large shoots, starting from a folder or CSV file.
- First click: **Try it with sample data**. The adjacent result is “Opens three edited sample records.”
- Result: pass. The exact text that made this clear was “Caption large shoots without changing originals,” “For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files,” and “Try it with sample data.” The headline, audience sentence, primary action, action result, all three facts, and import actions are visible before scrolling. No console or page error occurred.

### 1440 × 900 desktop

- What it does, for whom, and what to click first are the same as on phone.
- Result: pass. The same first-screen copy and a product-specific archival field-desk image are visible before scrolling. No console or page error occurred.

## Findings

### F-2-1 — Minor — A paid-tier availability claim has no declared claim or tagged test

- Location and exact quote: landing pricing section, “Core XMP and data exports remain free.”
- Why this matters: this is a purchase decision claim. `.factory/claims.json` verifies the paid price and unlocks, plus individual exports, but contains no claim that XMP, CSV, and backup exports remain available without a Field edition license. A demo export does not document the promised free-edition entitlement.
- Concrete fix: add a claim such as `free-core-exports` and a tagged clean-browser test that starts a real unlicensed workspace, imports records, then proves XMP, CSV, and JSON backup exports work. Alternatively delete the sentence.

### F-2-2 — Minor — The demo’s ownership/location helper uses unexplained implementation jargon

- Location and exact quote: demo editor, section 03 helper, “Portable IPTC ownership and place fields.”
- Why this matters: after the one-click demo, a visitor has to translate “IPTC” and infer which fields this section contains. The copy is not needed to use the product and does not name the visible result in plain words.
- Concrete fix: replace it with “Creator, copyright, and location fields.”

## Demo and sandbox check

- Pass: one click from `/` opened `/demo` with the three-record “Salt marsh bird survey” workspace already in use.
- Pass: the persistent banner reads “Demo — sample data, nothing is saved,” includes **Reset demo** and **Start for real**, and Reset restored the sample state in the declared test.
- Pass: the `@claim:demo-sandbox` test seeded a separate real IndexedDB workspace, edited and reset demo data, then confirmed the real workspace was unchanged. Code uses distinct `demo:caption-queue` and `caption-queue` databases.
- Pass: a fresh live context waited for service-worker control, edited the demo, went offline, and reloaded. The edit remained and the status changed to “Offline · work is saved.” Its full request log contained only `https://photo-metadata-queue.sociobot.in`.

## Claims check

Every command listed in `.factory/claims.json` was run separately after `npm ci`; all passed once and selected exactly one tagged claim test:

`demo-sandbox`, `offline-reload`, `local-privacy`, `xmp-export`, `original-files-unchanged`, `photo-import`, `no-generated-captions`, `metadata-tools`, `bulk-xmp`, `free-limit`, `field-edition`, `local-persistence`, `csv-export`, `backup-restore`, `backup-cross-browser`, `direct-sidecar-write`, `keyboard-save-next`, `license-verification-privacy`, and `keyboard-controls`.

No declared claim failed. F-2-1 is an unlisted live claim.

## Copy audit — landing page

Counts treat paths, abbreviations, numbers, and hyphenated terms as one word. The audit includes sentence-like labels and controls so no first-read copy is omitted. No landing item exceeds 22 words.

| Copy | Words | Result |
| --- | ---: | --- |
| Local photo metadata queue | 4 | Pass |
| Caption large shoots without changing originals | 6 | Pass; `original-files-unchanged` |
| For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files. | 20 | Pass; `photo-import` and `xmp-export` |
| Try it with sample data | 5 | Pass; result-naming action |
| Opens three edited sample records. | 5 | Pass; `demo-sandbox` |
| Choose photo folder | 3 | Pass; result-naming action |
| Import CSV | 2 | Pass; result-naming action |
| Restore backup | 2 | Pass; result-naming action |
| Runs offline after the first visit. | 6 | Pass; `offline-reload` |
| Photos and metadata stay on this device. | 7 | Pass; `local-privacy` |
| Free for 25 records per shoot. | 6 | Pass; `free-limit` |
| Field edition costs $24 once. | 5 | Pass; `field-edition` |
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
| Caption Queue stores the workspace in this browser. | 8 | Pass; `local-persistence` |
| It sends nothing during the free metadata workflow. | 8 | Pass; `local-privacy` |
| It writes separate `.xmp` metadata files. | 6 | Pass; `xmp-export` |
| It does not change photo files or generate captions. | 9 | Pass; `original-files-unchanged`, `no-generated-captions` |
| Read the privacy details | 4 | Pass; result-naming link |
| One-time license | 2 | Pass |
| Use the free queue or remove its limit | 8 | Pass |
| $24 once | 2 | Pass; `field-edition` |
| Field edition removes the 25-record import limit, adds saved shoots, and enables batch edit patterns. | 15 | Pass; `field-edition` |
| Core XMP and data exports remain free. | 7 | **F-2-1** |
| View Field edition | 3 | Pass; result-naming action |
| Photo metadata stays on this device during the free workflow. | 10 | Pass; `local-privacy` |
| Caption Queue v1.0.0 · Built by Param Factory · Field-desk image generated for this product. | 15 | Pass |

Terminology is consistent: source media is “photo,” a queued item is a “record,” a group is a “shoot,” and the output is defined as a “`.xmp` metadata file” before the shorter “`.xmp` file.”

## Copy audit — README

| Sentence | Words | Result |
| --- | ---: | --- |
| Caption Queue is a local metadata queue for photographers handling large shoots. | 12 | Pass |
| It turns a photo folder or CSV file into a keyboard-friendly review queue. | 13 | Pass |
| It exports valid `.xmp` metadata files without changing photos. | 9 | Pass |
| Photographers, editors, and archive teams who review metadata before sending photos to a library or archive. | 16 | Pass |
| The free edition accepts 25 records per shoot. | 8 | Pass |
| The optional $24 Field edition is a one-time license. | 9 | Pass |
| It removes the import limit, adds saved shoots, and enables batch edit patterns. | 13 | Pass |
| `.xmp` writing, backups, accessibility, and privacy remain free. | 8 | **F-2-1**: same unlisted free-entitlement claim |
| Try three realistic records at `/demo`; the demo uses a separate browser database. | 13 | Pass |
| Import a photo folder or a CSV with a required `filename` column. | 12 | Pass |
| Save metadata in this browser and reopen the queue offline after your first visit. | 14 | Pass |
| Navigate with the queue, J/K keys, or Previous/Next; save and advance with Cmd/Ctrl+Enter. | 13 | Pass |
| Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens. | 10 | Pass |
| Preview well-formed, escaped XMP and validate required editorial fields before marking a record ready. | 14 | Pass |
| Write `.xmp` files directly to a chosen folder in supported browsers, or download them elsewhere. | 15 | Pass |
| Export metadata CSV and JSON workspace backups; restore a JSON backup on another browser. | 14 | Pass |
| Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`. | 20 | Pass; technical reference sentence |
| Requires Node.js 20+. | 3 | Pass; maintainer instruction |
| `npm run build` is the factory work-order build command. | 9 | Pass; maintainer instruction |
| It creates the static deployment at `dist/`, with `dist/index.html` at its root. | 12 | Pass; maintainer instruction |
| Browser tests use Playwright 1.58.2 and the preinstalled Chromium build. | 10 | Pass; maintainer instruction |
| There are no analytics, trackers, third-party fonts, or third-party runtime scripts. | 11 | Pass; `local-privacy` |
| The free metadata workflow contacts only this site's own servers. | 10 | Pass; `local-privacy` |
| Only a pasted paid-license token is sent to the Sociobot licensing endpoint for verification. | 14 | Pass; `license-verification-privacy` |
| See `/privacy` and `/terms` in the app for the full policies. | 11 | Pass |
| Deploy the contents of `dist/` to a static host. | 9 | Pass; maintainer instruction |
| The Azure Static Web Apps configuration routes `/demo`, `/privacy`, and `/terms` to the app. | 14 | Pass; maintainer instruction |
| Unknown paths use the designed 404 page. | 7 | Pass; maintainer instruction |
| Documents and `sw.js` revalidate, while `/assets/*` uses one-year immutable caching. | 10 | Pass; maintainer instruction |
| Serve HTTPS for service workers, installability, and directory writing. | 9 | Pass; maintainer instruction |
| Do not configure secrets in the client bundle. | 8 | Pass; maintainer instruction |
| Every visitor-facing product promise and its clean demo test are listed in `.factory/claims.json`. | 13 | **F-2-1**: currently contradicted by the unlisted free-entitlement claim |
| Demo isolation and reset behavior are documented in `.factory/demo.md`. | 9 | Pass |
| MIT. | 1 | Pass |
| Generated artwork provenance is recorded in `.factory/design.md`. | 7 | Pass |

## Earlier-review closure

Every finding in `.factory/review-1.md` was rechecked on the live site and in source. The following table records actual closure, not the prior polish status.

| Earlier id | Confirmed result |
| --- | --- |
| F-1-1 | Pass: live mobile Back/Forward restores route, focus, and recorded scroll; source uses manual restoration. |
| F-1-2 | Pass: claim and source-hash/export test exist. |
| F-1-3 | Pass: live 404 is HTTP 404 with shell, metadata, Privacy, Terms, and plain h1. |
| F-1-4 | Pass: `no-generated-captions` claim test exists and passed. |
| F-1-5 | Pass: live demo renders “1 record still needs review.” |
| F-1-6 | Pass: live demo renders “Photo 1 of 3.” |
| F-1-7 | Pass: live demo renders “Required metadata.” |
| F-1-8 | Pass: live demo renders “Required metadata complete.” |
| F-1-9 | Pass: live demo renders “Reusable terms.” |
| F-1-10 | Pass: live demo renders “XMP exports.” |
| F-1-11 | Pass: live demo action is “Export this shoot” / “Export 3 `.xmp` files.” |
| F-1-12 | Pass: no hero figcaption or plate slogan exists in source or live DOM. |
| F-1-13 | Pass: landing sentence defines separate XMP metadata files. |
| F-1-14 | Pass: landing uses “photo library,” not DAM. |
| F-1-15 | Pass: export step names the metadata-file result. |
| F-1-16 | Pass: privacy boundary names separate `.xmp` metadata files. |
| F-1-17 | Pass: README introduction is split and defines `.xmp` metadata files. |
| F-1-18 | Pass: README says “library or archive,” not DAM. |
| F-1-19 | Pass: README says “separate browser database”; namespace remains in demo documentation. |
| F-1-20 | Pass: README says “this browser,” not IndexedDB. |
| F-1-21 | Pass: README leads with direct folder-writing result, not API name. |
| F-1-22 | Pass: README says the free workflow contacts this site's own servers. |
| F-1-23 | Pass: deployment wording is split into two sentences. |
| F-1-24 | Pass: live/source terminology consistently uses “photo” for source media and “record” for queued items. |

## Structure, routing, and visual check

- Pass: `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, and an unknown URL have the expected route title, one h1, description, canonical, OG data, favicon, consistent header/footer, and no 390 px horizontal overflow. The unknown URL returns HTTP 404.
- Pass: direct links, SPA navigation, browser Back/Forward, route focus, and live announcements are tested and worked in the rerun.
- Pass: all discovered internal, checkout, and source links returned 200; no dead links were found.
- Pass: `npm run verify:url -- https://photo-metadata-queue.sociobot.in` passed. The live cold route and live demo had no console/page errors. The intentional unknown-URL navigation produces the browser's normal failed-resource message for its 404 response; the rendered 404 itself is complete and accessible.
- Pass: the botanical field-guide palette, paper-like layout, serif/sans pairing, and original field-desk art are specific to this product rather than a generic SaaS surface. Design provenance is recorded in `.factory/design.md`.
- Pass: no raw provider key or Azure/OpenAI runtime integration is present. The brief does not imply a missing AI step; import, CSV/JSON backup restore, direct-folder export, and portable downloads are present.

## What would make this perfect

1. Close F-2-1 with a clean unlicensed-real-workspace export claim, or remove the free-entitlement copy.
2. Replace the IPTC helper in F-2-2 with the plain field-result wording.
3. Re-run the 19 exact claim commands, full e2e suite, and live cold/demo check after those two changes.
