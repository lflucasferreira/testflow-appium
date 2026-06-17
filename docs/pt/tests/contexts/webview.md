# Contextos — WebView e switching

**Arquivo fonte:** [`webview.spec.ts`](../../../../tests/contexts/webview.spec.ts)

---

## Objetivo

Esta suite valida o **gerenciamento de contextos** no Appium — mecanismo que permite alternar entre contexto nativo (`NATIVE_APP`) e contexto web (`WEBVIEW_*`) em apps híbridos. No **mobile web** do TestFlow (Chrome/Safari no emulador), os testes verificam:

- Listagem de contextos disponíveis
- Comandos no contexto web atual
- Troca para contexto WEBVIEW quando existir
- Execução de queries DOM via `browser.execute`

Essencial para entender quando `browser.$` opera no DOM web vs. árvore de acessibilidade nativa.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **Appium** | Driver com suporte a `getContexts` / `switchContext` |
| **Mobile web** | Chrome no Android ou Safari no iOS |
| **Execução** | `npm run test:contexts` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@appium` | `describe('Appium context switching @appium')` | APIs de contexto do Appium |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`listContexts`](../../../../support/helpers/gestures.ts) | `browser.getContexts()` — array de strings |
| [`getCurrentContext`](../../../../support/helpers/gestures.ts) | `browser.getContext()` — contexto ativo |
| [`switchToWebContext`](../../../../support/helpers/gestures.ts) | Busca contexto com `WEBVIEW` no nome |
| [`browser.execute`](https://webdriver.io/docs/api/browser/execute) | `querySelectorAll('[data-testid]')` no DOM |
| **Mobile web vs híbrido** | Em mobile web puro, contexto costuma ser único (WEBVIEW); em apps nativos+híbridos há múltiplos contextos |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup na tela de login

```typescript
import { getCurrentContext, listContexts, switchToWebContext } from '../../support/helpers/gestures'

describe('Appium context switching @appium', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })
```

- **Dado:** tela de login carregada no WebView.
- **Quando:** `visit()` navega para `/web/login.html`.
- **Então:** pelo menos um contexto web está disponível.

---

### Bloco 2 — Listar contextos

```typescript
  it(tc(TC.APPIUM_CONTEXT, 'lists available contexts on mobile web'), async () => {
    const contexts = await listContexts()
    expect(contexts.length).toBeGreaterThan(0)
  })
```

- **Dado:** sessão Appium conectada ao browser mobile.
- **Quando:** `browser.getContexts()` é chamado.
- **Então:** retorna array não vazio — tipicamente `['NATIVE_APP', 'WEBVIEW_...']` ou apenas contexto web em alguns drivers.

---

### Bloco 3 — Comandos no contexto atual

```typescript
  it('runs commands in current web context', async () => {
    const context = await getCurrentContext()
    expect(context).toBeTruthy()
    await expect(await login().emailInput()).toBeDisplayed()
  })
```

- **Dado:** contexto web já ativo (padrão ao abrir URL).
- **Quando:** `getCurrentContext` retorna identificador e seletores CSS funcionam.
- **Então:** `login-email` visível — confirma que comandos WebDriver operam no DOM.

---

### Bloco 4 — Troca para WEBVIEW

```typescript
  it('switches to WEBVIEW when hybrid context exists', async () => {
    const before = await getCurrentContext()
    await switchToWebContext()
    const after = await getCurrentContext()
    expect(after).toBeTruthy()
    expect(typeof before).toBe('string')
  })
```

- **Dado:** lista de contextos contém entrada com `WEBVIEW`.
- **Quando:** `switchToWebContext` chama `browser.switchContext(webContext)`.
- **Então:** contexto após troca é string válida — operação idempotente se já estava no web.

**Implementação:**

```typescript
export async function switchToWebContext() {
  const contexts = await listContexts()
  const webContext = contexts.find((ctx) => ctx.includes('WEBVIEW') || ctx === 'WEBVIEW')
  if (webContext) {
    await browser.switchContext(webContext)
  }
}
```

---

### Bloco 5 — Queries DOM no contexto web

```typescript
  it('executes DOM queries inside web context', async () => {
    const testIds = await browser.execute(() =>
      Array.from(document.querySelectorAll('[data-testid]'))
        .slice(0, 5)
        .map((el) => el.getAttribute('data-testid')),
    )
    expect(testIds).toContain('login-email')
  })
```

- **Dado:** DOM da página de login renderizado.
- **Quando:** JavaScript consulta os primeiros 5 elementos com `data-testid`.
- **Então:** `login-email` está na lista — prova de acesso direto ao DOM no contexto correto.

---

## Como executar

```bash
npm run test:contexts

npm run test:grep:appium

PLATFORM=android wdio run wdio.conf.ts --spec tests/contexts/webview.spec.ts
```

---

## Referências relacionadas

- Context helpers: [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts)
- Locator strategies: [`tests/locators/strategies.spec.ts`](../../../../tests/locators/strategies.spec.ts)
- Seletores: [`support/selectors.ts`](../../../../support/selectors.ts)
