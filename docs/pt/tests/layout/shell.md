# App Shell — Layout, navegação e notificações

**Arquivo fonte:** [`shell.spec.ts`](../../../../tests/layout/shell.spec.ts)

---

## Objetivo

Esta suite valida o **shell da aplicação** (layout autenticado) do TestFlow no mobile web. Cobre quatro áreas:

1. **Landmarks de layout** — sidebar, topbar, breadcrumb e nome do usuário
2. **Navegação pela sidebar** — todas as rotas do menu com link ativo
3. **Notificações** — dropdown do sino e "marcar todas como lidas"
4. **Tema** — alternância de `data-theme` claro/escuro

É a suíte mais abrangente de navegação estrutural — complementa o smoke de [`navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts) com cobertura de notificações e tema.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Shell autenticado em qualquer rota interna |
| **Autenticação** | `loginViaApi` em `beforeEach` |
| **Execução** | `npm run test:layout` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | `describe('App shell — layout & notifications @regression')` | Regressão de layout e UX estrutural |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| **Page Object** | [`ShellPage`](../../../../pages/ShellPage.ts) |
| **`ShellPage.navItems()`** | Array estático de 9 itens de menu (dashboard → states) |
| [`pollUntil`](../../../../support/helpers/waits.ts) | Polling até badge de notificações zerar |
| **`browser.execute`** | Lê `data-theme` do `documentElement` |
| **`browser.$('[data-testid="..."]')`** | Verificação direta de página destino após navegação |
| **`toHaveUrl`** | Confirma path após clique na sidebar |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup

```typescript
import { ShellPage } from '../../pages/ShellPage'
import { loginViaApi } from '../../support/auth'
import { pollUntil } from '../../support/helpers/waits'

describe('App shell — layout & notifications @regression', () => {
  const shell = () => new ShellPage()

  beforeEach(async () => {
    await loginViaApi()
    await shell().shouldShowAppShell()
  })
```

- **Dado:** usuário autenticado no dashboard.
- **Quando:** `shouldShowAppShell` confirma sidebar e topbar visíveis.
- **Então:** shell completo disponível para testes no mobile web.

---

### Bloco 2 — Landmarks de layout

```typescript
  describe('Layout landmarks', () => {
    it('sidebar, topbar and breadcrumb are visible', async () => {
      await shell().shouldShowAppShell()
      await expect(await shell().breadcrumb()).toBeDisplayed()
      await expect(await shell().userName()).toHaveText(expect.stringContaining('Demo User'))
    })
  })
```

- **Dado:** shell autenticado renderizado.
- **Quando:** breadcrumb e nome do usuário são inspecionados.
- **Então:** breadcrumb visível e topbar exibe "Demo User".

---

### Bloco 3 — Navegação pela sidebar (parametrizado)

```typescript
  describe('Sidebar navigation', () => {
    for (const { testId, path, pageTestId } of ShellPage.navItems()) {
      it(`navigates to ${path} via ${testId}`, async () => {
        await shell().navigateViaSidebar(testId)
        await expect(browser).toHaveUrl(expect.stringContaining(path))
        await expect(await browser.$(`[data-testid="${pageTestId}"]`)).toBeDisplayed()
        await shell().shouldHighlightNav(testId)
      })
    }
  })
```

- **Dado:** cada item do menu está na sidebar (`nav-dashboard`, `nav-team`, … `nav-states`).
- **Quando:** o teste clica no link correspondente.
- **Então:** URL contém o path esperado, página destino visível e link possui classe `active`.

**Rotas cobertas:** dashboard, team, settings, widgets, components, activity, advanced, wizard, states.

---

### Bloco 4 — Notificações

```typescript
  describe('Notifications', () => {
    it('opens notification dropdown on bell tap', async () => {
      await shell().openNotifications()
      await expect(await shell().notifList()).toBeDisplayed()
    })

    it('mark all read clears badge', async () => {
      await shell().openNotifications()
      const before = await shell().getUnreadCount()
      expect(before).toBeGreaterThan(0)
      await shell().markAllNotificationsRead()
      await pollUntil(() => shell().getUnreadCount(), (count) => count === 0)
    })
  })
```

- **Dado:** badge de notificações com contagem > 0.
- **Quando:** usuário toca no sino (`notif-bell`) e depois em "marcar todas" (`notif-mark-all`).
- **Então:** lista de notificações abre e badge zera após polling — UX de leitura em mobile.

---

### Bloco 5 — Alternância de tema

```typescript
  describe('Theme toggle', () => {
    it('theme toggle switches data-theme', async () => {
      const before = await shell().getTheme()
      await shell().toggleTheme()
      const after = await shell().getTheme()
      expect(after).not.toBe(before)
    })
  })
```

- **Dado:** tema atual em `document.documentElement[data-theme]`.
- **Quando:** usuário toca em `theme-toggle`.
- **Então:** atributo `data-theme` muda (ex.: `dark` ↔ `light`).

---

## Como executar

```bash
npm run test:layout

PLATFORM=android wdio run wdio.conf.ts --spec tests/layout/shell.spec.ts
```

---

## Referências relacionadas

- Page Object: [`pages/ShellPage.ts`](../../../../pages/ShellPage.ts)
- Smoke sidebar: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
- Polling helper: [`support/helpers/waits.ts`](../../../../support/helpers/waits.ts)
