import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Credentials } from '../data/users';

/** Perfex CRM admin login page: https://crm.anhtester.com/admin/authentication */
export class LoginPage extends BasePage {
  readonly path = '/admin/authentication';

  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  /** The app can render several error banners at once (one per invalid field). */
  readonly alerts: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Login' });
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.rememberMeCheckbox = page.locator('#remember');
    this.loginButton = page.locator('form button[type="submit"]');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
    this.alerts = page.locator('.alert-danger');
  }

  override async waitUntilLoaded(): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible' });
    await this.passwordInput.waitFor({ state: 'visible' });
  }

  async fillCredentials({ email, password }: Credentials): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async setRememberMe(checked: boolean): Promise<void> {
    await this.rememberMeCheckbox.setChecked(checked);
  }

  /**
   * Submits the form and waits for the server response plus the resulting page.
   * `noWaitAfter` keeps the click itself from blocking on the navigation, which
   * WebKit reports inconsistently for a full form post.
   */
  async submit(): Promise<void> {
    const submission = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' && response.url().includes(this.path),
    );

    await this.loginButton.click({ noWaitAfter: true });

    await submission;
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Fill + submit. Does not assert the outcome — the test decides what to expect. */
  async login(credentials: Credentials, options: { rememberMe?: boolean } = {}): Promise<void> {
    await this.fillCredentials(credentials);
    if (options.rememberMe !== undefined) {
      await this.setRememberMe(options.rememberMe);
    }
    await this.submit();
  }

  // --- assertions -------------------------------------------------------

  async expectLoginFormVisible(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
  }

  /** Asserts that at least one error banner carries `message`. */
  async expectErrorMessage(message: string | RegExp): Promise<void> {
    await expect(this.alerts.filter({ hasText: message }).first()).toBeVisible();
  }

  /** Text of every error banner currently rendered. */
  async errorMessages(): Promise<string[]> {
    return (await this.alerts.allInnerTexts()).map((text) => text.trim());
  }

  async expectStillOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/authentication/);
    await expect(this.loginButton).toBeVisible();
  }
}

/** Messages the application renders on a failed login. */
export const LOGIN_ERRORS = {
  invalidCredentials: 'Invalid email or password',
  emailRequired: 'The Email Address field is required.',
  passwordRequired: 'The Password field is required.',
} as const;
