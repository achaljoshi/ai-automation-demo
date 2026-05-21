import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit, expect } from '@playwright/test';
import { ICustomWorld } from './world';
import playwrightConfig from '../playwright.config';

// ── Read timeouts from playwright.config.ts ────────────────────────────────────
const use               = playwrightConfig.use ?? {};
const NAVIGATION_TIMEOUT = (use.navigationTimeout  as number) ?? 60_000;
const ACTION_TIMEOUT     = (use.actionTimeout      as number) ?? 15_000;
const BASE_URL           = (use.baseURL            as string) ?? 'https://practicetestautomation.com';
const VIEWPORT           = (use.viewport as { width: number; height: number } | undefined)
                           ?? { width: 1280, height: 720 };

const BROWSER = process.env.BROWSER || 'chromium';
const HEADED  = process.env.HEADED  === 'true';

// Cucumber per-step timeout — set equal to the navigation timeout so a slow
// page.goto() / waitForURL() never gets killed by Cucumber before Playwright
// has a chance to throw its own descriptive error message.
setDefaultTimeout(NAVIGATION_TIMEOUT);

// Global assertion retry timeout for all expect(locator).toBeVisible() etc.
expect.configure({ timeout: ACTION_TIMEOUT });

// ── Lifecycle hooks ────────────────────────────────────────────────────────────

BeforeAll(async function () {
  // Global setup (optional)
});

Before(async function (this: ICustomWorld) {
  const launcher = { chromium, firefox, webkit }[BROWSER] ?? chromium;
  this.browser = await launcher.launch({ headless: !HEADED });
  this.context = await this.browser.newContext({ baseURL: BASE_URL, viewport: VIEWPORT });
  this.page    = await this.context.newPage();

  // Apply Playwright-level timeouts from playwright.config.ts.
  // These govern goto(), waitForURL(), click()'s implicit nav-wait, etc.
  this.page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
  this.page.setDefaultTimeout(ACTION_TIMEOUT);
});

// timeout: 15_000 — must exceed the 5 s screenshot cap so cleanup always
// completes even when the browser is left mid-navigation by a failed step.
After({ timeout: 15_000 }, async function (this: ICustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    try {
      // Hard cap on the screenshot so a hung page doesn't block cleanup.
      const shot = await this.page.screenshot({ fullPage: true, timeout: 5_000 });
      await this.attach(shot, 'image/png');
    } catch { /* skip silently */ }
  }
  try { await this.context?.close(); } catch { /* ignore */ }
  try { await this.browser?.close(); } catch { /* ignore */ }
});

AfterAll(async function () {
  // Global teardown (optional)
});
