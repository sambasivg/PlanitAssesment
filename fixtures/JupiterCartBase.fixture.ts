import { readFileSync } from 'node:fs';
import { expect, test as base } from '@playwright/test';

export type AssessmentTestData = {
  contact: {
    requiredFields: ('Forename' | 'Email' | 'Message')[];
    validation: {
      forename: string;
      email: string;
      message: string;
    };
    submission: {
      forenamePrefix: string;
      emailPrefix: string;
      emailDomain: string;
      message: string;
      successTimeoutMs: number;
    };
  };
  cart: {
    products: {
      name: string;
      quantity: number;
      price: string;
    }[];
  };
};

type AssessmentFixtures = {
  assessmentData: AssessmentTestData;
};

const assessmentData = JSON.parse(
  readFileSync(new URL('../Testdata/JupiterCartTestdata.json', import.meta.url), 'utf8'),
) as AssessmentTestData;

export const test = base.extend<AssessmentFixtures>({
  assessmentData: async ({}, use) => {
    await use(assessmentData);
  },
});

export { expect };