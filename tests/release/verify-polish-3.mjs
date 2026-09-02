import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'https://photo-metadata-queue.sociobot.in';
const evidence = '.factory/evidence-polish-3';
await mkdir(evidence, { recursive: true });

const browser = await chromium.launch();
const errors = [];

async function coldPage(options = {}) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
  return { context, page };
}

async function assertNoSeriousAxe(page) {
  const result = await new AxeBuilder({ page }).analyze();
  assert.deepEqual(result.violations.filter((item) => ['serious', 'critical'].includes(item.impact)), []);
}

try {
  const desktop = await coldPage({ viewport: { width: 1440, height: 900 } });
  await desktop.page.goto(`${base}/`, { waitUntil: 'networkidle' });
  assert.equal(await desktop.page.title(), 'Caption Queue — Write photo metadata offline');
  assert.equal(await desktop.page.locator('h1').count(), 1);
  assert.equal(await desktop.page.locator('h1').textContent(), 'Caption large shoots without changing originals');
  assert.equal(await desktop.page.getByRole('link', { name: 'Try it with sample data' }).getAttribute('href'), '/demo');
  assert.equal(await desktop.page.locator('#connection').textContent(), 'Online · data stays local');
  assert.equal(await desktop.page.getByText('Local & online').count(), 0);
  await desktop.page.locator('.pricing').getByText('XMP, metadata CSV, and workspace backup exports remain free.').waitFor();
  assert.equal(await desktop.page.getByText('Core XMP and data exports remain free.').count(), 0);
  await assertNoSeriousAxe(desktop.page);
  await desktop.page.screenshot({ path: `${evidence}/live-cold-desktop.png`, fullPage: true });
  await desktop.page.getByRole('button', { name: 'View pricing' }).click();
  const pricing = desktop.page.getByRole('dialog');
  await pricing.getByText('Sociobot/Dodo handles payment and refunds.').waitFor();
  await pricing.getByText('A refund cancels the license.').waitFor();
  assert.equal(await pricing.getByText(/merchant of record/i).count(), 0);
  await assertNoSeriousAxe(desktop.page);
  await desktop.page.screenshot({ path: `${evidence}/live-pricing-desktop.png`, fullPage: true });
  await desktop.context.close();

  const mobile = await coldPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await mobile.page.goto(`${base}/`, { waitUntil: 'networkidle' });
  assert.equal(await mobile.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const firstScreenBottom = await mobile.page.locator('.fact-list').evaluate((element) => element.getBoundingClientRect().bottom);
  assert.ok(firstScreenBottom <= 844, `first screen ended at ${firstScreenBottom}px`);
  await mobile.page.screenshot({ path: `${evidence}/live-cold-mobile.png` });

  await Promise.all([
    mobile.page.waitForURL('**/demo'),
    mobile.page.getByRole('link', { name: 'Try it with sample data' }).click()
  ]);
  assert.equal(new URL(mobile.page.url()).pathname, '/demo');
  await mobile.page.getByText('Demo — sample data, nothing is saved').waitFor();
  assert.equal(await mobile.page.locator('.specimen-row').count(), 3);
  await mobile.page.getByText('Creator, copyright, and location fields.').waitFor();
  assert.equal(await mobile.page.getByText('Portable IPTC ownership and place fields.').count(), 0);
  const caption = mobile.page.locator('#description');
  await caption.fill('');
  for (const token of ['{filename}', '{sequence}', '{shoot}', '{date}']) {
    await mobile.page.getByRole('button', { name: token, exact: true }).click();
  }
  assert.equal(await caption.inputValue(), 'BIRDS_1842001Salt marsh bird survey2026-08-20');
  await mobile.page.screenshot({ path: `${evidence}/live-demo-tokens-mobile.png`, fullPage: true });
  await mobile.page.locator('#title').fill('Temporary live demo edit');
  await mobile.page.getByRole('button', { name: 'Reset demo' }).click();
  await mobile.page.waitForFunction(() => document.querySelector('#title')?.value === 'Great blue heron lifting from reeds');
  assert.equal(await mobile.page.locator('#title').inputValue(), 'Great blue heron lifting from reeds');
  await assertNoSeriousAxe(mobile.page);
  await mobile.page.screenshot({ path: `${evidence}/live-demo-mobile.png`, fullPage: true });
  await mobile.context.close();

  const free = await coldPage();
  await free.page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  assert.equal(new URL(free.page.url()).pathname, '/demo');
  await free.page.getByRole('button', { name: 'Start for real' }).click();
  assert.equal(await free.page.evaluate(() => localStorage.getItem('sb_license:photo-metadata-queue')), null);

  await free.page.locator('#csv-input').setInputFiles({
    name: 'missing-filename.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('title,caption\nMissing file,A row without a filename')
  });
  await free.page.locator('.notice-toast').getByText('Add a filename column to the CSV.').waitFor();
  await free.page.locator('#csv-input').setInputFiles({
    name: 'complete-schema.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from([
      'filename,title,caption,description,keywords,creator,photographer,rights,city,state,country,dateCreated',
      'LIVE_001.jpg,Live one,First record,,bird; wetland,Mira Shah,,© Mira Shah,Kingston,Ontario,Canada,2026-08-21',
      'LIVE_002.jpg,Live two,,Alias description,bird; dusk,,Nora Singh,© Nora Singh,Picton,Ontario,Canada,2026-08-22'
    ].join('\n'))
  });
  assert.equal(await free.page.locator('#description').inputValue(), 'First record');
  assert.equal(await free.page.locator('#creator').inputValue(), 'Mira Shah');
  await free.page.getByRole('button', { name: /LIVE_002.jpg/ }).click();
  assert.equal(await free.page.locator('#description').inputValue(), 'Alias description');
  assert.equal(await free.page.locator('#creator').inputValue(), 'Nora Singh');
  assert.equal(await free.page.locator('#city').inputValue(), 'Picton');
  assert.equal(await free.page.locator('#state').inputValue(), 'Ontario');
  assert.equal(await free.page.locator('#country').inputValue(), 'Canada');
  assert.equal(await free.page.locator('#dateCreated').inputValue(), '2026-08-22');
  await free.page.screenshot({ path: `${evidence}/live-csv-schema-desktop.png`, fullPage: true });
  await free.page.evaluate(() => {
    const writes = {};
    window.liveFreeWrites = writes;
    window.showDirectoryPicker = async () => ({
      getFileHandle: async (name) => ({ createWritable: async () => ({ write: async (content) => { writes[name] = content; }, close: async () => undefined }) })
    });
  });
  await free.page.getByRole('button', { name: 'Export 2 .xmp files' }).click();
  await free.page.waitForFunction(() => Object.keys(window.liveFreeWrites ?? {}).length === 2);
  const csvDownload = free.page.waitForEvent('download');
  await free.page.getByRole('button', { name: 'Export metadata CSV' }).click();
  assert.equal((await csvDownload).suggestedFilename(), 'complete-schema-metadata.csv');
  const backupDownload = free.page.waitForEvent('download');
  await free.page.getByRole('button', { name: 'Export workspace backup' }).click();
  assert.equal((await backupDownload).suggestedFilename(), 'caption-queue-complete-schema.json');
  await free.context.close();

  const history = await coldPage({ viewport: { width: 390, height: 844 } });
  await history.page.goto(`${base}/`);
  await history.page.evaluate(() => scrollTo(0, 0));
  await history.page.locator('.nav-privacy').evaluate((link) => link.click());
  assert.match(await history.page.title(), /^Privacy — Caption Queue$/);
  assert.equal(await history.page.locator('h1').evaluate((element) => element === document.activeElement), true);
  await history.page.waitForTimeout(100);
  await history.page.evaluate(() => scrollTo(0, 280));
  await history.page.waitForTimeout(200);
  const savedScroll = await history.page.evaluate(() => ({ y: scrollY, saved: history.state?.scrollY }));
  assert.ok(savedScroll.y > 0);
  assert.equal(savedScroll.saved, savedScroll.y);
  await history.page.goBack();
  await history.page.waitForFunction(() => location.pathname === '/' && scrollY === 0);
  assert.equal(await history.page.locator('h1').evaluate((element) => element === document.activeElement), true);
  await history.page.goForward();
  await history.page.waitForFunction((expectedY) => location.pathname === '/privacy' && scrollY === expectedY, savedScroll.y);
  await history.context.close();

  const routes = await coldPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  for (const [path, title] of [['/privacy', 'Privacy — Caption Queue'], ['/terms', 'Terms — Caption Queue'], ['/demo', 'Demo — Caption Queue']]) {
    await routes.page.goto(`${base}${path}`);
    await routes.page.waitForFunction((expectedTitle) => document.title === expectedTitle, title);
    assert.equal(await routes.page.title(), title);
    assert.equal(await routes.page.locator('h1').count(), 1);
    assert.equal(await routes.page.locator('main').count(), 1);
    assert.equal(await routes.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await assertNoSeriousAxe(routes.page);
  }
  assert.deepEqual(errors, []);
  const response404 = await routes.page.goto(`${base}/not-a-real-route`);
  assert.equal(response404?.status(), 404);
  assert.equal(await routes.page.title(), 'Page not found — Caption Queue');
  assert.equal(await routes.page.locator('h1').textContent(), 'Page not found');
  assert.equal(await routes.page.getByRole('link', { name: 'Privacy', exact: true }).count() > 0, true);
  assert.equal(await routes.page.getByRole('link', { name: 'Terms', exact: true }).count() > 0, true);
  await assertNoSeriousAxe(routes.page);
  await routes.page.screenshot({ path: `${evidence}/live-404-mobile.png`, fullPage: true });
  await routes.context.close();
  assert.deepEqual(errors, ['console: Failed to load resource: the server responded with a status of 404 ()']);
  errors.length = 0;

  const offline = await coldPage({ viewport: { width: 390, height: 844 } });
  const requests = [];
  offline.page.on('request', (request) => requests.push(request.url()));
  await offline.page.goto(`${base}/demo`);
  await offline.page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await offline.page.locator('#title').fill('Cold live offline record');
  await offline.page.waitForTimeout(300);
  await offline.context.setOffline(true);
  await offline.page.reload();
  assert.equal(await offline.page.locator('#title').inputValue(), 'Cold live offline record');
  await offline.page.getByText('Offline · work is saved').waitFor();
  assert.deepEqual([...new Set(requests.map((url) => new URL(url).origin))], [base]);
  await offline.page.screenshot({ path: `${evidence}/live-demo-offline-mobile.png` });
  await offline.context.close();

  assert.deepEqual(errors, []);
  console.log(`Polish 3 live verification passed at ${base}`);
} finally {
  await browser.close();
}
