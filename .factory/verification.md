# Verification 1 — FAIL

**Candidate:** `b0607d39b25ac40fe38dd3b428ff172b641ab74d`  
**Live URL:** <https://photo-metadata-queue.sociobot.in>  
**Verified:** 2026-08-28 (UTC)  
**Scope:** independent clean-checkout verification; product source was not modified.

## Result

**FAIL.** The product works end to end for the sampled local-first metadata workflow and the live release is the exact candidate artifact, but it does not meet the stated keyboard/visible-focus acceptance requirement. Two deployment-policy issues also remain.

## Quality gates

| Check | Result | Evidence |
|---|---|---|
| Clean install | PASS | `npm ci` installed 60 packages; audit reported 0 vulnerabilities. |
| Unit tests | PASS | `npm test`: 8/8 Vitest tests passed. |
| Type check / production build | PASS | `npm run build` (`tsc --noEmit && vite build`) passed and produced `dist/`. |
| Repository checks | PASS | There is no separate lint/typecheck script; the production build contains the available TypeScript check. |
| Browser E2E suite | PASS | `npm run test:e2e`: 3/3 Playwright Chromium 1.58.2 tests passed. |
| Accessibility scan | PASS | Fresh axe Playwright scans of landing (light and dark) and populated 390 px workspace: 0 serious/critical findings. |
| Lighthouse mobile | PASS | Local production preview: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.8 s, TBT 110 ms, CLS 0. |
| JS/CSS budget | PASS | Initial application JS 36,718 B (13,030 B gzip), CSS 17,803 B (4,790 B gzip): both below 200 KB / 50 KB uncompressed budgets. |
| PWA installability | PASS | Chromium `Page.getInstallabilityErrors`: empty for local preview and live URL. |

## End-to-end evidence

On a clean Chromium profile I verified desktop and 390 x 844 mobile behavior:

- Invalid CSV recovery for missing `filename` and blank filename rows; the user receives specific error messages and can retry.
- Free-tier boundary: a 25-row CSV imports; a 26-row CSV remains unimported, opens the Field dialog, and reports the exact limit.
- Representative 25-photo workflow: import CSV, edit title/caption/keywords/date, mark ready, advance, inspect XMP, download the correctly named `.xmp`, export CSV, export JSON backup, reject an invalid backup, and confirm/restore the valid backup.
- XML escaping was verified with ampersand, angle brackets, double quotes, and apostrophes in metadata.
- `J`/`K` queue navigation works outside form fields; the skip link works; the 390 px queue drawer opens/closes without horizontal overflow.
- `prefers-reduced-motion: reduce` makes scrolling instant and transition duration effectively zero (`1e-05s`).
- No page errors, no console errors, and no outbound runtime requests were observed. The normal local workflow sends no data off-device.
- Offline reload after a controlled-service-worker session preserved the imported workspace. A controlled changed-worker test surfaced the in-app “An update is ready” refresh toast.

## Live deployment and policy evidence

All fetched live files exactly matched the fresh local production build by SHA-256: `/`, `/sw.js`, `/manifest.webmanifest`, `/offline.html`, hashed JS/CSS, both WebP images, and all three PNG icons plus SVG icon. `/privacy` and `/terms` return the candidate SPA shell with HTTP 200. The reported deployment-only failure was not reproduced.

Live response headers include HSTS, `nosniff`, and a strict referrer policy. Chromium reports no manifest/installability failure even though the manifest is served as `application/octet-stream`.

## Defects

### High — keyboard focus is not visibly associated with the three primary import actions

On the landing page, Tab order reaches `#photo-input`, `#csv-input`, and `#backup-input`, not their visible label-buttons. Each is a visually-hidden 1 px-wide input with a focus outline on that hidden element; the visible “Choose photo folder”, “Import CSV”, and “Restore backup” control does not get a focus treatment. A keyboard-only photographer cannot reliably tell which primary action is focused. This violates the work-order requirement for visible focus and keyboard-only use. Axe does not detect this visual focus failure.

**Required resolution:** make the visible import controls themselves keyboard-focusable (for example, use labelled buttons that activate their file inputs), or propagate `:focus-visible` from each input to its visible label with a clear 3:1 focus indicator; re-run keyboard verification at desktop and 390 px.

### Medium — live hashed assets are not served with immutable long-lived caching

The live JS, CSS, and immutable hashed/static assets all return `Cache-Control: public, must-revalidate, max-age=30`. The PWA/performance acceptance contract calls for long-lived immutable caching for hashed assets. Set immutable cache headers for content-hashed JS/CSS and versioned assets; retain short/no-cache behavior for HTML and service worker.

### Medium — browser response policy is incomplete

The live HTML response has no Content-Security-Policy, `frame-ancestors`/`X-Frame-Options`, or Permissions-Policy. The app currently has no third-party scripts and the runtime request audit was clean, but the response-policy check is incomplete for a privacy-first local application. Add a restrictive CSP, anti-framing protection, and a Permissions-Policy appropriate to the features used.

### Critical

None found.

## Reproduction commands

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Serve `dist/` (for example `npm run preview`) and use Chromium. For the release comparison, hash the local files and the matching live paths listed above. The report’s Lighthouse result used Lighthouse 13.4.1 against the local production preview with the preinstalled Chromium executable.
