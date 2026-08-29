# Caption Queue — adversarial review 1 handoff

## Outcome

**FAIL.** The full review is in [`.factory/review-1.md`](review-1.md). No product code was changed.

The live first screen is clear at 390 × 844 and desktop, and the one-click demo is populated, resettable, offline-capable, and isolated from a seeded real workspace. The blocking defect is mobile History API scroll restoration: opening Privacy from the top of `/` and pressing Back returns to `/` at `scrollY=1882` while focus sits on the off-screen h1.

The review also records an incomplete 404 shell, two unlisted live claims, one demo grammar error, and plain-language/terminology findings. Verdict remains FAIL because the work order requires zero findings.

## Verification performed

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e -- --reporter=line
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
```

Results: 15 unit tests passed; typecheck and build passed; 32 browser tests passed; all 17 exact `.factory/claims.json` commands passed again from a separate temporary clone; the live build matches all 20 deployment artifacts. Live request logging stayed same-origin during the free demo flow, offline reload retained an edit, all discovered links resolved, and Axe found zero violations on the main routes and 404.

## Files changed

- `.factory/review-1.md` — complete evidence, sentence counts, findings, claim results, structure checks, and verdict.
- `.factory/handoff.md` — this review handoff.

## Next steps

Fix F-1-1 through F-1-24, add the missing history/404/claim tests, repeat the full review from a clean clone, and change the verdict only when no findings remain.
