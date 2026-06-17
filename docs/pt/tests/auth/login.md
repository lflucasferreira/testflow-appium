# Autenticação — Login mobile

**Arquivo fonte:** [`login.spec.ts`](../../../../tests/auth/login.spec.ts)

---

## Objetivo

Esta suite valida o **fluxo completo de autenticação** da aplicação TestFlow pela tela de login no **mobile web** (Appium + Chrome/Safari). Ela cobre:

- Estrutura do formulário e atributos dos campos em viewport mobile
- Login bem-sucedido via UI com redirecionamento ao dashboard
- Persistência de sessão no `sessionStorage`
- Rejeição de credenciais inválidas e permanência na URL de login
- Atalho `loginViaUi` como smoke de login end-to-end

É a base para entender como [`LoginPage`](../../../../pages/LoginPage.ts) encapsula seletores e ações reutilizáveis com WebdriverIO.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Rodando no host em `http://localhost:5050`; emulador acessa via `10.0.2.2` (Android) ou `127.0.0.1` (iOS) |
| **Appium** | Servidor local iniciado pelo `@wdio/appium-service` |
| **Dependências** | `npm install` na raiz do projeto |
| **Credenciais DEMO** | `DEMO_EMAIL` e `DEMO_PASSWORD` em variáveis de ambiente |
| **Fixture** | [`credentials.json`](../../../../fixtures/credentials.json) com pares válidos/inválidos para testes negativos |
| **Execução** | `npm run test:auth` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@regression` | Bloco principal "Authentication" | Suíte de regressão funcional |
| `@smoke` | Bloco "Authentication — API login shortcut" | Verificação rápida de login via UI |

---

## Conceitos do Appium / WebdriverIO

| Conceito | Uso neste arquivo |
|----------|-------------------|
| **Page Object** | [`LoginPage`](../../../../pages/LoginPage.ts) — métodos fluentes (`loginWith`, `shouldRedirectToDashboard`) |
| **Aninhamento de `describe`** | Agrupa testes por tema (estrutura, credenciais válidas, inválidas) |
| [`browser.$('[data-testid="..."]')`](../../../../support/selectors.ts) | Seletores estáveis via `data-testid` |
| [`expect-webdriverio`](https://webdriver.io/docs/api/expect-webdriverio) | `toBeDisplayed`, `toHaveAttribute`, `toHaveUrl`, `toHaveText` |
| [`getSessionAuth`](../../../../support/auth.ts) | Lê `sandbox-auth` do `sessionStorage` via `browser.execute` |
| [`loginViaUi`](../../../../support/auth.ts) | Preenche formulário e aguarda `page-dashboard` |
| **`setValue` / `clearValue`** | Digitação em campos mobile — dispara eventos de input no WebView |
| **Mocha `beforeEach`** | Garante estado limpo na tela de login antes de cada teste |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Setup e Page Object

```typescript
import credentials from '../../fixtures/credentials.json'
import { LoginPage } from '../../pages/LoginPage'
import { getSessionAuth, loginViaUi } from '../../support/auth'
import { DEMO_EMAIL, DEMO_PASSWORD } from '../../support/config'

describe('Authentication @regression', () => {
  const login = () => new LoginPage()

  beforeEach(async () => {
    await login().visit()
  })
```

- **Dado:** cada teste começa na página de login.
- **Quando:** `LoginPage.visit()` navega para `/web/login.html` via `openAppPath`.
- **Então:** estado limpo — nenhuma sessão prévia assumida.

---

### Bloco 2 — Estrutura da página

```typescript
  describe('Page structure', () => {
    it(tc(TC.AUTH_LOGIN_FORM, 'renders all form elements on mobile'), async () => {
      await expect(await login().emailInput()).toBeDisplayed()
      await expect(await login().passwordInput()).toBeDisplayed()
      await expect(await login().submitBtn()).toBeDisplayed()
    })

    it('password field masks input', async () => {
      const input = await login().passwordInput()
      await expect(input).toHaveAttribute('type', 'password')
    })
  })
```

- **Dado:** a página de login está carregada no mobile web.
- **Quando:** elementos do formulário são consultados via métodos do Page Object.
- **Então:** email, senha e submit estão visíveis; o campo de senha tem `type="password"`.

---

### Bloco 3 — Credenciais válidas

```typescript
  describe('Valid credentials', () => {
    it(tc(TC.AUTH_LOGIN_SUCCESS, 'logs in via UI and redirects to dashboard'), async () => {
      await login().loginWith(DEMO_EMAIL, DEMO_PASSWORD)
      await login().shouldRedirectToDashboard()
    })

    it(tc(TC.AUTH_SESSION, 'sets auth data in sessionStorage after login'), async () => {
      await login().loginWith(DEMO_EMAIL, DEMO_PASSWORD)
      await login().shouldRedirectToDashboard()
      const auth = await getSessionAuth()
      expect(auth).not.toBeNull()
      expect(auth?.email).toBe(DEMO_EMAIL)
    })
  })
```

- **Dado:** credenciais DEMO válidas.
- **Quando:** o usuário preenche email/senha e toca em submit.
- **Então:** o browser navega para `/web/dashboard.html`, `page-dashboard` fica visível e `sandbox-auth` contém o email do usuário.

---

### Bloco 4 — Credenciais inválidas

```typescript
  describe('Invalid credentials', () => {
    it(tc(TC.AUTH_WRONG_PASSWORD, 'shows error for wrong password'), async () => {
      await login().loginWith(credentials.valid.email, credentials.invalid.password)
      await login().shouldShowError('Invalid credentials')
    })

    it('does not navigate away on failed login', async () => {
      await login().loginWith(credentials.invalid.email, credentials.invalid.password)
      await expect(browser).toHaveUrl(expect.stringContaining('/web/login.html'))
    })
  })
```

- **Dado:** combinações inválidas da fixture `credentials.json`.
- **Quando:** o formulário é submetido com senha ou email incorretos.
- **Então:** mensagem de erro aparece em `login-result` e a URL permanece em `/web/login.html`.

---

### Bloco 5 — Smoke: atalho de login via UI

```typescript
describe('Authentication — API login shortcut @smoke', () => {
  it('loginViaUi reaches dashboard', async () => {
    await loginViaUi()
    await expect(await browser.$('[data-testid="page-dashboard"]')).toBeDisplayed()
  })
})
```

- **Dado:** helper `loginViaUi` disponível para outros specs.
- **Quando:** email, senha e submit são preenchidos programaticamente.
- **Então:** o dashboard carrega — validação mínima do atalho de autenticação.

---

## Como executar

```bash
# Suíte de auth completa
npm run test:auth

# Android
PLATFORM=android wdio run wdio.conf.ts --spec tests/auth/login.spec.ts

# iOS
PLATFORM=ios wdio run wdio.ios.conf.ts --spec tests/auth/login.spec.ts

# Apenas regressão
npm run test:grep:regression
```

---

## Referências relacionadas

- Page Object: [`pages/LoginPage.ts`](../../../../pages/LoginPage.ts)
- Auth helpers: [`support/auth.ts`](../../../../support/auth.ts)
- Fixture de credenciais: [`fixtures/credentials.json`](../../../../fixtures/credentials.json)
- Config de URLs mobile: [`support/config.ts`](../../../../support/config.ts)
