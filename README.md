# Planit Technical Assessment

Playwright and TypeScript automation for the Jupiter Toys assessment application. The tests use page objects and accessible locators, and can run locally or in Azure Pipelines.

## Setup

Requires Node.js 22.x.

```sh
npm ci
npx playwright install chromium
npm run lint
npm run typecheck
```

## Run

```sh
npm run typecheck
npm run test:assessment
npm run test:assessment:repeat
```

The repeat command runs only TC2 five sequential times. Set `PLANIT_BASE_URL` to use a different application environment; the default is `https://jupiter.cloud.planittesting.com`.

Assessment inputs are centralized in `Testdata/JupiterCartTestdata.json` and injected into specs through the typed custom fixture in `fixtures/JupiterCartBase.fixture.ts`.

Open the generated HTML report with `npm run test:report`.

## Assessment Coverage

- TC1: open Contact from Home, submit an empty form, verify required-field errors, then populate mandatory fields and verify the errors clear.
- TC2: submit valid contact details and verify the success message; repeat five times with distinct contact data.
- TC3: add 2 Stuffed Frogs, 5 Fluffy Bunnies, and 3 Valentine Bears; verify each unit price, quantity, subtotal, and cart total.

## Agents

Claude Code agent definitions live in `.claude/agents/`:

- `planner` creates a read-only test plan.
- `generator` creates focused Playwright coverage following the page-object conventions.
- `healer` diagnoses failures and makes minimal evidence-based repairs.

## CI

`azure-pipelines.yml` installs Node.js and Chromium, typechecks the project, runs all assessment tests, repeats TC2 five times, and publishes the Playwright report.