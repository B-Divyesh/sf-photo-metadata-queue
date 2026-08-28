import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const csv = 'filename,title,caption,keywords,photographer,rights,city,country,dateCreated\nIMG_0001.jpg,Marsh heron,A heron at the edge of the marsh,bird; wetland,Mira Shah,© Mira Shah,Kingston,Canada,2026-08-20\nIMG_0002.jpg,,,,,,,,2026-08-20';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    indexedDB.deleteDatabase('caption-queue');
    localStorage.clear();
  });
  await page.reload();
});

test('imports a CSV, edits a record, and exports valid XMP', async ({ page }) => {
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await expect(page.getByRole('heading', { name: 'wetlands', level: 1 })).toBeVisible();
  await expect(page.getByText('IMG_0001.jpg', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: /IMG_0002.jpg/ }).click();
  await page.locator('#title').fill('Heron returning');
  await page.locator('#description').fill('A heron returns to the marsh.');
  await page.locator('#keywords').fill('bird; wetland');
  await page.getByRole('button', { name: /Mark ready/ }).click();
  await expect(page.getByText('1 of 2 ready')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export this XMP' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('IMG_0002.xmp');
});

test('landing and editor have no serious axe violations', async ({ page }) => {
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: 'Change color theme' }).click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
});

test('installed shell reopens offline at mobile width', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: /Caption the shoot/ })).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
});
