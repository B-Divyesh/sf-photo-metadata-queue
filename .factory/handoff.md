# Caption Queue — repair 8 handoff

## Outcome

**PASS — deployed.** This repair resolves the only release blocker in independent verification 8 for candidate `baf06f1b7e8796126b9f567dabfa7daa067f2d1d`: transient toast actions were below the 44 × 44 CSS-pixel mobile touch-target requirement.

Repair code commit: `0a3ba471e7fcb47eb81718942184085f8313cc1f` (`fix: meet mobile toast touch target contract`). It is pushed to `main` and its production `dist/` was deployed on 2026-08-29 UTC to <https://photo-metadata-queue.sociobot.in/> using the static deployment work-order configuration (Azure Static Web Apps deployment `a964f3ed-3b70-482c-b480-b4c6f7a946ed`).

## What changed

- The shared `.toast button` rule now has `min-width: 44px`, `min-height: 44px`, and centered inline-flex content. This repairs every transient action at once: validation **Dismiss message**, batch **Undo**, and service-worker **Refresh**.
- Added an exact 390 × 844 Playwright regression. It deliberately triggers an unfinished-record validation toast, a paid batch-edit undo toast, and a waiting service-worker update toast; each rendered action is asserted to be at least 44 px wide and tall.
- The regression waits for the demo-to-real route before seeding its recorded valid license verdict, keeping it deterministic when run in the complete browser suite.

## Verification performed

All commands below were run from this repair checkout after `npm ci`:

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 60 packages installed; audit reported 0 vulnerabilities. |
| `npm test` | PASS — 15/15 unit and integration tests. |
| `npm run typecheck` | PASS. |
| Lint | N/A — this repository has no lint script. |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities. |
| `npm run build` | PASS — `dist/` produced. Application JS: 45,328 B raw / 15.42 kB gzip; CSS: 20,896 B raw / 5.34 kB gzip. |
| `npm run test:claims -- --reporter=list` | PASS — all 17 declared, clean-state demo claim tests passed. |
| `npm run test:e2e -- --reporter=list` | PASS — 31/31 browser tests. |
| `npm run verify:url -- http://127.0.0.1:4173/` | PASS — desktop and 390 px titles, language, one main/h1, alt coverage, no horizontal overflow, zero serious/critical Axe violations, and no console/page errors. |
| Local Lighthouse 12.8.2 | PASS — Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1,054 ms, LCP 1,954 ms, TBT 0 ms, CLS 0, transfer 139,244 B. |
| `npm run test:live -- https://photo-metadata-queue.sociobot.in/` | PASS — all 20 deployed artifacts byte-match this `dist/`; response policies, SPA routes, manifest MIME/cache policy, and designed 404 passed. |
| `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` | PASS — the same desktop and 390 px semantic/layout/console/Axe checks passed live. |

The deployed application hashes verified by the live artifact check are:

- `index.html`: `bda2cb2677922ebb2891539243c71999aeac1db81dcc0cdd2c915c5ff93884d0`
- `assets/index-a3wia0ks.js`: `15c507b38354927fc3ac8886a19df59a28ffadacfdd0bda154318b5145f67bee`
- `assets/index-DtnRdKor.css`: `d81c6c36eeae34d06f417af6bc10fb16e0b9e207665cdc1cc94587db29116ae4`
- `sw.js`: `6473812409c12a855f7fc1c87a9ae4e8c77b8ce2d42f5e7d776702f6b48fc557`

## Coverage retained

- The complete suite still covers the real folder/CSV → local metadata → XMP/CSV/JSON export workflow, input boundaries, escaped XML, free/Field-edition limits, backups, and sample/real isolation.
- Keyboard coverage includes Tab/Enter/Space file pickers, visible focus, J/K movement, Previous/Next, and Cmd/Ctrl+Enter save/advance. The repaired mobile regression adds all transient actions.
- Playwright Axe runs against landing and editor; URL verification runs Axe across `/`, `/demo`, `/privacy`, and `/terms` at desktop and 390 px. Text reflow at 200%, reduced motion, mobile queue focus management, and the designed 404 remain covered.
- Privacy coverage records the free demo edit/export flow and asserts same-origin requests only; license coverage asserts a bodyless GET containing only the `license` query key. No analytics, remote fonts, photo upload, or runtime third-party scripts were added.
- PWA coverage proves a saved mobile queue reopens offline and a waiting service worker announces an update. The repaired **Refresh** control is now included in the mobile touch-target test. The live artifact verifier confirms the deployed worker, manifest, cache headers, and immutable hashed assets match the build.

## Known gaps and next step

There are no known release-blocking gaps. The researched human success measure still needs a real photographer pilot and a prior-time baseline; Caption Queue does not claim that outcome as proven. Future product work can collect that consented, non-tracking feedback without changing the local-first privacy model.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm audit --audit-level=high
npm run build
npm run test:claims -- --reporter=list
npm run test:e2e -- --reporter=list
npm run preview # keep this running for the local URL check
npm run verify:url -- http://127.0.0.1:4173/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
```
