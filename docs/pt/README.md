# TestFlow Appium — Documentação de Treinamento

Material didático que explica **bloco a bloco** cada arquivo de teste do projeto. Ideal para novos alunos que estão aprendendo Appium 2, WebdriverIO, Mocha, Page Objects e automação mobile web/API.

Cada documento aponta para o arquivo de spec correspondente com um link relativo.

**Idioma:** Português · [English](../en/README.md)

---

## Como usar este material

1. Leia o doc da suite que você vai executar ou manter.
2. Abra o [arquivo de spec](..) linkado no topo do documento.
3. Siga a explicação seção por seção enquanto lê o código.
4. Execute a suite localmente:

```bash
npm run test                                    # suite WDIO completa (Android padrão)
npm run test:android                            # Android / Chrome explícito
npm run test:ios                                # iOS Simulator / Safari
npm run test:smoke                              # apenas specs smoke
npm run test:api                                # Mocha + Axios (sem device)
npm run test:gestures                           # demos de gestos Appium
npm run test:grep:smoke                         # tag @smoke em specs WDIO
npm run test:grep:appium                        # tag @appium
```

---

## Índice por suite

### Smoke & Auth

| Suite | Documentação | Arquivo de teste |
|-------|--------------|------------------|
| Smoke — navegação | [navigation.md](tests/smoke/navigation.md) | [`tests/smoke/navigation.spec.ts`](../../tests/smoke/navigation.spec.ts) |
| Auth — login | [login.md](tests/auth/login.md) | [`tests/auth/login.spec.ts`](../../tests/auth/login.spec.ts) |

### Páginas autenticadas

| Suite | Documentação | Arquivo de teste |
|-------|--------------|------------------|
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

| Suite | Documentação | Arquivo de teste |
|-------|--------------|------------------|
| Visual regression | [visual.md](tests/visual/visual.md) | [`tests/visual/visual.spec.ts`](../../tests/visual/visual.spec.ts) |
| API — auth & health | [auth.api.md](tests/api/auth.api.md) | [`tests/api/auth.api.spec.ts`](../../tests/api/auth.api.spec.ts) |

### Específico Appium

| Suite | Documentação | Arquivo de teste |
|-------|--------------|------------------|
| Gestos | [gestures.md](tests/gestures/gestures.md) | [`tests/gestures/gestures.spec.ts`](../../tests/gestures/gestures.spec.ts) |
| Capacidades do device | [device.md](tests/device/device.md) | [`tests/device/device.spec.ts`](../../tests/device/device.spec.ts) |
| Troca de contexto | [webview.md](tests/contexts/webview.md) | [`tests/contexts/webview.spec.ts`](../../tests/contexts/webview.spec.ts) |
| Estratégias de locator | [strategies.md](tests/locators/strategies.md) | [`tests/locators/strategies.spec.ts`](../../tests/locators/strategies.spec.ts) |

---

## Conceitos transversais

Os documentos cobrem, entre outros:

- **Appium 2:** instalação local via `npm`, `appium:drivers`, UiAutomator2 (Android), XCUITest (iOS)
- **WebdriverIO 9:** `wdio.conf.ts`, `wdio.shared.conf.ts`, `@wdio/appium-service`, `expect-webdriverio`
- **Mocha:** `describe` / `it`, `before` / `beforeEach`, tags no título (`@smoke`, `@appium`, `@regression`)
- **Mapeamento de URL mobile:** `10.0.2.2` (emulador Android), `127.0.0.1` (iOS), `getBaseUrl()` em [`support/config.ts`](../../support/config.ts)
- **Navegação:** `openAppPath`, `seedSessionOnOrigin` em [`support/navigation.ts`](../../support/navigation.ts)
- **Autenticação:** `loginViaApi`, `visitAuthenticated`, `fetchAuthToken`, `injectAuthSession` em [`support/auth.ts`](../../support/auth.ts)
- **Page Object Model:** classes em [`pages/`](../../pages/), `BasePage` com helpers `testId()`
- **Seletores:** `byTestId`, `waitForTestId`, `clickTestId` em [`support/selectors.ts`](../../support/selectors.ts) — veja [`selector-strategy.md`](../selector-strategy.md)
- **Gestos:** `swipeUp`, `swipeDown`, `longPress`, `scrollIntoView` em [`support/helpers/gestures.ts`](../../support/helpers/gestures.ts)
- **Device:** orientação, teclado, screenshots em [`tests/device/device.spec.ts`](../../tests/device/device.spec.ts)
- **Contextos:** `getContexts`, `switchContext`, WEBVIEW nos helpers de gestos
- **Testes de API:** Mocha + Axios via [`support/api/client.ts`](../../support/api/client.ts), excluídos do WDIO em `wdio.shared.conf.ts`
- **Allure:** `@wdio/allure-reporter`, screenshots em falha no `afterTest`, `npm run report`
- **Dados de teste:** [`fixtures/credentials.json`](../../fixtures/credentials.json), constantes em [`support/constants/`](../../support/constants/)
- **Visual regression:** baselines de screenshot via [`support/helpers/visual.ts`](../../support/helpers/visual.ts)

---

## Referência rápida — scripts npm

| Script | O que executa |
|--------|----------------|
| `npm run test` | Suite WDIO completa (Android padrão) |
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
| `npm run test:api` | Specs API Mocha (sem sessão Appium) |
| `npm run test:grep:smoke` | Specs WDIO com tag `@smoke` |
| `npm run test:grep:regression` | Specs WDIO com tag `@regression` |
| `npm run test:grep:appium` | Specs WDIO com tag `@appium` |
| `npm run test:ci:android` | Script CI Android completo |
| `npm run test:ci:android:smoke` | Script CI smoke Android |
| `npm run report` | Gera e abre relatório Allure |

---

## Outros materiais em `docs/`

| Recurso | Descrição |
|---------|-----------|
| [`slides/`](../slides/) | Apresentação introdutória Appium (HTML/PDF) |
| [`slides/guia-completo.html`](../slides/guia-completo.html) | Guia passo a passo em português (página única) |
| [`slides/complete-guide.html`](../slides/complete-guide.html) | Step-by-step guide in English (single page) |
| [`selector-strategy.md`](../selector-strategy.md) | `data-testid` via helpers WDIO |
| [`appium-technical-interview-questions.md`](../appium-technical-interview-questions.md) | Banco de perguntas técnicas para entrevistas (Português) |

---

## Estrutura de pastas

```
docs/
├── README.md                          ← seletor de idioma
├── appium-technical-interview-questions.md
├── selector-strategy.md
├── pt/
│   ├── README.md                      ← índice (Português)
│   └── tests/                         ← walkthroughs por spec
├── en/
│   ├── README.md                      ← index (English)
│   └── tests/
└── slides/                            ← apresentação
```

Cada `.md` em `docs/pt/tests/` espelha o spec homônimo em `tests/`.
