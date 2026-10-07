import type { Locator, Page } from '@playwright/test';

export type CartProductDetails = {
  price: string;
  quantity: string;
  subtotal: string;
};

export class JupiterCartPage {
  constructor(private readonly page: Page) {}

  productRow(name: string): Locator {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name, exact: true }),
    });
  }

  async productDetails(name: string): Promise<CartProductDetails> {
    const row = this.productRow(name);
    return {
      price: await row.getByRole('cell').nth(1).innerText(),
      quantity: await row.getByRole('spinbutton').inputValue(),
      subtotal: await row.getByRole('cell').nth(3).innerText(),
    };
  }

  async totalText(): Promise<string> {
    return this.page.getByRole('row').filter({ hasText: 'Total:' }).innerText();
  }
}