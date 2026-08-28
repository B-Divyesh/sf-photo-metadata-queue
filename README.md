# Caption Queue

Caption Queue is a private, offline-first metadata workbench for photographers handling large shoots. It turns a photo folder or CSV manifest into a keyboard-friendly review queue for titles, captions, controlled keywords, creator, rights, location, and date fields, then writes standards-valid XMP sidecars without modifying image originals.

Live product: <https://photo-metadata-queue.sociobot.in>

## Who it is for

Photographers, editors, and archive teams who need more control than a broad DAM preset but less setup than custom scripts. The free edition supports one active shoot with up to 25 records. The optional $24 Field edition is a one-time license for unlimited saved shoots and batch patterns; XMP writing, backups, accessibility, and privacy are never gated.

## Capabilities

- Import an image folder or a CSV with a required `filename` column.
- Persist metadata locally in IndexedDB and work after the first load without a network.
- Navigate with the queue, J/K keys, or Previous/Next; save and advance with Cmd/Ctrl+Enter.
- Reuse shoot vocabulary and `{filename}`, `{sequence}`, `{shoot}`, and `{date}` tokens.
- Preview escaped XMP and validate required editorial fields before marking a record ready.
- Write `.xmp` sidecars through the File System Access API where supported, with browser downloads as a portable fallback.
- Export metadata CSV and JSON workspace backups; restore a JSON backup on another browser.

Expected CSV headings include `filename`, `title`, `caption` or `description`, `keywords` (semicolon-separated), `creator` or `photographer`, `rights`, `city`, `state`, `country`, and `dateCreated`.

## Develop and verify

Requires Node.js 20+.

```sh
npm install
npm run dev
npm test
npm run build
npm run test:e2e
```

`npm run build` is the factory work-order build command. It creates the static deployment at `dist/`, with `dist/index.html` at its root. Browser tests use Playwright 1.58.2 and the preinstalled Chromium build.

## Privacy and data ownership

There are no analytics, trackers, third-party fonts, or runtime scripts. Photos and metadata never leave the device. Only a pasted paid-license token is sent to the Sociobot licensing endpoint for verification. See `/privacy` and `/terms` in the app for the full plain-language policies.

## Deployment

Deploy the contents of `dist/` to a static host with SPA fallback to `index.html` for `/privacy` and `/terms`. Serve HTTPS so service workers, installability, and directory writing are available. Do not configure secrets in the client bundle.

## License

MIT. Generated artwork provenance is recorded in [`.factory/design.md`](.factory/design.md).
