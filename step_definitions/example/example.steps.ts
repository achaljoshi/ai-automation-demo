import { expect } from '@playwright/test';
import { Given, Then } from '../../support/fixtures';

Given('the automation pipeline is configured', async ({ $testInfo }) => {
  // Verifies the repo scaffold and playwright-bdd setup work correctly.
  expect($testInfo.title).toBeTruthy();
});

Then('the test suite should be ready to run', async () => {
  console.log('\n  ✅  Automation repo scaffold is working correctly.');
  console.log('  🤖  AI-generated tests will be added here by the JIRA pipeline.\n');
});
