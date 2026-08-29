# Independent verification 10 — PASS

- **Candidate:** `b93374b4de77c4786d899e28f6eec6b241f21aae`
- **Live URL:** <https://photo-metadata-queue.sociobot.in/>
- **Verified:** 2026-08-29 UTC
- **Scope:** clean-checkout independent product QA; product code was not modified

## Result

**PASS.** The candidate satisfies the researched brief and factory acceptance contract. The mandatory claims and first-read gates pass. The live deployment byte-matches the fresh production build. No critical, high, medium, or low product defect was found.

## Mandatory gate: claims

`.factory/claims.json` exists and contains 17 claims. After the documented clean-checkout prerequisite `npm ci`, every listed `test` command was run separately. Each command selected exactly one tagged browser test and passed.

The literal pre-install invocation stopped before test discovery because a clean checkout has no local `@playwright/test`. This was a missing dependency prerequisite, not a failed claim assertion. `npm ci` installed the locked dependencies, after which all exact commands passed:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — isolated three-record demo, reset, and real-data separation |
| `offline-reload` | PASS — demo and real queues reopen offline |
| `local-privacy` | PASS — free workflow is same-origin only |
| `xmp-export` | PASS — parsed XML and escaped sensitive characters |
| `photo-import` | PASS — undecodable JPEG fixtures become queue records |
| `metadata-tools` | PASS — tokens, controlled terms, and validation |
| `bulk-xmp` | PASS — one fallback sidecar per record |
| `free-limit` | PASS — 25 accepted and 26 rejected |
| `field-edition` | PASS — $24 once, unlimited import, saved shoots, and batch patterns with recorded verdict |
| `local-persistence` | PASS — edit survives reload |
| `csv-export` | PASS — header and three data rows |
| `backup-restore` | PASS — exported workspace restores |
| `backup-cross-browser` | PASS — backup restores in a separate fresh context |
| `direct-sidecar-write` | PASS — compatible directory handle receives all sidecars |
| `keyboard-save-next` | PASS — controls and Ctrl/Cmd+Enter save and move |
| `license-verification-privacy` | PASS — bodyless GET with only the token query value |
| `keyboard-controls` | PASS — J/K and keyboard-operated landing import |

Every ID occurs exactly once in `tests/e2e/claims.spec.ts`. The landing, legal pages, and README were cross-checked against the manifest; no material unlisted claim was found.

## Mandatory gate: cold first read

**PASS.** A fresh live context with no storage answered all three questions in the first viewport:

- What it does: **“Caption large shoots without changing originals.”** The next sentence explains folder/CSV input and XMP sidecars.
- Who it serves: **“For photographers with large shoots.”**
- What to click first: **“Try it with sample data,”** next to **“Opens three edited sample records.”**

The link opened `/demo` in one click with “Salt marsh bird survey,” three records, `2 of 3 ready`, a persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real**. At 390 × 844, the headline, audience sentence, sample action, explanation, and all three plain facts ended by y=791.83 px. Screenshots: [`qa-10/first-read-desktop.png`](qa-10/first-read-desktop.png) and [`qa-10/first-read-mobile.png`](qa-10/first-read-mobile.png).

## Clean checkout and production build

| Check | Evidence |
| --- | --- |
| Candidate and worktree | Initial `HEAD` was exactly `b93374b4de77c4786d899e28f6eec6b241f21aae`; worktree was clean. |
| Install | `npm ci` installed 60 locked packages; audit reported 0 vulnerabilities. |
| Unit/integration | `npm test`: 15/15 tests passed in four files. |
| Type/lint | `npm run typecheck` passed. `npm run lint --if-present` completed; no lint script is configured. |
| Dependency audit | `npm audit --audit-level=high`: 0 vulnerabilities. |
| Exact build | `npm run build` passed and produced `dist/index.html`. |
| Complete browser suite | `npm run test:e2e -- --reporter=list`: 32/32 passed, including the same-URL worker-update regression. |
| Source hygiene | `git diff --check` passed. |

Fresh build sizes are 45,446 B JavaScript (15,437 B gzip), 20,896 B CSS (5,356 B gzip), no font payload, and a 32,228 B mobile hero. These are well inside the 200 KB JS, 50 KB CSS, 120 KB fonts, and 300 KB mobile-image budgets.

Key fresh-build hashes:

- `dist/index.html`: `93dbed8773376733add384071e4d92b26d895054a7ff76e8de3fce58f61a0a1f`
- `dist/assets/index-bRWyb-qK.js`: `69a3351b021542d443ab9b8097a262d069aabdf8e60624be231e5aaa786866bd`
- `dist/assets/index-DtnRdKor.css`: `d81c6c36eeae34d06f417af6bc10fb16e0b9e207665cdc1cc94587db29116ae4`
- `dist/sw.js`: `6473812409c12a855f7fc1c87a9ae4e8c77b8ce2d42f5e7d776702f6b48fc557`

## End-to-end workflow and recovery

Fresh live exercises covered normal, boundary, invalid, and recovery paths:

- The one-click demo opened three realistic records and started at `2 of 3 ready`.
- Submitting the unfinished record announced “2 required items remain. Add a title.” and moved focus to the validation ledger.
- Exact 256-character title and 2,000-character caption values were accepted and completed `3 of 3 ready`.
- Imported 257/2,001-character values produced both specific length errors, stayed unfinished, focused validation, and recovered to `1 of 1 ready` after correction.
- `Heron & <returning> "quoted"` exported as `BIRDS_1842.xmp`; the XMP parsed and source XML characters were escaped.
- Metadata CSV contained one header plus three records.
- A malformed JSON backup produced a useful parse error and retained the three current records.
- CSVs with a missing filename heading and blank filename produced specific errors. A later valid CSV recovered and preserved a quoted comma and embedded newline.
- The free boundary was exact: 26 records were rejected and 25 imported.
- Two intentionally undecodable JPEG fixtures became local queue records without any photo upload.
- Controlled vocabulary, caption tokens, backup/restore, direct-folder and download sidecars, paid batch patterns, saved shoots, and undo paths passed in the full suite.

The live workbench is a complete review queue, not a landing-page mock. Screenshots: [`qa-10/demo-desktop.png`](qa-10/demo-desktop.png) and [`qa-10/demo-mobile-dark.png`](qa-10/demo-mobile-dark.png).

## Privacy, billing, and server allowance

- Playwright recorded the complete live free edit plus XMP/CSV export. The only requests were the document and same-origin image, script, and stylesheet. There were no analytics, trackers, remote fonts/scripts, photo uploads, AI requests, or API calls.
- License verification sent one bodyless `GET` to `https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify` with `license` as its only query key. An invalid verdict left paid features locked and produced a useful message.
- A fresh single-client burst received 30 HTTP 200 invalid verdicts. Request 31 returned HTTP 429 with `Retry-After: 4`; CORS allowed the product origin. **Observed allowance: 30 accepted requests per window.**
- Checkout returned HTTP 303 to the Sociobot/Dodo hosted checkout. No payment provider is embedded in the product.
- Source inspection found only the product origin, GitHub source link, and the two allowed Sociobot billing endpoints. The product has no sign-in, product backend, health endpoint, or remote persistence service, so Entra identity, backend concurrency, and server persistence checks are not applicable.

## Accessibility, mobile, and visual review

- Desktop-light and 390px dark/reduced-motion Axe scans covered `/`, `/demo`, `/privacy`, and `/terms`; the designed HTTP 404 was also scanned. All had zero serious/critical findings.
- Every route had `lang=en`, a route-specific title, one `<h1>`, one `<main>`, no horizontal overflow, and no page/console errors.
- Keyboard-only use reached the 44px skip link and visible import controls. Focus is a visible 3px ochre outline. Enter opened the file picker; J/K moved the queue; Ctrl+Enter saved; invalid submission focused validation.
- The open license dialog focused **Close**, had no serious/critical Axe issue, closed with Escape, and returned focus to its opener.
- All visible mobile controls measured at least 44 × 44 CSS px. The populated demo reflowed at 200% text with `scrollWidth=390`.
- Reduced motion shortened animation and transition durations to `1e-05s`. Dark and light treatments both passed automated contrast checks.
- The field-guide visual system is product-specific and matches `.factory/design.md`: herbarium paper, fern/ochre palette, specimen indexing, editorial image, dense workbench, and restrained state motion. It does not resemble a generic SaaS template.

## PWA, deployment identity, headers, caching, links, and performance

- `npm run test:live -- https://photo-metadata-queue.sociobot.in/` proved all 20 deployed files byte-match the fresh `dist`; this live deployment is the candidate artifact.
- `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed desktop semantics and the 390px layout.
- Chromium reported no installability errors. The manifest has standalone display, versioned start URL, and 192/512/maskable icons.
- A changed live-demo title survived a real offline reload and showed **Offline · work is saved**.
- The fixed same-URL update reproduction changed the exact candidate worker from `caption-queue-v3` to `caption-queue-v3-qa9`. Choosing **Refresh** caused one successful reload under the new controller, removed the old cache, kept `<main>` visible, and produced no errors.
- HTML, manifest, and `sw.js` return `no-cache, no-store, must-revalidate`. The hashed JS asset returns `public, max-age=31536000, immutable`.
- Live HTML sends HSTS, same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, COOP/CORP, and restrictive permissions policy.
- All discovered home/demo/privacy/terms/source links returned 200. Checkout returned its expected 303. Unknown routes return the designed HTTP 404.
- Lighthouse 12.8.2 mobile: Performance 94, Accessibility 100, Best Practices 100, SEO 100; FCP 1,433 ms, LCP 1,555 ms, TBT 261 ms, CLS 0, Speed Index 1,433 ms, transfer 139,613 B. Lighthouse supplied no field INP value; tested interactions gave immediate feedback.

## Defects by severity

| Severity | Count | Findings |
| --- | ---: | --- |
| Critical | 0 | None |
| High | 0 | None |
| Medium | 0 | None |
| Low | 0 | None |

One old verifier helper under `.factory/verification-evidence-8/` assumes local photo import always observes one same-origin request after attaching its listener. Fresh runs alternated between zero and one pending same-origin asset request. The privacy invariant is that every observed request is same-origin; the current claim test enforces that correctly. This is stale historical evidence code, not shipped product code or an active quality-gate failure.

## Applicability and remaining evidence

Library/CLI pack-install is not applicable to this static offline-first PWA. The brief explicitly excludes generative captions; no AI feature is missing from the smallest useful product. The researched “half prior time with 95% accepted sidecars” success measure still requires a photographer pilot and baseline. The product does not claim that outcome as proven.

## Reproduce

```sh
npm ci
# Run each .factory/claims.json test entry separately
npm test
npm run typecheck
npm run lint --if-present
npm audit --audit-level=high
npm run build
npm run test:e2e -- --reporter=list
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
```
