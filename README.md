# Caption Queue

Caption Queue is a local metadata queue for photographers handling large shoots. It turns a photo folder or CSV file into a keyboard-friendly review queue. It exports valid `.xmp` metadata files without changing photos.

Live product: <https://photo-metadata-queue.sociobot.in>

One-click sample: <https://photo-metadata-queue.sociobot.in/demo>

## Who it is for

Photographers, editors, and archive teams who review metadata before sending photos to a library or archive. The free edition accepts 25 records per shoot. The optional $24 Field edition is a one-time license. It removes the import limit, adds saved shoots, and enables batch edit patterns. XMP, metadata CSV, and workspace backup exports remain free.

## Capabilities

- Try three realistic records at `/demo`; the demo uses a separate browser database.
- Import a photo folder or a CSV with a required `filename` column.
- Save metadata in this browser and reopen the queue offline after your first visit.
- Navigate with the queue, J/K keys, or Previous/Next; save and advance with Cmd/Ctrl+Enter.
- Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens.
- Preview well-formed, escaped XMP and validate required editorial fields before marking a record ready.
- Write `.xmp` files directly to a chosen folder in supported browsers, or download them elsewhere.
- Export metadata CSV and JSON workspace backups; restore a JSON backup on another browser.

Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`.

## Develop and verify

Requires Node.js 20+.

```sh
npm ci
npm run dev
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run preview # keep this running for the next command
npm run verify:url -- http://127.0.0.1:4173/
```

`npm run build` is the factory work-order build command. It creates the static deployment at `dist/`, with `dist/index.html` at its root. Browser tests use Playwright 1.58.2 and the preinstalled Chromium build.

Every production build writes `dist/release.json` with its Git commit. After pushing and deploying `main`, run `npm run test:live -- https://photo-metadata-queue.sociobot.in/`. The command fails if the live marker, local source, and `origin/main` disagree.

## Privacy and data ownership

There are no analytics, trackers, third-party fonts, or third-party runtime scripts. The free metadata workflow contacts only this site's own servers. Only a pasted paid-license token is sent to the Sociobot licensing endpoint for verification. See `/privacy` and `/terms` in the app for the full policies.

## Deployment

Deploy the contents of `dist/` to a static host. The Azure Static Web Apps configuration routes `/demo`, `/privacy`, and `/terms` to the app. Unknown paths use the designed 404 page. Documents and `sw.js` revalidate, while `/assets/*` uses one-year immutable caching. Serve HTTPS for service workers, installability, and directory writing. Do not configure secrets in the client bundle.

Every visitor-facing product promise and its clean demo test are listed in [`.factory/claims.json`](.factory/claims.json). Demo isolation and reset behavior are documented in [`.factory/demo.md`](.factory/demo.md).

## License

MIT. Generated artwork provenance is recorded in [`.factory/design.md`](.factory/design.md).
