import { Page, Response, expect } from '@playwright/test';

/**
 * Shared behaviour for every page object: navigation, waiting and small helpers.
 * Page objects expose intent ("login as admin"), never raw selectors, to the tests.
 */
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  /** Path relative to `baseURL`, e.g. `/admin/authentication`. */
  abstract readonly path: string;

  async goto(): Promise<Response | null> {
    const response = await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.waitUntilLoaded();
    return response;
  }

  /** Override in a subclass to wait for the element that proves the page is ready. */
  async waitUntilLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectToBeOpened(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${escapeRegExp(this.path)}/?$`));
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  get currentUrl(): string {
    return this.page.url();
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
