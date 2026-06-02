import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';

Given('the user is on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('the user enters {string} as the username', async function (this: ICustomWorld, username: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(username);
});

When('the user enters {string} as the password', async function (this: ICustomWorld, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillPassword(password);
});

When('the user clicks the {string} button', async function (this: ICustomWorld, buttonName: string) {
  // No need to use the buttonName parameter since the page object already knows the button name
  const loginPage = new LoginPage(this.page);
  await loginPage.clickSubmit();
});

Then('the page URL should contain {string}', async function (this: ICustomWorld, urlPart: string) {
  const escapedUrlPart = urlPart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(this.page).toHaveURL(new RegExp(escapedUrlPart));
});

Then('the user should see the heading {string}', async function (this: ICustomWorld, heading: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectSuccessHeadingVisible();
});

Then('the user should see the message {string}', async function (this: ICustomWorld, message: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectSuccessMessageVisible();
});

Then('the log out link should be visible', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectLogoutLinkVisible();
});

Then('the error message {string} should be displayed', async function (this: ICustomWorld, message: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectError(message);
});

Then('the password field should have the type {string}', async function (this: ICustomWorld, fieldType: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectPasswordType(fieldType);
});