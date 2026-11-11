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

  async expectSuccessURL(): Promise<void> {
    await expect(this.page, 'Successful login should navigate to the success page').toHaveURL(/\/logged-in-successfully\//);
  }

  async expectSuccessHeading(): Promise<void> {
    await expect(this.successHeading, 'The login success heading should be visible').toBeVisible();
  }

  async expectSuccessMessage(): Promise<void> {
    await expect(this.successMessage, 'The login success message should be visible').toBeVisible();
  }

  async expectLogoutLinkVisible(): Promise<void> {
    await expect(this.logoutLink, 'The Log out link should be visible after login').toBeVisible();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage, `The login error should say "${message}"`).toHaveText(message);
  }

  async expectPasswordType(fieldType: string): Promise<void> {
    await expect(this.passwordInput, 'The password field should mask input characters').toHaveAttribute('type', fieldType);
  }
}
