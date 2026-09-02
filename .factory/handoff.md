# Caption Queue — polish round 3 handoff

## Outcome

**PASS.** All 30 findings across `.factory/review-1.md`, `review-2.md`, and `review-3.md` are closed. Caption Queue remains the original local-first PWA with its botanical field-guide visual system.

## What changed

- Added the `csv-import-schema` claim and one clean-demo browser test for the required `filename` column, every documented field, and both documented aliases.
- Expanded `metadata-tools` to prove `{filename}`, padded `{sequence}`, `{shoot}`, and `{date}` exactly.
- Rewrote the connection and payment/refund copy in plain words, including matching terms-page wording.
- Made CSV aliases choose the first populated documented value. A successful retry now removes any stale import error.
- Bumped the service-worker cache and retained demo isolation, offline behavior, route metadata, focus restoration, accessibility, privacy, export, and license behavior.
- Updated `.factory/claims.json`, `.factory/copy-audit.md`, `.factory/catalog-description.txt`, `.factory/polish-3.md`, and the release verifier.

## Verification evidence

From a fresh clone of final `origin/main`:

```sh
npm ci
# all 21 exact test commands from .factory/claims.json, run separately
npm test
npm run typecheck
npm run build
npm run test:e2e -- --reporter=line
```

Results: 21/21 exact claim commands, 19/19 unit tests, and 40/40 browser tests passed. `npm audit --audit-level=high` reported zero vulnerabilities.

After deploying through `/opt/fleet/lib/deploy-static.sh photo-metadata-queue dist`:

```sh
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
```

The live artifact parity, headers, known routes, designed HTTP 404, cold first screen, isolated demo/reset, CSV schema, all tokens, payment copy, history focus/scroll, offline reload, same-origin traffic, and serious/critical Axe checks passed. Screenshots and the Lighthouse JSON are in `.factory/evidence-polish-3/`.

Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.2 s, LCP 1.5 s, TBT 0 ms, CLS 0. Production JS is 46.31 kB raw / 15.63 kB gzip; main CSS is 20.74 kB raw / 5.32 kB gzip.

## Run and deploy

Use `npm ci`, `npm run dev`, `npm test`, `npm run typecheck`, `npm run build`, and `npm run test:e2e`. Deploy only the generated `dist/` directory through the work-order static deploy command above.

## Known gaps and next steps

None. No review finding, claim gap, accessibility defect, or deployment mismatch remains.
