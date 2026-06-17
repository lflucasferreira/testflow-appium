# Activity

**Source file:** [`activity.spec.ts`](../../../../tests/activity/activity.spec.ts)

---

## Purpose

This **regression** suite validates the **Activity** page on mobile web. After API login, it verifies:

1. **Activity counter** — the run/activity counter widget renders.
2. **Pipeline section** — the pipeline visualization area is visible.

These are read-only layout checks that confirm key activity-page landmarks appear in the mobile viewport without exercising deep pipeline interactions.

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
| **Execution** | `npm run test:activity` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `Activity` describe block | Regression grep coverage |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`ActivityPage`](../../../../pages/ActivityPage.ts) | Page Object for counter and pipeline sections |
| [`loginViaApi`](../../../../support/auth.ts) | Authentication before each test |
| `expect-webdriverio` | `toBeDisplayed` on counter and pipeline elements |
| `describe` / `it` | Mocha block with shared `beforeEach` setup |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Activity @regression', () => {
  const activity = () => new ActivityPage()

  beforeEach(async () => {
    await loginViaApi()
    await activity().open('/web/activity.html')
    await activity().shouldBeLoaded()
  })
```

- **Given:** no active session.
- **When:** `loginViaApi()` authenticates and opens `/web/activity.html`.
- **Then:** `page-activity` root is visible.

---

### Block 2 — Activity counter

```typescript
  it('renders activity counter', async () => {
    await expect(await activity().counter()).toBeDisplayed()
  })
```

- **Given:** the activity page is loaded.
- **When:** the counter element is queried.
- **Then:** it is displayed in the mobile browser.

---

### Block 3 — Pipeline section

```typescript
  it('renders pipeline section', async () => {
    await expect(await activity().pipeline()).toBeDisplayed()
  })
})
```

- **Given:** the activity page includes a pipeline visualization.
- **When:** the pipeline container is inspected.
- **Then:** it is displayed — confirms the lower section of the page renders on mobile.

---

## How to run

```bash
# Full activity suite
npm run test:activity

# This file only
wdio run wdio.conf.ts --spec tests/activity/activity.spec.ts
```

---

## Related references

- Activity Page Object: [`pages/ActivityPage.ts`](../../../../pages/ActivityPage.ts)
- Dashboard activity feed (gestures): [`tests/gestures/gestures.spec.ts`](../../../../tests/gestures/gestures.spec.ts)
