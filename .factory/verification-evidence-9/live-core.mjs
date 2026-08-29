import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = 'https://photo-metadata-queue.sociobot.in';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(base, { waitUntil: 'networkidle' });
await page.getByRole('link', { name: 'Try it with sample data' }).click();
await page.waitForURL(`${base}/demo`);
assert.equal(await page.locator('.specimen-row').count(), 3);
assert.equal(await page.getByText('2 of 3 ready').count(), 1);
assert.equal(await page.getByText('Demo — sample data, nothing is saved').count(), 1);

await page.getByRole('button', { name: /BIRDS_1844.JPG/ }).click();
await page.getByRole('button', { name: 'Mark ready & next' }).click();
const validation = {
  live: await page.locator('#live').textContent(),
  focused: await page.locator('.validation').evaluate((node) => node === document.activeElement),
};
assert.equal(validation.focused, true);
assert.match(validation.live, /2 required items remain/);
await page.locator('#title').fill('T'.repeat(256));
await page.locator('#description').fill('D'.repeat(2000));
await page.getByRole('button', { name: 'Mark ready & next' }).click();
assert.equal(await page.getByText('3 of 3 ready').count(), 1);

await page.getByRole('button', { name: /BIRDS_1842.JPG/ }).click();
await page.locator('#title').fill('Heron & <returning> "quoted"');
const xmpEvent = page.waitForEvent('download');
await page.getByRole('button', { name: 'Export this XMP' }).click();
const xmpDownload = await xmpEvent;
const xmpPath = await xmpDownload.path();
assert(xmpPath);
const xmp = await readFile(xmpPath, 'utf8');
assert.match(xmp, /Heron &amp; &lt;returning&gt; &quot;quoted&quot;/);
const parseError = await page.evaluate((xml) => new DOMParser().parseFromString(xml, 'application/xml').querySelector('parsererror')?.textContent ?? '', xmp);
assert.equal(parseError, '');

const csvEvent = page.waitForEvent('download');
await page.getByRole('button', { name: 'Export metadata CSV' }).click();
const csvDownload = await csvEvent;
const csvPath = await csvDownload.path();
assert(csvPath);
const csv = await readFile(csvPath, 'utf8');
assert.equal(csv.trim().split(/\r?\n/).length, 4);

await page.locator('#backup-input').setInputFiles({ name: 'damaged.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
const backupError = await page.locator('.notice-toast').textContent();
assert.match(backupError, /Expected property name|Unexpected token|JSON/);
assert.equal(await page.locator('.specimen-row').count(), 3);
await page.screenshot({ path: '.factory/verification-evidence-9/live-demo-desktop.png', fullPage: true });

const evidence = {
  demo: { records: 3, readyInitially: '2 of 3', banner: true },
  validation,
  acceptedBoundaries: { titleCharacters: 256, captionCharacters: 2000, readyAfterRecovery: '3 of 3' },
  xmp: { filename: xmpDownload.suggestedFilename(), parsed: true, escapedSensitiveText: true },
  csvRowsIncludingHeader: 4,
  invalidBackup: { message: backupError, recordsRetained: 3 },
  errors,
};
assert.deepEqual(errors, []);
console.log(JSON.stringify(evidence, null, 2));
await context.close();
await browser.close();
