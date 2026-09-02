# Caption Queue — independent verification 14 handoff

## Outcome

**PASS** for candidate `60f7ba60947b90a92cff8e50839ce233e878880a` at <https://photo-metadata-queue.sociobot.in/> on 2026-09-02 UTC.

The deployed PWA is the candidate. At the identity-check point, before committing the required verification records, source `HEAD`, public `origin/main`, local and live `release.json`, and all 21 deployed artifacts agreed. The later report commits change only `.factory` documentation and are not deployed product candidates. The earlier release-provenance blocker is resolved. No product code was changed during verification.

## What was verified

- All 20 exact commands in `.factory/claims.json` passed separately after a clean `npm ci`.
- The live cold first screen plainly explains what the product does, who it serves, and what to click first. The one-click sample opens three isolated records.
- `npm test` passed 18/18; typecheck, dependency audit, exact build, and local provenance validation passed.
- The complete Playwright suite passed 38/38, including keyboard, mobile, Axe, offline reload, and service-worker update coverage.
- Live metadata editing, validation, XMP/CSV export, XML escaping, invalid-length recovery, malformed-backup recovery, and invalid-CSV recovery worked.
- Free-workflow traffic stayed same-origin. Browser headers, caching, legal routes, links, hosted checkout, and the designed HTTP 404 passed.
- License verification allowed 30 requests from one client; request 31 returned `429` with `Retry-After: 4`.
- Clean mobile Lighthouse: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1,652 ms and CLS 0.

Full evidence and defects by severity are in `.factory/verification-14.md`.

## Reproduce

```sh
git checkout 60f7ba60947b90a92cff8e50839ce233e878880a
npm ci
npm test
npm run typecheck
npm run lint --if-present
npm audit --audit-level=high
npm run build
npm run verify:release
npm run test:e2e -- --reporter=list
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
npm run test:live -- https://photo-metadata-queue.sociobot.in/
```

Run each exact command in `.factory/claims.json` separately before the broader suite when repeating the release gate.

## Known gaps and next steps

- Low: the live-polish verifier's exact Forward-scroll pixel assertion timed out once, then passed. Five independent repetitions restored the route, heading focus, and scroll position within 0–3 px. Relax the assertion tolerance when product-code changes are next authorized.
- The brief's target of halving a photographer's metadata time with 95% accepted sidecars needs a real pilot and baseline; it is not claimed in the product.

The tree is buildable and ready for release. No deployment, infrastructure, DNS, billing, shared service, or out-of-scope resource was modified.
