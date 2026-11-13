# ai-automation-repo

AI-generated Playwright + playwright-bdd automation tests, powered by the
[Test Automation Agent](https://github.com/achaljoshi/test-automation-agent).

Test files in this repo are automatically generated from JIRA stories
by the JIRA pipeline — no manual coding required.

---

## Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | Browser automation |
| [playwright-bdd](https://vitalets.github.io/playwright-bdd/) | BDD: Gherkin features run by Playwright Test |
| [TypeScript](https://www.typescriptlang.org/) | Language |
| [GitHub Actions](https://docs.github.com/en/actions) | CI/CD |

---

## Project Structure

```
ai-automation-repo/
├── .github/workflows/
│   └── playwright.yml        # GitHub Actions CI workflow
├── features/
│   └── <story-key>_<name>.feature   # Gherkin feature files (AI-generated)
├── step_definitions/
│   └── <story-key>_<name>.steps.ts  # Playwright step defs (AI-generated)
├── pages/
│   └── <PageName>.ts         # Page Object classes (AI-generated, if needed)
├── api/
│   └── <Name>Client.ts       # API clients (AI-generated, if needed)
├── support/
│   ├── fixtures.ts           # The test every scenario runs in + Given/When/Then
│   └── api.ts                # The `api` fixture: HTTP client and last response
├── package.json
├── tsconfig.json
└── playwright.config.ts      # playwright-bdd (defineBddConfig) + Playwright settings
```

---

## Running Tests Locally

```bash
# Install dependencies
npm install
npx playwright install chromium

# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run regression tests
npm run test:regression

# Run in headed mode (visible browser)
npm run test:headed

# One scenario, or a tag
npx bddgen && npx playwright test --grep "Pipeline health check"
npx bddgen && npx playwright test --grep @api
```

`npm test` runs `bddgen` (turns the features into Playwright tests under `.features-gen/`) and
then `playwright test`. Reports: `playwright-report/` (HTML) and `test-results/junit.xml`.

### Writing steps

Steps import Given/When/Then from `support/fixtures.ts` and take Playwright fixtures as the first
argument — no World, no hooks:

```typescript
import { expect } from '@playwright/test';
import { Given, Then } from '../support/fixtures';
import { LoginPage } from '../pages/LoginPage';

Given('the user is on the login page', async ({ page }) => {
  await new LoginPage(page).navigate();
});

Then('the user should see the message {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message)).toBeVisible();
});
```

A step defined twice, or a feature step with no definition, fails `bddgen` with the step's name.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:3000` | Application under test |
| `HEADED` | `false` | Show browser window |
| `API_BASE_URL` | `https://qforge-prod.azurewebsites.net/mock/api/v1` | Base URL for `@api` scenarios |

Copy `.env.example` to `.env` and set your values.

---

## API Tests

API scenarios (tagged `@api`) use the `api` fixture, an HTTP session on Playwright's `request`.
Fixtures are lazy, so a scenario that never uses `page` never starts a browser.

- `support/api.ts` — `ApiSession`, `sendRequest()`, `fieldAt()` and `API_BASE_URL`
- `step_definitions/common/api.steps.ts` — generic HTTP steps shared by every API story
  (`When I send a GET request to "/accounts/1"`, `Then the response status should be 200`,
  `And the response field "meta.count" should equal 4`, …). Don't redefine them in story files.
- `api/` — API clients the JIRA agent generates for story-specific actions

```bash
npx bddgen && npx playwright test --grep @api      # API scenarios only
```

---

## How Tests Get Added

Tests are automatically generated and pushed here by the JIRA pipeline:

```bash
# From the test-automation-agent repo:
python jira_run.py PROJ-123 \
  --repo https://github.com/<username>/ai-automation-repo.git \
  --ci github-actions \
  --notify-email qa@company.com
```

The agent will:
1. Read the JIRA story
2. Generate `.feature` + step definitions using AI
3. Push to a `feature/proj-123-...` branch
4. Trigger this GitHub Actions workflow
5. **If tests pass** — open a Pull Request to `main` (see below)
6. Send you the test report

---

## Auto-PR after green CI

When all tests pass, `.github/workflows/playwright.yml` runs `gh pr create` from the
feature branch to `main`.

**Full setup guide (where to click in GitHub and Azure):**  
→ **[docs/AUTO_PR_SETUP.md](docs/AUTO_PR_SETUP.md)**

Quick summary:

| What | Where |
|------|--------|
| Agent pushes tests + triggers CI | Azure **qforge-agents** app settings: `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_WORKFLOW` |
| Workflow opens the PR | **This repo** → Settings → Secrets → Actions → `PR_CREATE_TOKEN` (PAT with `repo` scope), **or** enable “Allow GitHub Actions to create and approve pull requests” under Settings → Actions → General |

You only configure this once. After that, each successful JIRA run can open a PR automatically.

---

## Configuring the JIRA Pipeline (one-time)

```bash
# Point the pipeline at this repo
python jira_run.py configure GITHUB_TOKEN=ghp_yourtoken
python jira_run.py configure GITHUB_OWNER=<your-github-username>
python jira_run.py configure GITHUB_REPO=ai-automation-repo
python jira_run.py configure GITHUB_WORKFLOW=playwright.yml
```

---

*Generated by [Test Automation Agent](https://github.com/achaljoshi/test-automation-agent)*
