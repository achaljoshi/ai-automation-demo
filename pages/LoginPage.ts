import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successHeading: Locator;
  readonly successMessage: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.errorMessage = page.locator('#error');
    this.successHeading = page.getByRole('heading', { name: 'Logged In Successfully' });
    this.successMessage = page.getByText('Congratulations student. You successfully logged in!', { exact: true });
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
  }

  async navigate(): Promise<void> {
    // TODO: verify this fix — the retry timed out loading the external demo site; waiting for the login form avoids waiting for unrelated resources.
    await this.page.goto('/practice-test-login/', { waitUntil: 'commit', timeout: 30_000 });
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15_000 });
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click({ noWaitAfter: true });
  }

  async expectSuccessUrl(path: string): Promise<void> {
    // The site can redirect to the success path without the trailing slash.
    const escapedPath = path.replace(/\/$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const expected = new RegExp(`${escapedPath}/?(?:[?#]|$)`);
    // The submit click does not wait for navigation; wait for its commit before asserting the URL.
    await this.page.waitForURL(expected, { waitUntil: 'commit', timeout: 45_000 });
    await expect(this.page, `Login should navigate to a URL containing ${path}`).toHaveURL(expected);
  }

  async expectSuccessHeading(heading: string): Promise<void> {
    await expect(this.successHeading, `The ${heading} heading should be visible`).toBeVisible();
  }

  async expectSuccessMessage(message: string): Promise<void> {
    await expect(this.successMessage, `The success message ${message} should be visible`).toBeVisible();
  }

  async expectLogoutLinkVisible(): Promise<void> {
    await expect(this.logoutLink, 'The Log out link should be visible after login').toBeVisible();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage, `The login error should be ${message}`).toHaveText(message);
  }

  async expectPasswordType(fieldType: string): Promise<void> {
    await expect(this.passwordInput, `The password field should have type ${fieldType}`).toHaveAttribute('type', fieldType);
  }
}
