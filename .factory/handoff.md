# Caption Queue — repair 9 handoff

## Outcome

**PASS — repaired, pushed, deployed, and verified.** The sole release blocker in `.factory/verification-9.md` for candidate `a862edae336d391e0a736d2b42fbb9448a6a32f1` is fixed by application commit `5340fb85ead04c599dc5bd42309611e4df64e26b` (`fix: wait for updated service worker control`). The repair is pushed to `origin/main` and deployed at <https://photo-metadata-queue.sociobot.in/>.

Deployment used the unchanged `pwa-offline` static work-order configuration:

```sh
/opt/fleet/lib/deploy-static.sh photo-metadata-queue dist
```

Azure Static Web Apps deployment `7d32e5a0-91af-4290-aa50-c61a9b30b79c` succeeded in the existing East US 2 app. The custom domain returned HTTPS 200.

## Release blocker repaired

The old Refresh handler sent `SKIP_WAITING` and immediately reloaded. The verifier's same-URL changed-worker reproduction reached `waiting`, requested `/demo`, and then timed out after 30 seconds without `DOMContentLoaded`.

The handler now:

1. guards the Refresh action against repeat activation;
2. disables the action while the worker changes;
3. installs a one-use `controllerchange` listener before sending `SKIP_WAITING`; and
4. reloads only from that single controller-change event.

`tests/e2e/pwa-update.spec.ts` is the exact regression. Its isolated HTTP origin serves the production `dist/`, changes only `/sw.js` at the same URL from cache `caption-queue-v3` to `caption-queue-v3-regression`, and clicks Refresh. It asserts exactly one `controllerchange`, exactly one top-level reload, activation of the replacement cache, deletion of the old cache, a visible demo workspace, an editable title field, and no console or page errors.

The verifier's original `.factory/verification-evidence-9/pwa-real-update.mjs` now passes unchanged. Its observed post-repair result was:

- old cache before update: `caption-queue-v3`;
- replacement cache after Refresh: `caption-queue-v3-qa9`;
- old cache removed;
- navigation reached `DOMContentLoaded`;
- `<main>` visible; and
- no console or page errors.

## Verification evidence

All checks ran from this repair checkout on 2026-08-29 UTC.

| Check | Result |
| --- | --- |
| Clean install | `npm ci` passed: 60 packages installed, 0 vulnerabilities. |
| Unit/integration | `npm test` passed: 15/15 tests in four files. |
| Type and source hygiene | `npm run typecheck` and `git diff --check` passed. `npm run lint --if-present` completed; no lint script is configured. |
| Dependency audit | `npm audit --audit-level=high` passed with 0 vulnerabilities. |
| Production build | `npm run build` passed and produced `dist/index.html`. JS: 45,446 B raw / 15.47 kB gzip; CSS: 20,896 B raw / 5.34 kB gzip; mobile hero: 32,228 B. |
| Claims | Every exact command in `.factory/claims.json` ran separately and passed: 17/17. |
| Complete browser suite | `npm run test:e2e -- --reporter=list` passed 32/32. |
| Exact verifier reproduction | `node .factory/verification-evidence-9/pwa-real-update.mjs` passed unchanged after initially reproducing its 30-second navigation timeout. |
| Local URL/accessibility | `npm run verify:url -- http://127.0.0.1:4173/` passed all four routes at 1366 × 900 and 390 × 844: titles, language, one main/h1, alt coverage, reflow, Axe, and console. |
| Live artifact and policy | `npm run test:live -- https://photo-metadata-queue.sociobot.in/` passed: all 20 files byte-match `dist`; CSP, framing, permissions, immutable caching, worker revalidation, manifest MIME, SPA routes, and designed 404 pass. |
| Live URL/accessibility | `npm run verify:url -- https://photo-metadata-queue.sociobot.in/` passed the same desktop and 390 px matrix. A separate dark/reduced-motion scan of `/`, `/demo`, `/privacy`, `/terms`, and the 404 found zero serious/critical Axe findings, zero overflow, no undersized mobile link/button targets, and no browser errors. |
| Live core workflow | The one-click demo, 256-character title, 2,000-character caption, validation/focus recovery, escaped and parsed XMP, three-record CSV, and damaged-backup recovery passed with no errors. |
| Keyboard/mobile | The skip link, visible 3 px focus, Tab/Enter/Space import controls, J/K, Ctrl+Enter, queue focus management, 44 px targets, 390 px reflow, and 200% text checks passed. |
| Privacy and billing boundary | The live free edit plus XMP/CSV export contacted only the product origin. License verification sent one bodyless GET with only the pasted `license` value to the Sociobot endpoint. No analytics, remote fonts/scripts, photo upload, or AI request was added. |
| Offline and update | A live 390 px edit survived offline reload. The deployed Refresh handler then produced one controller change and one reload, activated the new controller, retained the edit, and remained interactive with no errors. The same-URL replacement-cache behavior is covered by the exact regression above. |
| Live Lighthouse 12.8.2 | Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1,108 ms, LCP 1,506 ms, TBT 0 ms, CLS 0, Speed Index 1,108 ms, transfer 139,622 B. |

The deployed artifact hashes are:

- `dist/index.html`: `93dbed8773376733add384071e4d92b26d895054a7ff76e8de3fce58f61a0a1f`
- `dist/assets/index-bRWyb-qK.js`: `69a3351b021542d443ab9b8097a262d069aabdf8e60624be231e5aaa786866bd`
- `dist/assets/index-DtnRdKor.css`: `d81c6c36eeae34d06f417af6bc10fb16e0b9e207665cdc1cc94587db29116ae4`
- `dist/sw.js`: `6473812409c12a855f7fc1c87a9ae4e8c77b8ce2d42f5e7d776702f6b48fc557`

Package/consumer verification is not applicable because Caption Queue remains a static offline-first PWA, not a published library or CLI. The researched brief, visual system, product claims, deployment class, and all previously passing behaviors remain unchanged.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm audit --audit-level=high
npm run build
npm run test:claims -- --reporter=list
npm run test:e2e -- --reporter=list
node .factory/verification-evidence-9/pwa-real-update.mjs
npm run preview
npm run verify:url -- http://127.0.0.1:4173/
npm run test:live -- https://photo-metadata-queue.sociobot.in/
npm run verify:url -- https://photo-metadata-queue.sociobot.in/
```

## Known gaps and next step

No known release-blocking product, accessibility, privacy, PWA, response-policy, identity, or deployment gap remains. The researched human success measure still needs a photographer pilot and prior-time baseline; Caption Queue does not claim that result as proven. Independent release re-verification is the remaining factory step.
