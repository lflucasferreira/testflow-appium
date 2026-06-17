# Appium Device Capabilities

**Source file:** [`device.spec.ts`](../../../../tests/device/device.spec.ts)

---

## Purpose

This **Appium-specific** suite validates **device-level capabilities** on mobile web. It covers two areas:

**Unauthenticated (login page):**
1. **Keyboard** — software keyboard can be hidden after filling login fields.
2. **Orientation** — portrait and landscape modes both display the email input.
3. **Screenshot** — `browser.saveScreenshot` writes a PNG to disk.
4. **Platform metadata** — `browser.capabilities.platformName` is set (Android check included).
5. **JavaScript execution** — `navigator.userAgent` is readable in the browser context.

**Authenticated:**
6. **Background simulation** — session persists after a brief `mobile: backgroundApp` call and URL reload.

These tests prove the Appium session handles device APIs beyond basic element interaction.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | Recommended for keyboard and orientation tests |
| **iOS simulator** | Keyboard API may be unsupported — `hideKeyboardIfShown` catches errors gracefully |
| **Appium** | UiAutomator2 or XCUITest driver |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` (keyboard test) |
| **Execution** | `npm run test:device` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@appium` | Both describe blocks | Appium device capability tests |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`hideKeyboardIfShown`](../../../../support/helpers/gestures.ts) | Checks `browser.isKeyboardShown()` then calls `hideKeyboard()` |
| [`setOrientation`](../../../../support/helpers/gestures.ts) | Wraps `browser.setOrientation('PORTRAIT' \| 'LANDSCAPE')` |
| [`isAndroid`](../../../../support/config.ts) | Platform guard for Android-specific assertion |
| [`browser.saveScreenshot`](https://webdriver.io/docs/api/browser/saveScreenshot) | Device-level screenshot capture |
| `browser.capabilities` | Reads `platformName` and other session caps |
| `browser.execute('mobile: backgroundApp', …)` | Native Appium command (may noop on pure mobile web) |
| `browser.execute(() => navigator.userAgent)` | In-browser JS execution |
| [`LoginPage`](../../../../pages/LoginPage.ts) | Opens login page for device tests |

---

## Step-by-step — block by block

### Block 1 — Setup (login page)

```typescript
describe('Appium device capabilities @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })
```

- **Given:** a fresh Appium session.
- **When:** the login page opens before each test.
- **Then:** device tests run against a consistent starting page.

---

### Block 2 — Keyboard handling

```typescript
  it(tc(TC.APPIUM_KEYBOARD, 'hides software keyboard after login fields'), async () => {
    await login().fillEmail(DEMO_EMAIL)
    await login().fillPassword(DEMO_PASSWORD)
    await hideKeyboardIfShown()
    await expect(await login().submitBtn()).toBeDisplayed()
  })
```

- **Given:** the mobile keyboard appeared after filling login fields.
- **When:** `hideKeyboardIfShown()` dismisses the keyboard if visible.
- **Then:** the submit button is displayed and not obscured by the keyboard.

---

### Block 3 — Orientation

```typescript
  it(tc(TC.APPIUM_ORIENTATION, 'supports portrait and landscape orientation'), async () => {
    await setOrientation('PORTRAIT')
    await expect(await login().emailInput()).toBeDisplayed()

    await setOrientation('LANDSCAPE')
    await expect(await login().emailInput()).toBeDisplayed()

    await setOrientation('PORTRAIT')
  })
```

- **Given:** the login page is loaded.
- **When:** orientation switches between portrait, landscape, and back to portrait.
- **Then:** the email input remains displayed in both orientations.

---

### Block 4 — Screenshot and platform metadata

```typescript
  it('captures device screenshot on demand', async () => {
    const path = `./screenshots/device-login-${Date.now()}.png`
    await browser.saveScreenshot(path)
    expect(path).toContain('screenshots')
  })

  it('reads mobile platform metadata', async () => {
    const caps = browser.capabilities
    expect(caps.platformName).toBeTruthy()
    if (isAndroid()) {
      expect(String(caps.platformName).toLowerCase()).toContain('android')
    }
  })
```

- **Given:** an active Appium session.
- **When:** a screenshot is saved or capabilities are read.
- **Then:** the file path is under `screenshots/` and `platformName` is truthy (Android when applicable).

---

### Block 5 — JavaScript execution

```typescript
  it('executes mobile JavaScript in browser context', async () => {
    const userAgent = await browser.execute(() => navigator.userAgent)
    expect(userAgent.length).toBeGreaterThan(0)
  })
})
```

- **Given:** the mobile browser context is active.
- **When:** `navigator.userAgent` is read via `browser.execute`.
- **Then:** a non-empty user agent string is returned.

---

### Block 6 — Background simulation (authenticated)

```typescript
describe('Appium device — authenticated shell @appium', () => {
  it('persists session after brief background simulation', async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')

    await browser.execute('mobile: backgroundApp', [{ seconds: 1 }]).catch(() => {
      // backgroundApp is native-only; mobile web may ignore — acceptable
    })

    await browser.url(await browser.getUrl())
    await waitForTestId('page-dashboard')
  })
})
```

- **Given:** an authenticated dashboard session.
- **When:** `mobile: backgroundApp` simulates a 1-second background (or is ignored on mobile web), then the current URL is reloaded.
- **Then:** `page-dashboard` is still visible — session data persisted across the reload.

---

## How to run

```bash
# Full device suite
npm run test:device

# This file only
wdio run wdio.conf.ts --spec tests/device/device.spec.ts

# Android emulator
npm run test:android -- --spec tests/device/device.spec.ts
```

---

## Related references

- Gesture/device helpers: [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts)
- Platform detection: [`support/config.ts`](../../../../support/config.ts)
- Context switching: [`tests/contexts/webview.spec.ts`](../../../../tests/contexts/webview.spec.ts)
