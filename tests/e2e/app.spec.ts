import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const csv = 'filename,title,caption,keywords,photographer,rights,city,country,dateCreated\nIMG_0001.jpg,Marsh heron,A heron at the edge of the marsh,bird; wetland,Mira Shah,© Mira Shah,Kingston,Canada,2026-08-20\nIMG_0002.jpg,,,,,,,,2026-08-20';

async function tabTo(page: Page, selector: string, limit = 80): Promise<void> {
  for (let step = 0; step < limit; step += 1) {
    await page.keyboard.press('Tab');
    if (await page.locator(selector).evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error(`Keyboard focus did not reach ${selector} after ${limit} Tab presses`);
}

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
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  let results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: 'Change color theme' }).click();
  results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
  expect(await page.locator('h1').count()).toBe(1);
  expect(consoleErrors).toEqual([]);
});

test('keyboard focus reaches visible import buttons and each activates its file picker on desktop and mobile', async ({ page }) => {
  const importButtons = [
    ['Choose photo folder', 'photo-input'],
    ['Import CSV', 'csv-input'],
    ['Restore backup', 'backup-input']
  ] as const;

  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    for (const [index, [name, inputId]] of importButtons.entries()) {
      const button = page.getByRole('button', { name });
      await tabTo(page, `[data-file-picker="${inputId}"]`);
      await expect(button).toBeFocused();
      await expect(button).toHaveCSS('outline-style', 'solid');
      await expect(button).toHaveCSS('outline-width', '3px');
      expect(await button.evaluate((element) => {
        const box = element.getBoundingClientRect();
        return box.width >= 44 && box.height >= 44;
      })).toBe(true);
      await expect(page.locator(`#${inputId}`)).not.toBeFocused();
      await expect(page.locator(`#${inputId}`)).toHaveAttribute('tabindex', '-1');
      const picker = page.waitForEvent('filechooser');
      await page.keyboard.press(index === 1 ? 'Space' : 'Enter');
      expect(await (await picker).element().getAttribute('id')).toBe(inputId);
    }
  }
});

test('workspace backup import uses the same visible keyboard control', async ({ page }) => {
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  const button = page.getByRole('button', { name: 'Import workspace backup' });
  await tabTo(page, '[data-file-picker="backup-input"]');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-width', '3px');
  await expect(page.locator('#backup-input')).toHaveAttribute('tabindex', '-1');
  const picker = page.waitForEvent('filechooser');
  await page.keyboard.press('Space');
  expect(await (await picker).element().getAttribute('id')).toBe('backup-input');
});

test('installed shell reopens offline at mobile width', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  await expect(page.getByRole('heading', { name: 'wetlands', level: 1 })).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'wetlands', level: 1 })).toBeVisible();
  await expect(page.getByText('IMG_0001.jpg', { exact: true }).first()).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
});
