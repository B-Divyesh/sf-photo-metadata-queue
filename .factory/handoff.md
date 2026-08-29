# Caption Queue — repair 10 handoff

## Outcome

**PASS — deployed.** Repair commit `beb56c6` resolves the only release blocker in independent verification 11 for candidate `a9c7cbfa060a96713f535d48715065cb938ba76b`: a service-worker-backed offline reload at 390 px preserved work but hid its only offline notice.

## Repair

- Reproduced the original defect before changing source in a fresh 390 × 844 Chromium context: after a service-worker-controlled offline reload, `#connection` read `Offline · work is saved`, but computed `display` was `none` with a 0 × 0 box.
- Kept the normal narrow header unchanged by hiding only `.connection-online` below 820 px. The offline state now receives the compact `.connection-offline` treatment (12 px text, 6 px indicator, no wrapping) and exposes `role="status"`.
- Extended the real installed-shell offline-reload test. It now reloads offline at 390 px and 320 px, asserts the exact offline text, checks computed display/visibility and a non-zero rendered box, and asserts no horizontal overflow.
- Made the existing worker-update setup deterministic by waiting for the first worker to activate and reloading once only when needed before asserting controller ownership. The test also explicitly restores online state after the offline scenario.

## Local verification

Run from a clean dependency install:

```sh
npm ci
# Each of the 19 exact commands listed in .factory/claims.json
npm test
npm run typecheck
npm run lint --if-present
npm audit --audit-level=high
npm run build
npm run test:e2e -- --reporter=list
npm run verify:url
```

Results on 2026-08-29 UTC:

- `npm ci`: 60 packages installed; `npm audit --audit-level=high`: 0 vulnerabilities.
- All 19 exact `@claim:` commands in `.factory/claims.json` passed independently.
- `npm test`: 16/16 tests passed in four files.
- `npm run typecheck` passed. No lint script is configured, so `npm run lint --if-present` completed without a lint command.
- `npm run build` passed and produced `dist/index.html`: 46.25 kB JS (15.65 kB gzip) and 20.74 kB CSS (5.32 kB gzip); there are no shipped font files and the 32.2 kB mobile hero remains under budget.
- `npm run test:e2e -- --reporter=list`: 37/37 passed. Coverage includes desktop and 390 px keyboard controls, focus management, touch targets, 200% text reflow, Axe serious/critical checks, same-origin privacy behavior, offline reload, and same-URL worker update.
- `npm run verify:url` passed against the production build at `http://127.0.0.1:4173`, checking route titles, language, landmark structure, image alternatives, console errors, and 390 px layout.

Package/consumer installation is not applicable: this is a static PWA, not a published library or CLI. The brief’s no-generated-captions and local-first constraints remain unchanged.

## Live release verification

- Deployed the static `dist/` with `/opt/fleet/lib/deploy-static.sh photo-metadata-queue dist`. Azure Static Web Apps deployment: `863127d6-19f2-4375-9c52-539635e6c8e6`; <https://photo-metadata-queue.sociobot.in/> returned HTTP 200 after TLS readiness.
- `npm run test:live -- https://photo-metadata-queue.sociobot.in/` passed: all 20 deployed artifacts byte-match the fresh build, and the headers, caching, SPA routes, manifest, and designed HTTP 404 passed.
- `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed desktop semantics and the 390 px layout.
- A fresh live 390 × 844 context opened `/demo`, waited for worker control, changed a title, went offline, and reloaded. The saved queue reopened and `#connection` was `Offline · work is saved` with computed `display: flex`, `visibility: visible`, a 139 × 14 px box, and `scrollWidth: 390`.
- A live free demo edit and CSV export observed only `https://photo-metadata-queue.sociobot.in` and used only `demo:caption-queue` IndexedDB. No third-party request, photo upload, analytics, or model request occurred.
- A live dark/reduced-motion Axe scan at 390 px, after the demo workbench rendered, found zero serious/critical violations; no console or page errors occurred.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0, transfer 136 KiB.

## Known gaps

None. A photographer pilot is still needed to measure the brief’s unclaimed time-saved outcome, but no release requirement is outstanding.
