import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';

Given('the user is on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('the user enters username {string}', async function (this: ICustomWorld, username: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillUsername(username);
});

When('the user enters password {string}', async function (this: ICustomWorld, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fillPassword(password);
});

When('the user clicks the {string} button', async function (this: ICustomWorld, button: string) {
  const loginPage = new LoginPage(this.page);
  if (button === 'Submit') {
    await loginPage.clickSubmit();
  } else {
    throw new Error(`Unknown button: ${button}`);
  }
});

Then('the page URL should contain {string}', async function (this: ICustomWorld, urlPart: string) {
  await this.page.waitForURL(`**${urlPart}**`);
});

Then('the user should see the heading {string}', async function (this: ICustomWorld, heading: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectSuccess();
});

Then('the user should see the message {string}', async function (this: ICustomWorld, message: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectSuccess();
});

Then('the user should see the {string} link', async function (this: ICustomWorld, linkText: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectSuccess();
});

Then('the error message {string} should be displayed', async function (this: ICustomWorld, message: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectError(message);
});

Then('the {string} field should be of type {string}', async function (this: ICustomWorld, fieldName: string, type: string) {
  const loginPage = new LoginPage(this.page);
  if (fieldName === 'Password' && type === 'password') {
    await loginPage.expectPasswordFieldMasked();
  } else {
    throw new Error(`Validation for field ${fieldName} with type ${type} not implemented.`);
  }
});