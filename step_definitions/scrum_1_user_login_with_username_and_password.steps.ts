import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import { LoginPage } from '../pages/LoginPage';

Given('the user is on the login page', async ({ page }) => {
  await new LoginPage(page).navigate();
});

When('the user enters username {string}', async ({ page }, username: string) => {
  await new LoginPage(page).fillUsername(username);
});

When('the user enters password {string}', async ({ page }, password: string) => {
  await new LoginPage(page).fillPassword(password);
});

When('the user submits the login form', async ({ page }) => {
  await new LoginPage(page).clickSubmit();
});

Then('the page URL should contain {string}', async ({ page }, path: string) => {
  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page, `The URL should contain ${path}`).toHaveURL(new RegExp(escapedPath));
});

Then('the heading {string} should be visible', async ({ page }, heading: string) => {
  await new LoginPage(page).expectHeadingVisible(heading);
});

Then('the message {string} should be visible', async ({ page }, message: string) => {
  await new LoginPage(page).expectMessageVisible(message);
});

Then('the {string} link should be visible', async ({ page }, linkText: string) => {
  await new LoginPage(page).expectLogoutLinkVisible(linkText);
});

Then('the error message {string} should be displayed', async ({ page }, message: string) => {
  await new LoginPage(page).expectError(message);
});

Then('the password field should have the type {string}', async ({ page }, fieldType: string) => {
  await new LoginPage(page).expectPasswordType(fieldType);
});
