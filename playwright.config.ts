import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * playwright-bdd turns the .feature files under features/ into Playwright tests (`npx bddgen`, written to
 * .features-gen/), and Playwright Test runs them: `npm test` = `bddgen && playwright test`.
 *
 * Steps: support/fixtures.ts (the `test` every scenario runs in, and Given/When/Then) plus
 * every file under step_definitions/. Fixtures are lazy, so an API scenario that only uses
 * the `api` fixture never starts a browser.
 */
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['support/fixtures.ts', 'step_definitions/**/*.ts'],
  outputDir: '.features-gen',
});

export default defineConfig({
  testDir,
  // Scenarios run one at a time: they share public demo sites and the Demo Bank mock API.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  // Per-scenario timeout; public demo sites on CI runners can take 30-40 s to load.
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    /** Target application base URL. Overridden by BASE_URL env var in CI. */
    baseURL: process.env.BASE_URL || 'https://practicetestautomation.com',
    headless: process.env.HEADED !== 'true',
    navigationTimeout: 60_000,
    actionTimeout: 15_000,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } } }],
});
