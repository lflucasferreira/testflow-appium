# Dashboard

**Source file:** [`dashboard.spec.ts`](../../../../tests/dashboard/dashboard.spec.ts)

---

## Purpose

This **regression** suite validates the authenticated **Dashboard** page on mobile web. After API login, it checks:

1. **Greeting** — time-based greeting displays the logged-in user's name.
2. **KPI cards** — all four metric cards render with numeric values.
3. **New run modal** — the modal opens on tap and closes on cancel without leaving the page.

The tests use the [`DashboardPage`](../../../../pages/DashboardPage.ts) Page Object and rely on `loginViaApi` to skip repetitive UI authentication.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | Reachable via `http://10.0.2.2:5050` (or `ANDROID_BASE_URL`) |
| **iOS simulator** | Reachable via `http://127.0.0.1:5050` (or `IOS_BASE_URL`) |
| **Appium** | Emulator/simulator with Chrome (Android) or Safari (iOS) |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` configured |
| **Execution** | `npm run test:dashboard` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `Dashboard` describe block | Part of full regression grep (`npm run test:grep:regression`) |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`DashboardPage`](../../../../pages/DashboardPage.ts) | Page Object for greeting, KPI cards, and run modal |
| [`loginViaApi`](../../../../support/auth.ts) | API auth + navigate to dashboard in `beforeEach` |
| `expect-webdriverio` | `toBeDisplayed`, `toHaveText`, `not.toBeDisplayed` |
| `browser.$` / Page Object selectors | Resolves dashboard elements by `data-testid` |
| `getText()` | Reads KPI numeric value as string, parsed with `parseInt` |
| `describe` / `it` | Mocha nested blocks: Greeting, KPI cards, New run modal |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Dashboard @regression', () => {
  const dashboard = () => new DashboardPage()

  beforeEach(async () => {
    await loginViaApi()
    await dashboard().shouldBeLoaded()
  })
```

- **Given:** a clean mobile browser session.
- **When:** `beforeEach` calls `loginViaApi()` and waits for the dashboard root.
- **Then:** every test starts on a loaded, authenticated dashboard.

---

### Block 2 — Greeting

```typescript
  describe('Greeting', () => {
    it('shows time-based greeting with the user name', async () => {
      await dashboard().shouldShowGreeting()
      const greeting = await dashboard().greeting()
      await expect(greeting).toHaveText(expect.stringContaining('Demo User'))
    })
  })
```

- **Given:** the user is logged in as the demo account.
- **When:** the greeting element is read.
- **Then:** its text contains `Demo User` — confirms personalization renders on mobile.

---

### Block 3 — KPI cards

```typescript
  describe('KPI cards', () => {
    it('renders all four KPI cards', async () => {
      await dashboard().shouldHaveAllKpiCards()
    })

    it('shows a numeric value in the runs card', async () => {
      const value = await dashboard().kpiValue('runs')
      const text = await value.getText()
      expect(parseInt(text, 10)).toBeGreaterThan(0)
    })
  })
```

- **Given:** the dashboard KPI section is visible.
- **When:** all four cards are checked, then the `runs` card value is read.
- **Then:** every card is displayed and the runs value parses to a number greater than zero.

---

### Block 4 — New run modal

```typescript
  describe('New run modal', () => {
    it('opens and closes the new run modal', async () => {
      await dashboard().openNewRunModal()
      const modal = await dashboard().runModal()
      await expect(modal).toBeDisplayed()
      await dashboard().cancelRun()
      await expect(modal).not.toBeDisplayed()
    })
  })
})
```

- **Given:** the dashboard action to create a new run is available.
- **When:** the user taps to open the modal, then taps cancel.
- **Then:** the modal appears and is dismissed — touch interaction works without navigation side effects.

---

## How to run

```bash
# Full dashboard suite
npm run test:dashboard

# This file only
wdio run wdio.conf.ts --spec tests/dashboard/dashboard.spec.ts

# Regression grep (includes dashboard)
npm run test:grep:regression
```

---

## Related references

- Dashboard Page Object: [`pages/DashboardPage.ts`](../../../../pages/DashboardPage.ts)
- Auth helpers: [`support/auth.ts`](../../../../support/auth.ts)
- Gesture tests on dashboard: [`tests/gestures/gestures.spec.ts`](../../../../tests/gestures/gestures.spec.ts)
