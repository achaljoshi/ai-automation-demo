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
    await this.submitButton.click();
  }

  async expectSuccessUrl(): Promise<void> {
    await expect(this.page, 'Successful login should navigate to the success page').toHaveURL(/\/logged-in-successfully\//);
  }

  async expectSuccessHeading(heading: string): Promise<void> {
    await expect(this.successHeading, `The heading "${heading}" should be visible`).toHaveText(heading);
  }

  async expectSuccessMessage(message: string): Promise<void> {
    await expect(this.successMessage, `The success message "${message}" should be visible`).toHaveText(message);
  }

  async expectLogoutLinkVisible(linkName: string): Promise<void> {
    await expect(this.logoutLink, `The "${linkName}" link should be visible`).toBeVisible();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage, `The login error "${message}" should be visible`).toHaveText(message);
  }

  async expectPasswordFieldType(fieldType: string): Promise<void> {
    await expect(this.passwordInput, `The password field should have type "${fieldType}"`).toHaveAttribute('type', fieldType);
  }
}
