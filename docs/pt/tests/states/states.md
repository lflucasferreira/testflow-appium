# UI States — Skeleton, vazio e erro

**Arquivo fonte:** [`states.spec.ts`](../../../../tests/states/states.spec.ts)

---

## Objetivo

Esta suite valida a **página UI States** do TestFlow no mobile web — vitrine de estados de interface (loading skeleton, empty state, error state). Verifica:

- Exibição do estado skeleton após acionar botão
- Exibição do estado vazio
- Exibição do estado de erro

Cada teste alterna o conteúdo da área `states-content` via botões de demonstração, simulando padrões comuns de UX em apps mobile.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | `/web/states.html` acessível pelo emulador |
| **Autenticação** | `loginViaApi` em `beforeEach` |
| **Execução** | `npm run test:states` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('UI States @regression')` | Suíte de regressão funcional |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| **Page Object** | [`StatesPage`](../../../../pages/StatesPage.ts) |
| **Botões de demo** | `states-show-skeleton`, `states-show-empty`, `states-show-error` |
| **`contentArea()`** | Container `states-content` que muda conforme o estado |
| **Touch click** | Alternância de estados via toque nos botões de controle |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup

```typescript
import { StatesPage } from '../../pages/StatesPage'
import { loginViaApi } from '../../support/auth'

describe('UI States @regression', () => {
  const states = () => new StatesPage()

  beforeEach(async () => {
    await loginViaApi()
    await states().open('/web/states.html')
    await states().shouldBeLoaded()
  })
```

- **Dado:** usuário autenticado na vitrine de estados.
- **Quando:** `page-states` fica visível.
- **Então:** botões de demonstração estão acessíveis no mobile web.

---

### Bloco 2 — Estado skeleton

```typescript
  it('shows skeleton loading state', async () => {
    await states().showSkeleton()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })
```

- **Dado:** área de conteúdo no estado inicial.
- **Quando:** usuário toca em `states-show-skeleton`.
- **Então:** `states-content` permanece visível com placeholder de loading.

---

### Bloco 3 — Estado vazio

```typescript
  it('shows empty state', async () => {
    await states().showEmpty()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })
```

- **Dado:** vitrine de estados carregada.
- **Quando:** botão `states-show-empty` é acionado.
- **Então:** área de conteúdo exibe estado vazio (ilustração + mensagem).

---

### Bloco 4 — Estado de erro

```typescript
  it('shows error state', async () => {
    await states().showError()
    const content = await states().contentArea()
    await expect(content).toBeDisplayed()
  })
```

- **Dado:** controles de estado disponíveis.
- **Quando:** botão `states-show-error` é acionado.
- **Então:** área de conteúdo exibe estado de erro — padrão de feedback em falhas de rede/API.

---

## Como executar

```bash
npm run test:states

PLATFORM=android wdio run wdio.conf.ts --spec tests/states/states.spec.ts
```

---

## Referências relacionadas

- Page Object: [`pages/StatesPage.ts`](../../../../pages/StatesPage.ts)
- Smoke — carregamento: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
