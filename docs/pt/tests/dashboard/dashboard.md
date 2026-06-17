# Dashboard — KPIs e modal de nova execução

**Arquivo fonte:** [`dashboard.spec.ts`](../../../../tests/dashboard/dashboard.spec.ts)

---

## Objetivo

Esta suite valida a **página principal autenticada** do TestFlow no mobile web. Após `loginViaApi`, verifica:

- Saudação contextual com nome do usuário
- Renderização dos quatro cards de KPI (runs, pass rate, members, issues)
- Valor numérico positivo no card de execuções
- Abertura e fechamento do modal "New Run"

Os testes usam o Page Object [`DashboardPage`](../../../../pages/DashboardPage.ts) e dependem de sessão pré-autenticada para focar no conteúdo do dashboard, não no fluxo de login.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Backend e frontend acessíveis pelo emulador (`10.0.2.2:5050` no Android) |
| **Sessão** | `loginViaApi` injeta token e abre `/web/dashboard.html` |
| **Dependências** | `npm install`, Appium + emulador configurados |
| **Execução** | `npm run test:dashboard` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('Dashboard @regression')` | Incluído na suíte de regressão completa |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`loginViaApi`](../../../../support/auth.ts) | Autenticação rápida sem UI antes de cada teste |
| **Page Object** | [`DashboardPage`](../../../../pages/DashboardPage.ts) — KPIs, greeting, modal |
| [`waitForPage`](../../../../pages/BasePage.ts) | Aguarda `data-testid` raiz da página |
| [`expect-webdriverio`](https://webdriver.io/docs/api/expect-webdriverio) | `toHaveText`, `toBeDisplayed`, `not.toBeDisplayed` |
| **`getText()`** | Lê texto renderizado de elementos KPI no WebView |
| **`parseInt`** | Valida que o valor de runs é numérico e maior que zero |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup autenticado

```typescript
import { DashboardPage } from '../../pages/DashboardPage'
import { loginViaApi } from '../../support/auth'

describe('Dashboard @regression', () => {
  const dashboard = () => new DashboardPage()

  beforeEach(async () => {
    await loginViaApi()
    await dashboard().shouldBeLoaded()
  })
```

- **Dado:** credenciais DEMO válidas e API acessível do host.
- **Quando:** `beforeEach` executa `loginViaApi` e aguarda `page-dashboard`.
- **Então:** cada teste parte do dashboard carregado no mobile web.

---

### Bloco 2 — Saudação

```typescript
  describe('Greeting', () => {
    it('shows time-based greeting with the user name', async () => {
      await dashboard().shouldShowGreeting()
      const greeting = await dashboard().greeting()
      await expect(greeting).toHaveText(expect.stringContaining('Demo User'))
    })
  })
```

- **Dado:** o dashboard está visível.
- **Quando:** o elemento `dash-greeting` é inspecionado.
- **Então:** o texto contém saudação por período do dia (`Good morning/afternoon/evening`) e o nome "Demo User".

---

### Bloco 3 — Cards de KPI

```typescript
  describe('KPI cards', () => {
    it('renders all four KPI cards', async () => {
      await dashboard().shouldHaveAllKpiCards()
    })

    it('shows a numeric value in the runs card', async () => {
      const value = await dashboard().kpiValue('runs')
      const text = await value.getText()
      expect(parseInt(text, 10)).toBeGreaterThan(0)
    })
  })
```

- **Dado:** os quatro KPIs (`runs`, `passrate`, `members`, `issues`) existem no DOM.
- **Quando:** `shouldHaveAllKpiCards` itera cada card e seu valor.
- **Então:** todos estão visíveis com valor não vazio; o card `runs` exibe número inteiro positivo.

---

### Bloco 4 — Modal New Run

```typescript
  describe('New run modal', () => {
    it('opens and closes the new run modal', async () => {
      await dashboard().openNewRunModal()
      const modal = await dashboard().runModal()
      await expect(modal).toBeDisplayed()
      await dashboard().cancelRun()
      await expect(modal).not.toBeDisplayed()
    })
  })
```

- **Dado:** o botão `btn-new-run` está acessível na viewport mobile.
- **Quando:** o usuário toca em "New Run" e depois em cancelar (`run-modal-cancel`).
- **Então:** o overlay `run-modal-overlay` aparece e desaparece — ciclo completo do modal.

---

## Como executar

```bash
npm run test:dashboard

# Plataforma específica
PLATFORM=android wdio run wdio.conf.ts --spec tests/dashboard/dashboard.spec.ts
PLATFORM=ios wdio run wdio.ios.conf.ts --spec tests/dashboard/dashboard.spec.ts
```

---

## Referências relacionadas

- Page Object: [`pages/DashboardPage.ts`](../../../../pages/DashboardPage.ts)
- Auth: [`support/auth.ts`](../../../../support/auth.ts)
- Gestures no dashboard: [`tests/gestures/gestures.spec.ts`](../../../../tests/gestures/gestures.spec.ts)
