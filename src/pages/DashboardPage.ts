import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/** Landing page after a successful admin login. */
export class DashboardPage extends BasePage {
  readonly path = '/admin';

  readonly logoutLink: Locator;
  readonly widgetsSection: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutLink = page.locator('a[href*="authentication/logout"]').first();
    this.widgetsSection = page.getByText('Widgets', { exact: true }).first();
  }

  override async waitUntilLoaded(): Promise<void> {
    await this.page.waitForURL(/\/admin\/?$/);
    await expect(this.page).toHaveTitle(/Dashboard/i);
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/?$/);
    await expect(this.page).toHaveTitle(/Dashboard/i);
    await expect(this.logoutLink).toHaveCount(1);
  }

  async logout(): Promise<void> {
    await this.page.goto('/admin/authentication/logout', { waitUntil: 'domcontentloaded' });
    await this.page.waitForURL(/\/admin\/authentication/);
  }
}
