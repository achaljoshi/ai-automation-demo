import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';
import { LoginPage } from '../pages/LoginPage';

Given('the user is on the login page', async function (this: ICustomWorld) {
  await new LoginPage(this.page).navigate();
});

When('the user enters username {string}', async function (this: ICustomWorld, username: string) {
  await new LoginPage(this.page).fillUsername(username);
});

When('the user enters password {string}', async function (this: ICustomWorld, password: string) {
  await new LoginPage(this.page).fillPassword(password);
});

When('the user submits the login form', async function (this: ICustomWorld) {
  await new LoginPage(this.page).clickSubmit();
});

Then('the page URL should contain {string}', async function (this: ICustomWorld, path: string) {
  await new LoginPage(this.page).expectUrlContains(path);
});

Then('the heading {string} should be visible', async function (this: ICustomWorld, heading: string) {
  await new LoginPage(this.page).expectHeadingVisible(heading);
});

Then('the message {string} should be visible', async function (this: ICustomWorld, message: string) {
  await new LoginPage(this.page).expectMessageVisible(message);
});

Then('the {string} link should be visible', async function (this: ICustomWorld, linkName: string) {
  await new LoginPage(this.page).expectLogoutLinkVisible(linkName);
});

Then('the login error {string} should be displayed', async function (this: ICustomWorld, message: string) {
  await new LoginPage(this.page).expectError(message);
});

Then('the password field should have the type {string}', async function (this: ICustomWorld, type: string) {
  await new LoginPage(this.page).expectPasswordType(type);
});
