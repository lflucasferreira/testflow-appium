# Visual Regression

**Source file:** [`visual.spec.ts`](../../../../tests/visual/visual.spec.ts)

---

## Purpose

This **visual regression** suite captures mobile browser screenshots and compares them against stored baselines. It covers three key screens:

1. **Login screen** — unauthenticated login page layout on mobile.
2. **Dashboard** — authenticated dashboard after API login.
3. **Components page** — primary buttons area on the components showcase.

Unlike Playwright's pixel-diff engine, this project uses a lightweight file-size comparison via [`assertScreenshotMatches`](../../../../support/helpers/visual.ts). On first run, baselines are created automatically.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Running at `http://localhost:5050` on the host |
| **Android emulator** | `http://10.0.2.2:5050` loopback — visual baselines are platform-specific |
| **iOS simulator** | `http://127.0.0.1:5050` loopback |
| **Appium** | Stable emulator/simulator resolution recommended for consistent screenshots |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` (dashboard and components tests) |
| **Baselines** | Stored in `test-results/visual-baselines/` — created on first run |
| **Execution** | `npm run test:visual` |

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@visual` | Entire `Visual regression` describe block | Visual-only grep filtering |
| `@regression` | Entire `Visual regression` describe block | Included in regression runs |

---

## WebdriverIO / Appium concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`assertScreenshotMatches`](../../../../support/helpers/visual.ts) | Saves screenshot and compares file size against baseline |
| [`browser.saveScreenshot`](https://webdriver.io/docs/api/browser/saveScreenshot) | Captures PNG from mobile browser |
| [`appPath`](../../../../support/config.ts) | Builds platform-aware URL for components page |
| [`loginViaApi`](../../../../support/auth.ts) | Authenticates before dashboard/components shots |
| [`waitForTestId`](../../../../support/selectors.ts) | Waits for page root before screenshot |
| [`LoginPage`](../../../../pages/LoginPage.ts) | Opens login page for unauthenticated baseline |

---

## Step-by-step — block by block

### Block 1 — Login baseline

```typescript
describe('Visual regression @visual @regression', () => {
  it(tc(TC.VISUAL_LOGIN, 'login screen baseline on mobile'), async () => {
    await new LoginPage().visit()
    await assertScreenshotMatches('mobile-login')
  })
```

- **Given:** no active session.
- **When:** the login page opens and `assertScreenshotMatches('mobile-login')` runs.
- **Then:** a baseline PNG is created (first run) or the current screenshot file size is within 5% of the baseline.

---

### Block 2 — Dashboard baseline

```typescript
  it(tc(TC.VISUAL_DASHBOARD, 'dashboard baseline when authenticated'), async () => {
    await loginViaApi()
    await assertScreenshotMatches('mobile-dashboard')
  })
```

- **Given:** a valid API session on the dashboard.
- **When:** the dashboard is fully loaded and a screenshot is taken.
- **Then:** `mobile-dashboard.png` matches the stored baseline within the size threshold.

---

### Block 3 — Components baseline

```typescript
  it(tc(TC.VISUAL_COMPONENTS, 'components page primary buttons baseline'), async () => {
    await loginViaApi()
    await browser.url(appPath('/web/components.html'))
    await waitForTestId('page-components')
    await assertScreenshotMatches('mobile-components')
  })
})
```

- **Given:** an authenticated session.
- **When:** the browser navigates to the components page using the platform-aware `appPath` URL.
- **Then:** `mobile-components.png` matches the baseline — button layout is stable on mobile.

**Baseline logic (helper):**

```typescript
if (!fs.existsSync(baselinePath)) {
  await saveBaseline(name)  // first run creates baseline
  return
}
// subsequent runs compare file sizes (default 5% threshold)
```

---

## How to run

```bash
# Full visual suite
npm run test:visual

# This file only
wdio run wdio.conf.ts --spec tests/visual/visual.spec.ts

# First run — creates baselines in test-results/visual-baselines/
# Re-run to compare against baselines
```

---

## Related references

- Visual helper: [`support/helpers/visual.ts`](../../../../support/helpers/visual.ts)
- Mobile URLs: [`support/config.ts`](../../../../support/config.ts)
- Components functional tests: [`tests/components/components.spec.ts`](../../../../tests/components/components.spec.ts)
