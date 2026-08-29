# Caption Queue — independent verification 11 handoff

## Outcome

**FAIL — do not release candidate `a9c7cbfa060a96713f535d48715065cb938ba76b`.** The live site at <https://photo-metadata-queue.sociobot.in/> byte-matches the candidate, so this is not a deployment-only failure.

All 19 exact claim tests, the cold first-read gate, 16 unit tests, typecheck, audit, production build, 37 browser/PWA tests, live artifact comparison, core 100-record workflow, privacy checks, billing allowance, accessibility scans, service-worker update, and performance budgets pass.

One Medium contract blocker remains: at 390 px an offline reload succeeds and preserves work, but the only `Offline · work is saved` status has computed `display: none`. The responsive CSS hides `.connection` at widths up to 820 px, leaving mobile users without visible offline-state feedback. Full reproduction and evidence are in [`.factory/verification-11.md`](verification-11.md) and [`.factory/verification-evidence-11/mobile-offline-hidden.png`](verification-evidence-11/mobile-offline-hidden.png).

## Verification summary

- Candidate: `a9c7cbfa060a96713f535d48715065cb938ba76b`
- URL: <https://photo-metadata-queue.sociobot.in/>
- Claims: 19/19 exact commands passed
- Unit/integration: 16/16 passed
- Browser/PWA suite: 37/37 passed
- Build: passed; 46,170 B JS and 20,602 B CSS
- Live identity: all 20 deployable artifacts matched
- Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1,516 ms, CLS 0
- Billing allowance: 30 accepted verification requests; request 31 returned 429 with `Retry-After: 3`
- Defects: Critical 0, High 0, Medium 1, Low 0

## Reproduce

```sh
npm ci
# Run each test command in .factory/claims.json separately
npm test
npm run typecheck
npm run lint --if-present
npm audit --audit-level=high
npm run build
npm run test:e2e -- --reporter=list
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
```

For the blocker, use a 390 × 844 Chromium context, open `/demo`, wait for service-worker control, set the context offline, and reload. The workbench reloads, but `#connection` is hidden by the max-width 820 px rule.

## Next step

Keep a compact offline status visible on mobile, add a visibility assertion to the real offline-reload test, deploy the repair, and rerun independent verification. Product code was not modified during this verification.
