# Selector Strategy — TestFlow Mobile Web

This Appium / WebdriverIO project interacts with the TestFlow sandbox app exclusively through **`data-testid`** attributes. There are **no component tests** in this repository — all specs are mobile web E2E, Appium capability demos, or standalone API checks.

## Mobile web (TestFlow app)

TestFlow renders UI with `data-testid`. Use the helpers in [`support/selectors.ts`](../support/selectors.ts):

```ts
import { byTestId, waitForTestId, clickTestId } from '../support/selectors'

// CSS selector string
byTestId('login-email')  // → '[data-testid="login-email"]'

// WDIO element with wait
await waitForTestId('login-email')
await clickTestId('login-submit')
```

The `$` helper wraps `browser.$(byTestId(id))` and is used by Page Objects via `BasePage.testId()`.

## Page Objects

Page Object classes in [`pages/`](../pages/) expose locators as methods that wrap `this.testId(...)`:

```ts
// pages/LoginPage.ts
emailInput() {
  return this.testId('login-email')
}
```

Specs should prefer Page Object methods or `waitForTestId` / `clickTestId` rather than inlining raw CSS in every test.

## Helper functions

| Helper | Purpose |
|--------|---------|
| `byTestId(id)` | Returns CSS selector string `[data-testid="…"]` |
| `$(id)` | Returns `browser.$(byTestId(id))` (async) |
| `$$(prefix)` | Returns elements matching `[data-testid^="prefix"]` |
| `waitForTestId(id)` | Waits for exist + displayed, returns element |
| `clickTestId(id)` | Wait + click in one call |
| `fillTestId(id, value)` | Wait + clear + setValue |
| `getTextTestId(id)` | Wait + getText |
| `isDisplayedTestId(id)` | Quick visibility check without full wait |

Default timeout is **15 s** locally and **45 s** in CI (`process.env.CI`).

## When to use other locators

| Context | Preferred locator | Notes |
|---------|-------------------|-------|
| TestFlow UI elements | `byTestId` / `waitForTestId` | Primary strategy — stable, app-defined |
| Locator strategy demos | XPath, chained CSS | See [`tests/locators/strategies.spec.ts`](../tests/locators/strategies.spec.ts) |
| Form roots / fallbacks | `browser.$('form[data-testid="login-form"], .login-form, main')` | Only when scoping children |
| Third-party widgets | Vendor CSS (`.select2-container`, `.swal2-popup`) | Last resort — same as Playwright suite |
| Native chrome (rare) | Accessibility id, `-android uiautomator` | Hybrid/native apps only; this repo is mobile **web** |

## What this repo does not use

- **`data-cy-hook`** — Cypress component-test convention; not used here.
- **Component test mount helpers** — no isolated component specs; all UI tests run against the full app in a mobile browser.
- **`page.getByTestId`** — Playwright API; here we use WDIO `browser.$` + `support/selectors.ts`.

## Hook / test ID maps

Page Objects in [`pages/`](../pages/) are the single source of truth for element locators. When the app adds a new interactive element, add a method to the relevant Page Object rather than inlining selectors in specs.

See also: [`docs/en/README.md`](en/README.md) · [`docs/appium-technical-interview-questions.md`](appium-technical-interview-questions.md) (section 6 — Locators).
