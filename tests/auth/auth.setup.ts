import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { USERS } from '../../src/data/users';
import { ADMIN_STORAGE_STATE } from '../../src/utils/paths';



/**
 * Logs in once and stores the session, so suites that need an authenticated
 * admin can reuse it via `storageState` instead of logging in per test.
 */
setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login(USERS.admin);
  await dashboardPage.expectLoggedIn();

  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
  expect(page.url()).toContain('/admin');
});
