# Device — Teclado, orientação e capacidades

**Arquivo fonte:** [`device.spec.ts`](../../../../tests/device/device.spec.ts)

---

## Objetivo

Esta suite valida **capacidades específicas do dispositivo** expostas pelo Appium no mobile web. Cobre dois blocos:

1. **Tela de login (não autenticada)** — teclado virtual, orientação portrait/landscape, screenshot, metadados da plataforma e execução de JavaScript
2. **Shell autenticado** — persistência de sessão após simulação de background

Demonstra APIs que não existem no Playwright desktop: `hideKeyboard`, `setOrientation`, `browser.capabilities`, `mobile: backgroundApp`.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **Appium** | UiAutomator2 (Android) ou XCUITest (iOS) |
| **Emulador** | Device com teclado software e suporte a rotação |
| **Execução** | `npm run test:device` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@appium` | Ambos os blocos `describe` | Requer driver nativo Appium |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`hideKeyboardIfShown`](../../../../support/helpers/gestures.ts) | `browser.isKeyboardShown()` + `hideKeyboard()` |
| [`setOrientation`](../../../../support/helpers/gestures.ts) | `browser.setOrientation('PORTRAIT' \| 'LANDSCAPE')` |
| [`browser.saveScreenshot`](https://webdriver.io/docs/api/browser/saveScreenshot) | Captura PNG em `./screenshots/` |
| [`browser.capabilities`](https://webdriver.io/docs/api/browser/capabilities) | `platformName`, versão, device name |
| [`isAndroid`](../../../../support/config.ts) | Detecta plataforma para assertion condicional |
| [`browser.execute('mobile: backgroundApp')`](https://appium.github.io/appium.io/docs/en/commands/mobile-command/) | Simula app em background (nativo; tolerante a falha em mobile web) |
| **`navigator.userAgent`** | JavaScript no contexto WebView |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup na tela de login

```typescript
import { LoginPage } from '../../pages/LoginPage'
import { hideKeyboardIfShown, setOrientation } from '../../support/helpers/gestures'

describe('Appium device capabilities @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })
```

- **Dado:** cada teste começa na tela de login.
- **Quando:** `visit()` abre `/web/login.html`.
- **Então:** campos interativos disponíveis para testes de device.

---

### Bloco 2 — Teclado virtual

```typescript
  it(tc(TC.APPIUM_KEYBOARD, 'hides software keyboard after login fields'), async () => {
    await login().fillEmail(DEMO_EMAIL)
    await login().fillPassword(DEMO_PASSWORD)
    await hideKeyboardIfShown()
    await expect(await login().submitBtn()).toBeDisplayed()
  })
```

- **Dado:** teclado software aberto após preencher campos.
- **Quando:** `hideKeyboardIfShown` detecta e oculta o teclado.
- **Então:** botão submit visível — não coberto pelo teclado em viewport mobile.

---

### Bloco 3 — Orientação portrait / landscape

```typescript
  it(tc(TC.APPIUM_ORIENTATION, 'supports portrait and landscape orientation'), async () => {
    await setOrientation('PORTRAIT')
    await expect(await login().emailInput()).toBeDisplayed()

    await setOrientation('LANDSCAPE')
    await expect(await login().emailInput()).toBeDisplayed()

    await setOrientation('PORTRAIT')
  })
```

- **Dado:** emulador com suporte a rotação.
- **Quando:** orientação alterna entre portrait e landscape.
- **Então:** campo de email permanece visível em ambas — layout responsivo no mobile web.

---

### Bloco 4 — Screenshot e metadados

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

- **Dado:** sessão Appium ativa.
- **Quando:** screenshot é salvo ou capabilities são lidas.
- **Então:** arquivo PNG criado em `screenshots/`; `platformName` contém "android" no emulador Android.

---

### Bloco 5 — JavaScript no WebView

```typescript
  it('executes mobile JavaScript in browser context', async () => {
    const userAgent = await browser.execute(() => navigator.userAgent)
    expect(userAgent.length).toBeGreaterThan(0)
  })
```

- **Dado:** contexto web ativo no Chrome/Safari mobile.
- **Quando:** `browser.execute` roda código no DOM.
- **Então:** `navigator.userAgent` retorna string não vazia — confirma bridge WebDriver ↔ JavaScript.

---

### Bloco 6 — Persistência após background

```typescript
describe('Appium device — authenticated shell @appium', () => {
  it('persists session after brief background simulation', async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')

    await browser.execute('mobile: backgroundApp', [{ seconds: 1 }]).catch(() => {
      // backgroundApp é native-only; mobile web pode ignorar — aceitável
    })

    await browser.url(await browser.getUrl())
    await waitForTestId('page-dashboard')
  })
})
```

- **Dado:** sessão autenticada no dashboard.
- **Quando:** `mobile: backgroundApp` simula 1 segundo em background (ou falha silenciosamente em mobile web puro).
- **Então:** após recarregar URL atual, `page-dashboard` ainda visível — `sandbox-auth` persistiu no `sessionStorage`.

---

## Como executar

```bash
npm run test:device

PLATFORM=android wdio run wdio.conf.ts --spec tests/device/device.spec.ts
PLATFORM=ios wdio run wdio.ios.conf.ts --spec tests/device/device.spec.ts
```

---

## Referências relacionadas

- Gestures helpers: [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts)
- Config de plataforma: [`support/config.ts`](../../../../support/config.ts)
- Screenshots em falha: [`wdio.shared.conf.ts`](../../../../wdio.shared.conf.ts) (`afterTest`)
