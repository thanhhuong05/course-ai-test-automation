import { test, expect } from '../../src/fixtures';
import { LOGIN_ERRORS } from '../../src/pages/LoginPage';
import { INVALID_LOGIN_CASES, USERS } from '../../src/data/users';

test.describe('Admin login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login form is rendered with all its controls', async ({ loginPage }) => {
    await loginPage.expectLoginFormVisible();
    await expect(loginPage.rememberMeCheckbox).not.toBeChecked();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
  });

  test('valid credentials land the admin on the dashboard @smoke', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(USERS.admin);

    await dashboardPage.expectLoggedIn();
  });

  test('valid credentials with "Remember me" checked also log the admin in', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(USERS.admin, { rememberMe: true });

    await dashboardPage.expectLoggedIn();
  });

  test('logging out returns the admin to the login page', async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.login(USERS.admin);
    await dashboardPage.expectLoggedIn();

    await dashboardPage.logout();

    await loginPage.expectLoginFormVisible();
  });

  for (const { title, credentials, expectedError } of INVALID_LOGIN_CASES) {
    test(`rejects login with ${title}`, async ({ loginPage }) => {
      await loginPage.login(credentials);

      await loginPage.expectErrorMessage(expectedError);
      await loginPage.expectStillOnLoginPage();
    });
  }

  test('submitting an empty form reports both required fields', async ({ loginPage }) => {
    await loginPage.submit();

    await loginPage.expectErrorMessage(LOGIN_ERRORS.emailRequired);
    await loginPage.expectErrorMessage(LOGIN_ERRORS.passwordRequired);
    await loginPage.expectStillOnLoginPage();
  });

  test('password input masks what the user types', async ({ loginPage }) => {
    await loginPage.passwordInput.fill(USERS.admin.password);

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.passwordInput).toHaveValue(USERS.admin.password);
  });
});

test.describe('Access control', () => {
  test('an anonymous visitor is redirected from the dashboard to login', async ({
    page,
    loginPage,
  }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/\/admin\/authentication/);
    await loginPage.expectLoginFormVisible();
  });
});
