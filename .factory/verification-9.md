# Independent verification 9 — FAIL

- **Candidate:** `a862edae336d391e0a736d2b42fbb9448a6a32f1`
- **Live URL:** <https://photo-metadata-queue.sociobot.in/>
- **Verified:** 2026-08-29 UTC
- **Scope:** clean-clone independent product QA. Product code was not modified.

## Result

**FAIL.** The mandatory claims, cold first-read gate, core metadata workflow, deployment identity, privacy controls, billing rate limit, accessibility scans, mobile layout, offline reload, installability, and performance budgets pass. Release acceptance is blocked by one PWA update defect: choosing **Refresh** after a changed service worker reaches the waiting state starts a page request but does not complete the reload.

## Mandatory claims gate

`.factory/claims.json` exists. Before broader QA, every listed command was run separately from the clean candidate checkout through the demo entry point. All 17 passed:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `offline-reload` | PASS |
| `local-privacy` | PASS |
| `xmp-export` | PASS |
| `photo-import` | PASS |
| `metadata-tools` | PASS |
| `bulk-xmp` | PASS |
| `free-limit` | PASS |
| `field-edition` | PASS |
| `local-persistence` | PASS |
| `csv-export` | PASS |
| `backup-restore` | PASS |
| `backup-cross-browser` | PASS |
| `direct-sidecar-write` | PASS |
| `keyboard-save-next` | PASS |
| `license-verification-privacy` | PASS |
| `keyboard-controls` | PASS |

Each command selected exactly one test. Per-claim logs and the result matrix are in `verification-evidence-9/claims/`. Landing, legal-page, and README promises are represented by observable claim tests; no material unlisted claim was found.

## Cold first-read gate

**PASS.** A fresh live desktop context showed, in the first viewport:

- What it does: “Caption large shoots without changing originals,” followed by the folder/CSV-to-XMP explanation.
- Who it serves: “For photographers with large shoots.”
- What to click first: **Try it with sample data**, next to “Opens three edited sample records.”

The link opened `/demo` in one click with three realistic records, a persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real**. At 390 × 844, the headline, audience sentence, sample action, action explanation, and all three facts fit in the initial viewport; the last fact ended at y=791.83 px. Evidence: `live-first-read-desktop.png`, `live-first-read-mobile.png`, and `live-accessibility.log`.

## Clean checkout and local gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — initial `HEAD` exactly matched `a862edae336d391e0a736d2b42fbb9448a6a32f1` and the worktree was clean |
| Install | PASS — `npm ci`; 60 packages, 0 vulnerabilities |
| Unit/integration | PASS — `npm test`; 15/15 tests in four files |
| Type checking | PASS — `npm run typecheck` |
| Lint | N/A — no lint command exists |
| Production build | PASS — exact `npm run build`; `dist/` produced |
| Complete browser suite | PASS — `npm run test:e2e -- --reporter=list`; 31/31 tests |
| Dependency audit | PASS — `npm audit --audit-level=high`; 0 vulnerabilities |
| Live URL verifier | PASS — desktop and 390 px semantic/layout/Axe/console checks |
| Live artifact identity | PASS — all 20 deployed files byte-match the fresh production build |

The build emits 45,328 B JavaScript (15.42 kB gzip) and 20,896 B CSS (5.34 kB gzip), with no font files. The mobile hero is 32,228 B. Key hashes are `bda2cb…84d0` (`index.html`), `15c507…bee` (JavaScript), `d81c6c…6ae4` (CSS), and `647381…c557` (`sw.js`).

## End-to-end product exercise

- The live one-click demo opened “Salt marsh bird survey” with three records and `2 of 3 ready`.
- Submitting the unfinished record announced “2 required items remain. Add a title.” and focused the validation ledger. Exact 256-character title and 2,000-character caption values were accepted; recovery produced `3 of 3 ready`.
- `Heron & <returning> "quoted"` exported as `BIRDS_1842.xmp`; the XML parsed and source-sensitive characters were escaped. Metadata CSV contained one header plus three records.
- A malformed JSON backup produced a specific parse error and retained the existing three records.
- A CSV without a filename heading and a row with a blank filename produced specific errors. A later valid CSV recovered, preserving a quoted comma and embedded newline.
- The free boundary was exact: 26 rows were rejected and 25 imported. Two intentionally undecodable JPEG fixtures became local queue records.
- The complete browser suite additionally proves demo/real database isolation, reset/discard, cross-browser backup restore, direct and fallback bulk sidecar writing, controlled terms/tokens, and paid batch patterns using a recorded valid verdict.
- The researched time-saving success measure still requires a photographer pilot and prior-time baseline; the product does not present it as proven.

Evidence: `live-core.log`, `live-import-boundaries.log`, `live-demo-desktop.png`, and `full-e2e.log`.

## Privacy, billing, and request allowance

- Playwright recorded the entire live free edit plus XMP/CSV export flow. Every request was same-origin; there was no analytics, tracking, remote font/script, upload, or AI request.
- A live invalid-license attempt sent one bodyless `GET` to `https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify` with `license` as its only query key. The UI remained locked with a useful error.
- The checkout endpoint returned HTTP 303 to hosted Dodo checkout; the application embeds no payment provider.
- A fresh single-client burst received 30 HTTP 200 invalid verdicts. Request 31 returned HTTP 429 with `Retry-After: 4`. CORS allowed the product origin. **Observed allowance: 30 accepted requests per window.**
- The product has no sign-in flow, backend, persistence service, or health endpoint. Entra authority, backend concurrency, and server persistence checks are not applicable.

Evidence: `live-privacy.log`, `license-rate-limit.log`, `checkout-headers.log`, and `response-headers.log`.

## Accessibility, mobile, structure, and console

- Live Axe scans found zero serious/critical findings on `/`, `/demo`, `/privacy`, and `/terms` at desktop and 390 px in light mode. The same routes also had zero serious/critical findings in dark/reduced-motion mode. The designed 404 independently had zero.
- All primary routes have `lang=en`, route-specific titles, one `h1`, one `main`, alt text, and no horizontal overflow.
- Keyboard checks reached the 44 px skip link and the import controls. Focus used a visible 3 px ochre outline. Enter activated **Import CSV**; J/K moved the queue; Ctrl+Enter saved; invalid submission moved focus to the validation summary.
- All visible mobile controls measured at least 44 × 44 CSS px, including transient toast actions. At 200% text, the populated 390 px demo remained exactly 390 px wide.
- Reduced motion produced `1e-05s` transition and animation durations. Light and dark contrast scans passed.
- Normal pages and tested workflows produced no console/page errors. The intentional HTTP 404 produced only Chromium's expected failed-resource console line for the 404 document.

Evidence: `verify-url-live.log`, `live-accessibility.log`, `axe-dark-all-routes.log`, and `404-accessibility.log`.

## PWA, headers, caching, links, and performance

- Chromium found no manifest or installability errors. The manifest has standalone display, versioned start URL, and 192/512/maskable icons.
- A changed demo title survived a live offline reload and the app showed `Offline · work is saved`.
- HTML, the manifest, and `sw.js` revalidate. The hashed app asset sends `public, max-age=31536000, immutable`.
- Live HTML sends HSTS, same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, DENY framing, `nosniff`, strict referrer policy, COOP/CORP, and restrictive permissions policy.
- Every discovered internal/source link returned 200. Checkout returned its expected 303. Unknown routes return the designed HTTP 404.
- Mobile Lighthouse 12.8.2 scored Performance 99, Accessibility 100, Best Practices 100, and SEO 100. FCP was 1,207 ms, LCP 1,510 ms, TBT 116 ms, CLS 0, Speed Index 1,207 ms, and total transfer 139,552 B. Lighthouse supplied no field INP value; tested interactions had immediate visible results.

Evidence: `installability.log`, `response-headers.log`, `link-statuses.log`, `lighthouse-summary.log`, and `lighthouse-live-mobile.json`.

## Release-blocking defect

### Medium — applying a waiting service-worker update can hang the reload

The production code handles the toast action by posting `SKIP_WAITING` and immediately calling `location.reload()` in the same click handler. A controlled same-URL update test served the exact production `dist/`, then changed only the worker cache version from `caption-queue-v3` to `caption-queue-v3-qa9`, matching a normal deployment where `/sw.js` content changes without changing its URL.

Observed sequence:

1. The original worker controlled `/demo` and populated `caption-queue-v3`.
2. `registration.update()` fetched changed `/sw.js`; the app displayed **An update is ready** and the worker reached `waiting`.
3. Choosing **Refresh** requested `/demo` again from the server.
4. Navigation never reached `DOMContentLoaded`; Playwright timed out after 30 seconds, so the new cache/app state could not be confirmed usable.

This fails the requested PWA update check. The repository's current regression only asserts that the toast appears and a worker is waiting; it never chooses **Refresh** or verifies the post-update app.

Required fix: after posting `SKIP_WAITING`, wait once for `navigator.serviceWorker`'s `controllerchange` event, then reload with a one-shot guard. Add a same-URL changed-worker regression that clicks **Refresh**, verifies the new worker/cache is active, and confirms the app is interactive after reload. Reproduction and request trace: `verification-evidence-9/pwa-real-update.mjs` and `pwa-real-update.log`.

### Critical/high defects

None found.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm audit --audit-level=high
npm run build
npm run test:e2e -- --reporter=list
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
node .factory/verification-evidence-9/live-core.mjs
node .factory/verification-evidence-9/live-accessibility.mjs
node .factory/verification-evidence-9/live-privacy.mjs
node .factory/verification-evidence-9/pwa-real-update.mjs # expected failure
```
