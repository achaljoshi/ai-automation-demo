/**
 * The `test` every scenario runs in, and the Given/When/Then that step files import.
 *
 *   import { Given, When, Then } from '../support/fixtures';
 *   Given('the user is on the login page', async ({ page }) => { ... });
 *   Then('the response status should be {int}', async ({ api }, status: number) => { ... });
 *
 * Built-in fixtures: page, context, browser, request, baseURL, $testInfo ...
 * Added here: `api` (support/api.ts) — the scenario's HTTP client and last response.
 * Add a fixture for anything a scenario needs; never use hooks or globals for state.
 */
import { createBdd, test as base } from 'playwright-bdd';
import { ApiSession } from './api';

type Fixtures = {
  api: ApiSession;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new ApiSession(request));
  },
});

export const { Given, When, Then } = createBdd(test);
