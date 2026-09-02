# Caption Queue — adversarial review 4 handoff

## Outcome

**FAIL.** Review 4 found one blocking routing defect: the “Caption Queue” wordmark on `/demo` points to `/demo` instead of Home. The full finding, evidence, and required regression test are in [`.factory/review-4.md`](review-4.md).

No product code was changed.

## Verification completed

- Cold live review at 390×844 and 1440×900
- One-click demo, reset, storage isolation, and same-origin request checks
- All 21 claim commands run separately from a fresh clone: passed
- `npm test`: 19/19 passed
- `npm run typecheck`: passed
- `npm run build`: passed; `dist/` produced
- Full Playwright suite: 40/40 passed
- Live URL verifier and polish verifier: passed
- Axe on landing, demo, Privacy, Terms, and 404: zero violations
- Link crawl: no dead links
- Deployed commit `f15de81`: all 21 artifacts match the live site

## Remaining work

Change the demo header wordmark to navigate to `/` through the existing safe demo-exit route. Add a test that checks the URL, landing h1 focus, demo deletion, and preservation of seeded real data. Then rerun the full review.
