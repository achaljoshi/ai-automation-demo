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

setDefaultTimeout(NAVIGATION_TIMEOUT);
expect.configure({ timeout: ACTION_TIMEOUT });

// Do not let a browser stuck in navigation block the entire teardown hook.
async function boundedCleanup(operation: () => Promise<unknown>, timeoutMs: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      operation(),
      new Promise<void>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Cleanup timed out')), timeoutMs);
      }),
    ]);
  } catch { /* best-effort cleanup */ }
  finally { if (timer) clearTimeout(timer); }
}

// ── Lifecycle hooks ────────────────────────────────────────────────────────────

BeforeAll(async function () {
  // Global setup (optional)
});

Before({ tags: 'not @api' }, async function (this: ICustomWorld) {
  const launcher = { chromium, firefox, webkit }[BROWSER] ?? chromium;
  this.browser = await launcher.launch({ headless: !HEADED });
  this.context = await this.browser.newContext({ baseURL: BASE_URL, viewport: VIEWPORT });
  this.page    = await this.context.newPage();

  this.page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
  this.page.setDefaultTimeout(ACTION_TIMEOUT);
});

After({ timeout: 15_000 }, async function (this: ICustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    try {
      const shot = await this.page.screenshot({ fullPage: true, timeout: 3_000 });
      await this.attach(shot, 'image/png');
    } catch { /* skip silently */ }
  }
  // TODO: verify this fix — the retry's cleanup timed out while the page was mid-navigation.
  if (this.context) await boundedCleanup(() => this.context.close(), 4_000);
  if (this.browser) await boundedCleanup(() => this.browser.close(), 4_000);
});

AfterAll(async function () {
  // Global teardown (optional)
});
