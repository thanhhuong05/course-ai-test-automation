import { test, expect } from '../../src/fixtures';
import { ADMIN_STORAGE_STATE } from '../../src/utils/paths';

/**
 * Example of reusing the session saved by `auth.setup.ts`: no login steps here,
 * the test starts already authenticated. Add feature suites the same way.
 */
test.describe('Session reuse', () => {
  test.use({ storageState: ADMIN_STORAGE_STATE });

  test('a stored admin session opens the dashboard directly', async ({
    page,
    dashboardPage,
  }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await dashboardPage.expectLoggedIn();
    await expect(page).not.toHaveURL(/authentication/);
  });
});
