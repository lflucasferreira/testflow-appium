# TestFlow Appium — Training Documentation

Instructional material that explains **block by block** each test file in the project. Ideal for new students learning Appium 2, WebdriverIO, Mocha, Page Objects, and mobile web/API automation.

Each document links to the corresponding spec file with a relative path.

**Language:** English · [Português](../pt/README.md)

---

## How to use this material

1. Read the doc for the suite you will run or maintain.
2. Open the [spec file](..) linked at the top of the document.
3. Follow the explanation section by section while reading the code.
4. Run the suite locally:

```bash
npm run test                                    # full WDIO suite (Android default)
npm run test:android                            # explicit Android / Chrome
npm run test:ios                                # iOS Simulator / Safari
npm run test:smoke                              # smoke specs only
npm run test:api                                # Mocha + Axios (no device)
npm run test:gestures                           # Appium gesture demos
npm run test:grep:smoke                         # @smoke tag across WDIO specs
npm run test:grep:appium                        # @appium tag
```

---

## Index by suite

### Smoke & Auth

| Suite | Documentation | Spec file |
|-------|---------------|-----------|
| Smoke — navigation | [navigation.md](tests/smoke/navigation.md) | [`tests/smoke/navigation.spec.ts`](../../tests/smoke/navigation.spec.ts) |
| Auth — login | [login.md](tests/auth/login.md) | [`tests/auth/login.spec.ts`](../../tests/auth/login.spec.ts) |

### Authenticated pages

| Suite | Documentation | Spec file |
|-------|---------------|-----------|
| Dashboard | [dashboard.md](tests/dashboard/dashboard.md) | [`tests/dashboard/dashboard.spec.ts`](../../tests/dashboard/dashboard.spec.ts) |
| Team | [team.md](tests/team/team.md) | [`tests/team/team.spec.ts`](../../tests/team/team.spec.ts) |
| Settings | [settings.md](tests/settings/settings.md) | [`tests/settings/settings.spec.ts`](../../tests/settings/settings.spec.ts) |
| Components | [components.md](tests/components/components.md) | [`tests/components/components.spec.ts`](../../tests/components/components.spec.ts) |
| Wizard | [wizard.md](tests/wizard/wizard.md) | [`tests/wizard/wizard.spec.ts`](../../tests/wizard/wizard.spec.ts) |
| Activity | [activity.md](tests/activity/activity.md) | [`tests/activity/activity.spec.ts`](../../tests/activity/activity.spec.ts) |
| Advanced | [advanced.md](tests/advanced/advanced.md) | [`tests/advanced/advanced.spec.ts`](../../tests/advanced/advanced.spec.ts) |
| UI States | [states.md](tests/states/states.md) | [`tests/states/states.spec.ts`](../../tests/states/states.spec.ts) |
| App shell / layout | [shell.md](tests/layout/shell.md) | [`tests/layout/shell.spec.ts`](../../tests/layout/shell.spec.ts) |

### Visual & API

| Suite | Documentation | Spec file |
|-------|---------------|-----------|
| Visual regression | [visual.md](tests/visual/visual.md) | [`tests/visual/visual.spec.ts`](../../tests/visual/visual.spec.ts) |
| API — auth & health | [auth.api.md](tests/api/auth.api.md) | [`tests/api/auth.api.spec.ts`](../../tests/api/auth.api.spec.ts) |

### Appium-specific

| Suite | Documentation | Spec file |
|-------|---------------|-----------|
| Gestures | [gestures.md](tests/gestures/gestures.md) | [`tests/gestures/gestures.spec.ts`](../../tests/gestures/gestures.spec.ts) |
| Device capabilities | [device.md](tests/device/device.md) | [`tests/device/device.spec.ts`](../../tests/device/device.spec.ts) |
| Context switching | [webview.md](tests/contexts/webview.md) | [`tests/contexts/webview.spec.ts`](../../tests/contexts/webview.spec.ts) |
| Locator strategies | [strategies.md](tests/locators/strategies.md) | [`tests/locators/strategies.spec.ts`](../../tests/locators/strategies.spec.ts) |

---

## Cross-cutting concepts

The docs cover, among other topics:

- **Appium 2:** local install via `npm`, `appium:drivers`, UiAutomator2 (Android), XCUITest (iOS)
- **WebdriverIO 9:** `wdio.conf.ts`, `wdio.shared.conf.ts`, `@wdio/appium-service`, `expect-webdriverio`
- **Mocha:** `describe` / `it`, `before` / `beforeEach`, tags in titles (`@smoke`, `@appium`, `@regression`)
- **Mobile URL mapping:** `10.0.2.2` (Android emulator), `127.0.0.1` (iOS), `getBaseUrl()` in [`support/config.ts`](../../support/config.ts)
- **Navigation:** `openAppPath`, `seedSessionOnOrigin` in [`support/navigation.ts`](../../support/navigation.ts)
- **Authentication:** `loginViaApi`, `visitAuthenticated`, `fetchAuthToken`, `injectAuthSession` in [`support/auth.ts`](../../support/auth.ts)
- **Page Object Model:** classes in [`pages/`](../../pages/), `BasePage` with `testId()` helpers
- **Selectors:** `byTestId`, `waitForTestId`, `clickTestId` in [`support/selectors.ts`](../../support/selectors.ts) — see [`selector-strategy.md`](../selector-strategy.md)
- **Gestures:** `swipeUp`, `swipeDown`, `longPress`, `scrollIntoView` in [`support/helpers/gestures.ts`](../../support/helpers/gestures.ts)
- **Device:** orientation, keyboard hide, screenshots in [`tests/device/device.spec.ts`](../../tests/device/device.spec.ts)
- **Contexts:** `getContexts`, `switchContext`, WEBVIEW in gesture helpers
- **API testing:** Mocha + Axios via [`support/api/client.ts`](../../support/api/client.ts), excluded from WDIO in `wdio.shared.conf.ts`
- **Allure:** `@wdio/allure-reporter`, failure screenshots in `afterTest`, `npm run report`
- **Test data:** [`fixtures/credentials.json`](../../fixtures/credentials.json), constants in [`support/constants/`](../../support/constants/)
- **Visual regression:** screenshot baselines via [`support/helpers/visual.ts`](../../support/helpers/visual.ts)

---

## npm scripts quick reference

| Script | What it runs |
|--------|----------------|
| `npm run test` | Full WDIO suite (Android default) |
| `npm run test:android` | `PLATFORM=android wdio run wdio.conf.ts` |
| `npm run test:ios` | `PLATFORM=ios wdio run wdio.ios.conf.ts` |
| `npm run test:smoke` | `tests/smoke/**/*.spec.ts` |
| `npm run test:auth` | `tests/auth/**/*.spec.ts` |
| `npm run test:dashboard` | `tests/dashboard/**/*.spec.ts` |
| `npm run test:team` | `tests/team/**/*.spec.ts` |
| `npm run test:settings` | `tests/settings/**/*.spec.ts` |
| `npm run test:components` | `tests/components/**/*.spec.ts` |
| `npm run test:wizard` | `tests/wizard/**/*.spec.ts` |
| `npm run test:activity` | `tests/activity/**/*.spec.ts` |
| `npm run test:advanced` | `tests/advanced/**/*.spec.ts` |
| `npm run test:states` | `tests/states/**/*.spec.ts` |
| `npm run test:layout` | `tests/layout/**/*.spec.ts` |
| `npm run test:visual` | `tests/visual/**/*.spec.ts` |
| `npm run test:gestures` | `tests/gestures/**/*.spec.ts` |
| `npm run test:device` | `tests/device/**/*.spec.ts` |
| `npm run test:contexts` | `tests/contexts/**/*.spec.ts` |
| `npm run test:locators` | `tests/locators/**/*.spec.ts` |
| `npm run test:api` | Mocha API specs (no Appium session) |
| `npm run test:grep:smoke` | WDIO specs tagged `@smoke` |
| `npm run test:grep:regression` | WDIO specs tagged `@regression` |
| `npm run test:grep:appium` | WDIO specs tagged `@appium` |
| `npm run test:ci:android` | Full Android CI script |
| `npm run test:ci:android:smoke` | Android smoke CI script |
| `npm run report` | Generate and open Allure report |

---

## Other materials in `docs/`

| Resource | Description |
|----------|-------------|
| [`slides/`](../slides/) | Introductory Appium presentation (HTML/PDF) |
| [`guia-completo.html`](../guia-completo.html) | Step-by-step guide in Portuguese (single page) |
| [`complete-guide.html`](../complete-guide.html) | Step-by-step guide in English (single page) |
| [`selector-strategy.md`](../selector-strategy.md) | `data-testid` via WDIO helpers |
| [`appium-technical-interview-questions.md`](../appium-technical-interview-questions.md) | Technical interview question bank (Portuguese) |

---

## Folder structure

```
docs/
├── README.md                          ← language selector
├── appium-technical-interview-questions.md
├── selector-strategy.md
├── en/
│   ├── README.md                      ← this index (English)
│   └── tests/                         ← walkthroughs per spec
├── pt/
│   ├── README.md                      ← índice (Português)
│   └── tests/
└── slides/                            ← presentation
```

Each `.md` in `docs/en/tests/` mirrors the homonymous spec under `tests/`.
