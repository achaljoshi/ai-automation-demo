import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly successHeading: Locator;
  readonly successMessage: Locator;
  readonly logoutLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successHeading = page.getByRole('heading', { name: 'Logged In Successfully' });
    this.successMessage = page.getByText('Congratulations student. You successfully logged in!', { exact: true });
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
    this.errorMessage = page.locator('#error');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/practice-test-login/', { waitUntil: 'domcontentloaded' });
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
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(this.page, `Login should navigate to a URL containing ${path}`).toHaveURL(new RegExp(escapedPath));
  }

  async expectSuccessHeading(heading: string): Promise<void> {
    await expect(this.successHeading, `The ${heading} heading should be visible`).toHaveText(heading);
  }

  async expectSuccessMessage(message: string): Promise<void> {
    await expect(this.successMessage, `The success message should say: ${message}`).toHaveText(message);
  }

  async expectLogoutLinkVisible(): Promise<void> {
    await expect(this.logoutLink, 'The Log out link should be visible after login').toBeVisible();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage, `Login error should say: ${message}`).toHaveText(message);
  }

  async expectPasswordFieldType(fieldType: string): Promise<void> {
    await expect(this.passwordInput, 'The password field should mask entered characters').toHaveAttribute('type', fieldType);
  }
}
