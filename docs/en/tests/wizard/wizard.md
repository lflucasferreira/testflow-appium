# Wizard

**Source file:** [`wizard.spec.ts`](../../../../tests/wizard/wizard.spec.ts)

---

## Purpose

This **regression** suite validates the multi-step **Wizard** flow on mobile web. It checks:

1. **Step indicator** — the wizard shows a step indicator on the first step.
2. **Step advancement** — filling the project name and tapping Next advances the wizard while keeping the indicator visible.

The wizard pattern is common in onboarding flows; these tests confirm touch input and step navigation work in the mobile browser.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` loopback |
| **iOS simulator** | `http://127.0.0.1:5050` loopback |
| **Appium** | Mobile Chrome/Safari |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` |
| **Execution** | `npm run test:wizard` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `Wizard` describe block | Regression grep coverage |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`WizardPage`](../../../../pages/WizardPage.ts) | Page Object for step indicator, project name, and Next button |
| [`loginViaApi`](../../../../support/auth.ts) | API authentication in `beforeEach` |
| `fillProjectName` / `goNext` | Mobile text input and button tap via Page Object |
| `expect-webdriverio` | `toBeDisplayed` on step indicator |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Wizard @regression', () => {
  const wizard = () => new WizardPage()

  beforeEach(async () => {
    await loginViaApi()
    await wizard().open('/web/wizard.html')
    await wizard().shouldBeLoaded()
  })
```

- **Given:** a clean mobile session.
- **When:** API login and navigation to `/web/wizard.html` complete.
- **Then:** `page-wizard` is visible.

---

### Block 2 — First step indicator

```typescript
  it('shows step indicator on first step', async () => {
    await expect(await wizard().stepIndicator()).toBeDisplayed()
  })
```

- **Given:** the wizard loads on step one.
- **When:** the step indicator element is queried.
- **Then:** it is displayed — confirms the wizard chrome renders on mobile.

---

### Block 3 — Advance to next step

```typescript
  it('advances to next step after filling project name', async () => {
    await wizard().fillProjectName('Mobile Test Project')
    await wizard().goNext()
    await expect(await wizard().stepIndicator()).toBeDisplayed()
  })
})
```

- **Given:** the project name field is empty on step one.
- **When:** the user types `Mobile Test Project` and taps Next.
- **Then:** the step indicator remains visible — wizard advanced without breaking the layout.

---

## How to run

```bash
# Full wizard suite
npm run test:wizard

# This file only
wdio run wdio.conf.ts --spec tests/wizard/wizard.spec.ts
```

---

## Related references

- Wizard Page Object: [`pages/WizardPage.ts`](../../../../pages/WizardPage.ts)
- Smoke page load for wizard: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
