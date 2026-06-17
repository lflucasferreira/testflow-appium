# API — Saúde e autenticação

**Arquivo fonte:** [`auth.api.spec.ts`](../../../../tests/api/auth.api.spec.ts)

---

## Objetivo

Este módulo cobre **testes de contrato HTTP** do backend TestFlow, executados via **Mocha puro** (sem Appium/WebdriverIO). Valida:

- Saúde do serviço (`GET /health`)
- Login com credenciais DEMO (`POST /api/auth/login`)
- Respostas de erro simuladas (404, 422)
- Listagem de usuários (`GET /api/users`)
- Rejeição de credenciais inválidas (401)

Diferente dos specs WebdriverIO, estes testes rodam no host com `axios` — ideal para CI rápido e validação de API antes de subir emuladores.

---

## Pré-requisitos

| Item | Detalhe |
|------|---------|
| **TestFlow** | Backend respondendo em `http://localhost:5050` (ou `API_BASE_URL`) |
| **Credenciais** | `DEMO_EMAIL` e `DEMO_PASSWORD` em variáveis de ambiente |
| **Dependências** | `npm install` — não requer Appium nem emulador |
| **Execução** | `npm run test:api` |

---

## Tags utilizadas

| Tag | Onde aparece | Significado |
|-----|--------------|-------------|
| `@api` | Ambos os blocos `describe` | Testes HTTP sem browser |
| `@smoke` | "API — health & auth" | Endpoints críticos pós-deploy |
| `@regression` | "API — users" | Contratos adicionais de API |

> Tags são documentais neste spec — filtragem via Mocha grep requer inclusão no título ou configuração customizada. O script `test:api` executa todos os specs em `tests/api/`.

---

## Conceitos do Appium / WebdriverIO (contexto API)

| Conceito | Uso neste arquivo |
|----------|-------------------|
| [`apiClient`](../../../../support/api/client.ts) | Instância Axios com `validateStatus: () => true` |
| [`validateSchema`](../../../../support/api/client.ts) | Asserta tipos de chaves na resposta JSON |
| [`getApiBaseUrl`](../../../../support/config.ts) | URL da API no host (`localhost:5050`) — não usa `10.0.2.2` |
| [`HTTP`](../../../../support/constants/httpStatus.ts) | Constantes de status (200, 401, 404, 422) |
| [`tc` / `TC`](../../../../support/constants/testCases.ts) | Rastreabilidade de casos de teste |
| **Mocha `it`** | Runner independente do WebdriverIO (`wdio.api.conf.ts` exclui API do WDIO) |

---

## Passo a passo — bloco a bloco

### Bloco 1 — Health e auth (smoke)

```typescript
import { DEMO_EMAIL, DEMO_PASSWORD } from '../../support/config'
import { apiClient, assert, validateSchema } from '../../support/api/client'
import { HTTP } from '../../support/constants/httpStatus'

describe('API — health & auth @api @smoke', () => {
  it(tc(TC.SMOKE_HEALTH, 'GET /health returns 200'), async () => {
    const response = await apiClient().get('/health')
    assert.strictEqual(response.status, HTTP.OK)
  })
```

- **Dado:** o backend TestFlow está acessível no host.
- **Quando:** `GET /health` é executado via Axios.
- **Então:** status HTTP é 200 — serviço vivo.

**Login via API:**

```typescript
  it(tc(TC.SMOKE_AUTH_LOGIN, 'POST /api/auth/login returns token'), async () => {
    const response = await apiClient().post('/api/auth/login', {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })
    assert.strictEqual(response.status, HTTP.OK)
    validateSchema(response.data, { token: 'string', user: 'object' })
    assert.strictEqual(response.data.user.email, DEMO_EMAIL)
  })
```

- **Dado:** credenciais DEMO válidas.
- **Quando:** `POST /api/auth/login` com body JSON.
- **Então:** resposta é 200, `token` é string, `user` é objeto e email confere — mesmo contrato usado por `fetchAuthToken` nos testes mobile.

**Endpoints de erro:**

```typescript
  it(tc(TC.SMOKE_ERROR_404, 'GET /api/errors/404 returns 404'), async () => {
    const response = await apiClient().get('/api/errors/404')
    assert.strictEqual(response.status, HTTP.NOT_FOUND)
  })

  it(tc(TC.SMOKE_ERROR_422, 'GET /api/errors/422 returns 422'), async () => {
    const response = await apiClient().get('/api/errors/422')
    assert.strictEqual(response.status, HTTP.UNPROCESSABLE)
  })
```

- **Dado:** rotas de erro simuladas existem no backend.
- **Quando:** requisição é feita a `/api/errors/404` ou `/api/errors/422`.
- **Então:** status assertado confere (404 ou 422).

---

### Bloco 2 — Users e credenciais inválidas

```typescript
describe('API — users @api @regression', () => {
  it(tc(TC.SMOKE_USERS_LIST, 'GET /api/users returns user array'), async () => {
    const response = await apiClient().get('/api/users')
    assert.strictEqual(response.status, HTTP.OK)
    validateSchema(response.data, { users: 'array' })
    assert.ok(response.data.users.length > 0)
  })

  it('rejects login with invalid credentials', async () => {
    const response = await apiClient().post('/api/auth/login', {
      email: 'wrong@email.com',
      password: 'wrong',
    })
    assert.strictEqual(response.status, HTTP.UNAUTHORIZED)
  })
})
```

- **Dado:** endpoint de usuários público ou sem auth conforme contrato TestFlow.
- **Quando:** `GET /api/users` é executado.
- **Então:** array `users` não vazio.

- **Dado:** credenciais inválidas.
- **Quando:** POST de login com email/senha errados.
- **Então:** status 401 — espelha testes negativos de [`login.spec.ts`](../../../../tests/auth/login.spec.ts).

---

## Como executar

```bash
# Todos os specs de API (Mocha, sem Appium)
npm run test:api

# Apenas este arquivo
npx mocha --require ts-node/register/transpile-only --timeout 30000 \
  tests/api/auth.api.spec.ts

# Com URL customizada
API_BASE_URL=http://localhost:5050 npm run test:api
```

**Relação com testes mobile:**

```bash
# Smoke mobile usa fetchAuthToken — depende do mesmo POST /api/auth/login
API_BASE_URL=http://localhost:5050 npm run test:smoke
```

---

## Referências relacionadas

- Cliente API: [`support/api/client.ts`](../../../../support/api/client.ts)
- Auth mobile: [`support/auth.ts`](../../../../support/auth.ts)
- Smoke mobile: [`tests/smoke/navigation.spec.ts`](../../../../tests/smoke/navigation.spec.ts)
- Exclusão no WDIO: [`wdio.shared.conf.ts`](../../../../wdio.shared.conf.ts) (`exclude: ['./tests/api/**/*.spec.ts']`)
