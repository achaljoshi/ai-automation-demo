import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';

Given('the user is on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('the user enters the username {string}', async function (this: ICustomWorld, username: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(username);
});

When('the user enters the password {string}', async function (this: ICustomWorld, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillPassword(password);
});

When('the user clicks the {string} button', async function (this: ICustomWorld, buttonName: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickSubmit();
});

Then('the page URL should contain {string}', async function (this: ICustomWorld, urlPart: string) {
  await expect(this.page).toHaveURL(new RegExp(urlPart));
});

Then('the user should see the heading {string}', async function (this: ICustomWorld, heading: string) {
  await expect(this.page.getByRole('heading', { name: heading })).toBeVisible();
});

Then('the user should see the message {string}', async function (this: ICustomWorld, message: string) {
  await expect(this.page.getByText(message)).toBeVisible();
});

Then('the {string} link should be visible', async function (this: ICustomWorld, linkName: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectLogoutLinkVisible();
});

Then('the error message {string} should be displayed', async function (this: ICustomWorld, errorMessage: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectError(errorMessage);
});

Then('the password field should have the type {string}', async function (this: ICustomWorld, expectedType: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectPasswordFieldType(expectedType);
});