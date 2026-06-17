# Activity — Feed e pipeline

**Arquivo fonte:** [`activity.spec.ts`](../../../../tests/activity/activity.spec.ts)

---

## Objetivo

Esta suite valida a **página Activity** do TestFlow no mobile web — painel de atividade recente e status de pipeline. Verifica:

- Renderização do contador de atividades
- Presença da seção de pipeline

Testes de smoke de carregamento; não exercitam filtros ou paginação profunda.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | `/web/activity.html` acessível pelo emulador |
| **Autenticação** | `loginViaApi` em `beforeEach` |
| **Execução** | `npm run test:activity` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('Activity @regression')` | Suíte de regressão funcional |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| **Page Object** | [`ActivityPage`](../../../../pages/ActivityPage.ts) |
| **`counter()`** | Elemento com contagem de atividades |
| **`pipeline()`** | Seção de status do pipeline CI/CD |
| **`shouldBeLoaded`** | Aguarda `page-activity` |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup

```typescript
import { ActivityPage } from '../../pages/ActivityPage'
import { loginViaApi } from '../../support/auth'

describe('Activity @regression', () => {
  const activity = () => new ActivityPage()

  beforeEach(async () => {
    await loginViaApi()
    await activity().open('/web/activity.html')
    await activity().shouldBeLoaded()
  })
```

- **Dado:** sessão autenticada.
- **Quando:** abre Activity e aguarda elemento raiz.
- **Então:** página pronta no mobile web.

---

### Bloco 2 — Contador de atividades

```typescript
  it('renders activity counter', async () => {
    await expect(await activity().counter()).toBeDisplayed()
  })
```

- **Dado:** a página Activity carregou.
- **Quando:** o contador é consultado.
- **Então:** está visível na viewport mobile.

---

### Bloco 3 — Seção de pipeline

```typescript
  it('renders pipeline section', async () => {
    await expect(await activity().pipeline()).toBeDisplayed()
  })
```

- **Dado:** componentes de pipeline existem no layout.
- **Quando:** a seção pipeline é inspecionada.
- **Então:** está visível — contrato mínimo de renderização do painel de CI.

---

## Como executar

```bash
npm run test:activity

PLATFORM=android wdio run wdio.conf.ts --spec tests/activity/activity.spec.ts
```

---

## Referências relacionadas

- Page Object: [`pages/ActivityPage.ts`](../../../../pages/ActivityPage.ts)
- Gestures — scroll no feed: [`tests/gestures/gestures.spec.ts`](../../../../tests/gestures/gestures.spec.ts)
