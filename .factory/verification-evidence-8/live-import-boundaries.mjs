import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = 'https://photo-metadata-queue.sociobot.in';
const browser = await chromium.launch({ headless: true });

async function cleanPage() {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base);
  await page.evaluate(async () => {
    localStorage.clear();
    await new Promise((resolve) => {
      const request = indexedDB.deleteDatabase('caption-queue');
      request.onsuccess = request.onerror = request.onblocked = resolve;
    });
  });
  await page.reload();
  return { context, page };
}

const findings = {};
{
  const { context, page } = await cleanPage();
  await page.locator('#csv-input').setInputFiles({ name: 'missing.csv', mimeType: 'text/csv', buffer: Buffer.from('title,caption\nNo file,Missing filename') });
  await page.locator('.notice-toast').getByText('Add a filename column to the CSV.').waitFor();
  findings.missingFilenameHeader = 'Add a filename column to the CSV.';

  await page.locator('#csv-input').setInputFiles({ name: 'blank.csv', mimeType: 'text/csv', buffer: Buffer.from('filename,title\n,Blank filename') });
  await page.locator('.notice-toast').getByText('Row 2 has no filename.').waitFor();
  findings.blankFilename = 'Row 2 has no filename.';

  const valid = 'filename,title,caption,keywords,creator,rights\nFRAME_001.jpg,"Heron, returning","Line one\nline two",bird;marsh,Mira Shah,© Mira Shah\nFRAME_002.CR3,Second frame,Second caption,bird,Mira Shah,© Mira Shah';
  await page.locator('#csv-input').setInputFiles({ name: 'quoted.csv', mimeType: 'text/csv', buffer: Buffer.from(valid) });
  await page.getByRole('heading', { name: 'quoted', level: 1 }).waitFor();
  assert.equal(await page.locator('#title').inputValue(), 'Heron, returning');
  assert.equal(await page.locator('#description').inputValue(), 'Line one\nline two');
  findings.recovery = { shoot: 'quoted', records: await page.locator('.specimen-row').count(), quotedComma: true, embeddedNewline: true };
  await context.close();
}

{
  const { context, page } = await cleanPage();
  const makeCsv = (count) => ['filename,title,caption,keywords', ...Array.from({ length: count }, (_, i) => `FRAME_${i + 1}.jpg,Frame ${i + 1},Caption ${i + 1},test`)].join('\n');
  await page.locator('#csv-input').setInputFiles({ name: 'over-limit.csv', mimeType: 'text/csv', buffer: Buffer.from(makeCsv(26)) });
  await page.getByRole('dialog').waitFor();
  const rejection = await page.locator('.notice-toast').textContent();
  assert.match(rejection, /more than 25 records/);
  await page.getByRole('button', { name: 'Close' }).click();
  await page.locator('#csv-input').setInputFiles({ name: 'exact-limit.csv', mimeType: 'text/csv', buffer: Buffer.from(makeCsv(25)) });
  await page.getByText('0 of 25 ready').waitFor();
  findings.freeLimit = { rejected: 26, accepted: 25, rejection };
  await context.close();
}

{
  const { context, page } = await cleanPage();
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.locator('#photo-input').setInputFiles('tests/fixtures/photo-shoot');
  await page.locator('.specimen-row').first().waitFor();
  assert.equal(await page.locator('.specimen-row').count(), 2);
  findings.photoFolder = {
    records: await page.locator('.specimen-row').count(),
    names: await page.locator('.specimen-row strong').allTextContents(),
    requestOrigins: [...new Set(requests.map((url) => new URL(url).origin))]
  };
  assert.deepEqual(findings.photoFolder.requestOrigins, [base]);
  await context.close();
}

console.log(JSON.stringify(findings, null, 2));
await browser.close();
