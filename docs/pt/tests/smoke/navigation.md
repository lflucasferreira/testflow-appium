# Smoke — Navegação mobile web

**Arquivo fonte:** [`navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)

---

## Objetivo

Esta suite **smoke** verifica se a aplicação TestFlow está operacional no **mobile web** (Chrome no emulador Android ou Safari no simulador iOS) após autenticação. Ela cobre três dimensões complementares:

1. **Carregamento de páginas** — cada rota autenticada abre sem erro e expõe o elemento raiz esperado via `data-testid`.
2. **Navegação pela sidebar** — links e estado ativo se comportam conforme o contrato da UI em viewport mobile.
3. **Logout** — a sessão é limpa e o usuário é redirecionado à página inicial.

A suite foi projetada para ser **rápida**: usa `fetchAuthToken` / `visitWithToken` e `loginViaApi` para evitar repetir auth na UI em cada teste e verifica apenas a raiz de cada página, sem fluxos profundos.

> Os testes de saúde da API (`GET /health`, `POST /api/auth/login`, etc.) estão no spec dedicado [`auth.api.spec.ts`](../../../../tests/api/auth.api.spec.ts), executado via Mocha fora do WebdriverIO.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Backend e frontend rodando em `http://localhost:5050` no host |
| **Emulador Android** | Appium + emulador com Chrome; o app acessa o host via `http://10.0.2.2:5050` (loopback do Android) |
| **Simulador iOS** | Appium + simulador; loopback padrão `http://127.0.0.1:5050` |
| **Dependências** | `npm install` e drivers Appium (`npm run appium:drivers`) |
| **Credenciais** | `DEMO_EMAIL` e `DEMO_PASSWORD` em variáveis de ambiente ou `.env` |
| **Execução** | `npm run test:smoke` ou `PLATFORM=android wdio run wdio.conf.ts --spec tests/smoke/navigation.spec.ts` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@smoke` | Todos os blocos `describe` | Sanity checks rápidos pós-deploy |
| `@regression` | Bloco "Smoke — page navigation" | Incluído na suíte de regressão completa |

Filtragem via Mocha: `npm run test:grep:smoke`.

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`fetchAuthToken`](../../../../support/auth.ts) | Obtém token Bearer via Axios em `before` — sem abrir browser |
| [`visitWithToken`](../../../../support/auth.ts) | Injeta sessão no `sessionStorage` e navega para um path |
| [`loginViaApi`](../../../../support/auth.ts) | Login completo via API + abertura do dashboard |
| [`logoutViaUi`](../../../../support/auth.ts) | Clica em `nav-logout` na sidebar |
| [`waitForTestId`](../../../../support/selectors.ts) | Espera existência + visibilidade de `[data-testid="..."]` |
| [`browser.$`](https://webdriver.io/docs/api/browser/$) | Seletor CSS nativo do WebdriverIO |
| [`expect-webdriverio`](https://webdriver.io/docs/api/expect-webdriverio) | Matchers: `toHaveUrl`, `toContain` no título |
| [`browser.execute`](https://webdriver.io/docs/api/browser/execute) | Lê `sessionStorage` após logout |
| [`getBaseUrl`](../../../../support/config.ts) | Resolve URL do host conforme plataforma (10.0.2.2 no Android) |
| [`tc` / `TC`](../../../../support/constants/testCases.ts) | Prefixa títulos com IDs de caso de teste (ex.: `[TC-0001]`) |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Imports e lista de páginas

```typescript
import { fetchAuthToken, loginViaApi, logoutViaUi, visitWithToken } from '../../support/auth'
import { tc, TC } from '../../support/constants/testCases'
import { waitForTestId } from '../../support/selectors'

const PAGES = [
  { path: '/web/dashboard.html', testId: 'page-dashboard', title: 'Dashboard', tcId: TC.SMOKE_DASHBOARD },
  { path: '/web/team.html', testId: 'page-team', title: 'Team', tcId: TC.SMOKE_TEAM },
  // ... demais páginas
]
```

- **Dado:** o projeto importa helpers de auth, seletores e constantes de TC.
- **Quando:** `PAGES` define o contrato de cada rota — path, `testId` raiz, título e ID de caso de teste.
- **Então:** adicionar uma nova página exige apenas uma entrada no array, sem duplicar lógica.

**Páginas cobertas:** Dashboard, Team, Settings, Components, Activity, Advanced, Wizard, UI States.

---

### Bloco 2 — Smoke: navegação de páginas

```typescript
describe('Smoke — page navigation @smoke @regression', () => {
  let authToken: string

  before(async () => {
    authToken = (await fetchAuthToken()).token
  })

  for (const { path, testId, title, tcId } of PAGES) {
    it(tc(tcId, `${title} page loads on mobile web`), async () => {
      await visitWithToken(path, authToken)
      await waitForTestId(testId)
      await expect(await browser.getTitle()).toContain(title)
    })
  }
})
```

- **Dado:** um token de auth válido é obtido uma vez via API em `before`.
- **Quando:** cada teste injeta sessão e navega para um path autenticado no Chrome mobile.
- **Então:** a raiz da página fica visível e o título do documento contém o nome esperado — prova mínima de renderização no viewport mobile.

---

### Bloco 3 — Smoke: navegação pela sidebar

```typescript
describe('Smoke — sidebar navigation @smoke', () => {
  beforeEach(async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')
  })

  it(tc(TC.SMOKE_NAV_TEAM, 'navigates from dashboard to team via sidebar'), async () => {
    await waitForTestId('nav-team').then((el) => el.click())
    await waitForTestId('page-team')
    await expect(browser).toHaveUrl(expect.stringContaining('/web/team.html'))
  })
```

- **Dado:** um usuário autenticado está no dashboard com a sidebar visível.
- **Quando:** toca no link `nav-team` (simulado como clique touch).
- **Então:** a URL contém `/web/team.html` e `page-team` aparece.

**Teste de link ativo:**

```typescript
  it(tc(TC.SMOKE_NAV_ACTIVE, 'highlights the active nav link'), async () => {
    const nav = await waitForTestId('nav-dashboard')
    const className = await nav.getAttribute('class')
    expect(className).toMatch(/active/)
  })
```

- **Dado:** o dashboard é a rota atual.
- **Quando:** o item de menu correspondente é inspecionado.
- **Então:** ele possui a classe CSS `active` — feedback visual de navegação.

---

### Bloco 4 — Smoke: logout

```typescript
describe('Smoke — logout @smoke', () => {
  it(tc(TC.SMOKE_LOGOUT, 'logout clears session and redirects to index'), async () => {
    await loginViaApi()
    await waitForTestId('page-dashboard')

    await logoutViaUi()
    await expect(browser).toHaveUrl(expect.stringMatching(/\/web\/index\.html/))

    const auth = await browser.execute(() => sessionStorage.getItem('sandbox-auth'))
    expect(auth).toBeNull()
  })
})
```

- **Dado:** uma sessão ativa criada via `loginViaApi`.
- **Quando:** o usuário toca em logout na sidebar.
- **Então:** é redirecionado à home (`/web/index.html`) e `sandbox-auth` é removido do `sessionStorage`.

---

## Como executar

```bash
# Smoke completo (Android por padrão)
npm run test:smoke

# Android explícito
npm run test:android -- --spec tests/smoke/navigation.spec.ts

# iOS
npm run test:ios -- --spec tests/smoke/navigation.spec.ts

# Filtrar tag @smoke em toda a suíte
npm run test:grep:smoke

# API health (Mocha, sem Appium)
npm run test:api
```

**Variáveis úteis:**

```bash
# Sobrescrever URL no emulador Android
ANDROID_BASE_URL=http://10.0.2.2:5050 npm run test:smoke

# API acessível do host (testes de token em before)
API_BASE_URL=http://localhost:5050 npm run test:smoke
```

---

## Referências relacionadas

- Helpers de auth: [`support/auth.ts`](../../../../support/auth.ts)
- Resolução de URLs mobile: [`support/config.ts`](../../../../support/config.ts)
- Seletores e waits: [`support/selectors.ts`](../../../../support/selectors.ts)
- Config WebdriverIO: [`wdio.conf.ts`](../../../../wdio.conf.ts)
- API smoke: [`tests/api/auth.api.spec.ts`](../../../../tests/api/auth.api.spec.ts)
