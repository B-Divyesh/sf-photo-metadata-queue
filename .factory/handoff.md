# Caption Queue — independent verification 10 handoff

## Outcome

**PASS.** Candidate `b93374b4de77c4786d899e28f6eec6b241f21aae` was independently verified on 2026-08-29 UTC against <https://photo-metadata-queue.sociobot.in/>. No product code was changed. The full evidence and defect accounting are in [`.factory/verification-10.md`](verification-10.md).

The live deployment byte-matches all 20 files in the candidate's fresh production build. The earlier deployment/update failure is not present: the repaired same-URL service-worker update activates the replacement worker, reloads once under the new controller, removes the old cache, and keeps the app usable.

## Verification summary

- Mandatory first-read gate: PASS on desktop and 390 × 844 mobile. The first viewport states the job, audience, first action, action result, offline/privacy facts, and price.
- Mandatory claims gate: PASS, 17/17 exact manifest commands after `npm ci`; each selected one tagged browser test.
- Install/build: `npm ci`, `npm run typecheck`, `npm audit --audit-level=high`, and exact `npm run build` passed.
- Automated tests: 15/15 unit/integration and 32/32 complete Playwright tests passed.
- Product flow: folder/CSV queue, tokens, controlled terms, validation, XMP, bulk writing, CSV, backup/restore, free limit, paid fixture paths, and recovery cases passed.
- Privacy: the free live workflow made only same-origin requests. License verification sent only the pasted token in a bodyless GET.
- API allowance: 30 accepted license-verification requests per observed window; request 31 returned `429` with `Retry-After: 4`.
- Accessibility: zero serious/critical Axe findings across all primary routes and the 404 in desktop light and mobile dark/reduced-motion modes. Keyboard, focus, dialog, 44px targets, and 200% reflow passed.
- PWA: installability, live offline reload/persistence, and the repaired update/apply/reload path passed.
- Delivery: all links, response headers, security policy, SPA routes, designed 404, and cache policies passed.
- Lighthouse mobile: Performance 94, Accessibility 100, Best Practices 100, SEO 100; LCP 1.55s, CLS 0, transfer 139.6KB.
- Bundles: JS 45,446 B raw / 15,437 B gzip; CSS 20,896 B raw / 5,356 B gzip; mobile hero 32,228 B.

## Defects

Critical: 0. High: 0. Medium: 0. Low: 0.

The historical `.factory/verification-evidence-8/live-import-boundaries.mjs` has a stale request-count assertion, but the active claim suite checks the correct same-origin privacy invariant. It is not shipped code and does not affect the result.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm audit --audit-level=high
npm run build
npm run test:claims -- --reporter=list
npm run test:e2e -- --reporter=list
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
```

## Remaining external validation

The brief's human success measure—finishing a 100-image shoot in less than half the prior time with at least 95% accepted sidecars—requires a photographer pilot and prior-time baseline. Caption Queue does not claim that result as proven. No release-blocking gap remains.
