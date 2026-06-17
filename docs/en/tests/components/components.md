# Components

**Source file:** [`components.spec.ts`](../../../../tests/components/components.spec.ts)

---

## Purpose

This **regression** suite validates the **Components** showcase page on mobile web. It verifies:

1. **Primary button** — the main action button renders and is tappable.
2. **Loading button** — the loading-state button variant is visible.
3. **Demo modal** — opening and closing a modal works via touch without leaving the page.

The page exercises reusable UI patterns that other TestFlow screens depend on. Tests use the [`ComponentsPage`](../../../../pages/ComponentsPage.ts) Page Object.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` (or `ANDROID_BASE_URL`) |
| **iOS simulator** | `http://127.0.0.1:5050` (or `IOS_BASE_URL`) |
| **Appium** | Mobile browser session |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` |
| **Execution** | `npm run test:components` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `Components` describe block | Regression grep coverage |
| `@a11y` | Entire `Components` describe block | Accessibility-related component checks (shared tag with a11y suites) |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`ComponentsPage`](../../../../pages/ComponentsPage.ts) | Page Object for buttons and modal |
| [`loginViaApi`](../../../../support/auth.ts) | Fast authentication before each test |
| [`tc` / `TC`](../../../../support/constants/testCases.ts) | Test case ID wrapper for traceability |
| `expect-webdriverio` | `toBeDisplayed`, `not.toBeDisplayed` on modal overlay |
| `describe` / `it` | Mocha structure with shared `beforeEach` |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Components @regression @a11y', () => {
  const components = () => new ComponentsPage()

  beforeEach(async () => {
    await loginViaApi()
    await components().open('/web/components.html')
    await components().shouldBeLoaded()
  })
```

- **Given:** no session at test start.
- **When:** API login and navigation to `/web/components.html` complete.
- **Then:** `page-components` root is visible.

---

### Block 2 — Primary button

```typescript
  it('renders primary action button', async () => {
    await expect(await components().primaryBtn()).toBeDisplayed()
  })
```

- **Given:** the components page is loaded.
- **When:** the primary button element is queried.
- **Then:** it is displayed in the mobile viewport.

---

### Block 3 — Loading button

```typescript
  it(tc(TC.COMP_LOADING_BUTTON, 'shows loading button'), async () => {
    await expect(await components().loadingBtn()).toBeDisplayed()
  })
```

- **Given:** the components showcase includes a loading-state button.
- **When:** the loading button is inspected.
- **Then:** it is visible — confirms loading UI patterns render on mobile.

---

### Block 4 — Demo modal

```typescript
  it('opens and closes demo modal', async () => {
    await components().openModal()
    await components().closeModal()
    const modal = await components().modalOverlay()
    await expect(modal).not.toBeDisplayed()
  })
})
```

- **Given:** a modal trigger is available on the page.
- **When:** the user taps to open, then taps to close the modal.
- **Then:** the modal overlay is no longer displayed — touch open/close cycle works.

---

## How to run

```bash
# Full components suite
npm run test:components

# This file only
wdio run wdio.conf.ts --spec tests/components/components.spec.ts
```

---

## Related references

- Components Page Object: [`pages/ComponentsPage.ts`](../../../../pages/ComponentsPage.ts)
- Visual baseline for components: [`tests/visual/visual.spec.ts`](../../../../tests/visual/visual.spec.ts)
- Test case constants: [`support/constants/testCases.ts`](../../../../support/constants/testCases.ts)
