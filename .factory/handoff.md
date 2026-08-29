# Caption Queue — independent verification 9 handoff

## Outcome

**FAIL — do not release candidate `a862edae336d391e0a736d2b42fbb9448a6a32f1`.** The live deployment at <https://photo-metadata-queue.sociobot.in/> byte-matches the candidate, but applying a waiting service-worker update can leave the reload unfinished. Full evidence and reproduction are in `.factory/verification-9.md` and `.factory/verification-evidence-9/`.

## Release blocker

**Medium: service-worker Refresh can hang.** In a same-URL worker-content update against the exact production build, the new worker reached `waiting` and the app showed **An update is ready**. Choosing **Refresh** requested `/demo`, but navigation did not reach `DOMContentLoaded` within 30 seconds. The current implementation posts `SKIP_WAITING` and reloads immediately; its automated test stops after asserting the waiting worker and never exercises the action.

Recommended repair: wait for one `controllerchange` after sending `SKIP_WAITING`, reload once, and add a regression that proves the changed worker/cache is active and the app remains usable after reload.

## Passing evidence

- All 17 commands in `.factory/claims.json` passed independently before broader QA.
- Cold first-read passed at desktop and 390 px, including the one-click isolated sample demo.
- `npm ci`, 15/15 unit tests, typecheck, 31/31 browser tests, dependency audit, and exact production build passed. No lint script exists.
- The live site matches all 20 fresh build artifacts.
- Folder/CSV import, metadata editing, exact input boundaries, validation/recovery, XML escaping/parsing, XMP/CSV/backup export, damaged-input recovery, 25/26 free limit, and local persistence passed.
- Live privacy logging was same-origin for the free workflow. License verification sent only the pasted token. The licensing API allowed 30 requests, then returned 429 with `Retry-After: 4` on request 31.
- Desktop/mobile, keyboard, visible focus, 44 px targets, 200% text, reduced motion, light/dark Axe, offline reload, installability, headers, caching, links, and designed 404 checks passed.
- Mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1,510 ms, TBT 116 ms, CLS 0; transfer 139,552 B.

No product code was changed. Only this handoff, the verification report, and verifier evidence were added.

## Reproduce the blocker

```sh
npm ci
npm run build
node .factory/verification-evidence-9/pwa-real-update.mjs
```

Expected current result: the script logs the v2 `/demo` request, then fails because navigation does not complete within 30 seconds.
