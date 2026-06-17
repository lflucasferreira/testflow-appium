# App Shell — Layout and Notifications

**Source file:** [`shell.spec.ts`](../../../../tests/layout/shell.spec.ts)

---

## Purpose

This **regression** suite validates the **application shell** — the persistent layout wrapping every authenticated page on mobile web. It covers:

1. **Layout landmarks** — sidebar, topbar, breadcrumb, and user name are visible.
2. **Sidebar navigation** — every nav item routes to the correct page and highlights as active.
3. **Notifications** — bell opens the dropdown; "mark all read" clears the unread badge.
4. **Theme toggle** — switching theme changes the `data-theme` attribute.

This is one of the broader regression suites because it iterates over all sidebar destinations defined in `ShellPage.navItems()`.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` loopback |
| **iOS simulator** | `http://127.0.0.1:5050` loopback |
| **Appium** | Mobile browser with touch support |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` |
| **Execution** | `npm run test:layout` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `App shell` describe block | Regression grep coverage |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`ShellPage`](../../../../pages/ShellPage.ts) | Page Object for shell landmarks, nav, notifications, theme |
| [`ShellPage.navItems()`](../../../../pages/ShellPage.ts) | Data-driven list of sidebar routes for parameterized tests |
| [`pollUntil`](../../../../support/helpers/waits.ts) | Polls unread count until it reaches zero |
| [`loginViaApi`](../../../../support/auth.ts) | Authentication in `beforeEach` |
| `browser.$('[data-testid="…"]')` | Direct testId lookup for destination pages |
| `expect-webdriverio` | `toBeDisplayed`, `toHaveText`, `toHaveUrl` |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('App shell — layout & notifications @regression', () => {
  const shell = () => new ShellPage()

  beforeEach(async () => {
    await loginViaApi()
    await shell().shouldShowAppShell()
  })
```

- **Given:** authenticated session on the dashboard.
- **When:** `shouldShowAppShell()` confirms sidebar and topbar are visible.
- **Then:** each test starts inside the app shell.

---

### Block 2 — Layout landmarks

```typescript
  describe('Layout landmarks', () => {
    it('sidebar, topbar and breadcrumb are visible', async () => {
      await shell().shouldShowAppShell()
      await expect(await shell().breadcrumb()).toBeDisplayed()
      await expect(await shell().userName()).toHaveText(expect.stringContaining('Demo User'))
    })
  })
```

- **Given:** the authenticated shell is rendered.
- **When:** breadcrumb and user name elements are inspected.
- **Then:** breadcrumb is displayed and user name contains `Demo User`.

---

### Block 3 — Sidebar navigation (data-driven)

```typescript
  describe('Sidebar navigation', () => {
    for (const { testId, path, pageTestId } of ShellPage.navItems()) {
      it(`navigates to ${path} via ${testId}`, async () => {
        await shell().navigateViaSidebar(testId)
        await expect(browser).toHaveUrl(expect.stringContaining(path))
        await expect(await browser.$(`[data-testid="${pageTestId}"]`)).toBeDisplayed()
        await shell().shouldHighlightNav(testId)
      })
    }
  })
```

- **Given:** the sidebar lists all main app routes.
- **When:** each nav link is tapped in a generated `it` block.
- **Then:** the URL contains the expected path, the destination page root is displayed, and the nav item is highlighted as active.

---

### Block 4 — Notifications

```typescript
  describe('Notifications', () => {
    it('opens notification dropdown on bell tap', async () => {
      await shell().openNotifications()
      await expect(await shell().notifList()).toBeDisplayed()
    })

    it('mark all read clears badge', async () => {
      await shell().openNotifications()
      const before = await shell().getUnreadCount()
      expect(before).toBeGreaterThan(0)
      await shell().markAllNotificationsRead()
      await pollUntil(() => shell().getUnreadCount(), (count) => count === 0)
    })
  })
```

- **Given:** unread notifications exist (badge count > 0).
- **When:** the bell is tapped, then "mark all read" is activated.
- **Then:** the notification list opens and the unread count eventually reaches zero via polling.

---

### Block 5 — Theme toggle

```typescript
  describe('Theme toggle', () => {
    it('theme toggle switches data-theme', async () => {
      const before = await shell().getTheme()
      await shell().toggleTheme()
      const after = await shell().getTheme()
      expect(after).not.toBe(before)
    })
  })
})
```

- **Given:** a theme is active on the document root.
- **When:** the theme toggle is tapped.
- **Then:** `data-theme` changes — light/dark switch works on mobile.

---

## How to run

```bash
# Full layout/shell suite
npm run test:layout

# This file only
wdio run wdio.conf.ts --spec tests/layout/shell.spec.ts
```

---

## Related references

- Shell Page Object: [`pages/ShellPage.ts`](../../../../pages/ShellPage.ts)
- Polling helper: [`support/helpers/waits.ts`](../../../../support/helpers/waits.ts)
- Smoke sidebar nav: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
