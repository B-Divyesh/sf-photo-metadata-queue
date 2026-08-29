# Independent verification 6 — FAIL

**Date:** 2026-08-29 UTC  
**Candidate:** `6c9615909cde7cf65ed0ab28a0c83ed8ed05c820`  
**Live URL:** <https://photo-metadata-queue.sociobot.in/>  
**Scope:** clean install, every declared claim command, production build, live deployment identity, product workflows, privacy, accessibility, mobile, PWA, performance, response policy, and paid endpoint behavior.

## Verdict

**FAIL — do not release this candidate.** The clean-checkout claim commands now run and all 13 pass, and the live deployment exactly matches the candidate build. The core local metadata workflow, demo, exports, accessibility, offline behavior, and performance are strong. However, the paid license gate fails open when its first verification request receives an error, including a real API `429`. An arbitrary string then activates Field edition without a valid cached verdict. The claims manifest also does not fully meet the attached claims contract.

This is fresh evidence. The previous deployment-only/clean-clone failure is not present in this candidate.

## Release-blocking defects

### High — an unverified token unlocks Field edition when verification fails

Reproduced against the live product in a fresh browser:

1. Open `/` and choose **View pricing**.
2. Paste `definitely-invalid` in the license field.
3. Exhaust the real verification endpoint's allowance with invalid-token requests.
4. Choose **Verify license**. The browser's real request returns HTTP `429` with `Retry-After: 4`.
5. The live UI changes to **Field edition** and its dialog says **Field edition is active**.

Observed state after the failed request:

```json
{
  "browserVerifyStatus": 429,
  "retryAfter": "4",
  "unlockedButton": true,
  "activeText": 1,
  "cachedVerdict": null
}
```

The same result occurred when the request was aborted as a network failure. A normal online invalid-token response (`200 {"valid":false}`) is rejected correctly.

Cause: `verifyLicense()` catches a non-OK/network response and returns `hasLicense()`. After `saveLicense()` stores any token and clears the verdict, `hasLicense()` returns `true` merely because a token exists. This contradicts the paid-unlock contract: a first unlock must be verified; only an existing cached valid verdict may be used optimistically.

Impact: any visitor can activate the paid record limit, saved shoots, and batch editing during an outage or after causing/encountering the documented rate limit.

Required repair: distinguish an unverified token from a cached valid verdict. Keep first-time or previously invalid tokens locked on verification errors, show a retry message, honor `Retry-After`, and preserve offline optimism only for a still-acceptable cached valid verdict. Add tests for `valid:false`, network failure, and `429`.

### Major, contract blocker — declared claim tests do not prove all published claims

All 13 tags exist exactly once and their commands pass, but the manifest/test coverage violates the attached rule that the tagged test must prove the complete observable promise and that claim-like copy must be listed.

- `offline-reload` says both the demo and a saved real queue reopen offline. Its exact tagged test at `tests/e2e/claims.spec.ts:79` tests only the demo database. A separate untagged browser test covers a real queue, but it is not run by the claim's declared `--grep` command.
- `field-edition` promises batch edit patterns. Its exact tagged test at `tests/e2e/claims.spec.ts:165` only opens the batch dialog and checks its heading; it never applies a pattern or asserts changed metadata. Independent QA confirmed the feature works, but the declared claim test does not prove it.
- README claim-like statements are stronger than the entries/tests in `.factory/claims.json`: Cmd/Ctrl+Enter and Previous/Next controls (`README.md:18`), direct File System Access writing (`README.md:21`), restore into another browser (`README.md:22`), and paid-license verification sending only the token (`README.md:45`). These outcomes are not named and completely exercised by a corresponding tagged claim test.

Independent QA verified these behaviors where practical: Ctrl+Enter advanced the queue, mocked File System handles received three XMP files, a backup restored in a separate browser context, and license verification used a GET with only the `license` query key. That does not satisfy the required manifest-driven release gate.

Required repair: expand the exact tagged tests/claim wording so each complete promise is observable under its declared command, and add entries for the stronger published statements or remove those statements.

## Mandatory first actions

### Claims gate — command execution PASS

The checkout began clean at the requested commit. `.factory/claims.json` existed. After `npm ci`, every exact command was run separately before the general build/test work.

| Claim | Exact command result |
| --- | --- |
| `demo-sandbox` | PASS, 1 test |
| `offline-reload` | PASS, 1 test |
| `local-privacy` | PASS, 1 test |
| `xmp-export` | PASS, 1 test |
| `photo-import` | PASS, 1 test |
| `metadata-tools` | PASS, 1 test |
| `bulk-xmp` | PASS, 1 test |
| `free-limit` | PASS, 1 test |
| `field-edition` | PASS, 1 test |
| `local-persistence` | PASS, 1 test |
| `csv-export` | PASS, 1 test |
| `backup-restore` | PASS, 1 test |
| `keyboard-controls` | PASS, 1 test |

Each command built and served the production artifact from the clean clone. The quality problems above are gaps in what two tagged tests and the manifest prove, not command failures.

### First-read gate — PASS

Cold live desktop and 390 px mobile views answer all three questions in plain words:

- **What:** “Caption large shoots without changing originals,” with the XMP-sidecar explanation.
- **Who:** “For photographers with large shoots”.
- **First click:** **Try it with sample data**, followed by “Opens three edited sample records.”

The primary action opens `/demo` in one click. The persistent banner, **Reset demo**, and **Start for real** are present. At 390 × 844 the headline, audience sentence, sample action, explanation, and all three offline/privacy/price facts are fully inside the first viewport; the facts end at y=755.64 px.

## Clean checkout and build gates

| Check | Result |
| --- | --- |
| Candidate identity | `git rev-parse HEAD` = `6c9615909cde7cf65ed0ab28a0c83ed8ed05c820`; initial tree clean |
| Install | `npm ci` passed; 60 packages installed; 0 audit vulnerabilities |
| Unit/integration | `npm test` passed 14/14 tests across 4 files |
| Types | `npm run typecheck` passed |
| Lint | No lint script is present |
| Production build | `npm run build` passed and produced `dist/` |
| Full browser suite | `npm run test:e2e` passed 21/21 |
| Local URL verifier | Passed desktop and 390 px routes/semantics/axe/console checks |
| Live URL verifier | Passed desktop and 390 px routes/semantics/axe/console checks |

Production output:

- JS: 43,819 bytes, 14.98 kB gzip — below the 200 kB budget.
- CSS: 20,046 bytes, 5.22 kB gzip — below the 50 kB budget.
- Fonts: none — below the 120 kB budget.
- Desktop hero: 72,452 bytes; mobile hero: 32,228 bytes — below the 300 kB budget.

## Independent product workflow evidence

### Core job and normal cases

- The live demo opened three realistic “Salt marsh bird survey” records and only the `demo:caption-queue` IndexedDB database.
- A missing-title/caption record refused **Mark ready & next** with “2 required items remain. Add a title.” Filling the required fields recovered and produced 3 of 3 ready.
- Exact accepted boundaries of 256 title characters and 2,000 caption characters were saved and marked ready.
- `Heron & <returning>` exported as `Heron &amp; &lt;returning&gt;`; the downloaded XMP parsed without an XML error.
- Metadata CSV contained the header plus one row per sample record (4 rows total).
- J moved to `BIRDS_1843.JPG`; Ctrl+Enter saved and advanced to `BIRDS_1844.JPG`.
- Direct folder writing was exercised with File System Access-compatible handles: `BIRDS_1842.xmp`, `BIRDS_1843.xmp`, and `BIRDS_1844.xmp` were written and contained XMP. The fallback claim separately downloaded all three files.
- An exported demo backup with a changed title restored all three records into a separate fresh browser context and the real `caption-queue` database.
- With a recorded valid verification response, a 26-record batch title pattern produced `Catalog 001 — FRAME_001`; **Undo** restored `Original 1`.
- A 100-record licensed CSV shoot rendered in 249 ms in the QA environment with no product error. The brief's human “half prior time” success measure still requires a photographer pilot and baseline.

### Invalid input, limits, and recovery

- A CSV without `filename` showed “Add a filename column to the CSV.”
- A CSV row with an empty filename showed “Row 2 has no filename.”
- Recovery with a quoted CSV correctly preserved a comma in the title and an embedded newline in the caption.
- Malformed JSON showed the browser's exact parse error and left the three-record workspace intact.
- The declared free-limit test rejected 26 records and accepted exactly 25.
- A normal online invalid license was rejected with “That license is not active. Check the token and try again.” The error/429 path fails open as documented above.

## Privacy, endpoint, and response-policy evidence

- The complete independent free demo edit/export flow made requests only to `https://photo-metadata-queue.sociobot.in`; there were no console/page errors.
- The demo created only `demo:caption-queue`. No Sociobot license token was created by the free flow.
- The license-verification request is a GET to `https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify` with the `license` query key. No photos or metadata were sent during the observed flow.
- The product has no analytics, remote fonts, third-party scripts, or cloud image upload in the observed request log or built source.
- Live HTML returned the shipped CSP plus `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict referrer policy, COOP/CORP, HSTS, and restrictive camera/geolocation/microphone/payment/USB permissions.
- The checkout link returned HTTP 303 to Dodo hosted checkout. No payment provider is embedded in the app.
- The product has no sign-in, so the Microsoft Entra authority check is not applicable.

### Product-unlock API allowance

A bounded single-client burst to the real verify endpoint returned 30 successful invalid-token checks, then request 31 returned HTTP `429` with `Retry-After: 4` and `X-RateLimit-After: 4`. Observed allowance: **30 accepted requests per rate-limit window**. The API enforcement passes; the client mishandles the 429 as described in the High defect.

## Accessibility, mobile, and resilience

- `npm run verify:url` passed all routes locally and live at 1366 × 900 and 390 × 844: correct titles/lang, one `h1`, one `main`, alt text, no horizontal overflow, no console/page errors, and zero serious/critical axe findings.
- Independent dark-theme mobile axe scan also found zero serious/critical violations.
- Keyboard focus opened and closed the mobile queue correctly and returned to its trigger. Visible controls tested at 390 px had no target below 44 × 44 px.
- The designed focus ring is 3 px; keyboard file-picker activation passed on desktop and mobile.
- With reduced motion, observed transition and animation duration was `1e-05s`.
- At simulated 200% root text sizing on a 390 px viewport, the h1 and editor remained visible with no horizontal overflow.
- The mobile first screen and editor had no page/console errors.

## PWA, offline, caching, and performance

- The live page became service-worker controlled. A saved demo title survived an offline reload at 390 px.
- Registering the live worker with an update query produced the announced “An update is ready.” state and a waiting worker.
- The manifest uses standalone display, a versioned start URL, theme/background colors, and 192/512/maskable icons.
- Live HTML and `sw.js` use `no-cache, no-store, must-revalidate`. Hashed assets use one-year immutable caching.
- All discovered internal links returned 200. The source link returned 200. The buy link returned the expected 303.
- Lighthouse 12.8.2 live mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.5 s, CLS 0, TBT 60 ms, Speed Index 1.2 s, total transfer 136 KiB. Lab INP was unavailable; Playwright interaction checks passed.

## Deployment identity

`npm run test:live -- https://photo-metadata-queue.sociobot.in/` passed: all 20 deployable artifacts match the fresh candidate build byte-for-byte, including SPA routes, designed 404, headers, manifest, service worker, and cache policy.

- `dist/index.html` and live `/`: `687021ab1b989016142432edde0d86c7e5d39d219e5aeebbc94e76b2c95cf1ed`
- `dist/sw.js` and live `/sw.js`: `3d2d6e9c20c10ea8f3d4df23f9479e7e25dfc0ef6af0d292936143aab96fbafd`

The live deployment is the candidate. This FAIL is not caused by stale or missing deployment content.

## Required next steps

1. Fix first-verification error handling so an uncached/unverified token cannot unlock paid features on network errors or 429 responses.
2. Add paid-license tests for invalid, network-error, and rate-limit responses.
3. Make the tagged `offline-reload` and `field-edition` tests prove their complete claim text.
4. Add claim entries/tests for the stronger README/UI promises or narrow the copy.
5. Re-run independent verification from a clean checkout and redeploy the repaired artifact.
