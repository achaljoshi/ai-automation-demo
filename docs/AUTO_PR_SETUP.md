# Auto-PR setup (when CI tests pass)

When the JIRA pipeline finishes and **all Cucumber tests pass**, GitHub Actions can
automatically open a Pull Request from the feature branch (e.g.
`feature/scrum-1-user-login-...`) into `main`.

This doc explains **what happens**, **where each setting lives**, and **what you
need to configure once**.

---

## The flow (simple version)

```
┌─────────────────────┐     ┌──────────────────────────┐     ┌─────────────────────┐
│  Azure / local      │     │  ai-automation-demo      │     │  GitHub Actions     │
│  JIRA CI Agent      │────►│  (automation test repo)  │────►│  playwright.yml     │
│  (test-automation-  │     │                          │     │                     │
│   agent)            │     │  feature/… branch        │     │  Run tests → pass   │
└─────────────────────┘     └──────────────────────────┘     └──────────┬──────────┘
        │                              ▲                                  │
        │ 1. Generate tests            │ 3. Push branch                   │ 4. Auto PR
        │ 2. git push                  │                                  ▼
        └──────────────────────────────┘                        main ← Pull Request
```

| Step | Who | Where | What |
|------|-----|-------|------|
| 1–2 | JIRA agent | **Agents Web App** (Azure) or local `jira_run.py` | Reads JIRA, writes `.feature` + steps, pushes to `feature/…` |
| 3 | Same agent | Calls GitHub API | Triggers `workflow_dispatch` on **this repo** (`main` branch) |
| 4 | GitHub Actions | **This repo** → Actions → `playwright.yml` | Runs `npm test`; if green, runs `gh pr create` |

**Important:** Steps 1–3 use credentials on the **agent** (Azure `GITHUB_*` env vars).
Step 4 uses a **secret on this repo** (`PR_CREATE_TOKEN` or repo settings below).

---

## Two places, two jobs

Do not confuse these two GitHub-related setups:

| Purpose | Where you configure | Variable / secret |
|---------|---------------------|-------------------|
| Agent **pushes tests** and **starts** CI | Azure → **qforge-agents** → Environment variables (or local `.env` in converterapp) | `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_WORKFLOW` |
| Workflow **opens the PR** after tests pass | **This repo** → Settings → Secrets and variables → Actions | `PR_CREATE_TOKEN` (recommended) **or** repo Actions setting (see below) |

They can use the **same Personal Access Token (PAT)** value, but they are stored in
**different places**.

---

## One-time setup on `ai-automation-demo` (this repo)

Choose **one** of these options.

### Option A — Repository secret (recommended, already done for achaljoshi)

1. Open **GitHub** → **achaljoshi/ai-automation-demo**
2. **Settings** → **Secrets and variables** → **Actions**
3. Confirm secret **`PR_CREATE_TOKEN`** exists  
   - Value = a GitHub PAT with **`repo`** scope (Fine-grained: Contents read/write + Pull requests read/write on this repo)
4. Done — the workflow uses it automatically (`playwright.yml` line `GH_TOKEN: ${{ secrets.PR_CREATE_TOKEN || secrets.GITHUB_TOKEN }}`)

To create a PAT: GitHub → **Settings** → **Developer settings** → **Personal access tokens**.

### Option B — Allow the built-in Actions token

1. Open **achaljoshi/ai-automation-demo**
2. **Settings** → **Actions** → **General**
3. Under **Workflow permissions**, select **Read and write permissions**
4. Enable **Allow GitHub Actions to create and approve pull requests**
5. Save

If this is enabled, `GITHUB_TOKEN` alone can open PRs (no `PR_CREATE_TOKEN` required).

---

## One-time setup on Azure (JIRA agent)

These go on the **Agents Web App** (`qforge-agents`), **not** on the automation repo.

Azure Portal → **qforge-agents** → **Environment variables** → **App settings**:

| Name | Example | Purpose |
|------|---------|---------|
| `GITHUB_TOKEN` | `ghp_…` | Push feature branch + trigger workflow |
| `GITHUB_OWNER` | `achaljoshi` | GitHub user or org |
| `GITHUB_REPO` | `ai-automation-demo` | This repo name |
| `GITHUB_WORKFLOW` | `playwright.yml` | Workflow file under `.github/workflows/` |

After changing values: **Save** → **Restart** the Web App.

See also: [converterapp AZURE_SETUP.md](https://github.com/achaljoshi/converterapp/blob/main/AZURE_SETUP.md) → Profile B / A11.3.

---

## What you do day-to-day

**Nothing extra** for PR creation if setup above is done.

1. Run JIRA CI Agent (UI or `jira_run.py SCRUM-1 --repo … --ci github-actions`)
2. Wait for pipeline Phases 1–6
3. If tests pass → PR appears on **Pull requests** (or an existing PR is updated)
4. Review and merge the PR into `main`

For SCRUM-1, PR #1 was created manually when auto-PR failed the first time:
https://github.com/achaljoshi/ai-automation-demo/pull/1

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Tests **pass** but job shows warning on **Create PR to main** | `GITHUB_TOKEN` blocked from `createPullRequest` | Add **`PR_CREATE_TOKEN`** secret (Option A) or enable repo setting (Option B) |
| Error: `GitHub Actions is not permitted to create or approve pull requests` | Same as above | Same fix |
| No PR, but tests failed | Expected — PR only runs when all scenarios pass | Fix failing tests; re-run pipeline |
| PR title missing `[SCRUM-1]` | Old agent did not pass `story_key` to workflow | Update **test-automation-agent** to latest `main` and redeploy Agents Web App |
| PR step skipped | Branch is not `feature/…` or workflow not triggered via `workflow_dispatch` | Ensure JIRA agent pushes to `feature/<key>-…` and uses `--ci github-actions` |

---

## Related files

| File | Role |
|------|------|
| `.github/workflows/playwright.yml` | Runs tests + **Create PR to main** step |
| [test-automation-agent JIRA_PIPELINE.md](https://github.com/achaljoshi/test-automation-agent/blob/main/JIRA_PIPELINE.md) | Full pipeline docs |
| [converterapp AZURE_SETUP.md](https://github.com/achaljoshi/converterapp/blob/main/AZURE_SETUP.md) | Azure env vars for the agent |
