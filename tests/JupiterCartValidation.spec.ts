import { expect, test } from '../fixtures/JupiterCartBase.fixture';
import { JupiterCartPage } from '../src/pages/JupiterCartPage';
import { JupiterContactPage } from '../src/pages/JupiterContactPage';
import { JupiterHomePage } from '../src/pages/JupiterHomePage';
import { JupiterShopPage } from '../src/pages/JupiterShopPage';

test('TC1 - required contact errors clear when mandatory fields are populated', async ({
  page,
  assessmentData,
}) => {
  const homePage = new JupiterHomePage(page);
  await homePage.goto();
  await homePage.openContactPage();

  const contactPage = new JupiterContactPage(page);
  await contactPage.submit();

  for (const field of assessmentData.contact.requiredFields) {
    await expect(contactPage.requiredError(field)).toBeVisible();
  }

  await contactPage.fillMandatoryFields(
    assessmentData.contact.validation.forename,
    assessmentData.contact.validation.email,
    assessmentData.contact.validation.message,
  );

  for (const field of assessmentData.contact.requiredFields) {
    await expect(contactPage.requiredError(field)).toHaveCount(0);
  }
});

test('TC2 - successful contact submission', async ({ page, assessmentData }, testInfo) => {
  const submissionData = assessmentData.contact.submission;
  const forename = `${submissionData.forenamePrefix}${testInfo.repeatEachIndex}`;
  const email = `${submissionData.emailPrefix}${testInfo.repeatEachIndex}@${submissionData.emailDomain}`;
  const homePage = new JupiterHomePage(page);
  await homePage.goto();
  await homePage.openContactPage();

  const contactPage = new JupiterContactPage(page);
  await contactPage.fillMandatoryFields(
    forename,
    email,
    submissionData.message,
  );
  await contactPage.submit();

  await expect(contactPage.successMessage(forename)).toBeVisible({
    timeout: submissionData.successTimeoutMs,
  });
});

test('TC3 - cart prices, product subtotals, and total are correct', async ({ page, assessmentData }) => {
  const homePage = new JupiterHomePage(page);
  await homePage.goto();
  await homePage.openShopPage();

  const shopPage = new JupiterShopPage(page);
  const expectedProducts = assessmentData.cart.products;

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