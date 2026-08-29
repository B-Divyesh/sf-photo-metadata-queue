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

test('a first license verification accepts only a valid verdict', async ({ page }) => {
  const cases = [
    {
      name: 'invalid verdict',
      fulfill: { status: 200, contentType: 'application/json', body: JSON.stringify({ valid: false, reason: 'invalid' }) },
      message: 'That license is not active. Check the token and try again.'
    },
    {
      name: 'network failure',
      abort: 'failed' as const,
      message: 'Could not verify this license right now. Check your connection and try again.'
    },
    {
      name: 'rate limit',
      fulfill: { status: 429, headers: { 'Retry-After': '4', 'Access-Control-Expose-Headers': 'Retry-After' } },
      message: 'The license service asked us to wait 4 seconds before retrying.'
    }
  ];

  for (const scenario of cases) {
    let verificationRequests = 0;
    await page.route('https://api.sociobot.in/**', async (route) => {
      verificationRequests += 1;
      if ('abort' in scenario) await route.abort(scenario.abort);
      else await route.fulfill(scenario.fulfill);
    });
    await page.getByRole('button', { name: 'View pricing' }).click();
    await page.getByLabel('Have a license? Paste it here').fill(`fixture-${scenario.name}`);
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.locator('#license-message')).toHaveText(scenario.message);
    await expect(page.locator('#license-button')).toHaveText('View pricing');
    await expect(page.getByText('Field edition is active')).toHaveCount(0);
    expect(verificationRequests).toBe(1);

    if (scenario.name === 'rate limit') {
      await page.getByRole('button', { name: 'Verify license' }).click();
      await expect(page.locator('#license-message')).toHaveText(scenario.message);
      expect(verificationRequests).toBe(1);
    }

    await page.unroute('https://api.sociobot.in/**');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  }
});

test('only a fresh cached valid verdict stays unlocked during a verification outage', async ({ page }) => {
  let verificationRequests = 0;
  await page.route('https://api.sociobot.in/**', async (route) => {
    verificationRequests += 1;
    await route.abort('failed');
  });
  await page.evaluate(() => {
    localStorage.setItem('sb_license:photo-metadata-queue', 'previously-verified-token');
    localStorage.setItem('sb_license:photo-metadata-queue:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.reload();
  await expect(page.locator('#license-button')).toHaveText('Field edition');
  expect(verificationRequests).toBe(0);

  await page.evaluate(() => localStorage.setItem('sb_license:photo-metadata-queue:verdict', JSON.stringify({ valid: true, checkedAt: Date.now() - 86_400_001 })));
  await page.reload();
  await expect(page.locator('#license-button')).toHaveText('View pricing');
  expect(verificationRequests).toBe(1);
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

test('mobile editor touch controls meet the 44px target contract', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });

  const controls = [
    page.locator('[data-token]'),
    page.locator('[data-remove-keyword]'),
    page.getByRole('button', { name: 'Add term' })
  ];
  for (const control of controls) {
    const count = await control.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      const box = await control.nth(index).boundingBox();
      expect(box, `control ${index} should have a rendered box`).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('closed mobile queue is inert and opening it manages keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#csv-input').setInputFiles({ name: 'wetlands.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
  const queue = page.locator('.queue-panel');
  await expect(queue).toHaveAttribute('inert', '');
  await expect(queue).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('heading', { name: 'wetlands', level: 1 })).toBeVisible();
  const toggle = page.getByRole('button', { name: /Queue/ });
  await toggle.click();
  await expect(queue).not.toHaveAttribute('inert');
  await expect(page.getByRole('button', { name: 'Close queue' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(queue).toHaveAttribute('inert', '');
  await expect(toggle).toBeFocused();
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

test('installed shell announces a waiting service-worker update', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await page.evaluate(() => navigator.serviceWorker.register('/sw.js?qa-update=1'));
  const toast = page.getByText('An update is ready.');
  await expect(toast).toBeVisible();
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting))).toBe(true);
  expect(errors).toEqual([]);
});
