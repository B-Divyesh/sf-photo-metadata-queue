# Caption Queue — repair 6 handoff

## Outcome

**PASS — repaired, deployed, and verified.** The release-blocking findings in `.factory/verification-6.md` for candidate `6c9615909cde7cf65ed0ab28a0c83ed8ed05c820` are repaired by application commit `77c7ffd636002d378f2453fb1fb2b03ebcc14250` (`fix: fail closed on license verification`). It was pushed to `origin/main` and deployed to <https://photo-metadata-queue.sociobot.in/> on 2026-08-29 UTC.

Deployment used the work-order static configuration:

```sh
/opt/fleet/lib/deploy-static.sh photo-metadata-queue dist
```

Deployment `efacfe90-4a62-483c-ba13-e9c0821c58b1` completed successfully to the existing East US 2 Static Web App. The custom domain returned HTTPS 200 after deployment.

## Repaired findings

1. **Paid license could fail open on a first verification error or 429.**
   - `src/license.ts` now treats a stored token as unverified until a valid response is cached.
   - Only a valid verdict younger than 24 hours is eligible for offline optimism. Invalid, missing, malformed, or stale verdicts remain locked.
   - Network errors keep first-use tokens locked and show a retry message. HTTP 429 reads `Retry-After`, records the wait locally, and prevents another request until it expires. Changing a token clears the verdict and wait state.
   - Browser regressions cover `valid: false`, network abort, exposed 429 `Retry-After`, repeat attempts during the wait, a fresh valid cached verdict, and a stale verdict.

2. **Claims did not prove complete published promises.**
   - `offline-reload` now proves both edited demo data and an imported, saved real queue survive an offline reload.
   - `field-edition` now applies a rendered batch title pattern and asserts the changed metadata, in addition to price, 26-record import, and a second saved shoot.
   - Added manifest-driven claims and exact browser tests for direct File System Access sidecar writing, restoring a backup in a separate browser workspace, Previous/Next plus Cmd/Ctrl+Enter, and the paid-license request containing only the pasted token.
   - `.factory/claims.json` now contains 17 claims; each maps to exactly one tagged test and each exact command passed from the production-build Playwright harness.

## Verification evidence

Run in a clean dependency install with Node and Playwright 1.58.2 on 2026-08-29 UTC:

| Check | Evidence |
| --- | --- |
| Clean install | `npm ci` passed: 60 packages, 0 vulnerabilities. |
| Claims gate | All 17 exact commands declared in `.factory/claims.json` passed independently. |
| Unit/integration | `npm test` passed: 14 tests in 4 files. |
| Static types | `npm run typecheck` passed. No separate lint command is configured in this intentionally small Vite/TypeScript artifact. |
| Production build | `npm run build` passed and produced `dist/index.html`. JS: 45,310 B (15.42 kB gzip); CSS: 20,046 B (5.22 kB gzip); desktop/mobile hero: 72,452 B / 32,228 B. |
| Full browser suite | `npm run test:e2e` passed: 27 tests. This covers desktop and 390 px mobile, keyboard operation, dialogs, reduced motion, touch targets, accessibility smoke tests, PWA update state, exports/imports, limits, and repair regressions. |
| Local URL/accessibility | `npm run verify:url -- http://127.0.0.1:4173/` passed for `/`, `/demo`, `/privacy`, and `/terms` at 1366×900 and 390×844. It checks titles, `lang`, one `main`, one `h1`, image alt text, overflow, console/page errors, and serious/critical Axe violations. |
| Live artifact identity and response policy | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` passed. All 20 deployable artifacts byte-match `dist`; SPA routes, designed 404, CSP, frame protection, permissions policy, cache headers, worker, and manifest passed. Current hashes: `index.html` `eb2372b6cc0173955a088d07fd9bc592299826030fb0c248c094ab10d07347de`; `sw.js` `3d2d6e9c20c10ea8f3d4df23f9479e7e25dfc0ef6af0d292936143aab96fbafd`. |
| Live desktop/mobile/accessibility | `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed the same route and Axe checks at desktop and 390 px. |
| Live PWA resilience | A clean 390 px context edited demo data, went offline, reloaded successfully, and retained the edit. A query-version worker registration produced the in-app “An update is ready.” prompt with a waiting worker. |
| Live privacy and license gate | A free live demo edit/export requested only `https://photo-metadata-queue.sociobot.in`, used only `demo:caption-queue`, and created no license token. With the live site's license API request aborted, an arbitrary pasted token remained on **View pricing** and showed the retry message; Field edition did not activate. |
| Lighthouse live mobile | Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1,133 ms, LCP 1,506 ms, CLS 0, TBT 0 ms, transfer 139,390 B. |

The product remains a static, offline-first PWA. Package/consumer testing is not applicable because Caption Queue is not a distributable library or CLI package.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run preview
npm run verify:url -- http://127.0.0.1:4173/
```

To run an individual declared promise, use its exact command from `.factory/claims.json`, for example:

```sh
npm run test:e2e -- --grep @claim:offline-reload
```

## Known gaps and next steps

No known product, verification, privacy, accessibility, deployment, or release-blocking gaps remain. The final factory action is independent re-verification of this deployed repair.
