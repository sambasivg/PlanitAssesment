import type { Page } from '@playwright/test';

export class JupiterShopPage {
  constructor(private readonly page: Page) {}

  async addProduct(name: string, quantity: number): Promise<void> {
    const product = this.page.getByRole('listitem').filter({
      has: this.page.getByRole('heading', { name, exact: true }),
    });

    for (let count = 0; count < quantity; count++) {
      await product.getByRole('link', { name: 'Buy' }).click();
    }
  }

  async openCartPage(): Promise<void> {
    await this.page.getByRole('link', { name: /^Cart/ }).click();
  }
}