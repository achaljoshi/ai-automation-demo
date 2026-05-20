import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser } from '@playwright/test';
import { ICustomWorld } from './world';

const BROWSER  = process.env.BROWSER  || 'chromium';
const HEADED   = process.env.HEADED   === 'true';

BeforeAll(async function () {
  // Warm up (optional global setup)
});

Before(async function (this: ICustomWorld) {
  const launcher = { chromium, firefox, webkit }[BROWSER] ?? chromium;
  this.browser = await launcher.launch({ headless: !HEADED });
  this.context = await this.browser.newContext({
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    viewport: { width: 1280, height: 720 },
  });
  this.page = await this.context.newPage();
});

After(async function (this: ICustomWorld, scenario) {
  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }
  await this.context?.close();
  await this.browser?.close();
});

AfterAll(async function () {
  // Global teardown (optional)
});
