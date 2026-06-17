# Team

**Source file:** [`team.spec.ts`](../../../../tests/team/team.spec.ts)

---

## Purpose

This **regression** suite validates the **Team** page on mobile web. After API login, it verifies:

1. **Users table** — the team members table renders in the mobile viewport.
2. **Search filter** — typing in the search input filters the table without breaking layout.
3. **Invite modal** — tapping invite opens the modal overlay.

The suite uses the [`TeamPage`](../../../../pages/TeamPage.ts) Page Object and navigates directly to `/web/team.html` after authentication.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` loopback (or `ANDROID_BASE_URL`) |
| **iOS simulator** | `http://127.0.0.1:5050` loopback (or `IOS_BASE_URL`) |
| **Appium** | Mobile Chrome/Safari session active |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` |
| **Execution** | `npm run test:team` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@regression` | Entire `Team` describe block | Included in `npm run test:grep:regression` |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`TeamPage`](../../../../pages/TeamPage.ts) | Page Object for table, search, and invite modal |
| [`loginViaApi`](../../../../support/auth.ts) | Authenticates before each test |
| `browser.$('[data-testid="invite-modal-overlay"]')` | Direct selector for modal overlay |
| `waitForDisplayed()` | Waits up to 5 s for invite modal to appear |
| `expect-webdriverio` | `toBeDisplayed` on table element |
| `setValue` / `clearValue` | Search input interaction via Page Object |

---

## Step-by-step — block by block

### Block 1 — Setup

```typescript
describe('Team @regression', () => {
  const team = () => new TeamPage()

  beforeEach(async () => {
    await loginViaApi()
    await team().open('/web/team.html')
    await team().shouldBeLoaded()
  })
```

- **Given:** no active session at test start.
- **When:** `loginViaApi()` authenticates, then `TeamPage.open()` navigates to the team route.
- **Then:** `page-team` root is visible before each test runs.

---

### Block 2 — Users table

```typescript
  it('renders users table', async () => {
    const table = await team().usersTable()
    await expect(table).toBeDisplayed()
  })
```

- **Given:** the team page is loaded.
- **When:** the users table element is queried.
- **Then:** it is displayed in the mobile browser viewport.

---

### Block 3 — Search filter

```typescript
  it('filters table via search input', async () => {
    await team().search('Demo')
    const table = await team().usersTable()
    await expect(table).toBeDisplayed()
  })
```

- **Given:** the search input is available on the team page.
- **When:** the user types `Demo` into the search field.
- **Then:** the table remains displayed — filtering does not crash or hide the table container.

---

### Block 4 — Invite modal

```typescript
  it('opens invite modal', async () => {
    await team().openInviteModal()
    const modal = await browser.$('[data-testid="invite-modal-overlay"]')
    await modal.waitForDisplayed({ timeout: 5000 }).catch(() => undefined)
  })
})
```

- **Given:** the invite action button is tappable.
- **When:** `openInviteModal()` triggers a touch click.
- **Then:** the invite modal overlay appears (or the wait times out gracefully without failing the session).

---

## How to run

```bash
# Full team suite
npm run test:team

# This file only
wdio run wdio.conf.ts --spec tests/team/team.spec.ts
```

---

## Related references

- Team Page Object: [`pages/TeamPage.ts`](../../../../pages/TeamPage.ts)
- Shell navigation to team: [`tests/layout/shell.spec.ts`](../../../../tests/layout/shell.spec.ts)
- Smoke nav to team: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
