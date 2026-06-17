# Gestos Appium — Swipe, scroll e long press

**Arquivo fonte:** [`gestures.spec.ts`](../../../../tests/gestures/gestures.spec.ts)

---

## Objetivo

Esta suite valida **gestos touch nativos** do Appium no mobile web do TestFlow, usando o dashboard autenticado como cenário. Cobre:

- Swipe para cima — scroll do feed de atividades para a viewport
- Swipe para baixo — retorno ao topo após scroll
- Long press em card KPI — sessão permanece estável
- Toque na navegação — link Team via sidebar

É a suíte de referência para [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts) — padrão W3C `performActions` com `pointerType: 'touch'`.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **Appium** | Servidor com suporte a gestos touch (UiAutomator2 / XCUITest) |
| **Emulador** | Android ou iOS com Chrome/Safari |
| **Autenticação** | `loginViaApi` + dashboard carregado |
| **Execução** | `npm run test:gestures` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@appium` | `describe('Appium gestures @appium @regression')` | Requer capacidades nativas de gesto |
| `@regression` | Mesmo `describe` | Suíte de regressão |

Filtragem: `npm run test:grep:appium`.

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`swipeUp` / `swipeDown`](../../../../support/helpers/gestures.ts) | Gestos verticais via `performActions` |
| [`longPress`](../../../../support/helpers/gestures.ts) | Toque prolongado com `pause` na sequência de ações |
| [`scrollIntoView`](../../../../support/helpers/gestures.ts) | Scroll DOM antes de gestos em elementos específicos |
| [`waitForTestId`](../../../../support/selectors.ts) | Localiza `activity-list`, `kpi-runs`, `nav-team` |
| **`getWindowSize`** | Calcula coordenadas proporcionais à resolução do device |
| **`releaseActions`** | Libera estado do pointer após cada gesto |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup autenticado

```typescript
import { DashboardPage } from '../../pages/DashboardPage'
import { loginViaApi } from '../../support/auth'
import { longPress, scrollIntoView, swipeDown, swipeUp } from '../../support/helpers/gestures'

describe('Appium gestures @appium @regression', () => {
  beforeEach(async () => {
    await loginViaApi()
    await new DashboardPage().shouldBeLoaded()
  })
```

- **Dado:** dashboard autenticado com feed de atividades abaixo da dobra.
- **Quando:** `beforeEach` confirma `page-dashboard`.
- **Então:** canvas de gestos touch pronto no mobile web.

---

### Bloco 2 — Swipe up no feed

```typescript
  it(tc(TC.APPIUM_SWIPE, 'swipe up scrolls activity feed into view'), async () => {
    const list = await waitForTestId('activity-list')
    await scrollIntoView(list)
    await swipeUp({ percent: 0.35 })
    await expect(list).toBeDisplayed()
  })
```

- **Dado:** `activity-list` existe mas pode estar parcialmente fora da viewport.
- **Quando:** `scrollIntoView` centraliza o elemento e `swipeUp` rola 35% da altura da tela.
- **Então:** lista permanece visível — gesto não quebra a sessão WebView.

---

### Bloco 3 — Swipe down (retorno ao topo)

```typescript
  it('swipe down returns toward top of dashboard', async () => {
    await swipeUp({ percent: 0.4 })
    await swipeDown({ percent: 0.35 })
    await expect(await waitForTestId('dash-greeting')).toBeDisplayed()
  })
```

- **Dado:** página rolada para baixo após primeiro swipe.
- **Quando:** `swipeDown` executa gesto de cima para baixo.
- **Então:** `dash-greeting` visível novamente — usuário voltou ao topo.

---

### Bloco 4 — Long press em KPI

```typescript
  it('long press on KPI card does not crash session', async () => {
    const card = await waitForTestId('kpi-runs')
    await scrollIntoView(card)
    await longPress(card, 800)
    await expect(card).toBeDisplayed()
  })
```

- **Dado:** card `kpi-runs` visível após scroll.
- **Quando:** `longPress` mantém toque por 800ms no centro do elemento.
- **Então:** card ainda visível — sessão Appium estável (sem crash ou perda de contexto).

**Sequência do long press:**

```typescript
{ type: 'pointerDown', button: 0 },
{ type: 'pause', duration: durationMs },
{ type: 'pointerUp', button: 0 },
```

---

### Bloco 5 — Navegação por toque

```typescript
  it('tap navigation via touch on team link', async () => {
    const nav = await waitForTestId('nav-team')
    await nav.click()
    await waitForTestId('page-team')
  })
```

- **Dado:** sidebar com link Team visível.
- **Quando:** toque em `nav-team` (click traduzido em tap pelo driver).
- **Então:** `page-team` aparece — navegação touch funcional.

---

## Como executar

```bash
npm run test:gestures

# Todos os testes @appium
npm run test:grep:appium

PLATFORM=android wdio run wdio.conf.ts --spec tests/gestures/gestures.spec.ts
```

---

## Referências relacionadas

- Helpers de gestos: [`support/helpers/gestures.ts`](../../../../support/helpers/gestures.ts)
- Advanced — swipe na página longa: [`tests/advanced/advanced.spec.ts`](../../../../tests/advanced/advanced.spec.ts)
- Device — teclado e orientação: [`tests/device/device.spec.ts`](../../../../tests/device/device.spec.ts)
