# Independent verification 8 — FAIL

**Candidate:** `baf06f1b7e8796126b9f567dabfa7daa067f2d1d`  
**Live URL:** <https://photo-metadata-queue.sociobot.in/>  
**Verified:** 2026-08-29 UTC  
**Scope:** clean-clone independent product QA. Product code was not modified.

## Result

**FAIL.** The claims, first-read gate, core metadata workflow, deployment identity, privacy behavior, billing endpoint, PWA behavior, automated accessibility scans, and performance gates pass. Release acceptance is blocked by one mobile accessibility defect: transient toast actions are smaller than the required 44 × 44 CSS px touch target. The live validation toast's **Dismiss message** control measures 27.4 × 36 px at 390 px, and the service-worker update toast's **Refresh** control measures 74.4 × 36 px.

## Mandatory claims gate

`.factory/claims.json` exists. Every listed command was run separately from clean state through the product demo entry point before broader QA. All 17 passed:

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

Each command ran one matching test and all logs are in `verification-evidence-8/claims/`. Landing, legal-page, and README promises are covered by the claims manifest; no material unlisted product promise was found.

## Cold first-read gate

**PASS.** The untouched live first screen says:

- What it does: “Caption large shoots without changing originals,” with a folder/CSV-to-XMP explanation.
- Who it serves: “For photographers with large shoots.”
- What to click: **Try it with sample data**, followed by “Opens three edited sample records.”

The link opens `/demo` in one click with three realistic records. Its persistent banner identifies sample mode and provides **Reset demo** and **Start for real**. At 390 × 844, the headline, audience sentence, demo action, action explanation, and all three fact lines fit in the initial viewport; the fact list ends at y=791.83 px. Evidence: `first-read-desktop.png`, `first-read-mobile.png`, and `first-read-mobile.log`.

## Clean checkout and local gates

| Check | Result and evidence |
| --- | --- |
| Candidate identity | PASS — initial `HEAD` exactly matched the candidate hash |
| Install | PASS — `npm ci`; 60 packages, 0 vulnerabilities |
| Unit/integration | PASS — `npm test`; 15/15 tests in four files |
| Type checking | PASS — `npm run typecheck` |
| Lint | N/A — no lint command is defined |
| Production build | PASS — exact `npm run build`; `dist/` produced |
| Full browser suite | PASS — default `npm run test:e2e`; 30/30 tests |
| Dependency audit | PASS — `npm audit --audit-level=high`; 0 vulnerabilities |
| Source hygiene | PASS — `git diff --check` before report edits |
| Live URL verifier | PASS — desktop and 390 px route semantics, layout, Axe, and console checks |
| Live artifact verifier | PASS — all 20 deployed artifacts byte-match the fresh production build |

The production build emits 45,328 B JavaScript (15.42 kB gzip) and 20,819 B CSS (5.34 kB gzip). It ships no font files. The 32,228 B mobile hero is under budget.

## Independent live product exercise

- The one-click demo opened “Salt marsh bird survey” with three records and `2 of 3 ready`.
- Submitting the unfinished record announced both missing requirements and visibly focused the validation ledger. Exact 256-character title and 2,000-character caption values saved, recovering the shoot to 3/3 ready.
- `Heron & <returning> "quoted"` exported as `BIRDS_1842.xmp`; the XML parsed and the sensitive characters were escaped. Metadata CSV contained one header and three records.
- A damaged JSON backup produced a specific parse error and retained all three existing records.
- A CSV with no filename heading and a row with a blank filename produced specific errors. A subsequent valid CSV recovered and preserved a quoted comma and embedded newline.
- The free boundary was exact: 26 rows were rejected and 25 imported. Two undecodable JPEG fixtures became local queue records through folder import.
- The browser suite additionally proves demo/real isolation, reset/discard, cross-browser backup restore, direct and fallback bulk sidecar writing, keyboard save/navigation, tokens/vocabulary, and paid batch patterns using a recorded valid license verdict.
- The brief's human success measure still requires a photographer pilot and prior-time baseline. The product does not claim that outcome as proven.

Evidence: `live-independent.log`, `live-import-boundaries.log`, screenshots, and `full-e2e.log`.

## Privacy, billing, and endpoint allowance

- The full live demo edit/export flow contacted only `https://photo-metadata-queue.sociobot.in`; the license token remained absent. A live photo-folder import also made only same-origin requests.
- Source and network inspection found no analytics, tracking, remote fonts, third-party runtime scripts, image upload, LLM call, or embedded provider secret.
- A live invalid-license attempt sent one bodyless `GET` to the documented Sociobot verify endpoint with only the encoded token and stayed locked.
- The checkout endpoint returned HTTP 303 to the hosted Dodo checkout; the app embeds no payment provider.
- A fresh single-client verify burst received 30 HTTP 200 invalid verdicts. Request 31 returned HTTP 429 with `Retry-After: 3`. **Observed allowance: 30 accepted requests per window.** The API did not expose that header through CORS, but the client has a tested four-second fallback and fails closed.
- The product has no sign-in flow, so Microsoft Entra authority verification is not applicable.

Evidence: `live-independent.log`, `live-license-ui.log`, and `billing-endpoints.log`.

## Accessibility, mobile, structure, and console

- The repository URL verifier found zero serious/critical Axe findings on `/`, `/demo`, `/privacy`, and `/terms` at desktop and 390 px. Independent dark/reduced-motion testing of a populated mobile demo also found zero.
- All primary routes have `lang=en`, route-specific titles, one `h1`, one `main`, alt text, and no normal-size horizontal overflow. The designed 404 returns HTTP 404 and independently has zero serious/critical Axe findings.
- Keyboard tests cover visible 3 px focus, import pickers, J/K, Previous/Next, Ctrl/Cmd+Enter, validation focus, and mobile queue focus management. The skip link becomes visible at 44 px high and bypasses header controls.
- At 200% text on a 390 px viewport, the populated demo remained exactly 390 px wide. Reduced motion produced `1e-05s` transition and animation durations.
- Main product routes and workflows produced no console or page errors. The designed 404 produces only the expected browser resource message for its intentional HTTP 404 document.
- Initial-route links/buttons and editor controls satisfy 44 × 44 px, but transient toast actions do not; see the blocking defect below.

## PWA, headers, caching, links, and deployment identity

- Chromium reported no installability or manifest errors. The manifest has standalone display, a versioned start URL, and 192/512/maskable icons.
- An edited demo reopened offline at 390 px with its IndexedDB value intact and showed `Offline · work is saved`.
- Registering a query-version worker produced **An update is ready**; **Refresh** promoted it to the active controller.
- HTML and `sw.js` use `no-cache, no-store, must-revalidate`; the hashed application asset uses `public, max-age=31536000, immutable`; the manifest MIME is `application/manifest+json`.
- Live HTML sends HSTS, a restrictive same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, DENY framing, `nosniff`, strict referrer policy, COOP/CORP, and restrictive permissions policy.
- Every discovered internal/source link returned 200; checkout returned the expected 303. Unknown routes return the designed 404.
- `npm run test:live` matched all 20 deployment artifacts to the candidate build. Key hashes are `b732d2…18a4` (`index.html`), `5e22d3…5be0` (JS), `2e20db…95bf` (CSS), and `647381…f557` (`sw.js`).

## Performance

Fresh live mobile Lighthouse 12.8.2 scored Performance 96, Accessibility 100, Best Practices 100, and SEO 100. FCP was 1,134 ms, LCP 1,510 ms, CLS 0, TBT 220 ms, Speed Index 1,134 ms, and total transfer 139,534 B. Lighthouse did not provide field INP; direct editor interactions showed no observable delay.

## Blocking defect

### Medium — transient mobile toast actions are below 44 × 44 px

At 390 × 844 on the live deployment:

| Trigger | Action | Measured size |
| --- | --- | ---: |
| Submit the unfinished demo record | **Dismiss message** | 27.4 × 36 px |
| Install a waiting service-worker update | **Refresh** | 74.4 × 36 px |

Both use the shared `.toast button` rule with `min-height: 36px` and no 44 px minimum width. The same rule covers the batch **Undo** action. These are real recovery/update actions, not decorative controls. This violates the attached accessibility and design contracts requiring touch targets of at least 44 × 44 CSS px.

Required fix: give every toast action, including icon-only dismiss controls, a measured minimum 44 × 44 px hit area and add a 390 px regression that triggers validation, update, and undo to measure the transient controls. Evidence: `transient-touch-target.log` and `mobile-validation-toast.png`.

### Critical/high defects

None found.

## Reproduction

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm audit --audit-level=high
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
node .factory/verification-evidence-8/live-independent.mjs
node .factory/verification-evidence-8/live-import-boundaries.mjs
```
