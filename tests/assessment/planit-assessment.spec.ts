import { expect, test } from '@playwright/test';
import { JupiterCartPage } from '../../src/pages/JupiterCartPage';
import { JupiterContactPage } from '../../src/pages/JupiterContactPage';
import { JupiterHomePage } from '../../src/pages/JupiterHomePage';
import { JupiterShopPage } from '../../src/pages/JupiterShopPage';

test('TC1 - required contact errors clear when mandatory fields are populated', async ({ page }) => {
  const homePage = new JupiterHomePage(page);
  await homePage.goto();
  await homePage.openContactPage();

  const contactPage = new JupiterContactPage(page);
  await contactPage.submit();

  for (const field of ['Forename', 'Email', 'Message'] as const) {
    await expect(contactPage.requiredError(field)).toBeVisible();
  }

  await contactPage.fillMandatoryFields(
    'Alex',
    'alex.validation@example.com',
    'Checking required-field validation.',
  );

  for (const field of ['Forename', 'Email', 'Message'] as const) {
    await expect(contactPage.requiredError(field)).toHaveCount(0);
  }
});

test('TC2 - successful contact submission', async ({ page }, testInfo) => {
  const forename = `Planit${testInfo.repeatEachIndex}`;
  const homePage = new JupiterHomePage(page);
  await homePage.goto();
  await homePage.openContactPage();

  const contactPage = new JupiterContactPage(page);
  await contactPage.fillMandatoryFields(
    forename,
    `planit${testInfo.repeatEachIndex}@example.com`,
    'Submitting the Planit automation assessment form.',
  );
  await contactPage.submit();

  await expect(contactPage.successMessage(forename)).toBeVisible({ timeout: 15_000 });
});

test('TC3 - cart prices, product subtotals, and total are correct', async ({ page }) => {
  const homePage = new JupiterHomePage(page);
  await homePage.goto();
  await homePage.openShopPage();

  const shopPage = new JupiterShopPage(page);
  const expectedProducts = [
    { name: 'Stuffed Frog', quantity: 2, price: '$10.99' },
    { name: 'Fluffy Bunny', quantity: 5, price: '$9.99' },
    { name: 'Valentine Bear', quantity: 3, price: '$14.99' },
  ];

  for (const product of expectedProducts) {
    await shopPage.addProduct(product.name, product.quantity);
  }
  await shopPage.openCartPage();

  const cartPage = new JupiterCartPage(page);
  let expectedTotalCents = 0;

  for (const product of expectedProducts) {
    const row = cartPage.productRow(product.name);
    await expect(row).toBeVisible();

    const details = await cartPage.productDetails(product.name);
    expect(details.price).toBe(product.price);
    expect(details.quantity).toBe(String(product.quantity));

    const priceCents = toCents(details.price);
    const subtotalCents = toCents(details.subtotal);
    expect(subtotalCents).toBe(priceCents * product.quantity);
    expectedTotalCents += subtotalCents;
  }

  expect(toCents(await cartPage.totalText())).toBe(expectedTotalCents);
});

function toCents(value: string): number {
  const amount = value.match(/\d+(?:\.\d{1,2})?/);
  if (!amount) {
    throw new Error(`Unable to parse a currency amount from: ${value}`);
  }

  const [dollars, cents = ''] = amount[0].split('.');
  return Number(dollars) * 100 + Number(cents.padEnd(2, '0'));
}