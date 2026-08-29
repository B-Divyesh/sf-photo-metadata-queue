# Adversarial first-read review 1 — Caption Queue

Reviewed 2026-08-29 UTC against <https://photo-metadata-queue.sociobot.in/> from commit `6ceb3ce859e57d3b4e7b30c8ba281ebc08fefed0`.

## Verdict: FAIL

The landing page and demo pass the first-read and demo gates, and all 17 declared claim tests pass. The product still has one blocking routing defect and 23 high-to-minor findings. Under the stated zero-finding rule, it does not pass.

## First screen, before scrolling

### 390 × 844 phone

- What it does, in my words: it gives photographers a queue for writing captions and metadata for a large shoot without editing the source photos.
- For whom: photographers handling large shoots from a photo folder or CSV file.
- What I should click first: **Try it with sample data**. The adjacent text says it opens three edited sample records.
- Result: pass. The headline, audience sentence, sample action, action result, offline fact, local-data fact, free limit, and one-time price are all visible before scrolling.

### 1440 × 900 desktop

- What it does, in my words: the same local photo-metadata queue, producing separate XMP files rather than altering photographs.
- For whom: photographers with large shoots.
- What I should click first: **Try it with sample data**.
- Result: pass. The same information is visible before scrolling, along with the product-specific field-desk artwork.

The exact first-screen text that supplied these answers was “Caption large shoots without changing originals,” “For photographers with large shoots…,” and “Try it with sample data.” No first-screen blocking finding was recorded.

## Findings

Findings are ordered by severity.

### F-1-1 — BLOCKING — Mobile Back navigation restores the wrong scroll position

- Location: live History API navigation, `/` → `/privacy` → browser Back, at 390 × 844.
- Evidence: the landing page started at `scrollY=0`. After opening Privacy and pressing Back, the URL returned to `/` and focus moved to “Caption large shoots without changing originals,” but `scrollY` became `1882`. Repeating at 1440 × 900 returned to `scrollY=0`.
- Why this fails: the required deep-link/back-button behavior must restore both focus and scroll. A phone visitor returns near the bottom of the landing page while focus is on an off-screen heading.
- Concrete fix: set `history.scrollRestoration = 'manual'`, record scroll positions per history entry, and restore them only after the destination render settles. Add a 390 px Playwright test that starts at zero, follows Privacy, presses Back and Forward, and checks path, focus, and the recorded scroll position.

### F-1-2 — High — The core “originals are unchanged” promise is unlisted and not directly tested

- Exact quotes: landing headline “Caption large shoots without changing originals”; landing boundary “It does not change image files”; README “without changing image files”; editor “Image originals are never changed.”
- Why this fails: no `.factory/claims.json` entry states this promise. The sidecar tests confirm generated `.xmp` filenames, but no declared claim compares source-file bytes or rejects writes to original filenames. This is the primary safety promise in the first screen.
- Concrete fix: add an `original-files-unchanged` claim and tagged test. Hash fixture originals before and after import, single export, direct-folder export, and bulk export; assert the hashes and original filenames are unchanged and only expected `.xmp` files are created.

### F-1-3 — High — The live 404 does not use the required site shell or route metadata

- Location: any unknown live URL, for example `/not-a-real-route`.
- Exact text: h1 “This page is not in the queue.”
- Evidence: the page correctly returns HTTP 404, but has no description, canonical URL, Open Graph metadata, footer, Privacy link, or Terms link. Its header contains only the wordmark. The h1 is a queue metaphor instead of the plain result.
- Why this fails: it breaks the consistent header/footer and per-route metadata contract and leaves a lost visitor without policy links.
- Concrete fix: give `404.html` the normal header and footer, Privacy and Terms links, description/canonical/OG metadata, and the h1 “Page not found.” Keep “Return home” and “Open sample data.” Add these assertions to the live 404 test.

### F-1-4 — Medium — “Does not generate captions” is an unlisted claim

- Exact quote/location: landing privacy section, “It does not change image files or generate captions for you.”
- Why this fails: the second clause is a behavior claim with no matching claims entry or tagged test.
- Concrete fix: either remove the clause or add a `no-generated-captions` claim. Its test should import a real empty record, wait through the normal workflow, assert the caption remains empty without an explicit edit, and confirm no model request occurs.

### F-1-5 — Medium — Singular demo status has a grammar error

- Exact quote/location: demo export panel, “1 record still need review.”
- Why this fails: the visible demo is the product’s proof path; the error makes the first working screen look unfinished.
- Proposed rewrite: “1 record still needs review.” Keep “2 records still need review” for plurals and add both branches to a test.

### F-1-6 — Minor — “Specimen” is brand metaphor where the UI means “photo”

- Exact quote/location: demo editor, “SPECIMEN 001 / 003.”
- Why this fails: a first-time photographer must translate the botanical metaphor during the main task.
- Proposed rewrite: “PHOTO 1 OF 3.”

### F-1-7 — Minor — “Validation ledger” is an unclear heading

- Exact quote/location: demo editor, “VALIDATION LEDGER.”
- Why this fails: heard out of context, it does not name the section’s required-field checks.
- Proposed rewrite: “REQUIRED METADATA.”

### F-1-8 — Minor — “Standards ready” does not name the completed result

- Exact quote/location: demo validation heading, “Standards ready.”
- Why this fails: it does not say which standards or what passed.
- Proposed rewrite: “Required metadata complete.”

### F-1-9 — Minor — “Field notes” misnames the reusable-vocabulary section

- Exact quote/location: demo side panel, “Field notes.”
- Why this fails: the section contains controlled terms, not notes.
- Proposed rewrite: “Reusable terms.”

### F-1-10 — Minor — “Sidecar press” is a metaphorical section label

- Exact quote/location: demo side panel, “SIDECAR PRESS.”
- Why this fails: it does not name an action or section in plain words.
- Proposed rewrite: “XMP EXPORTS.”

### F-1-11 — Minor — “Write the set” introduces an undefined term

- Exact quote/location: demo side panel, “Write the set.”
- Why this fails: the interface otherwise uses “shoot,” “queue,” and “records”; “set” is not defined.
- Proposed rewrite: “Export this shoot.”

### F-1-12 — Minor — The hero image caption contains a decorative plate label and slogan

- Exact quote/location: landing hero image, “PLATE 01” and “From contact sheet to catalog record.”
- Why this fails: “Plate 01” is decorative lore, and the second line does not explain a feature or action.
- Concrete fix: remove both visible labels. Keep the useful image alt text and the existing provenance statement in the footer/design document.

### F-1-13 — Minor — The first audience sentence uses unexplained “XMP sidecars”

- Exact quote/location: landing first screen, “For photographers with large shoots, it turns folders or CSV files into a focused queue for clean XMP sidecars.”
- Why this fails: “XMP sidecars” is unexplained in the sentence that must orient a cold visitor.
- Proposed rewrite: “For photographers with large shoots, it turns folders or CSV files into a queue and writes separate XMP metadata files.”

### F-1-14 — Minor — The workflow copy uses the unexplained acronym “DAM”

- Exact quote/location: landing How it works, “Reuse its terms, check every record, then send clean sidecars to your DAM.”
- Why this fails: not every photographer calls a photo library a DAM, and the acronym is never expanded.
- Proposed rewrite: “Reuse its terms, check every record, then export metadata files for your photo library.”

### F-1-15 — Minor — The export step introduces XML without explaining why it matters

- Exact quote/location: landing How it works, “Review the XML and export .xmp sidecars.”
- Why this fails: “XML” and “.xmp sidecars” require two pieces of technical knowledge for a three-step overview.
- Proposed rewrite: “Review the metadata file and export one `.xmp` file for each photo.”

### F-1-16 — Minor — The privacy boundary repeats unexplained XMP terminology

- Exact quote/location: landing, “It writes XMP sidecars.”
- Why this fails: the sentence is short but still does not define the output.
- Proposed rewrite: “It writes separate `.xmp` metadata files.”

### F-1-17 — Minor — The README introduction stacks unexplained format terms

- Exact quote/location: README introduction, “It turns a photo folder or CSV file into a keyboard-friendly review queue, then exports well-formed XMP sidecars without changing image files.”
- Why this fails: “well-formed XMP sidecars” is dense before the README explains the format.
- Proposed rewrite: “It turns a photo folder or CSV file into a keyboard-friendly review queue. It exports valid `.xmp` metadata files without changing photos.”

### F-1-18 — Minor — The README uses “DAM” without expansion

- Exact quote/location: README Who it is for, “Photographers, editors, and archive teams who need focused metadata review before a DAM handoff.”
- Why this fails: a new reader must already know the digital-asset-management acronym to understand the audience description.
- Proposed rewrite: “Photographers, editors, and archive teams who review metadata before sending photos to a library or archive.”

### F-1-19 — Minor — The README exposes the storage implementation before explaining it

- Exact quote/location: README Capabilities, “Try three realistic records at `/demo`; this uses a separate `demo:caption-queue` IndexedDB database.”
- Why this fails: the database name and browser API describe implementation, not the useful isolation result.
- Proposed rewrite: “Try three realistic records at `/demo`; the demo uses a separate browser database.” Move the exact IndexedDB namespace to `.factory/demo.md`.

### F-1-20 — Minor — The README repeats “IndexedDB” in a user-facing capability

- Exact quote/location: README Capabilities, “Save metadata locally in IndexedDB and reopen the queue offline after the first visit.”
- Why this fails: the reader needs to know where the data stays, not the browser API’s name.
- Proposed rewrite: “Save metadata in this browser and reopen the queue offline after your first visit.”

### F-1-21 — Minor — The README leads with an API name instead of the result

- Exact quote/location: README Capabilities, “Write `.xmp` sidecars through the File System Access API where supported, with browser downloads as a portable fallback.”
- Why this fails: the implementation name obscures the practical difference between direct folder writing and downloads.
- Proposed rewrite: “Write `.xmp` files directly to a chosen folder in supported browsers, or download them elsewhere.”

### F-1-22 — Minor — “Same-origin requests” is privacy jargon

- Exact quote/location: README Privacy and data ownership, “The free metadata workflow makes only same-origin requests.”
- Why this fails: a non-developer cannot convert “same-origin” into a clear privacy consequence on first read.
- Proposed rewrite: “The free metadata workflow contacts only this site’s own servers.”

### F-1-23 — Minor — One README sentence exceeds 22 words

- Exact quote/location: README Deployment, “The included Azure Static Web Apps configuration rewrites `/demo`, `/privacy`, and `/terms` to the app and serves the designed 404 page for unknown paths.”
- Word count: 24.
- Why this fails: it exceeds the 22-word hard cap and combines routing with 404 behavior.
- Proposed rewrite: “The Azure Static Web Apps configuration routes `/demo`, `/privacy`, and `/terms` to the app. Unknown paths use the designed 404 page.”

### F-1-24 — Minor — User-facing copy alternates among photo, photograph, and image for the same source item

- Exact locations: “Choose photo folder,” “Move one photograph at a time,” “Start from an image folder,” “Move image by image,” and “It does not change image files.” The README also alternates “photo folder” and “image folder.”
- Why this fails: the product otherwise has a useful distinction between a photo and its queue record; extra synonyms weaken that vocabulary.
- Concrete fix: use “photo” for source media and “record” for a queued metadata item: “Move one photo at a time,” “Start from a photo folder,” “Move photo by photo,” and “It does not change photo files.”

## Copy audit — landing page

Counts treat hyphenated terms, abbreviations, numbers, paths, and code tokens as one word.

| Sentence or sentence-like copy | Words | Result |
| --- | ---: | --- |
| Caption large shoots without changing originals | 6 | Copy passes; claim coverage fails F-1-2 |
| For photographers with large shoots, it turns folders or CSV files into a focused queue for clean XMP sidecars. | 19 | F-1-13 |
| Opens three edited sample records. | 5 | Pass |
| Runs offline after the first visit. | 6 | Pass |
| Photos and metadata stay on this device. | 7 | Pass |
| Free for 25 records per shoot. | 6 | Pass |
| Field edition costs $24 once. | 5 | Pass |
| Keep one shoot in view. | 5 | Pass |
| Reuse its terms, check every record, then send clean sidecars to your DAM. | 13 | F-1-14 |
| Start from an image folder or a CSV file. | 9 | F-1-24 |
| Move image by image with shared terms and caption tokens. | 10 | F-1-24 |
| Review the XML and export .xmp sidecars. | 7 | F-1-15 |
| Caption Queue stores the workspace in this browser. | 8 | Pass |
| It sends nothing during the free metadata workflow. | 8 | Pass |
| It writes XMP sidecars. | 4 | F-1-16 |
| It does not change image files or generate captions for you. | 11 | Claim coverage fails F-1-2 and F-1-4; terminology F-1-24 |
| Field edition removes the 25-record import limit, adds saved shoots, and enables batch edit patterns. | 15 | Pass |
| Core XMP and data exports remain free. | 7 | Pass; matching exports were tested without a paid license |
| Photo metadata stays on this device during the free workflow. | 10 | Pass |
| Caption Queue v1.0.0 · Built by Param Factory · Field-desk image generated for this product. | 15 | Pass |

No landing sentence exceeds 22 words or contains a banned marketing adjective. Headings and controls were also checked: the headline is six words; the main actions use result-naming verbs; `How it works`, `Privacy and limits`, and `One-time license` make sense out of context. F-1-12 records the decorative image caption. F-1-6 through F-1-11 record the unclear demo headings reached from the landing action.

## Copy audit — README

| Sentence | Words | Result |
| --- | ---: | --- |
| Caption Queue is a local metadata queue for photographers handling large shoots. | 12 | Pass |
| It turns a photo folder or CSV file into a keyboard-friendly review queue, then exports well-formed XMP sidecars without changing image files. | 22 | F-1-17; terminology also F-1-24 |
| Photographers, editors, and archive teams who need focused metadata review before a DAM handoff. | 14 | F-1-18 |
| The free edition accepts 25 records per shoot. | 8 | Pass |
| The optional $24 Field edition is a one-time license that removes the import limit, adds saved shoots, and enables batch edit patterns. | 22 | Pass |
| XMP writing, backups, accessibility, and privacy remain free. | 8 | Pass; XMP is established by the preceding rewrite |
| Try three realistic records at `/demo`; this uses a separate `demo:caption-queue` IndexedDB database. | 13 | F-1-19 |
| Import an image folder or a CSV with a required `filename` column. | 12 | F-1-24 |
| Save metadata locally in IndexedDB and reopen the queue offline after the first visit. | 14 | F-1-20 |
| Navigate with the queue, J/K keys, or Previous/Next; save and advance with Cmd/Ctrl+Enter. | 13 | Pass |
| Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens. | 10 | Pass |
| Preview well-formed, escaped XMP and validate required editorial fields before marking a record ready. | 14 | Pass after XMP is defined in the introduction |
| Write `.xmp` sidecars through the File System Access API where supported, with browser downloads as a portable fallback. | 18 | F-1-21 |
| Export metadata CSV and JSON workspace backups; restore a JSON backup on another browser. | 14 | Pass |
| Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`. | 20 | Pass; technical reference list |
| Requires Node.js 20+. | 3 | Pass; developer section |
| `npm run build` is the factory work-order build command. | 9 | Pass; developer section |
| It creates the static deployment at `dist/`, with `dist/index.html` at its root. | 12 | Pass; developer section |
| Browser tests use Playwright 1.58.2 and the preinstalled Chromium build. | 10 | Pass; developer section |
| There are no analytics, trackers, third-party fonts, or third-party runtime scripts. | 11 | Pass |
| The free metadata workflow makes only same-origin requests. | 8 | F-1-22 |
| Only a pasted paid-license token is sent to the Sociobot licensing endpoint for verification. | 14 | Pass; the product and endpoint are named |
| See `/privacy` and `/terms` in the app for the full policies. | 11 | Pass |
| Deploy the contents of `dist/` to a static host. | 9 | Pass; developer section |
| The included Azure Static Web Apps configuration rewrites `/demo`, `/privacy`, and `/terms` to the app and serves the designed 404 page for unknown paths. | 24 | F-1-23 |
| Documents and `sw.js` revalidate, while `/assets/*` uses one-year immutable caching. | 10 | Pass; developer section |
| Serve HTTPS for service workers, installability, and directory writing. | 9 | Pass; developer section |
| Do not configure secrets in the client bundle. | 8 | Pass; developer section |
| Every visitor-facing product promise and its clean demo test are listed in `.factory/claims.json`. | 13 | Fails in practice because of F-1-2 and F-1-4 |
| Demo isolation and reset behavior are documented in `.factory/demo.md`. | 9 | Pass |
| MIT. | 1 | Pass |
| Generated artwork provenance is recorded in `.factory/design.md`. | 7 | Pass |

README labels (“Live product,” “One-click sample”) and all headings were checked separately. They name their destinations or sections. Deployment-specific technical terms are retained because that section addresses maintainers.

## Terminology check

| Concept | Current words | Required single term |
| --- | --- | --- |
| Source media | photo, photograph, image | photo |
| One queued unit | record | record |
| Group of records | shoot | shoot |
| Ordered work | queue | queue |
| Exported companion file | XMP sidecar, `.xmp` sidecar, sidecar, XML | define once as “`.xmp` metadata file,” then use `.xmp` file |
| Isolated sample experience | demo, sample data | demo for the mode; sample data for its contents |
| Paid tier | Field edition | Field edition |

## Demo and sandbox

- One-click entry: pass from the first screen and direct `/demo`.
- Immediate product use: pass. The first demo viewport shows “Salt marsh bird survey,” photo 1 of 3, populated title/caption fields, progress, and navigation.
- Realistic sample: pass. Three named bird-survey records are present; two are ready and one requires two fields.
- Persistent banner: pass. It shows “Demo — sample data, nothing is saved,” “Reset demo,” and “Start for real.”
- Reset: pass. Editing the first title and pressing Reset restored “Great blue heron lifting from reeds.”
- Isolation: pass. A seeded `caption-queue` real database retained “Private client shoot” and “Private title” after demo editing/reset. Start for real deleted `demo:caption-queue` and left only `caption-queue`.
- Requests: pass. The live landing/demo flow requested only the product origin and its own JS, CSS, and artwork.
- Offline: pass. After service-worker control, a changed demo title survived an offline reload with `navigator.onLine === false`.

## Claims audit

Every exact `test` command in `.factory/claims.json` was run after `npm ci` in a separate temporary clone of base commit `6ceb3ce`. Each selected exactly one tagged test.

| Claim id | Result | Observable assertion |
| --- | --- | --- |
| `demo-sandbox` | Pass | One-click, three records, reset, real-data isolation, discard |
| `offline-reload` | Pass | Edited demo and real queue reload offline |
| `local-privacy` | Pass | Demo edit/export traffic stays same-origin |
| `xmp-export` | Pass | XML parses and sensitive characters are escaped |
| `photo-import` | Pass | Two undecodable fixtures become records |
| `metadata-tools` | Pass | Tokens, controlled term, validation failure/recovery |
| `bulk-xmp` | Pass | Three named sidecar downloads |
| `free-limit` | Pass | 26 rejected and 25 accepted |
| `field-edition` | Pass | Price text and licensed feature fixture paths |
| `local-persistence` | Pass | Edited title survives reload |
| `csv-export` | Pass | Header plus three record rows |
| `backup-restore` | Pass | Exported backup restores edited data |
| `backup-cross-browser` | Pass | Backup restores in a separate browser context |
| `direct-sidecar-write` | Pass | Three named sidecars written through a recorded directory handle |
| `keyboard-save-next` | Pass | J, Previous/Next, and Ctrl+Enter behavior |
| `license-verification-privacy` | Pass | Bodyless GET contains only the license query value |
| `keyboard-controls` | Pass | J/K and keyboard file-picker activation |

No listed claim test failed. F-1-2 and F-1-4 are unlisted live claims. The live checkout was also opened without completing a purchase; it showed “Caption Queue Field Edition,” a $24.00 total, and “One-time unlock.”

## History review

No earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist. The only prior handoff reported zero defects. Its main assertions were rechecked against the live site and source: build parity, claim suite, demo isolation, offline reload, request boundaries, accessibility, links, security headers, and service-worker tests pass. F-1-1, F-1-2, F-1-3, and the copy findings above were not recorded there and remain present in the live build.

## Structure, accessibility, and links

| Check | Result |
| --- | --- |
| `/` title, one h1, description, canonical, OG, favicon | Pass |
| `/demo` route-specific title/description/canonical/OG, one h1 | Pass |
| `/privacy` route-specific title/description/canonical/OG, one h1 | Pass |
| `/terms` route-specific title/description/canonical/OG, one h1 | Pass |
| Live 404 status and designed styling | HTTP/status pass; shell/metadata fail F-1-3 |
| Deep-link reloads | Pass |
| Route-change h1 focus and live announcement | Pass |
| Browser Back/Forward | Fail on mobile scroll restoration, F-1-1 |
| Link crawl | Pass; all discovered internal links, GitHub source, and checkout returned 200 after redirects where applicable |
| Header/footer Privacy and Terms | Pass on app routes; fail on 404, F-1-3 |
| Axe serious/critical at mobile dark/reduced-motion | Pass with zero violations on `/`, `/demo`, `/privacy`, `/terms`, and a 404 |
| `verify-url.sh` | Pass at desktop and 390 px |
| Console errors on cold load | Pass; none observed |
| Distinct visual identity | Pass; the botanical field-desk palette, editorial type, ruled sheets, stamps, and original artwork are recognizably product-specific rather than a generic SaaS template |

## Missed leverage

No additional feature finding is warranted. The brief asks for folder/CSV intake, reusable terms/tokens, preview, XMP sidecars, offline/local storage, and deliberate manual captioning; all are present. CSV/JSON import/export and direct/download sidecar export cover the obvious portability need. An AI caption feature would conflict with the brief’s “no LLM-generated claims” constraint and is not needed for the core job. Cloud sync would weaken the local-first privacy model and is not implied strongly enough to add.

## Verification summary

- `npm test`: 15/15 passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; JS 45.45 kB raw / 15.47 kB gzip, CSS 20.90 kB raw / 5.34 kB gzip.
- `npm run test:e2e -- --reporter=line`: 32/32 passed.
- All 17 exact claim commands: passed in the original clean worktree and repeated in a separate clean clone.
- `npm run test:live -- https://photo-metadata-queue.sociobot.in/`: passed; 20 deployed artifacts match the build.
- `npm run verify:url -- https://photo-metadata-queue.sociobot.in/`: passed.
- Independent live Axe run: zero violations on all app routes and the 404.

## What would make this perfect

Resolve F-1-1 through F-1-24, especially the mobile history regression, the two unlisted safety/scope claims, and the incomplete 404 shell. Then rerun the exact claim commands from a clean clone, add regression coverage for mobile scroll restoration and 404 metadata/navigation, repeat the full copy audit, and require a genuinely empty finding list before changing the verdict to PASS.
