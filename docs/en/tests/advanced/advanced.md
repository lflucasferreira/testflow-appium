# Advanced

**Source file:** [`advanced.spec.ts`](../../../../tests/advanced/advanced.spec.ts)

---

## Purpose

This **regression** suite validates the **Advanced** demo page on mobile web. It covers:

1. **Shadow DOM section** — a shadow-host element is scrolled into view and remains displayed.
2. **Touch swipe scrolling** — a vertical swipe scrolls the page without losing the root element.

The advanced page showcases techniques (shadow DOM, long pages) that are harder to automate on mobile. One test is tagged `@appium` because it relies on W3C touch actions.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` loopback |
| **iOS simulator** | `http://127.0.0.1:5050` loopback |
| **Appium** | Touch action support via `browser.performActions` |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` |
| **Execution** | `npm run test:advanced` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `Advanced` describe block | Regression grep coverage |
| `@appium` | "scrolls advanced page with touch swipe" test | Appium-specific touch gesture |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`AdvancedPage`](../../../../pages/AdvancedPage.ts) | Page Object for shadow host and page root |
| [`scrollIntoView`](../../../../support/helpers/gestures.ts) | `browser.execute` scrolls element to center of viewport |
| [`swipeUp`](../../../../support/helpers/gestures.ts) | W3C pointer actions simulating vertical swipe |
| `browser.performActions` | Low-level touch pointer sequence for swipe |
| `expect-webdriverio` | `toBeDisplayed` after scroll and swipe |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Advanced @regression', () => {
  const advanced = () => new AdvancedPage()

  beforeEach(async () => {
    await loginViaApi()
    await advanced().open('/web/advanced.html')
    await advanced().shouldBeLoaded()
  })
```

- **Given:** authenticated mobile session.
- **When:** navigation to `/web/advanced.html` completes.
- **Then:** `page-advanced` is visible.

---

### Block 2 — Shadow DOM section

```typescript
  it('renders shadow DOM section on mobile web', async () => {
    const host = await advanced().shadowHost()
    await scrollIntoView(host)
    await expect(host).toBeDisplayed()
  })
```

- **Given:** the advanced page contains a shadow DOM host element below the fold.
- **When:** `scrollIntoView` brings the host into the mobile viewport.
- **Then:** the host element is displayed — shadow DOM container is reachable on mobile web.

---

### Block 3 — Touch swipe scroll

```typescript
  it('scrolls advanced page with touch swipe @appium', async () => {
    await swipeUp({ percent: 0.3 })
    await expect(await advanced().pageRoot()).toBeDisplayed()
  })
})
```

- **Given:** the advanced page is longer than the mobile viewport.
- **When:** `swipeUp({ percent: 0.3 })` performs a 30% vertical swipe via touch actions.
- **Then:** `page-advanced` root remains displayed — session stays stable after gesture scroll.

---

## How to run

```bash
# Full advanced suite
npm run test:advanced

# This file only
wdio run wdio.conf.ts --spec tests/advanced/advanced.spec.ts

# Appium-tagged tests only
npm run test:grep:appium
```

---

## Related references

- Advanced Page Object: [`pages/AdvancedPage.ts`](../../../../pages/AdvancedPage.ts)
- Gesture helpers: [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts)
- Dedicated gesture suite: [`tests/gestures/gestures.spec.ts`](../../../../tests/gestures/gestures.spec.ts)
