import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';
import { expect } from '@playwright/test';

Given('the user is on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('the user enters {string} as username', async function (this: ICustomWorld, username: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(username);
});

When('the user enters {string} as password', async function (this: ICustomWorld, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillPassword(password);
});

When('the user clicks the {string} button', async function (this: ICustomWorld, buttonName: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickSubmit();
});

Then('the browser navigates to {string}', async function (this: ICustomWorld, expectedUrl: string) {
  await expect(this.page).toHaveURL(new RegExp(expectedUrl));
});

Then('the heading {string} is visible', async function (this: ICustomWorld, headingText: string) {
  await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible();
});

Then('the message {string} is visible', async function (this: ICustomWorld, messageText: string) {
  await expect(this.page.getByText(messageText)).toBeVisible();
});

Then('the {string} link is visible', async function (this: ICustomWorld, linkName: string) {
  await expect(this.page.getByRole('link', { name: linkName })).toBeVisible();
});

Then('the error message {string} should be displayed', async function (this: ICustomWorld, errorMessage: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectError(errorMessage);
});

Then('the {string} field should mask the input characters', async function (this: ICustomWorld, fieldName: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectPasswordMasked();
});