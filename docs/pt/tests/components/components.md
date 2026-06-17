# Components — Botões e modal de demonstração

**Arquivo fonte:** [`components.spec.ts`](../../../../tests/components/components.spec.ts)

---

## Objetivo

Esta suite valida a **página Components** do TestFlow no mobile web — vitrine de componentes de UI. Verifica:

- Renderização do botão de ação primária
- Presença do botão em estado de loading
- Ciclo completo de abertura e fechamento do modal de demonstração

Marcada com `@a11y` por exercitar elementos interativos que também são alvo de testes de acessibilidade em outras suítes do ecossistema TestFlow.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | `/web/components.html` acessível pelo emulador |
| **Autenticação** | `loginViaApi` em `beforeEach` |
| **Execução** | `npm run test:components` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('Components @regression @a11y')` | Regressão funcional |
| `@a11y` | Mesmo `describe` | Componentes relevantes para acessibilidade |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| **Page Object** | [`ComponentsPage`](../../../../pages/ComponentsPage.ts) |
| [`tc` / `TC.COMP_LOADING_BUTTON`](../../../../support/constants/testCases.ts) | Rastreabilidade `[TC-0501]` no título do teste |
| **`waitForDisplayed`** | Aguarda overlay do modal após clique |
| **`not.toBeDisplayed`** | Confirma fechamento do modal |
| **Touch click** | `btn.click()` no WebView simula toque do usuário |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup

```typescript
import { ComponentsPage } from '../../pages/ComponentsPage'
import { loginViaApi } from '../../support/auth'
import { tc, TC } from '../../support/constants/testCases'

describe('Components @regression @a11y', () => {
  const components = () => new ComponentsPage()

  beforeEach(async () => {
    await loginViaApi()
    await components().open('/web/components.html')
    await components().shouldBeLoaded()
  })
```

- **Dado:** usuário autenticado.
- **Quando:** abre Components e aguarda `page-components`.
- **Então:** vitrine de componentes pronta no mobile web.

---

### Bloco 2 — Botão primário

```typescript
  it('renders primary action button', async () => {
    await expect(await components().primaryBtn()).toBeDisplayed()
  })
```

- **Dado:** a página carregou.
- **Quando:** `btn-primary` é consultado.
- **Então:** o botão de ação primária está visível.

---

### Bloco 3 — Botão loading

```typescript
  it(tc(TC.COMP_LOADING_BUTTON, 'shows loading button'), async () => {
    await expect(await components().loadingBtn()).toBeDisplayed()
  })
```

- **Dado:** componente de botão com spinner existe no DOM.
- **Quando:** `btn-loading` é inspecionado.
- **Então:** está visível — caso de teste `[TC-0501]` documentado.

---

### Bloco 4 — Modal de demonstração

```typescript
  it('opens and closes demo modal', async () => {
    await components().openModal()
    await components().closeModal()
    const modal = await components().modalOverlay()
    await expect(modal).not.toBeDisplayed()
  })
```

- **Dado:** botão `btn-open-modal` disponível.
- **Quando:** usuário abre o modal (`demo-modal-overlay`) e toca em fechar (`demo-modal-close`).
- **Então:** o overlay não está mais visível — ciclo modal completo em viewport mobile.

---

## Como executar

```bash
npm run test:components

PLATFORM=android wdio run wdio.conf.ts --spec tests/components/components.spec.ts
```

---

## Referências relacionadas

- Page Object: [`pages/ComponentsPage.ts`](../../../../pages/ComponentsPage.ts)
- Visual regression: [`tests/visual/visual.spec.ts`](../../../../tests/visual/visual.spec.ts)
- Baseline de componentes: screenshot `mobile-components` em [`support/helpers/visual.ts`](../../../../support/helpers/visual.ts)
