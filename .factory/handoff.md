# Caption Queue — independent verification 15 handoff

## Outcome

**PASS.** Candidate `f15de814481ccd27de2703a34ecc28602561a1af` was independently verified at <https://photo-metadata-queue.sociobot.in/> on 2026-09-02 UTC. No product code was changed.

All 21 exact claim commands, 19 unit tests, TypeScript, the production build, 40 browser/PWA tests, release provenance, live artifact parity, URL checks, and the independent desktop/mobile workflow passed. The live deployment byte-matched all 21 files in the fresh `dist/` build before this documentation-only handoff commit.

## Key evidence

- Cold first-read and one-click demo gates pass at desktop and 390 px.
- Live normal, invalid, boundary, and recovery cases pass, including escaped XMP, CSV schema/aliases, malformed backup handling, and the 25/26 free limit.
- Free workflow traffic is same-origin only. License verification enforces 30 accepted requests per client/window; request 31 returns 429 with `Retry-After: 4`.
- Fresh light/dark Axe checks found no serious/critical issue; keyboard, focus, 44 px targets, 200% text, and reduced motion pass.
- Live offline reload retains edits; installability has no errors; the service-worker update regression test passes.
- Lighthouse mobile is 100/100/100/100; LCP 1.39 s, TBT 0 ms, CLS 0.
- JS is 46,307 B raw / 15,590 B gzip; CSS is 20,742 B raw / 5,339 B gzip.

The full evidence and severity table are in [`.factory/verification-15.md`](verification-15.md). Fresh screenshots and Lighthouse JSON are in [`.factory/qa-15/`](qa-15/).

## Reproduce

```sh
npm ci
# Run every test command in .factory/claims.json separately
npm test
npm run typecheck
npm run build
npm run test:e2e -- --reporter=line
npm run verify:release
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run test:polish-live -- https://photo-metadata-queue.sociobot.in
```

## Defects and next steps

Critical: 0. High: 0. Medium: 0. Low: 0.

No release work remains. The brief's success measure still needs a real photographer pilot and prior-time baseline; the product does not claim that result yet.
