# Locators — Estratégias de seletores

**Arquivo fonte:** [`strategies.spec.ts`](../../../../tests/locators/strategies.spec.ts)

---

## Objetivo

Esta suite documenta e valida **estratégias de localização de elementos** no mobile web via WebdriverIO/Appium. Na tela de login, demonstra:

- Seletor CSS com `data-testid` (estratégia preferida do projeto)
- Seletor XPath
- Seletor por atributo e texto acessível
- Encadeamento a partir de elemento raiz do formulário
- Waits explícitos (`waitForDisplayed`, `waitForEnabled`)

Serve como guia prático alinhado a [`support/selectors.ts`](../../../../support/selectors.ts) e ao padrão `byTestId`.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Tela de login acessível no emulador |
| **Appium** | Sessão WebView ativa |
| **Execução** | `npm run test:locators` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@appium` | `describe('Appium locator strategies @appium')` | Validação em sessão Appium real |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`byTestId`](../../../../support/selectors.ts) | Gera `[data-testid="id"]` — seletor canônico do projeto |
| [`browser.$`](https://webdriver.io/docs/api/browser/$) | Localiza único elemento; retorna chainable promise |
| **XPath** | `//input[@data-testid="login-email"]` — alternativa quando CSS não basta |
| **`waitForDisplayed`** | Espera visibilidade com timeout (10s) |
| **`waitForEnabled`** | Espera elemento interativo (5s) |
| **`isExisting`** | Verifica presença no DOM sem exigir visibilidade |
| **`getText`** | Lê texto renderizado do botão submit |
| **Page Object** | [`LoginPage`](../../../../pages/LoginPage.ts) encapsula `byTestId` internamente |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup

```typescript
import { LoginPage } from '../../pages/LoginPage'
import { byTestId } from '../../support/selectors'

describe('Appium locator strategies @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })
```

- **Dado:** página de login carregada no WebView mobile.
- **Quando:** cada teste parte de estado limpo na tela de login.
- **Então:** elementos do formulário disponíveis para localização.

---

### Bloco 2 — CSS / data-testid (preferido)

```typescript
  it('finds element by CSS / data-testid selector', async () => {
    const el = await browser.$(byTestId('login-email'))
    await expect(el).toBeDisplayed()
  })
```

- **Dado:** campo email com `data-testid="login-email"`.
- **Quando:** `browser.$(byTestId('login-email'))` resolve para `[data-testid="login-email"]`.
- **Então:** elemento visível — **estratégia recomendada** por estabilidade e legibilidade.

---

### Bloco 3 — XPath

```typescript
  it('finds element by XPath', async () => {
    const el = await browser.$('//input[@data-testid="login-email"]')
    await expect(el).toBeDisplayed()
  })
```

- **Dado:** mesmo campo email no DOM.
- **Quando:** XPath absoluto por atributo `data-testid`.
- **Então:** elemento encontrado — útil quando hierarquia DOM importa ou CSS é ambíguo.

---

### Bloco 4 — Texto / nome acessível

```typescript
  it('finds submit button by accessible name / text', async () => {
    const el = await browser.$('button[data-testid="login-submit"]')
    await expect(el).toBeDisplayed()
    const text = await el.getText()
    expect(text.length).toBeGreaterThan(0)
  })
```

- **Dado:** botão submit com `data-testid` e label visível.
- **Quando:** seletor CSS por tag + testid e `getText()` leem o rótulo.
- **Então:** texto não vazio — alinhado a critérios de acessibilidade (nome acessível presente).

---

### Bloco 5 — Encadeamento / escopo

```typescript
  it('chains child selectors from form root', async () => {
    const form = await browser.$('form[data-testid="login-form"], .login-form, main')
    const email = await browser.$(byTestId('login-email'))
    await expect(email).toBeDisplayed()
    expect(await form.isExisting()).toBeDefined()
  })
```

- **Dado:** formulário de login com múltiplos seletores de fallback.
- **Quando:** raiz do form é localizada e email consultado no mesmo DOM.
- **Então:** ambos existem — padrão de escopo para evitar colisões em páginas complexas.

---

### Bloco 6 — Waits explícitos

```typescript
  it('waits for element state with explicit wait', async () => {
    const el = await browser.$(byTestId('login-password'))
    await el.waitForDisplayed({ timeout: 10000 })
    await el.waitForEnabled({ timeout: 5000 })
    await expect(el).toBeEnabled()
  })
```

- **Dado:** campo de senha pode demorar a ficar interativo em mobile (animações, teclado).
- **Quando:** waits explícitos com timeouts de 10s (displayed) e 5s (enabled).
- **Então:** elemento habilitado — complementa `waitForTestId` do helper centralizado.

**Comparação com helper do projeto:**

```typescript
// support/selectors.ts — abstração recomendada para testes de produto
export async function waitForTestId(testId: string, timeout = DEFAULT_TIMEOUT) {
  const el = await $(testId)
  await el.waitForExist({ timeout })
  await el.waitForDisplayed({ timeout })
  return el
}
```

---

## Como executar

```bash
npm run test:locators

PLATFORM=android wdio run wdio.conf.ts --spec tests/locators/strategies.spec.ts
```

---

## Referências relacionadas

- Seletores centralizados: [`support/selectors.ts`](../../../../support/selectors.ts)
- Context switching: [`tests/contexts/webview.spec.ts`](../../../../tests/contexts/webview.spec.ts)
- Page Object base: [`pages/BasePage.ts`](../../../../pages/BasePage.ts)
- Login funcional: [`tests/auth/login.spec.ts`](../../../../tests/auth/login.spec.ts)
