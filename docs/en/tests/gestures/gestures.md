# Appium Gestures

**Source file:** [`gestures.spec.ts`](../../../../tests/gestures/gestures.spec.ts)

---

## Purpose

This **Appium-specific** suite exercises **touch gestures** on the authenticated dashboard. It validates:

1. **Swipe up** — scrolls the activity feed into view.
2. **Swipe down** — returns toward the top of the dashboard after an upward swipe.
3. **Long press** — pressing a KPI card does not crash the session.
4. **Tap navigation** — sidebar team link works via standard touch click.

All gestures use W3C pointer actions from [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts), which is the Appium-recommended approach for mobile web automation.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` — touch actions via UiAutomator2 |
| **iOS simulator** | `http://127.0.0.1:5050` — touch actions via XCUITest |
| **Appium** | Drivers installed: `npm run appium:drivers` |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` |
| **Execution** | `npm run test:gestures` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@appium` | Entire `Appium gestures` describe block | Appium-specific grep (`npm run test:grep:appium`) |
| `@regression` | Entire `Appium gestures` describe block | Regression coverage |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`swipeUp` / `swipeDown`](../../../../support/helpers/gestures.ts) | Vertical swipes via `browser.performActions` |
| [`longPress`](../../../../support/helpers/gestures.ts) | Touch down + pause + touch up at element center |
| [`scrollIntoView`](../../../../support/helpers/gestures.ts) | DOM `scrollIntoView` before interacting with off-screen elements |
| [`waitForTestId`](../../../../support/selectors.ts) | Waits for `activity-list`, `dash-greeting`, `kpi-runs`, `nav-team` |
| `browser.performActions` | W3C Actions API for pointer/touch sequences |
| `browser.releaseActions` | Cleans up after performActions |
| `expect-webdriverio` | `toBeDisplayed` after each gesture |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Appium gestures @appium @regression', () => {
  beforeEach(async () => {
    await loginViaApi()
    await new DashboardPage().shouldBeLoaded()
  })
```

- **Given:** authenticated session on the dashboard.
- **When:** `beforeEach` completes.
- **Then:** every gesture test starts from a loaded dashboard.

---

### Block 2 — Swipe up (activity feed)

```typescript
  it(tc(TC.APPIUM_SWIPE, 'swipe up scrolls activity feed into view'), async () => {
    const list = await waitForTestId('activity-list')
    await scrollIntoView(list)
    await swipeUp({ percent: 0.35 })
    await expect(list).toBeDisplayed()
  })
```

- **Given:** the activity list may be below the fold on mobile.
- **When:** `scrollIntoView` centers the list, then `swipeUp({ percent: 0.35 })` swipes 35% of the viewport height.
- **Then:** `activity-list` remains displayed — swipe did not break the session.

---

### Block 3 — Swipe down (return to top)

```typescript
  it('swipe down returns toward top of dashboard', async () => {
    await swipeUp({ percent: 0.4 })
    await swipeDown({ percent: 0.35 })
    await expect(await waitForTestId('dash-greeting')).toBeDisplayed()
  })
```

- **Given:** the page was scrolled down by a swipe up.
- **When:** `swipeDown({ percent: 0.35 })` reverses the scroll direction.
- **Then:** `dash-greeting` is visible again near the top.

---

### Block 4 — Long press on KPI card

```typescript
  it('long press on KPI card does not crash session', async () => {
    const card = await waitForTestId('kpi-runs')
    await scrollIntoView(card)
    await longPress(card, 800)
    await expect(card).toBeDisplayed()
  })
```

- **Given:** the KPI runs card is in the viewport.
- **When:** a 800 ms long press is performed at the card's center coordinates.
- **Then:** the card is still displayed — no session crash or element detachment.

---

### Block 5 — Tap navigation

```typescript
  it('tap navigation via touch on team link', async () => {
    const nav = await waitForTestId('nav-team')
    await nav.click()
    await waitForTestId('page-team')
  })
})
```

- **Given:** the sidebar team link is visible.
- **When:** a standard WebDriver `click()` (touch tap on mobile) is performed.
- **Then:** `page-team` appears — confirms tap navigation works alongside gesture actions.

---

## How to run

```bash
# Full gestures suite
npm run test:gestures

# This file only
wdio run wdio.conf.ts --spec tests/gestures/gestures.spec.ts

# All @appium-tagged specs
npm run test:grep:appium
```

---

## Related references

- Gesture helpers: [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts)
- Dashboard Page Object: [`pages/DashboardPage.ts`](../../../../pages/DashboardPage.ts)
- Advanced page swipe: [`tests/advanced/advanced.spec.ts`](../../../../tests/advanced/advanced.spec.ts)
