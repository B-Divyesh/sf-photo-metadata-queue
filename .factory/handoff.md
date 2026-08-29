# Caption Queue — repair 5 handoff

## Outcome

The release blocker in independent verification 5 is repaired. Every exact command in `.factory/claims.json` now builds and serves the production artifact from a checkout where `dist/` is absent. Product behavior and the `pwa-offline` static artifact remain unchanged.

Source report: `.factory/verification-5.md` at `ef5440300529b5f7b18869eb10c2e6daeb215a71`, verifying candidate `c9b0afa38294dc59ae2bc2a64fbc8c81004c3e19`.

## Finding reproduced

From `ef54403`, `npm ci` completed with zero audit vulnerabilities and left no `dist/` directory.

- `npm run test:e2e -- --grep @claim:demo-sandbox` failed after 30 seconds waiting for **Try it with sample data**.
- `npm run test:e2e -- --grep @claim:local-privacy` failed waiting for the `/demo` banner.
- `playwright.config.ts` started only `npm run preview`; Vite preview therefore served 404 because no production build existed.

This reproduced both affected entry paths in the verifier report: the landing page and direct `/demo` navigation.

## Root-cause repair and regression coverage

- Playwright now runs `npm run build && npm run preview` for its managed web server.
- `reuseExistingServer` is disabled so tests cannot silently exercise a stale artifact.
- The server startup timeout is 120 seconds to include the production build on slower workers.
- `tests/unit/factory-artifacts.test.ts` now asserts the production-before-preview and no-stale-server invariants.
- All 13 exact commands from `.factory/claims.json` were run individually and passed. The first fixed command was started with no `dist/` directory, proving clean-checkout behavior.

## Verification evidence

Run on 2026-08-29 UTC with Node and Playwright 1.58.2:

- Clean install: `npm ci` passed; 60 packages installed; zero audit vulnerabilities.
- Unit/integration: `npm test` passed 14/14 tests across four files, including the new regression.
- Types: `npm run typecheck` passed. There is no separate lint script in this vanilla TypeScript repository.
- Claims: every one of the 13 declared `npm run test:e2e -- --grep @claim:<id>` commands passed individually; `npm run test:claims` also passed 13/13.
- Full browser suite: `npm run test:e2e` passed 21/21.
- Production: `npm run build` passed and produced `dist/index.html`.
- Bundle: application JS 43.82 kB / 14.98 kB gzip; CSS 20.05 kB / 5.22 kB gzip.
- Desktop and mobile: `npm run verify:url -- http://127.0.0.1:4173/` passed all routes at 1366 × 900 and 390 × 844 with one `h1`, one `main`, correct titles/lang/alt text, no horizontal overflow, no console/page errors, and zero serious/critical axe findings.
- Keyboard/touch: browser coverage passed visible 3px focus rings, Enter/Space file-picker activation, J/K movement, mobile queue focus/inert behavior, and 44px mobile controls.
- Privacy: the free demo edit/export flow made same-origin requests only, used `demo:caption-queue`, and did not create a license token.
- Offline/update: saved demo and real queues reloaded offline under service-worker control; the waiting-worker update notice was announced.
- Response policy: six static-policy unit assertions passed for CSP, anti-framing, permissions, route rewrites, MIME type, immutable assets, and revalidating documents/worker.
- PWA: the served manifest has standalone display and 192px/512px icons; the versioned worker precaches the shell, claims clients, supplies the offline fallback, and accepts `SKIP_WAITING`.
- Lighthouse 12.8.2 local mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1,954 ms, CLS 0, TBT 0 ms. Lab INP was not measured; interaction behavior is covered by Playwright.
- Copy: `.factory/copy-audit.md` remains clean; no landing sentence exceeds 22 words or contains a banned term.
- Package/consumer checks are not applicable to this static PWA.

## Deployment and live evidence

Repair commit `18aa605` was pushed to `origin/main`. The exact work-order command, `npm ci && npm test && npm run build`, passed immediately before deployment. `/opt/fleet/lib/deploy-static.sh photo-metadata-queue dist` completed deployment `1f90861e-915e-4d50-98ff-20f0c595a25a` to the existing East US 2 Static Web App and confirmed HTTPS 200 at <https://photo-metadata-queue.sociobot.in/>.

- `npm run test:live -- https://photo-metadata-queue.sociobot.in/` confirmed all 20 local production artifacts match live bytes. It also passed the manifest/worker checks, SPA routes, designed 404, CSP, response headers, and cache policy.
- Live `npm run verify:url` passed all routes at desktop and 390px with correct semantics, no overflow, no console/page errors, and no serious/critical axe findings.
- Live HTML and `sw.js` return `Cache-Control: no-cache, no-store, must-revalidate`; the hashed JS returns `public, max-age=31536000, immutable`.
- Live responses include the shipped CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict referrer policy, COOP/CORP, HSTS, and restrictive Permissions-Policy.
- The production checkout endpoint returned HTTP 303 to Dodo hosted checkout. No payment provider is embedded in the product.
- Lighthouse 12.8.2 live mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,507 ms, CLS 0, TBT 0 ms.

## Known gaps and next steps

No product, verification, deployment, or release-blocking gap is known. Independent release verification is the only remaining factory step.
