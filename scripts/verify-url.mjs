import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = new URL(process.argv[2] ?? 'http://127.0.0.1:4173/');
const browser = await chromium.launch({ headless: true });
const consoleErrors = [];

const expectedTitles = new Map([
  ['/', 'Caption Queue — Write photo metadata offline'],
  ['/demo', 'Demo — Caption Queue'],
  ['/privacy', 'Privacy — Caption Queue'],
  ['/terms', 'Terms — Caption Queue']
]);

for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(`${viewport.width}px: ${message.text()}`); });
  page.on('pageerror', (error) => consoleErrors.push(`${viewport.width}px: ${error.message}`));
  for (const [route, title] of expectedTitles) {
    const response = await page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
    assert.ok(response?.ok(), `${route} did not return a successful response at ${viewport.width}px`);
    assert.equal(await page.title(), title, `${route} has the wrong title`);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en', `${route} has the wrong language`);
    assert.equal(await page.locator('main').count(), 1, `${route} must have one main landmark`);
    assert.equal(await page.locator('h1').count(), 1, `${route} must have one h1`);
    assert.equal(await page.locator('img:not([alt])').count(), 0, `${route} has an image without alt text`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `${route} overflows at ${viewport.width}px`);
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? '')).map((violation) => violation.id), [], `${route} has serious or critical axe violations at ${viewport.width}px`);
  }
  await context.close();
}

assert.deepEqual(consoleErrors, [], `browser errors: ${consoleErrors.join(' | ')}`);
await browser.close();
console.log(`URL verified at desktop semantics and 390px layout: ${base.origin}`);
