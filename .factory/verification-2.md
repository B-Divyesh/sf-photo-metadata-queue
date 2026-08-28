# Verification 2 — FAIL

**Candidate:** `b5607cda09b3751607b467a7a2f61436b489e180`  
**Live URL:** <https://photo-metadata-queue.sociobot.in/>  
**Verified:** 2026-08-28 UTC  
**Scope:** independent verification from a clean detached checkout; product code was not modified.

## Result

**FAIL.** The candidate is deployed exactly, the local-first metadata workflow works end to end, and the previous focus/header/cache defects are fixed. Release acceptance is nevertheless blocked by two high-severity external-service defects: the advertised purchase action returns HTTP 404, and the license verification API did not rate-limit a 180-request burst. Mobile editor controls also miss the explicit 44 × 44 px target-size requirement.

## Clean-checkout quality gates

The candidate was checked out detached at `/tmp/caption-queue-verify-b5607cd` and installed with its lockfile.

| Check | Result | Fresh evidence |
|---|---|---|
| `npm ci` | PASS | 60 packages installed; 0 vulnerabilities. |
| `npm test` | PASS | 3 files, 10/10 Vitest tests. |
| `npm run typecheck` | PASS | TypeScript completed with no diagnostics. |
| `npm run build` | PASS | Exact `tsc --noEmit && vite build`; `dist/index.html` produced. |
| `npm run test:e2e` | PASS | 5/5 Playwright 1.58.2 Chromium tests. |
| `npm audit --audit-level=high` | PASS | 0 vulnerabilities. |
| `git diff --check` | PASS | No whitespace errors. |
| Live artifact comparison | PASS | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` matched all 15 deployable artifacts byte-for-byte and passed route/header assertions. |

Production output is 37,184 B JavaScript (13.08 KB gzip) and 17,940 B CSS (4.82 KB gzip), below the 200 KB / 50 KB budgets. The mobile hero is 32,228 B; no web fonts ship. Live Lighthouse 13.4.1 scored Performance 99, Accessibility 100, Best Practices 100, and SEO 100 (FCP 1.1 s, LCP 1.4 s, TBT 130 ms, CLS 0, Speed Index 1.1 s, 133 KiB transferred).

## Product and browser evidence

Fresh Chromium profiles were exercised at 1366 × 900 and 390 × 844.

- Folder import accepted six representative image assets without any outbound request. CSV recovery correctly reported a missing `filename` header and a blank filename on row 2.
- The free boundary behaved exactly: 25 records imported; 26 remained unimported and opened the Field-edition explanation.
- A normal three-record workflow covered required-field failure and recovery, title/caption/keyword/credit/location/date editing, controlled vocabulary, caption tokens, Cmd/Ctrl+Enter, J/K navigation, readiness, persistence, XMP inspection/download, metadata CSV export, JSON backup, damaged-backup rejection, and confirmed restore.
- Downloaded `IMG_0043.xmp` was well-formed XML and correctly escaped ampersands, angle brackets, quotes, and apostrophes. The `.CR3` input produced an `.xmp` sidecar name without touching the original.
- A cached-valid Field-edition smoke test covered vocabulary reuse, batch tokens, keyword merging, confirmation, and Undo. A 100-row shoot imported in 141 ms, batch-updated in 207 ms, rendered sequence `100`, and exported 101 CSV lines. These timings are lab-operation timings, not the brief's human pilot success metric.
- Mobile had no horizontal overflow; its queue drawer opened to 340 px and closed correctly. Desktop and mobile visual inspection found coherent layout and no clipped primary content.
- Keyboard checks covered the visible skip link and its `#main` target, 3 px focus indication, keyboard-opened file pickers, Cmd/Ctrl+Enter, J/K navigation, and native dialog dismissal. No keyboard trap was found.
- Axe scans of landing light, landing dark, and populated mobile workspace found 0 serious/critical violations. Semantics included `lang="en"`, a nonempty title, one `<h1>`, and one `<main>`.
- No console errors or page errors occurred. Normal folder/CSV/edit/export flows made no cross-origin requests. License restoration made only the documented Sociobot verification request; the token was removed from the URL and retained locally.
- `prefers-reduced-motion: reduce` matched, forced 0.00001 s transitions, and changed scroll behavior to `auto`.

## PWA, delivery, and privacy evidence

- Chromium reported no installability errors. A controlled live service worker supported offline reload with the IndexedDB workspace intact and displayed `Offline · work is saved`.
- A clean local production server changed the served worker body after installation. The current worker remained active, the new worker reached `installed`/waiting, the in-app “An update is ready” toast appeared, Refresh promoted the worker, and a subsequent offline reload succeeded.
- Live `/`, `/sw.js`, `/manifest.webmanifest`, `/privacy`, and `/terms` return 200. HTML and `sw.js` use `no-cache, no-store, must-revalidate`; hashed JS/CSS use `public, max-age=31536000, immutable`; the manifest MIME is `application/manifest+json`.
- Live HTML sends HSTS, same-origin CSP with `frame-ancestors 'none'` and `object-src 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, COOP/CORP, and a restrictive Permissions-Policy.
- The verify endpoint allows the production origin, returns `Cache-Control: no-store`, and returned `{ "valid": false, "reason": "invalid", "expires_at": null }` for an invalid token. The product has no sign-in flow, so Entra authority validation is not applicable.

## Defects

### High — advertised one-time purchase is unavailable

`GET https://api.sociobot.in/api/v1/products/photo-metadata-queue/checkout` returned HTTP 404 with:

```json
{"error":"enabled factory product","status":404}
```

The live UI advertises a $24 one-time Field edition and its “Buy Field edition” link targets this endpoint. A user cannot buy the unlimited-shoot/batch unlock, so the contracted monetization path is not end to end. Register/enable the production billing product and confirm a hosted-checkout redirect plus return URL before release.

### High — license verification endpoint does not satisfy required burst limiting

A sequential burst of 180 requests to:

```text
GET https://api.sociobot.in/api/v1/products/photo-metadata-queue/verify?license=independent-qa-rate-limit
```

completed in 1.951 seconds with 180 HTTP 200 responses. No request returned 429, so there was no `Retry-After` header and no threshold was observed through 180 requests. The work order explicitly requires a rapid burst to begin returning 429 with `Retry-After`, including product-unlock calls. Add or repair endpoint/IP/token rate limiting and document the observed threshold on reverification.

### Medium — several mobile workflow controls are below 44 × 44 px

At 390 × 844, computed button rectangles in the populated editor were:

| Control | Size |
|---|---:|
| `{filename}` token | 83 × 36 px |
| `{sequence}` token | 83 × 36 px |
| `{shoot}` token | 62 × 36 px |
| `{date}` token | 55 × 36 px |
| Remove keyword | 28 × 28 px |
| Add controlled term | 38 × 44 px |

These are central touch actions and violate the attached design/accessibility contract's minimum 44 × 44 CSS px target. Increase the actual hit areas without reducing spacing or visible focus clarity.

### Critical

None found.

## Reproduction

```sh
git worktree add --detach /tmp/caption-queue-verify-b5607cd b5607cda09b3751607b467a7a2f61436b489e180
cd /tmp/caption-queue-verify-b5607cd
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm audit --audit-level=high
npm run test:live -- https://photo-metadata-queue.sociobot.in/
```

Lighthouse used Chrome for Testing 145 and Lighthouse 13.4.1 against the live URL. Browser workflow, target-size, outbound-request, offline, worker-update, and rate-limit probes were independent of the repository's test suite.
