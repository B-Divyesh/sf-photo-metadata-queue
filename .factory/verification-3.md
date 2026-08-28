# Verification 3 — FAIL

**Candidate:** `abc4e78282b78385e60c9cddc468c8af67bb6651`  
**Live URL:** <https://photo-metadata-queue.sociobot.in/>  
**Verified:** 2026-08-28 UTC  
**Scope:** fresh independent verification from the clean candidate checkout. Product source was not modified.

## Result

**FAIL.** The deployed artifact is exactly the production build of this candidate and the local-first free workflow is solid. However, the product caps the free queue at 25 records while its advertised $24 Field-edition purchase endpoint returns HTTP 404. Therefore a photographer cannot obtain the necessary unlimited queue/batch capability to complete the researched 100-image job. This is an end-to-end release blocker.

The previous billing rate-limit blocker is **resolved**: a fresh burst received 429 responses and `Retry-After` as required.

## Quality gates

| Check | Result | Fresh evidence |
|---|---|---|
| Clean install | PASS | `npm ci` installed 60 packages; `npm audit --audit-level=high` found 0 vulnerabilities. |
| Unit tests | PASS | `npm test`: 3 files, 10/10 Vitest tests. |
| Type check | PASS | `npm run typecheck` completed without diagnostics. |
| Exact production build | PASS | `npm run build` (`tsc --noEmit && vite build`) completed and produced `dist/index.html`. |
| Browser regression suite | PASS | `npm run test:e2e`: 6/6 Playwright 1.58.2 Chromium tests. |
| Deployed identity and delivery | PASS | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` verified all 15 deployable files byte-for-byte and checked response policy/legal SPA routes. |
| Lint | N/A | The package defines no lint script. |

The built initial JS is 37,184 B (13.08 KB gzip) and CSS is 18,015 B (4.82 KB gzip), comfortably within the 200 KB / 50 KB static-product budgets. No web fonts ship. Mobile hero is 32,228 B.

## Independent product/browser exercise

Fresh Chromium profiles exercised the live URL at 1366 × 900 and 390 × 844.

- Invalid CSV with no `filename` header announced “Add a filename column to the CSV.” A subsequent valid import recovered normally.
- The exact free boundary was verified: a 25-row CSV imported; a 26-row CSV was refused with “This CSV has more than 25 records. Unlock Field edition or import a smaller manifest.”
- In a 25-record representative queue, attempting to mark an incomplete record ready announced all missing requirements; title/caption/keyword recovery worked; `{sequence}` inserted `001`; readiness progressed to `1 of 25 ready`.
- A one-record XMP export was named `escape.xmp`, escaped `&`, `<`, `>`, and apostrophes, removed an embedded U+0001 control character from output, and did not modify the original. Edited title/caption/keywords survived reload via IndexedDB.
- Live normal import/edit/export traffic used only `https://photo-metadata-queue.sociobot.in`; no cross-origin request, upload, CDN font, analytics, or third-party script occurred. The only designed cross-origin request is license verification.
- Desktop keyboard regressions passed in the repository suite: visible 3 px focus reaches the real import controls and Enter/Space opens each picker; the skip link, Ctrl/Cmd+Enter, J/K navigation, dialogs, and mobile queue controls were also covered by the fresh suite.
- At 390 px, there was no horizontal overflow. Dark/reduced-motion checks measured `0.00001s` transition duration and 44 px minimum height/width for caption tokens, keyword removal, and controlled-term add controls.
- Axe had zero serious/critical violations on the light landing screen, populated desktop workspace, and populated 390 px dark workspace. Browser console/page errors were zero. `lang`, title, one `h1`, `main`, labels, and image alt text were present.

## PWA, privacy, and delivery

- Fresh installed-shell test imported a workspace, waited for a controlling service worker, set the browser offline, reloaded at 390 px, and retained the workspace and main shell.
- A separate ephemeral local server served the exact `dist` then changed only the served worker version. The app showed “An update is ready”; Refresh sent `SKIP_WAITING` and promoted the replacement worker. This test did not alter repository files or the live deployment.
- The manifest has standalone display, versioned start URL, 192/512/maskable icons, and matching colours. `sw.js` uses a versioned cache, claims clients, precaches the shell, provides offline navigation fallback, and cache-first asset handling.
- Live `/`, `/privacy`, `/terms`, `/manifest.webmanifest`, `/sw.js`, and `/offline.html` returned 200. HTML and worker use `no-cache, no-store, must-revalidate`; hashed JS/CSS use `public, max-age=31536000, immutable`; manifest MIME is `application/manifest+json`.
- Live headers include same-origin CSP (`frame-ancestors 'none'`, `object-src 'none'`), HSTS, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, COOP/CORP, and a restrictive Permissions-Policy. Privacy and terms pages accurately disclose IndexedDB/localStorage and no tracking. There is no sign-in flow, so Entra tenant validation is not applicable.

## Performance

Fresh Lighthouse 13.4.1 mobile against the live URL: Performance **94**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 2.1 s, LCP 2.7 s, TBT 0 ms, CLS 0, Speed Index 1.8 s, 133 KiB transferred.

## Billing API verification

`GET https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify?license=independent-qa-20260828` returned the expected invalid-token response. A rapid concurrent 180-request probe completed in 1,330.6 ms: **30 HTTP 200** and **150 HTTP 429**, with `Retry-After: 4`. The observed burst allowance is 30 successful requests before limiting; this satisfies the work-order rate-limit check.

## Defects

### Critical — Field-edition checkout is unavailable, blocking the 100-image job

The live UI advertises a $24 one-time Field edition whose “Buy Field edition” target is:

```text
https://api.sociobot.in/api/v1/products/photo-metadata-queue/checkout
```

Fresh GET result:

```text
HTTP 404
Content-Type: application/json
{"error":"enabled factory product","status":404}
```

The app simultaneously refuses a 26-record CSV unless Field edition is unlocked. The researched success measure requires a 100-image shoot, so no new customer can complete the actual paid workflow. Factory/billing must register or enable this production product and return URL, then verify hosted checkout redirect, license return/capture, verification, and a 100-record paid workflow.

### Medium — fresh mobile Lighthouse LCP misses the stated 2.5 s target

The live mobile run measured LCP 2.7 s, over the attached 2.5 s budget, although overall Performance was 94 and all other reported category scores passed. Re-run under comparable network conditions after optimizing the LCP image/document path; do not treat a single lab run as field telemetry.

### High

None found. The previously reported verification-API rate-limit defect is no longer reproducible.

## Reproduction

```sh
npm ci
npm audit --audit-level=high
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run test:live -- https://photo-metadata-queue.sociobot.in/
```

Rate-limit probe: send 180 rapid GETs to the documented `/verify?license=<invalid-token>` endpoint and record status counts plus `Retry-After`. Lighthouse used Lighthouse 13.4.1 and the installed Playwright Chromium executable.
