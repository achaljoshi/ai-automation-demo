import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';
import { expect } from '@playwright/test';

Given('the user is on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigateToLoginPage();
});

When('the user enters username {string}', async function (this: ICustomWorld, username: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(username);
});

When('the user enters password {string}', async function (this: ICustomWorld, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillPassword(password);
});

When('the user clicks the {string} button', async function (this: ICustomWorld, buttonName: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.clickSubmitButton();
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

Then('the user should see the {string} link', async function (this: ICustomWorld, linkText: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectLogoutLinkVisible();
});

Then('the error message {string} should be displayed', async function (this: ICustomWorld, message: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectErrorMessage(message);
});

Then('the password field should have the type {string}', async function (this: ICustomWorld, fieldType: string) {
  const loginPage = new LoginPage(this.page);
  await expect(loginPage.passwordInput).toHaveAttribute('type', fieldType);
});