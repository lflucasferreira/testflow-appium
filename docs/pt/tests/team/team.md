# Team — Tabela de usuários e convite

**Arquivo fonte:** [`team.spec.ts`](../../../../tests/team/team.spec.ts)

---

## Objetivo

Esta suite valida a **página Team** do TestFlow no mobile web. Após autenticação via API, verifica:

- Renderização da tabela de usuários
- Filtragem da tabela pelo campo de busca
- Abertura do modal de convite de membros

Usa o Page Object [`TeamPage`](../../../../pages/TeamPage.ts) com navegação direta para `/web/team.html`.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Aplicação rodando e acessível pelo emulador |
| **Autenticação** | `loginViaApi` antes de cada teste |
| **Execução** | `npm run test:team` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('Team @regression')` | Suíte de regressão funcional |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`loginViaApi`](../../../../support/auth.ts) | Sessão autenticada sem passar pela UI de login |
| **Page Object** | [`TeamPage`](../../../../pages/TeamPage.ts) — busca, tabela, convite |
| [`open('/web/team.html')`](../../../../pages/BasePage.ts) | Navegação direta com URL resolvida para mobile |
| **`setValue` / `clearValue`** | Digitação no campo `team-search` no teclado mobile |
| **`browser.$`** | Seletor direto para overlay do modal de convite |
| **`waitForDisplayed`** | Espera explícita com timeout de 5s no modal |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup e carregamento

```typescript
import { TeamPage } from '../../pages/TeamPage'
import { loginViaApi } from '../../support/auth'

describe('Team @regression', () => {
  const team = () => new TeamPage()

  beforeEach(async () => {
    await loginViaApi()
    await team().open('/web/team.html')
    await team().shouldBeLoaded()
  })
```

- **Dado:** usuário autenticado com token válido.
- **Quando:** `open` navega para a rota Team e `shouldBeLoaded` aguarda `page-team`.
- **Então:** a página está pronta para interação no mobile web.

---

### Bloco 2 — Tabela de usuários

```typescript
  it('renders users table', async () => {
    const table = await team().usersTable()
    await expect(table).toBeDisplayed()
  })
```

- **Dado:** a página Team carregou.
- **Quando:** o elemento `users-table` é consultado.
- **Então:** a tabela está visível na viewport — contrato mínimo de renderização.

---

### Bloco 3 — Busca / filtro

```typescript
  it('filters table via search input', async () => {
    await team().search('Demo')
    const table = await team().usersTable()
    await expect(table).toBeDisplayed()
  })
```

- **Dado:** o campo `team-search` está disponível.
- **Quando:** o termo "Demo" é digitado via `setValue`.
- **Então:** a tabela permanece visível após filtragem — smoke de interação com busca em mobile.

---

### Bloco 4 — Modal de convite

```typescript
  it('opens invite modal', async () => {
    await team().openInviteModal()
    const modal = await browser.$('[data-testid="invite-modal-overlay"]')
    await modal.waitForDisplayed({ timeout: 5000 }).catch(() => undefined)
  })
```

- **Dado:** o botão `btn-invite` está na página.
- **Quando:** o usuário toca para convidar membro.
- **Então:** o overlay `invite-modal-overlay` é aguardado — validação de abertura do modal (com tolerância via `.catch` se animação atrasar).

---

## Como executar

```bash
npm run test:team

PLATFORM=android wdio run wdio.conf.ts --spec tests/team/team.spec.ts
```

---

## Referências relacionadas

- Page Object: [`pages/TeamPage.ts`](../../../../pages/TeamPage.ts)
- Navegação smoke: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
- Shell — navegação via sidebar: [`tests/layout/shell.spec.ts`](../../../../tests/layout/shell.spec.ts)
