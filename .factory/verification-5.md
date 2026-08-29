# Independent verification 5 — FAIL

**Date:** 2026-08-29 UTC  
**Candidate:** `c9b0afa38294dc59ae2bc2a64fbc8c81004c3e19`  
**Live URL:** <https://photo-metadata-queue.sociobot.in/>  
**Scope:** fresh local install, every declared claim command, production build, deployed PWA, and the researched brief/work-order contract.

## Verdict

**FAIL — release blocked by a required clean-clone claim-test failure.** The deployed product itself is strong and exactly matches the candidate build: the cold screen is clear, the isolated demo works, the metadata queue/export flow works, and browser/PWA/accessibility/privacy checks pass. However, the required claim commands do not run from a clean checkout as declared. `playwright.config.ts` starts `vite preview`, while `dist/` is ignored and absent in a clean clone; Vite therefore serves 404 instead of the demo. The contract explicitly makes any failing claim test release-blocking.

## First-read result — PASS

Cold live desktop and 390 px reads answered all three mandatory questions in plain words:

- **What it does:** “Caption large shoots without changing originals”; it turns folders or CSV files into a queue and writes XMP sidecars.
- **For whom:** “For photographers with large shoots”.
- **First click:** the visible **Try it with sample data** link says it “Opens three edited sample records.”

The link opens `/demo`, with the persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real controls. This first-read gate passes.

## Release-blocking finding

### Blocker — all required claim commands fail on a clean checkout

The required first action was performed before building:

```sh
npm ci
# each exact command from .factory/claims.json
npm run test:e2e -- --grep @claim:demo-sandbox
npm run test:e2e -- --grep @claim:offline-reload
npm run test:e2e -- --grep @claim:local-privacy
npm run test:e2e -- --grep @claim:xmp-export
npm run test:e2e -- --grep @claim:photo-import
npm run test:e2e -- --grep @claim:metadata-tools
npm run test:e2e -- --grep @claim:bulk-xmp
npm run test:e2e -- --grep @claim:free-limit
npm run test:e2e -- --grep @claim:field-edition
npm run test:e2e -- --grep @claim:local-persistence
npm run test:e2e -- --grep @claim:csv-export
npm run test:e2e -- --grep @claim:backup-restore
npm run test:e2e -- --grep @claim:keyboard-controls
```

All 13 exited non-zero. The first command timed out waiting for the required landing link; the remaining `/demo` tests failed waiting for the required demo banner. This is not a product rendering regression: in the clean checkout `dist/` does not exist (`.gitignore` excludes it), yet the configured web server is `npm run preview`. Vite preview returned HTTP 404, so no built application or demo entry point was available. The commands are consequently not self-contained clean-clone claim tests.

After the exact production build, `npm run test:claims` passed **13/13**. That confirms the claimed behaviour in a built artifact, but it does not cure the stipulated clean-clone command failure.

**Remediation:** make the declared test command create/serve the production artifact itself (for example, make the Playwright web-server build before preview), or change every claims test command to a self-contained documented command that does so. Re-run from a clone with no `dist/` directory.

## Checks that passed after the exact production build

| Check | Evidence |
| --- | --- |
| Install | `npm ci`: 60 packages, audit reported 0 vulnerabilities. |
| Unit tests | `npm test`: 13/13 Vitest tests passed. |
| Type/build | `npm run typecheck` and `npm run build` passed; `dist/` produced. |
| Full browser suite | `npm run test:e2e`: 21/21 Playwright tests passed. |
| Claim behaviour in built artifact | `npm run test:claims`: 13/13 passed. |
| Bundle budget | JS 43.82 kB / **14.98 kB gzip**; CSS 20.05 kB / **5.22 kB gzip**; within 200 kB JS and 50 kB CSS budgets. |
| Deployment identity | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` passed: all **20** local production artifacts matched live bytes; routes, 404, CSP, cache policy, worker, and manifest checks passed. |

### End-to-end behaviour

The passing built-artifact tests cover the representative queue workflow and recovery paths: realistic three-record demo; folder import with undecodable previews; CSV import; 25-record free limit and 26-record rejection; valid-license fixture allowing 26 records/batch edit/saved shoots; missing required fields and recovery; caption tokens and controlled terms; XML-sensitive XMP escaping; per-record and bulk sidecar downloads; CSV/JSON export and backup restore; persistence; J/K and import-control keyboard use; offline reload; and service-worker update notification.

### Live usability, accessibility, privacy, and PWA

- Fresh live desktop and 390 × 844 mobile scans had **zero axe serious/critical violations**, no console/page errors, no horizontal overflow, and a visible `3px` focus outline on keyboard-reached controls. The full Playwright suite also checks 44 px mobile controls, mobile queue focus management, and file-picker activation by Enter/Space.
- With `prefers-reduced-motion: reduce`, observed transitions/animation duration was `1e-05s`.
- A fresh live demo flow made requests only to `https://photo-metadata-queue.sociobot.in`; no third-party request was observed. The free flow stores its demo workspace in `demo:caption-queue` IndexedDB. The restrictive live CSP permits only the same origin plus the documented Sociobot license endpoint.
- The manifest, versioned service worker, offline navigation fallback, saved-workspace offline reload, and in-app “An update is ready.” update state all passed Playwright coverage. Live HTML and `/sw.js` use `no-cache, no-store, must-revalidate`; hashed JS/CSS use `public, max-age=31536000, immutable`.
- Live response headers included CSP with `default-src 'self'`, `frame-ancestors 'none'`, and `object-src 'none'`; `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict referrer policy, COOP/CORP, and a restrictive Permissions-Policy were present.
- Lighthouse 12.8.2 against live mobile measured **100 Performance** and **100 Accessibility**; LCP 1,373 ms, CLS 0, TBT 0 ms.

### Paid endpoint allowance

The product does not require sign-in. The real checkout endpoint returned HTTP **303** to Dodo hosted checkout. A fresh sequential 40-request single-client check of the documented product-license verify endpoint returned **30 × 200**, then **10 × 429**; the first 429 was request **31**, with `Retry-After: 4` and body `Too Many Requests! Wait for 4s`. Observed allowance: **30 requests per rate-limit window**.

## Not a deployment-only failure

The former deployment concern is not reproduced. The live HTML SHA-256 is `687021ab1b989016142432edde0d86c7e5d39d219e5aeebbc94e76b2c95cf1ed`, identical to fresh `dist/index.html`; live `sw.js` SHA-256 is `3d2d6e9c20c10ea8f3d4df23f9479e7e25dfc0ef6af0d292936143aab96fbafd`, identical to the fresh build. The fail is solely the mandatory reproducibility gate above.
