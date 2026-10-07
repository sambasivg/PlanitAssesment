import type { Page } from '@playwright/test';

export class JupiterHomePage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async openContactPage(): Promise<void> {
    await this.page.getByRole('link', { name: 'Contact' }).click();
  }

  async openShopPage(): Promise<void> {
    await this.page.getByRole('link', { name: 'Shop', exact: true }).click();
  }
}