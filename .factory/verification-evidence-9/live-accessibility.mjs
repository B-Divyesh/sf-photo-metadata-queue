import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = 'https://photo-metadata-queue.sociobot.in';
const browser = await chromium.launch({ headless: true });
const evidence = { mobileFirstRead: {}, keyboard: {}, mobileDemo: {}, offline: {}, errors: [] };

function watch(page) {
  page.on('console', (message) => {
    if (message.type() === 'error') evidence.errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => evidence.errors.push(`page: ${error.message}`));
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  watch(page);
  await page.goto(base, { waitUntil: 'networkidle' });
  const required = [
    page.getByRole('heading', { name: 'Caption large shoots without changing originals' }),
    page.getByText('For photographers with large shoots, it turns folders or CSV files into a focused queue for clean XMP sidecars.'),
    page.getByRole('link', { name: 'Try it with sample data' }),
    page.getByText('Opens three edited sample records.'),
    page.getByText('Runs offline after the first visit.'),
    page.getByText('Photos and metadata stay on this device.'),
    page.getByText('Free for 25 records per shoot. Field edition costs $24 once.'),
  ];
  const boxes = [];
  for (const locator of required) {
    const box = await locator.boundingBox();
    assert(box && box.y >= 0 && box.y + box.height <= 844, `first-read item outside viewport: ${await locator.textContent()}`);
    boxes.push({ text: await locator.textContent(), box });
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
  await page.screenshot({ path: '.factory/verification-evidence-9/live-first-read-mobile.png', fullPage: false });
  evidence.mobileFirstRead = { boxes, scrollWidth: 390 };

  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), 'Skip to main content');
  const skipFocus = await page.locator(':focus').evaluate((node) => {
    const s = getComputedStyle(node); const r = node.getBoundingClientRect();
    return { width: r.width, height: r.height, outline: s.outline, outlineColor: s.outlineColor };
  });
  assert(skipFocus.height >= 44);
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => location.hash), '#main');

  let reachedImport = false;
  const tabOrder = [];
  for (let i = 0; i < 16; i += 1) {
    await page.keyboard.press('Tab');
    const focused = await page.locator(':focus').evaluate((node) => ({
      text: node.getAttribute('aria-label') || node.textContent?.trim(),
      outline: getComputedStyle(node).outline,
    }));
    tabOrder.push(focused);
    if (focused.text === 'Import CSV') { reachedImport = true; break; }
  }
  assert.equal(reachedImport, true);
  await page.locator(':focus').evaluate((node) => node.addEventListener('click', () => { window.__qaKeyboardClick = true; }, { once: true }));
  await page.keyboard.press('Enter');
  const importActivatedByEnter = await page.evaluate(() => window.__qaKeyboardClick === true);
  assert.equal(importActivatedByEnter, true);
  evidence.keyboard = { skipFocus, tabOrder, importActivatedByEnter: true };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme: 'dark' });
  const page = await context.newPage();
  watch(page);
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  assert.equal(await page.getByText('Demo — sample data, nothing is saved').count(), 1);
  const first = await page.locator('.specimen-header h2').textContent();
  await page.keyboard.press('j');
  const second = await page.locator('.specimen-header h2').textContent();
  await page.keyboard.press('k');
  const back = await page.locator('.specimen-header h2').textContent();
  assert.notEqual(first, second);
  assert.equal(first, back);

  await page.getByRole('button', { name: /Queue/ }).click();
  await page.getByRole('button', { name: /BIRDS_1844.JPG/ }).click();
  await page.getByRole('button', { name: 'Mark ready & next' }).click();
  assert.equal(await page.locator('.validation').evaluate((node) => node === document.activeElement), true);
  await page.locator('#title').fill('Boundary title');
  await page.locator('#description').fill('A complete caption for the unfinished sample record.');
  await page.locator('#description').press('Control+Enter');
  assert.equal(await page.getByText('3 of 3 ready').count(), 1);

  const axe = await new AxeBuilder({ page }).analyze();
  const seriousCritical = axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => v.id);
  assert.deepEqual(seriousCritical, []);
  const undersized = await page.locator('a[href], button, input, select, textarea').evaluateAll((nodes) => nodes.filter((node) => {
    if (node.getAttribute('aria-hidden') === 'true' || node.getAttribute('tabindex') === '-1') return false;
    const target = node instanceof HTMLInputElement && ['checkbox', 'radio'].includes(node.type) ? node.closest('label') ?? node : node;
    const r = target.getBoundingClientRect(); const s = getComputedStyle(target);
    return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
  }).map((node) => {
    const target = node instanceof HTMLInputElement && ['checkbox', 'radio'].includes(node.type) ? node.closest('label') ?? node : node;
    const r = target.getBoundingClientRect();
    return { label: node.getAttribute('aria-label') || target.textContent?.trim() || node.getAttribute('name'), width: r.width, height: r.height };
  }).filter((item) => item.width < 44 || item.height < 44));
  assert.deepEqual(undersized, []);
  const motion = await page.locator('.primary-button').first().evaluate((node) => ({
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    transitionDuration: getComputedStyle(node).transitionDuration,
    animationDuration: getComputedStyle(node).animationDuration,
  }));
  assert.equal(motion.reduced, true);
  assert.match(motion.transitionDuration, /(?:0\.00001|1e-05)s/);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const reflow = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.equal(reflow.scrollWidth, reflow.viewport);
  await page.screenshot({ path: '.factory/verification-evidence-9/live-demo-mobile-dark-200pct.png', fullPage: true });
  evidence.mobileDemo = { navigation: { first, second, back }, validationFocus: true, ctrlEnterReady: true, seriousCritical, undersized, motion, reflow };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  watch(page);
  await page.goto(`${base}/demo`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.locator('#title').fill('Fresh live offline evidence');
  await page.waitForFunction(async () => {
    const db = await new Promise((resolve, reject) => { const r = indexedDB.open('demo:caption-queue'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    return await new Promise((resolve, reject) => { const tx = db.transaction('workspace', 'readonly'); const r = tx.objectStore('workspace').get('current'); r.onsuccess = () => resolve(r.result?.items?.some((item) => item.metadata?.title === 'Fresh live offline evidence')); r.onerror = () => reject(r.error); });
  });
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  const retained = await page.locator('#title').inputValue();
  assert.equal(retained, 'Fresh live offline evidence');
  assert.equal(await page.getByText('Offline · work is saved').count(), 1);
  evidence.offline = { retained, status: 'Offline · work is saved', mainVisible: await page.locator('main').isVisible() };
  await context.setOffline(false);
  await context.close();
}

assert.deepEqual(evidence.errors, []);
console.log(JSON.stringify(evidence, null, 2));
await browser.close();
