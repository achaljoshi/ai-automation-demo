import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';

Given('the user is on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

Given('the user enters {string} as the username', async function (this: ICustomWorld, username: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(username);
});

Given('the user enters {string} as the password', async function (this: ICustomWorld, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillPassword(password);
});

When('the user submits the login form', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.submit();
});

Then('the user should see the heading {string}', async function (this: ICustomWorld, heading: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectSuccessfulLogin();
});

Then('the user should see the message {string}', async function (this: ICustomWorld, message: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectSuccessfulLogin();
});

Then('the page URL should contain {string}', async function (this: ICustomWorld, urlPart: string) {
  await this.page.waitForURL(`**${urlPart}**`);
});

Then('the {string} link should be visible', async function (this: ICustomWorld, linkText: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectSuccessfulLogin();
});

Then('the error message {string} should be displayed', async function (this: ICustomWorld, errorMessage: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectError(errorMessage);
});

Given('the user focuses on the password field', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  // No specific interaction needed as focusing is implied during masking validation
});

Then('the password field should mask the input characters \(type="password"\)', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectPasswordMasking();
});