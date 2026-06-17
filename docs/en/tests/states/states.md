# UI States

**Source file:** [`states.spec.ts`](../../../../tests/states/states.spec.ts)

---

## Purpose

This **regression** suite validates the **UI States** demo page on mobile web. It exercises three loading/content states:

1. **Skeleton** — skeleton loading placeholder appears in the content area.
2. **Empty** — empty-state message renders when there is no data.
3. **Error** — error-state UI renders when a failure is simulated.

Each state is triggered via Page Object actions and verified by checking the shared content area remains displayed.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` loopback |
| **iOS simulator** | `http://127.0.0.1:5050` loopback |
| **Appium** | Mobile browser session |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` |
| **Execution** | `npm run test:states` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `UI States` describe block | Regression grep coverage |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`StatesPage`](../../../../pages/StatesPage.ts) | Page Object with `showSkeleton`, `showEmpty`, `showError` actions |
| [`loginViaApi`](../../../../support/auth.ts) | API authentication in `beforeEach` |
| `contentArea()` | Shared container queried after each state transition |
| `expect-webdriverio` | `toBeDisplayed` on content area |
| Touch `click` | State toggle buttons tapped via Page Object |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('UI States @regression', () => {
  const states = () => new StatesPage()

  beforeEach(async () => {
    await loginViaApi()
    await states().open('/web/states.html')
    await states().shouldBeLoaded()
  })
```

- **Given:** authenticated mobile session.
- **When:** navigation to `/web/states.html` completes.
- **Then:** `page-states` root is visible.

---

### Block 2 — Skeleton state

```typescript
  it('shows skeleton loading state', async () => {
    await states().showSkeleton()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })
```

- **Given:** the states page with toggle controls.
- **When:** the user taps to show the skeleton state.
- **Then:** the content area is displayed with skeleton placeholders.

---

### Block 3 — Empty state

```typescript
  it('shows empty state', async () => {
    await states().showEmpty()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })
```

- **Given:** the states page is loaded.
- **When:** the empty-state toggle is activated.
- **Then:** the content area displays the empty-state UI.

---

### Block 4 — Error state

```typescript
  it('shows error state', async () => {
    await states().showError()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })
})
```

- **Given:** the states page is loaded.
- **When:** the error-state toggle is activated.
- **Then:** the content area displays the error-state UI without crashing the mobile session.

---

## How to run

```bash
# Full states suite
npm run test:states

# This file only
wdio run wdio.conf.ts --spec tests/states/states.spec.ts
```

---

## Related references

- States Page Object: [`pages/StatesPage.ts`](../../../../pages/StatesPage.ts)
- Smoke page load for states: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
