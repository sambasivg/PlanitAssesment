import type { Locator, Page } from '@playwright/test';

export type RequiredContactField = 'Forename' | 'Email' | 'Message';

export class JupiterContactPage {
  constructor(private readonly page: Page) {}

  async submit(): Promise<void> {
    await this.page.getByRole('link', { name: 'Submit' }).click();
  }

  async fillMandatoryFields(forename: string, email: string, message: string): Promise<void> {
    await this.page.getByLabel('Forename *').fill(forename);
    await this.page.getByLabel('Email *').fill(email);
    await this.page.getByLabel('Message *').fill(message);
  }

  requiredError(field: RequiredContactField): Locator {
    return this.page.getByText(`${field} is required`, { exact: true });
  }

  successMessage(forename: string): Locator {
    return this.page.getByText(`Thanks ${forename}, we appreciate your feedback.`, { exact: true });
  }
}