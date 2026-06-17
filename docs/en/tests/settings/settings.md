# Settings

**Source file:** [`settings.spec.ts`](../../../../tests/settings/settings.spec.ts)

---

## Purpose

This **regression** suite validates the **Settings** page on mobile web. After API login, it checks:

1. **Form fields** — display name input and save button render correctly.
2. **Editable display name** — the user can change the display name and the input reflects the new value.

Mobile keyboards and touch input are exercised through the [`SettingsPage`](../../../../pages/SettingsPage.ts) Page Object.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` (default Android loopback) |
| **iOS simulator** | `http://127.0.0.1:5050` (default iOS loopback) |
| **Appium** | Emulator/simulator with mobile browser |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` |
| **Execution** | `npm run test:settings` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `Settings` describe block | Part of regression grep runs |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`SettingsPage`](../../../../pages/SettingsPage.ts) | Page Object for display name and save button |
| [`loginViaApi`](../../../../support/auth.ts) | API authentication in `beforeEach` |
| `setValue` / `clearValue` | Mobile text input via Page Object `updateDisplayName` |
| `expect-webdriverio` | `toBeDisplayed`, `toHaveValue` assertions |
| `toHaveValue('Mobile QA')` | Verifies input state after typing on mobile keyboard |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Settings @regression', () => {
  const settings = () => new SettingsPage()

  beforeEach(async () => {
    await loginViaApi()
    await settings().open('/web/settings.html')
    await settings().shouldBeLoaded()
  })
```

- **Given:** a fresh mobile browser context.
- **When:** API login completes and the settings route opens.
- **Then:** `page-settings` is visible before each test.

---

### Block 2 — Form fields

```typescript
  it('loads settings form fields', async () => {
    await expect(await settings().displayName()).toBeDisplayed()
    await expect(await settings().saveBtn()).toBeDisplayed()
  })
```

- **Given:** the settings page is loaded.
- **When:** the display name input and save button are queried.
- **Then:** both elements are displayed in the mobile viewport.

---

### Block 3 — Edit display name

```typescript
  it('allows editing display name', async () => {
    await settings().updateDisplayName('Mobile QA')
    const input = await settings().displayName()
    await expect(input).toHaveValue('Mobile QA')
  })
})
```

- **Given:** the display name field is focused and editable.
- **When:** the Page Object clears the field and types `Mobile QA`.
- **Then:** the input's value attribute equals `Mobile QA` — confirms mobile keyboard input round-trips correctly.

---

## How to run

```bash
# Full settings suite
npm run test:settings

# This file only
wdio run wdio.conf.ts --spec tests/settings/settings.spec.ts
```

---

## Related references

- Settings Page Object: [`pages/SettingsPage.ts`](../../../../pages/SettingsPage.ts)
- Auth helpers: [`support/auth.ts`](../../../../support/auth.ts)
- Shell sidebar nav to settings: [`tests/layout/shell.spec.ts`](../../../../tests/layout/shell.spec.ts)
