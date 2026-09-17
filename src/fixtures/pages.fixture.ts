import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type PageObjects = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

/**
 * Extends Playwright's `test` with ready-to-use page objects, so specs read as
 * behaviour instead of wiring: `await loginPage.login(USERS.admin)`.
 */
export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect };
