import { Given, When, Then } from '@cucumber/cucumber';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';

Given('the user is on the login page', async function (this: ICustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
});

When('the user fills in {string} with {string}', async function (this: ICustomWorld, field: string, value: string) {
  const loginPage = new LoginPage(this.page);

  if (field === 'Username') {
    await loginPage.fillUsername(value);
  } else if (field === 'Password') {
    await loginPage.fillPassword(value);
  } else {
    throw new Error(`Unknown field: ${field}`);
  }
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

  if (linkName === 'Log out') {
    await loginPage.expectLogoutLinkVisible();
  } else {
    throw new Error(`Unknown link: ${linkName}`);
  }
});

Then('the error message {string} should be displayed', async function (this: ICustomWorld, message: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectError(message);
});

Then('the password field should have the type {string}', async function (this: ICustomWorld, type: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.expectPasswordMasked();
});