# Wizard — Fluxo multi-etapas

**Arquivo fonte:** [`wizard.spec.ts`](../../../../tests/wizard/wizard.spec.ts)

---

## Objetivo

Esta suite valida o **assistente (wizard) de criação de projeto** do TestFlow no mobile web. Verifica:

- Exibição do indicador de etapa no primeiro passo
- Avanço para a próxima etapa após preencher o nome do projeto

O wizard é um fluxo sequencial sensível a viewport mobile — campos e botões "Next" devem permanecer interativos após toque no teclado virtual.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | `/web/wizard.html` acessível pelo emulador |
| **Autenticação** | `loginViaApi` em `beforeEach` |
| **Execução** | `npm run test:wizard` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('Wizard @regression')` | Suíte de regressão funcional |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| **Page Object** | [`WizardPage`](../../../../pages/WizardPage.ts) |
| **`fillProjectName`** | `setValue` no campo de nome do projeto |
| **`goNext`** | Clique no botão de avançar etapa |
| **`stepIndicator`** | Elemento que confirma em qual passo o wizard está |
| **`waitForPage`** | Aguarda `page-wizard` antes das interações |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup

```typescript
import { WizardPage } from '../../pages/WizardPage'
import { loginViaApi } from '../../support/auth'

describe('Wizard @regression', () => {
  const wizard = () => new WizardPage()

  beforeEach(async () => {
    await loginViaApi()
    await wizard().open('/web/wizard.html')
    await wizard().shouldBeLoaded()
  })
```

- **Dado:** usuário autenticado.
- **Quando:** navega para o wizard e aguarda carregamento.
- **Então:** primeiro passo do assistente está acessível no mobile web.

---

### Bloco 2 — Indicador de etapa inicial

```typescript
  it('shows step indicator on first step', async () => {
    await expect(await wizard().stepIndicator()).toBeDisplayed()
  })
```

- **Dado:** o wizard abriu no passo 1.
- **Quando:** o indicador de progresso é consultado.
- **Então:** está visível — usuário tem feedback de posição no fluxo.

---

### Bloco 3 — Avanço de etapa

```typescript
  it('advances to next step after filling project name', async () => {
    await wizard().fillProjectName('Mobile Test Project')
    await wizard().goNext()
    await expect(await wizard().stepIndicator()).toBeDisplayed()
  })
```

- **Dado:** o campo de nome do projeto está vazio.
- **Quando:** o usuário digita "Mobile Test Project" e toca em avançar.
- **Então:** o indicador de etapa permanece visível — confirma transição sem quebrar o fluxo (próximo passo renderizado).

---

## Como executar

```bash
npm run test:wizard

PLATFORM=android wdio run wdio.conf.ts --spec tests/wizard/wizard.spec.ts
```

---

## Referências relacionadas

- Page Object: [`pages/WizardPage.ts`](../../../../pages/WizardPage.ts)
- Smoke — carregamento: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
