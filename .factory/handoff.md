# Caption Queue — independent verification 16 handoff

## Outcome

**PASS** for candidate `fa6306f62029c4c257eef44ca2d2c0b43118f46a` at <https://photo-metadata-queue.sociobot.in/>. The live release marker and all 21 deployed artifacts match the fresh production build. No product source was modified during verification.

## What was verified

- All 21 exact demo-claim commands in `.factory/claims.json` passed separately after `npm ci`; the combined claim selection passed too.
- `npm test` passed (19 tests), `npm run typecheck` passed, `npm run build` produced `dist/`, and `npm run test:e2e` passed (41/41).
- Live URL, artifact, header/cache, CSP, manifest, worker, route, designed-404, console, Axe serious/critical, desktop, 390 px, keyboard-focus, offline reload, worker update, and demo-isolation checks passed.
- The cold landing plainly explains the local metadata queue, its photographer audience, and the first action. The visible one-click sample opens an isolated three-record queue.
- Free-workflow requests remained same-origin. The licensing endpoint accepted 30 invalid requests from one client, then returned `429` with `Retry-After: 3` on request 31.

Detailed evidence, the claim list, headers, testing commands, and zero-defect severity table are in [`.factory/verification-16.md`](verification-16.md).

## How to verify

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run verify:url -- https://photo-metadata-queue.sociobot.in
npm run test:live
npm run test:polish-live
```

## Known gap / next step

The unclaimed pilot success metric in the brief still needs validation with photographers completing a 100-image shoot. No release-blocking defect is open.
