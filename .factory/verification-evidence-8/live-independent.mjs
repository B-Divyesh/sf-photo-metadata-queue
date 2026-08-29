import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://photo-metadata-queue.sociobot.in';
const browser = await chromium.launch({ headless: true });
const evidence = { base, desktop: {}, mobile: {}, pwa: {}, errors: [] };

async function fresh(viewport, options = {}) {
  const context = await browser.newContext({ viewport, ...options });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') evidence.errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => evidence.errors.push(`page: ${error.message}`));
  return { context, page };
}

async function textDownload(page, name) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name }).click();
  const download = await pending;
  const path = await download.path();
  assert(path);
  return { name: download.suggestedFilename(), text: await readFile(path, 'utf8') };
}

{
  const { context, page } = await fresh({ width: 1366, height: 900 });
  const requests = [];
  page.on('request', (request) => requests.push(request.url()));
  const rootResponse = await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(rootResponse.status(), 200);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForURL(`${base}/demo`);
  assert.equal(await page.locator('.specimen-row').count(), 3);
  assert.equal(await page.getByText('2 of 3 ready').count(), 1);

  await page.getByRole('button', { name: /BIRDS_1844.JPG/ }).click();
  await page.getByRole('button', { name: 'Mark ready & next' }).click();
  const invalid = {
    live: await page.locator('#live').textContent(),
    focused: await page.locator('.validation').evaluate((node) => node === document.activeElement),
    outline: await page.locator('.validation').evaluate((node) => getComputedStyle(node).outline)
  };
  assert.equal(invalid.focused, true);
  assert.match(invalid.live, /2 required items remain/);
  await page.locator('#title').fill('T'.repeat(256));
  await page.locator('#description').fill('D'.repeat(2000));
  await page.getByRole('button', { name: 'Mark ready & next' }).click();
  assert.equal(await page.getByText('3 of 3 ready').count(), 1);

  await page.getByRole('button', { name: /BIRDS_1842.JPG/ }).click();
  await page.locator('#title').fill('Heron & <returning> "quoted"');
  const xmp = await textDownload(page, 'Export this XMP');
  assert.equal(xmp.name, 'BIRDS_1842.xmp');
  assert.match(xmp.text, /Heron &amp; &lt;returning&gt; &quot;quoted&quot;/);
  const parseError = await page.evaluate((xml) => new DOMParser().parseFromString(xml, 'application/xml').querySelector('parsererror')?.textContent ?? '', xmp.text);
  assert.equal(parseError, '');
  const csv = await textDownload(page, 'Export metadata CSV');
  assert.equal(csv.text.trim().split(/\r?\n/).length, 4);

  await page.locator('#backup-input').setInputFiles({ name: 'damaged.json', mimeType: 'application/json', buffer: Buffer.from('{broken') });
  await page.locator('.notice-toast').getByText(/Expected property name|Unexpected token|JSON/).waitFor();
  assert.equal(await page.locator('.specimen-row').count(), 3);
  await page.screenshot({ path: '.factory/verification-evidence-8/live-demo-desktop.png', fullPage: true });

  const origins = [...new Set(requests.map((url) => new URL(url).origin))];
  assert.deepEqual(origins, [base]);
  evidence.desktop = {
    status: rootResponse.status(),
    headers: await rootResponse.allHeaders(),
    demoRecords: 3,
    invalid,
    recoveredReady: '3 of 3',
    titleBoundary: 256,
    captionBoundary: 2000,
    xmp: { name: xmp.name, xmlParsed: true, sensitiveTextEscaped: true },
    csvRowsIncludingHeader: 4,
    damagedBackupRetainedRecords: 3,
    requestOrigins: origins,
    indexedDb: await page.evaluate(async () => (await indexedDB.databases()).map(({ name }) => name)),
    licenseStored: await page.evaluate(() => localStorage.getItem('sb_license:photo-metadata-queue'))
  };
  await context.close();
}

{
  const { context, page } = await fresh({ width: 390, height: 844 }, { reducedMotion: 'reduce', colorScheme: 'dark' });
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Queue/ }).click();
  await page.getByRole('button', { name: /BIRDS_1844.JPG/ }).click();
  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')).map((item) => item.id);
  assert.deepEqual(serious, []);
  const undersized = await page.locator('a[href], button').evaluateAll((elements) => elements
    .filter((element) => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    })
    .map((element) => {
      const box = element.getBoundingClientRect();
      return { label: element.getAttribute('aria-label') || element.textContent?.trim(), width: box.width, height: box.height };
    })
    .filter(({ width, height }) => width < 44 || height < 44));
  assert.deepEqual(undersized, []);
  const motion = await page.locator('.primary-button').first().evaluate((node) => ({
    transition: getComputedStyle(node).transitionDuration,
    animation: getComputedStyle(node).animationDuration,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches
  }));
  assert.equal(motion.reduced, true);
  assert.match(motion.transition, /(?:0\.00001|1e-05)s/);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const reflow = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.equal(reflow.scrollWidth, reflow.viewport);
  await page.screenshot({ path: '.factory/verification-evidence-8/live-demo-mobile-dark-200pct.png', fullPage: true });
  evidence.mobile = { seriousCriticalAxe: serious, undersized, motion, reflow };
  await context.close();
}

{
  const { context, page } = await fresh({ width: 390, height: 844 });
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.locator('#title').fill('Independent offline record');
  await page.waitForTimeout(300);
  await context.setOffline(true);
  await page.reload();
  assert.equal(await page.locator('#title').inputValue(), 'Independent offline record');
  assert.equal(await page.getByText('Offline · work is saved').count(), 1);
  await context.setOffline(false);
  await page.evaluate(() => navigator.serviceWorker.register('/sw.js?verification-8-update=1'));
  await page.getByText('An update is ready.').waitFor();
  const waitingBefore = await page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting));
  assert.equal(waitingBefore, true);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.getByRole('button', { name: 'Refresh' }).click()
  ]);
  await page.waitForFunction(() => navigator.serviceWorker.controller?.scriptURL.includes('verification-8-update=1'));
  evidence.pwa = {
    controlled: true,
    offlineReloadRetainedEdit: true,
    updateToast: true,
    waitingBefore,
    controller: await page.evaluate(() => navigator.serviceWorker.controller?.scriptURL)
  };
  await context.close();
}

assert.deepEqual(evidence.errors, []);
console.log(JSON.stringify(evidence, null, 2));
await browser.close();
