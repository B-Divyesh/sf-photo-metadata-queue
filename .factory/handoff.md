# Caption Queue — adversarial first-read review 3 handoff

## Outcome

**FAIL** for <https://photo-metadata-queue.sociobot.in/> on 2026-09-02 UTC. The product passes the cold first screen, one-click demo, sandbox isolation, all 20 declared claim commands, routes, accessibility checks, and every finding from reviews 1 and 2. Four non-blocking findings remain, so the zero-finding verdict rule prevents a pass.

No product code, deployment, infrastructure, DNS, billing, shared service, or out-of-scope resource was changed. This work order changes only `.factory/review-3.md` and this handoff.

## Findings left for the owner

- F-3-1: the README's required CSV column and complete input-heading map are not in `.factory/claims.json` or one tagged clean-demo test.
- F-3-2: the `metadata-tools` tagged test proves `{filename}` but not the other three documented tokens.
- F-3-3: “Local & online” can imply cloud storage; use “Online · data stays local.”
- F-3-4: the pricing dialog's “merchant of record” copy is jargon; use the concrete payment/refund wording in the review.

## Verification performed

From clean clone `/tmp/cq-review3-lGTGI5/repo` at `4b6bd5c24abb730785f23f292c37be10ebb62096`:

```sh
npm ci
# Each of the 20 test strings in .factory/claims.json, run separately
npm test
npm run typecheck
npm run build
npm run test:e2e -- --reporter=line
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
```

Results: 20/20 exact claim commands, 18/18 unit tests, and 38/38 browser tests passed. The build produced `dist/` with 15.62 kB gzip JS. Independent live mobile/desktop first-read, demo reset/isolation, same-origin request logging, route metadata, link crawl, history/focus, designed 404, and Axe checks also passed.

## Next steps

Resolve F-3-1 through F-3-4, then repeat every exact claim command and the complete adversarial checklist. Do not change the verdict to PASS until the finding count and untested-claim count are both zero.
