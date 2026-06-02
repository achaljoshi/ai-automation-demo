import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly logoutLink: Locator;
  readonly successHeading: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.errorMessage = page.locator('#error');
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
    this.successHeading = page.getByRole('heading', { name: 'Logged In Successfully' });
    this.successMessage = page.getByText('Congratulations student. You successfully logged in!');
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

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectPasswordType(type: string): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', type);
  }

  async expectLogoutLinkVisible(): Promise<void> {
    await expect(this.logoutLink).toBeVisible();
  }

  async expectSuccessHeadingVisible(): Promise<void> {
    await expect(this.successHeading).toBeVisible();
  }

  async expectSuccessMessageVisible(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }
}