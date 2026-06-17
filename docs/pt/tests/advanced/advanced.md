# Advanced — Shadow DOM e gestos de scroll

**Arquivo fonte:** [`advanced.spec.ts`](../../../../tests/advanced/advanced.spec.ts)

---

## Objetivo

Esta suite valida a **página Advanced** do TestFlow no mobile web — cenários de front-end avançado. Verifica:

- Renderização da seção Shadow DOM após scroll até o elemento
- Scroll da página via gesto de swipe touch (`swipeUp`)

Combina interação DOM (`scrollIntoView`) com gestos nativos Appium (`performActions` via helpers), característicos de automação mobile web.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | `/web/advanced.html` acessível pelo emulador |
| **Autenticação** | `loginViaApi` em `beforeEach` |
| **Gestos** | Helpers em [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts) |
| **Execução** | `npm run test:advanced` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('Advanced @regression')` | Regressão funcional |
| `@appium` | Teste de swipe | Exercita API de gestos touch do Appium |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`scrollIntoView`](../../../../support/helpers/gestures.ts) | `browser.execute` com `scrollIntoView({ block: 'center' })` |
| [`swipeUp`](../../../../support/helpers/gestures.ts) | `performActions` com pointer type `touch` — swipe vertical |
| **Shadow DOM** | Elemento host `shadow-host` na página Advanced |
| **`getWindowSize`** | Calcula coordenadas de swipe proporcionais à tela |
| **Page Object** | [`AdvancedPage`](../../../../pages/AdvancedPage.ts) |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup

```typescript
import { AdvancedPage } from '../../pages/AdvancedPage'
import { loginViaApi } from '../../support/auth'
import { scrollIntoView, swipeUp } from '../../support/helpers/gestures'

describe('Advanced @regression', () => {
  const advanced = () => new AdvancedPage()

  beforeEach(async () => {
    await loginViaApi()
    await advanced().open('/web/advanced.html')
    await advanced().shouldBeLoaded()
  })
```

- **Dado:** usuário autenticado na página Advanced.
- **Quando:** `shouldBeLoaded` confirma `page-advanced`.
- **Então:** conteúdo longo da página está disponível para scroll mobile.

---

### Bloco 2 — Shadow DOM

```typescript
  it('renders shadow DOM section on mobile web', async () => {
    const host = await advanced().shadowHost()
    await scrollIntoView(host)
    await expect(host).toBeDisplayed()
  })
```

- **Dado:** o host Shadow DOM está abaixo da dobra em viewport mobile.
- **Quando:** `scrollIntoView` centraliza o elemento na tela.
- **Então:** `shadow-host` fica visível — WebView renderiza shadow roots como no desktop.

---

### Bloco 3 — Swipe scroll

```typescript
  it('scrolls advanced page with touch swipe @appium', async () => {
    await swipeUp({ percent: 0.3 })
    await expect(await advanced().pageRoot()).toBeDisplayed()
  })
```

- **Dado:** a página Advanced tem conteúdo rolável.
- **Quando:** `swipeUp` executa gesto touch de baixo para cima (30% da altura da tela).
- **Então:** `page-advanced` permanece visível — sessão Appium estável após gesto; página respondeu ao scroll.

**Implementação do swipe:**

```typescript
// support/helpers/gestures.ts — resumo
await browser.performActions([{
  type: 'pointer',
  id: 'finger1',
  parameters: { pointerType: 'touch' },
  actions: [
    { type: 'pointerMove', duration: 0, x: startX, y: startY },
    { type: 'pointerDown', button: 0 },
    { type: 'pointerMove', duration: 600, x: startX, y: endY },
    { type: 'pointerUp', button: 0 },
  ],
}])
await browser.releaseActions()
```

---

## Como executar

```bash
npm run test:advanced

# Apenas gestos Appium em toda a suíte
npm run test:grep:appium
```

---

## Referências relacionadas

- Gestures helpers: [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts)
- Gestures dedicados: [`tests/gestures/gestures.spec.ts`](../../../../tests/gestures/gestures.spec.ts)
- Page Object: [`pages/AdvancedPage.ts`](../../../../pages/AdvancedPage.ts)
