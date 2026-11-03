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
    // This site's error container is #error and does not have role="alert".
    this.errorMessage = page.locator('#error');
    this.successHeading = page.getByRole('heading', { name: 'Logged In Successfully' });
    this.successMessage = page.getByText('Congratulations student. You successfully logged in!', { exact: true });
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
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

  async expectUrlContains(path: string): Promise<void> {
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(this.page, `The URL should contain ${path}`).toHaveURL(new RegExp(escapedPath));
  }

  async expectHeadingVisible(heading: string): Promise<void> {
    await expect(this.successHeading, `The heading "${heading}" should be visible`).toBeVisible();
    await expect(this.successHeading, `The heading should read "${heading}"`).toHaveText(heading);
  }

  async expectMessageVisible(message: string): Promise<void> {
    await expect(this.successMessage, `The message "${message}" should be visible`).toBeVisible();
  }

  async expectLogoutLinkVisible(linkName: string): Promise<void> {
    await expect(this.logoutLink, `The "${linkName}" link should be visible`).toBeVisible();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage, `The login error should be "${message}"`).toHaveText(message);
  }

  async expectPasswordType(type: string): Promise<void> {
    await expect(this.passwordInput, `The password field should have type "${type}"`).toHaveAttribute('type', type);
  }
}
