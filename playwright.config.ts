import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  // Service-worker registrations and caches are origin-scoped. Keep the release
  // suite serial so update/offline scenarios cannot race in shared browser state.
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: false,
    timeout: 120_000
  }
});
