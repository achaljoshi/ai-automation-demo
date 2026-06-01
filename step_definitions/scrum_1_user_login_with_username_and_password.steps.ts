import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';

// ── Background ────────────────────────────────────────────────────────────────

Given('the user is on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

// ── Successful login ──────────────────────────────────────────────────────────

When('the user enters the username {string} and the password {string}',
  async function (this: ICustomWorld, username: string, password: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.fillUsername(username);
    await loginPage.fillPassword(password);
});

When('the user clicks on the {string} button',
  async function (this: ICustomWorld, buttonName: string) {
    const loginPage = new LoginPage(this.page);
    if (buttonName.toLowerCase() === 'submit') {
      await loginPage.clickSubmit();
    } else {
      throw new Error(`Button with name '${buttonName}' is not defined in the step definitions.`);
    }
});

Then('the page URL should contain {string}', async function (this: ICustomWorld, urlPart: string) {
  await expect(this.page).toHaveURL(new RegExp(urlPart));
});

Then('the user should see the heading {string}',
  async function (this: ICustomWorld, heading: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.expectHeading();
});

Then('the user should see the message {string}',
  async function (this: ICustomWorld, message: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.expectSuccessMessage();
});

Then('the user should see the {string} link',
  async function (this: ICustomWorld, linkName: string) {
    const loginPage = new LoginPage(this.page);
    if (linkName.toLowerCase() === 'log out') {
      await loginPage.expectLogoutLink();
    } else {
      throw new Error(`Link with name '${linkName}' is not defined in the step definitions.`);
    }
});

// ── Negative scenarios ────────────────────────────────────────────────────────

Then('the error message {string} should be displayed',
  async function (this: ICustomWorld, message: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.expectErrorMessage(message);
});

// ── Password masking ─────────────────────────────────────────────────────────-

Then('the password field should have the type {string}',
  async function (this: ICustomWorld, fieldType: string) {
    const loginPage = new LoginPage(this.page);
    await loginPage.expectPasswordFieldType(fieldType);
});