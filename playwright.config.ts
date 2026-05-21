import { defineConfig } from '@playwright/test';

/**
 * Central Playwright timeout and browser configuration.
 *
 * NOTE: Cucumber.js is the test runner — `npx playwright test` is NOT used.
 * These values are read at runtime by support/hooks.ts and applied to every
 * page/context via:
 *
 *   page.setDefaultNavigationTimeout(navigationTimeout)
 *   page.setDefaultTimeout(actionTimeout)
 *   expect.configure({ timeout: actionTimeout })
 *
 * The Cucumber per-step timeout is also set to `navigationTimeout` so that
 * a slow page.goto() or waitForURL() is never killed by Cucumber before
 * Playwright can throw its own descriptive error.
 *
 * Tune these values to match the slowest environment (usually CI on a
 * public demo site). Locally they will just result in faster failure.
 */
export default defineConfig({
  use: {
    /** Target application base URL. Overridden by BASE_URL env var in CI. */
    baseURL: process.env.BASE_URL || 'https://practicetestautomation.com',

    /**
     * Navigation timeout — applies to:
     *   • page.goto()
     *   • page.waitForURL()
     *   • expect(page).toHaveURL()
     *   • the implicit navigation wait inside locator.click()
     *
     * Set to 60 s: public demo sites on GitHub-hosted runners can take 30–40 s
     * to fully load, and this gives a comfortable safety margin.
     */
    navigationTimeout: 60_000,

    /**
     * Action timeout — applies to:
     *   • locator.click(), fill(), focus(), type(), …
     *   • expect(locator).toBeVisible(), toContainText(), toHaveAttribute(), …
     *
     * 15 s is sufficient for element interactions on a loaded page; most
     * elements appear within 2–3 s on the demo site.
     */
    actionTimeout: 15_000,

    viewport: { width: 1280, height: 720 },
  },
});
