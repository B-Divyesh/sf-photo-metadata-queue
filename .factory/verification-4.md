# Independent verification 4 — FAIL

**Date:** 2026-08-28 UTC
**Candidate:** `abc4e78282b78385e60c9cddc468c8af67bb6651`
**Live URL:** <https://photo-metadata-queue.sociobot.in/>
**Verifier scope:** clean detached checkout, production build, deployed PWA, and the researched brief/work-order acceptance contract.

## Verdict

**FAIL — release blocked.** The candidate is a sound local metadata workbench in the manually imported-CSV flow, and the previously reported deployment-only billing/rate-limit failures are no longer reproducible. It nevertheless fails mandatory factory gates before functional acceptance: there is no claims registry, no isolated one-click sample demo, and the cold first screen does not say who the product is for or offer the required sample action.

## Release-blocking findings

### Critical — required claims registry is absent

The required first action was performed on the supplied clean checkout at base `401392b1be3b350e5ad30a214eb8ecd1902beda5`, then again immediately after checking out the candidate:

```sh
test -f .factory/claims.json
```

Both checks failed. Therefore there were no declared commands to run and **zero claim tests could be executed**. The claims contract explicitly makes a missing `.factory/claims.json` release-blocking. The candidate also has no tagged `@claim:<id>` tests.

Consequently, visitor-facing claims in the landing page and README are unlisted and unproven in the required demo sandbox. Examples include “offline-first”, “work after the first load without a network”, “Photos and metadata never leave the device”, “standards-valid XMP sidecars”, the 25-record free limit, and the $24/unlimited Field-edition statements. The normal free-flow network capture did observe only `https://photo-metadata-queue.sociobot.in`, but that does not replace a claim test.

### Critical — no one-click, isolated sample-data demo

There is no `.factory/demo.md`, no `demo:` storage namespace, and no demo implementation in `src/`. Cold live checks found:

| Entry point | Result |
| --- | --- |
| landing page primary actions | `Choose photo folder`, `Import CSV`, `Restore backup`; no “Try it with sample data” action |
| `/demo` | HTTP 200 SPA landing page; no sample loaded or demo banner |
| `/?demo=1` | ordinary landing page; no sample loaded or demo banner |
| persistent banner | absent; no “Demo — sample data, nothing is saved”, Reset demo, or Start for real action |

This violates the mandatory one-click demo and sandbox requirements. It also means the offline promise cannot be demonstrated from shipped sample data as required.

### Critical — cold first screen fails the plain-words gate

Fresh desktop and 390 px cold-page reads showed:

> Caption the shoot. Keep your originals untouched.
>
> Turn a folder or spreadsheet into a deliberate queue for titles, captions, keywords, and IPTC fields—then write standards-valid XMP sidecars.

This explains the work, but it does not name the intended user (photographers with large shoots) on the first screen. Its available first actions all require visitor-supplied data; the mandatory one-click sample action is absent. Under the explicit first-read rule, either defect fails the candidate.

## Additional findings

### Medium — route metadata is incomplete and legal-route titles are wrong

`index.html` has no canonical link, Open Graph tags, Twitter-card tags, or Apple touch icon required by the site-structure contract. Browser checks of `/privacy` and `/terms` both returned the landing title `Caption Queue — Photo metadata, deliberately done`, rather than route-specific titles such as `Privacy — Caption Queue`; each route also uses the product name alone as its `<h1>`. `/demo` is not a real route.

### Medium — required supporting verification/copy artifacts are absent

`.factory/copy-audit.md` is absent, as is the worker `verify-url.sh` requested by the accessibility contract. The latter could not be run because it is not present in the repository. The actual browser accessibility checks described below were run instead.

## Checks that passed

### Clean local quality gates

```text
npm ci                                  PASS — 60 packages; npm audit high: 0 vulnerabilities
npm test                                PASS — 10/10 Vitest tests in 3 files
npm run typecheck                       PASS
npm run build                           PASS — dist/ produced
npm run test:e2e                        PASS — 6/6 Playwright 1.58.2 Chromium tests
git diff --check                        PASS
```

The production build measured 37.18 kB JavaScript (13.08 kB gzip) and 18.02 kB CSS (4.82 kB gzip), below the static/PWA budgets.

### End-to-end workflow and recovery paths

Against the live production deployment, from a fresh context:

- Imported a two-record representative CSV, selected the incomplete record, and verified recovery feedback: `3 required items remain. Add a title.`
- Added title, caption, and keywords; marked the record ready; exported `IMG_0002.xmp`. The download contained correctly escaped `Heron &amp; &lt;returning&gt;` data.
- Exported metadata CSV; it had the documented header and exactly two record rows.
- The exact free-tier boundary accepted a 25-record CSV (`exact-25` workspace with `0 of 25 ready`). A 26-record CSV opened the Field-edition dialog and reported the limit.
- A malformed CSV without a filename column recovered with `Add a filename column to the CSV.`

### Deployed artifact, browser, PWA, privacy, and security checks

- `npm run test:live -- https://photo-metadata-queue.sociobot.in/` passed: all 15 deployment artifacts match the fresh `dist/` bytes, response policies pass, and `/privacy`/`/terms` resolve.
- Live desktop and 390 × 844 mobile scans found zero axe serious/critical violations; no console or page errors were observed. Mobile had no horizontal overflow. The reduced-motion body transition was `1e-05s`.
- The repository Playwright suite passed keyboard file-picker focus/activation, visible 3 px focus outlines, desktop/mobile target sizing, and offline reload tests.
- After a first live visit/import, a 390 px context went offline and reloaded the saved workspace successfully. A separate production-build service-worker update simulation changed the worker version and correctly displayed `An update is ready.` without console errors.
- During the normal free CSV/edit/export flow, captured browser requests were same-origin only. The source uses IndexedDB for workspace data and only permits the documented Sociobot licensing API in CSP.
- Live headers were present: restrictive same-origin CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, COOP/CORP, restrictive Permissions-Policy, and strict referrer policy. HTML/worker revalidate; hashed JS is `public, max-age=31536000, immutable`; the manifest MIME type is correct.
- Lighthouse 13.4.1 (live): Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.2 s, LCP 1.5 s, TBT 180 ms, CLS 0, transfer 133 KiB.

### Fresh evidence for prior external blockers

The prior report's API failures are resolved in the current environment:

- `GET https://api.sociobot.in/api/v1/products/photo-metadata-queue/checkout` returned **303** to a Dodo hosted checkout session.
- A rapid 180-request sequential burst to `.../verify?license=qa-abc4e782-<n>` returned 32 × 200 followed by 148 × 429. The first 429 was request **33**. The final response included `Retry-After: 4` and `x-ratelimit-after: 4` with body `Too Many Requests! Wait for 4s`.

## Required remediation before re-verification

1. Add `.factory/claims.json` and one clean-state demo-entry Playwright/Vitest claim test per visitor-facing promise; remove promises that cannot be tested.
2. Ship `/demo` or `?demo=1` with realistic metadata sample data, a distinct demo storage namespace, and the persistent demo/reset/start-for-real controls. Put `Try it with sample data` on the first screen and document it in `.factory/demo.md`.
3. Rewrite the first screen so it names photographers with large shoots and the first click plainly. Keep the existing local/XMP detail, but make the job, person, and first action immediately clear.
4. Add the required canonical/social/mobile metadata and route-specific titles; add the copy audit and worker URL verification script or an equivalent documented repository tool.
