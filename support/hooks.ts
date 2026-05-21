import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from '@playwright/test';
import { ICustomWorld } from './world';

// Raise the per-step timeout to 30 s. The default 5 s kills the After hook's
// screenshot when a failed step leaves the browser mid-navigation.
setDefaultTimeout(30_000);

const BROWSER = process.env.BROWSER || 'chromium';
const HEADED  = process.env.HEADED  === 'true';

BeforeAll(async function () {
  // Warm up (optional global setup)
});

Before(async function (this: ICustomWorld) {
  const launcher = { chromium, firefox, webkit }[BROWSER] ?? chromium;
  this.browser = await launcher.launch({ headless: !HEADED });
  this.context = await this.browser.newContext({
    baseURL: process.env.BASE_URL || 'https://practicetestautomation.com',
    viewport: { width: 1280, height: 720 },
  });
  this.page = await this.context.newPage();
});

// timeout: 15_000 — above the 5 s screenshot cap so cleanup always completes.
After({ timeout: 15_000 }, async function (this: ICustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    try {
      // Cap screenshot at 5 s — if page is hung, skip rather than hang.
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
