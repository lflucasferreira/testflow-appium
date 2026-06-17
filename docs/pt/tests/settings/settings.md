# Settings — Formulário de perfil

**Arquivo fonte:** [`settings.spec.ts`](../../../../tests/settings/settings.spec.ts)

---

## Objetivo

Esta suite valida a **página Settings** do TestFlow no mobile web. Após autenticação, verifica:

- Carregamento dos campos do formulário de configurações
- Edição do nome de exibição (`display name`) e reflexo no valor do input

Usa o Page Object [`SettingsPage`](../../../../pages/SettingsPage.ts) com foco em interações de formulário no teclado mobile.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Frontend em `/web/settings.html` acessível pelo emulador |
| **Autenticação** | `loginViaApi` em `beforeEach` |
| **Execução** | `npm run test:settings` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('Settings @regression')` | Suíte de regressão funcional |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`loginViaApi`](../../../../support/auth.ts) | Bypass de login na UI |
| **Page Object** | [`SettingsPage`](../../../../pages/SettingsPage.ts) |
| **`toHaveValue`** | Matcher do expect-webdriverio para inputs após edição |
| **`setValue`** | Preenche campo de texto no WebView mobile |
| **`waitForPage`** | Garante `page-settings` visível antes das assertions |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup

```typescript
import { SettingsPage } from '../../pages/SettingsPage'
import { loginViaApi } from '../../support/auth'

describe('Settings @regression', () => {
  const settings = () => new SettingsPage()

  beforeEach(async () => {
    await loginViaApi()
    await settings().open('/web/settings.html')
    await settings().shouldBeLoaded()
  })
```

- **Dado:** sessão autenticada com usuário DEMO.
- **Quando:** navegação abre Settings e aguarda elemento raiz.
- **Então:** formulário pronto para testes no mobile web.

---

### Bloco 2 — Campos do formulário

```typescript
  it('loads settings form fields', async () => {
    await expect(await settings().displayName()).toBeDisplayed()
    await expect(await settings().saveBtn()).toBeDisplayed()
  })
```

- **Dado:** a página Settings carregou.
- **Quando:** campos `displayName` e botão salvar são consultados.
- **Então:** ambos estão visíveis — estrutura mínima do formulário confirmada.

---

### Bloco 3 — Edição do display name

```typescript
  it('allows editing display name', async () => {
    await settings().updateDisplayName('Mobile QA')
    const input = await settings().displayName()
    await expect(input).toHaveValue('Mobile QA')
  })
```

- **Dado:** o input de nome está focável no mobile.
- **Quando:** `updateDisplayName` limpa e digita "Mobile QA".
- **Então:** o valor do input reflete a edição — prova de interação de formulário no WebView.

---

## Como executar

```bash
npm run test:settings

PLATFORM=android wdio run wdio.conf.ts --spec tests/settings/settings.spec.ts
```

---

## Referências relacionadas

- Page Object: [`pages/SettingsPage.ts`](../../../../pages/SettingsPage.ts)
- Smoke — carregamento da página: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
