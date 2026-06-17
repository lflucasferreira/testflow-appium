# testflow-appium

Appium mobile web automation suite for [TestFlow](https://github.com/qaschoolbr/testflow) — mirror of the Cypress (`testflow-cypress`), Playwright (`testflow-playwright`) and PyTest (`testflow-pytest`) suites, extended with Appium-specific mobile capabilities.

## What this project covers

TestFlow is a responsive web sandbox. This suite drives it through **real mobile browsers** (Chrome on Android, Safari on iOS) via Appium 2 + WebdriverIO, plus standalone REST API checks.

| Area | Specs | Tags |
|---|---|---|
| Smoke | `tests/smoke/navigation.spec.ts` | `@smoke` |
| Auth | `tests/auth/login.spec.ts` | `@regression` |
| Dashboard | `tests/dashboard/dashboard.spec.ts` | `@regression` |
| Team | `tests/team/team.spec.ts` | `@regression` |
| Settings | `tests/settings/settings.spec.ts` | `@regression` |
| Components | `tests/components/components.spec.ts` | `@regression` |
| Wizard | `tests/wizard/wizard.spec.ts` | `@regression` |
| Activity | `tests/activity/activity.spec.ts` | `@regression` |
| Advanced | `tests/advanced/advanced.spec.ts` | `@regression` |
| States | `tests/states/states.spec.ts` | `@regression` |
| Layout | `tests/layout/shell.spec.ts` | `@regression` |
| API | `tests/api/auth.api.spec.ts` | `@api`, `@smoke` |
| Visual | `tests/visual/visual.spec.ts` | `@visual` |
| **Gestures** | `tests/gestures/gestures.spec.ts` | `@appium` |
| **Device** | `tests/device/device.spec.ts` | `@appium` |
| **Contexts** | `tests/contexts/webview.spec.ts` | `@appium` |
| **Locators** | `tests/locators/strategies.spec.ts` | `@appium` |

Traceable test case IDs use the `[TC-xxxx]` prefix — see `support/constants/testCases.ts`.

### Appium capabilities demonstrated

- Mobile web (Chrome/Android, Safari/iOS)
- Touch gestures: tap, swipe, long press, scroll into view
- Device orientation (portrait / landscape)
- Software keyboard hide
- Context listing / WEBVIEW switching
- Locator strategies: CSS (`data-testid`), XPath, explicit waits
- Screenshots on failure + visual baselines
- Session injection via API + `sessionStorage`
- REST API suite (no device required)

## Prerequisites

- Node.js 20+
- Appium 2 (`npm install` installs it locally)
- **Android:** Android SDK, emulator or device, Chrome
- **iOS:** macOS, Xcode, iOS Simulator (for `npm run test:ios`)
- TestFlow on port `5050`

## Setup

```bash
npm install
npm run appium:drivers
cp .env.example .env
```

### Start TestFlow

```bash
docker run --rm -p 5050:5050 qaschool/testflow:latest
npm run check:testflow
```

### Mobile URL mapping

Emulators cannot reach `localhost` the same way as desktop browsers:

| Platform | Default base URL |
|---|---|
| Android emulator | `http://10.0.2.2:5050` |
| iOS simulator | `http://127.0.0.1:5050` |
| CI (adb reverse) | `http://127.0.0.1:5050` |
| Desktop / API only | `http://localhost:5050` |

Override with `BASE_URL`, `ANDROID_BASE_URL`, or `IOS_BASE_URL`.

### Credentials

| Field | Default | Override |
|---|---|---|
| Email | `demo@automation.io` | `DEMO_EMAIL` |
| Password | `Demo123!` | `DEMO_PASSWORD` |

## Running tests

```bash
# API only (no emulator)
npm run test:api

# Android mobile web (default)
npm run test:android

# iOS mobile web (macOS + Simulator)
npm run test:ios

# Full Android suite
npm test

# By suite
npm run test:smoke
npm run test:auth
npm run test:dashboard
npm run test:gestures
npm run test:device
npm run test:contexts
npm run test:locators
npm run test:visual

# By Mocha tag
npm run test:grep:smoke
npm run test:grep:regression
npm run test:grep:appium
```

## Allure Report

Mobile WDIO runs produce raw results in `allure-results/`. Generate and open the **Allure Report 3** (Awesome UI) locally:

```bash
npm run test:smoke          # or any WDIO suite
npm run allure:generate     # builds allure-report/
npm run allure:open         # opens in browser

# generate + open
npm run allure:serve
# or
npm run report
```

### GitHub Pages

On every push to `main`, the `publish` job merges Allure results when available, always builds the docs site (landing, guides, slides), and deploys to GitHub Pages:

- Hub: `https://lflucasferreira.github.io/testflow-appium/`
- Report: `https://lflucasferreira.github.io/testflow-appium/report/` (placeholder if no Allure data)

Android jobs upload `allure-results/`; the `publish` job combines them on `main`.

#### One-time setup (required)

`deploy-pages` fails with **404** until Pages is enabled on the repository:

1. Open [Settings → Pages](https://github.com/lflucasferreira/testflow-appium/settings/pages)
2. Under **Build and deployment → Source**, select **GitHub Actions** (not “Deploy from a branch”)
3. Re-run the **Appium Mobile** workflow (`workflow_dispatch` or push to `main`)

The workflow already declares the required permissions:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## Project structure

```
testflow-appium/
├── wdio.conf.ts              # Android capabilities
├── wdio.ios.conf.ts          # iOS capabilities
├── wdio.api.conf.ts          # REST-only runner
├── fixtures/                 # JSON fixtures
├── pages/                    # Page Object Model
├── support/
│   ├── auth.ts               # API login + sessionStorage seeding
│   ├── config.ts             # Base URL resolution per platform
│   ├── selectors.ts          # data-testid helpers
│   ├── api/                  # Axios client
│   ├── constants/            # TC ids, HTTP status, viewports
│   └── helpers/              # Gestures, waits, visual baselines
└── tests/                    # Specs by feature + Appium demos
```

## CI

GitHub Actions (`.github/workflows/appium.yml`) runs **parallel test jobs** on every push/PR, then a single Pages publish on `main`:

| Job | What it runs |
|---|---|
| `api` | REST smoke against TestFlow Docker service |
| `android-smoke` | Android smoke on emulator API 34 (parallel with `api`) |
| `android-full` | Full Android suite — `workflow_dispatch` only |
| `publish` | Merges Allure when available, always builds landing + guides + slides |
| `deploy` | GitHub Pages deployment (`main` only) |

```bash
# Same commands as CI (local)
npm run test:api
npm run test:ci:android:smoke
npm run test:ci:android
```

iOS jobs require macOS runners — run locally with `npm run test:ios`.

## Technologies

- [Appium 2](https://appium.io/)
- [WebdriverIO 9](https://webdriver.io/)
- TypeScript + Mocha
- [Allure Report](https://allurereport.org/)
- Page Object Model with `data-testid` selectors
- Axios for API tests

## License

Same as TestFlow / parent automation projects.
