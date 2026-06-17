# API — Health and Auth

**Source file:** [`auth.api.spec.ts`](../../../../tests/api/auth.api.spec.ts)

---

## Purpose

This **API** suite validates the TestFlow backend over HTTP without launching Appium or a mobile browser. It is executed by **Mocha + Axios**, separate from the WebdriverIO runner. It covers:

1. **Health check** — `GET /health` returns 200.
2. **Auth login** — `POST /api/auth/login` returns a token and user payload.
3. **Error endpoints** — simulated 404 and 422 responses.
4. **Users list** — `GET /api/users` returns a non-empty array.
5. **Invalid login** — wrong credentials return 401.

These tests mirror the API health block from the Playwright smoke suite but run as a standalone Mocha project excluded from `wdio.conf.ts`.

---

## Prerequisites

| Item | Detail |
|------|--------|
| **TestFlow** | Backend running at `http://localhost:5050` (or `API_BASE_URL` / `BASE_URL`) |
| **No emulator required** | Pure HTTP — no Appium session needed |
| **Dependencies** | `npm install` |
| **Credentials** | `DEMO_EMAIL` and `DEMO_PASSWORD` in `.env` |
| **Execution** | `npm run test:api` |

> **Note:** API tests use `getApiBaseUrl()` from [`support/config.ts`](../../../../support/config.ts), which defaults to `http://localhost:5050` — the host URL, not the Android `10.0.2.2` loopback.

---

## Tags used

| Tag | Where it appears | Meaning |
|-----|------------------|---------|
| `@api` | Both describe blocks | API-only tests (no WDIO/Appium) |
| `@smoke` | "API — health & auth" block | Fast backend sanity checks |
| `@regression` | "API — users" block | Broader API regression |

---

## Mocha / Axios concepts

| Concept | Usage in this file |
|---------|-------------------|
| [`apiClient`](../../../../support/api/client.ts) | Axios instance with `validateStatus: () => true` |
| [`validateSchema`](../../../../support/api/client.ts) | Lightweight response shape validation |
| [`assert`](../../../../support/api/client.ts) | Node `assert/strict` for status and payload checks |
| [`HTTP`](../../../../support/constants/httpStatus.ts) | Named status constants (`OK`, `NOT_FOUND`, etc.) |
| `describe` / `it` | Mocha blocks — same syntax as WDIO specs but different runner |
| `getApiBaseUrl()` | Resolves host-accessible API URL |

---

## Step-by-step — block by block

### Block 1 — Health and auth (@smoke)

```typescript
describe('API — health & auth @api @smoke', () => {
  it('GET /health returns 200', async () => {
    const response = await apiClient().get('/health')
    assert.strictEqual(response.status, HTTP.OK)
  })
```

- **Given:** the TestFlow backend is reachable at `getApiBaseUrl()`.
- **When:** `GET /health` is executed via Axios.
- **Then:** the HTTP status is 200.

**Login via API:**

```typescript
  it('POST /api/auth/login returns token', async () => {
    const response = await apiClient().post('/api/auth/login', {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })
    assert.strictEqual(response.status, HTTP.OK)
    validateSchema(response.data, { token: 'string', user: 'object' })
    assert.strictEqual(response.data.user.email, DEMO_EMAIL)
  })
```

- **Given:** valid DEMO credentials.
- **When:** `POST /api/auth/login` with a JSON body.
- **Then:** response is 200, token is a string, user is an object, and email matches.

**Error endpoints:**

```typescript
  it('GET /api/errors/404 returns 404', async () => {
    const response = await apiClient().get('/api/errors/404')
    assert.strictEqual(response.status, HTTP.NOT_FOUND)
  })

  it('GET /api/errors/422 returns 422', async () => {
    const response = await apiClient().get('/api/errors/422')
    assert.strictEqual(response.status, HTTP.UNPROCESSABLE)
  })
})
```

- **Given:** simulated error routes exist on the backend.
- **When:** requests are made to `/api/errors/404` or `/api/errors/422`.
- **Then:** the asserted status matches (404 or 422).

---

### Block 2 — Users (@regression)

```typescript
describe('API — users @api @regression', () => {
  it('GET /api/users returns user array', async () => {
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

- **Given:** the users endpoint and auth endpoint are available.
- **When:** `GET /api/users` or a bad login POST is executed.
- **Then:** users array is non-empty (200) or invalid login returns 401.

---

## How to run

```bash
# Full API suite (Mocha, not WDIO)
npm run test:api

# This file only
mocha --require ts-node/register/transpile-only --timeout 30000 tests/api/auth.api.spec.ts

# Smoke-tagged API tests (manual grep)
mocha --require ts-node/register/transpile-only --timeout 30000 'tests/api/**/*.spec.ts' --grep @smoke
```

---

## Related references

- API client: [`support/api/client.ts`](../../../../support/api/client.ts)
- API base URL config: [`support/config.ts`](../../../../support/config.ts)
- WDIO auth token (uses same endpoint): [`support/auth.ts`](../../../../support/auth.ts)
- WDIO excludes API specs: [`wdio.shared.conf.ts`](../../../../wdio.shared.conf.ts) (`exclude: ['./tests/api/**/*.spec.ts']`)
