import { DEMO_EMAIL, DEMO_PASSWORD } from '../../support/config'
import { apiClient, assert, validateSchema } from '../../support/api/client'
import { HTTP } from '../../support/constants/httpStatus'
import { tc, TC } from '../../support/constants/testCases'

describe('API — health & auth @api @smoke', () => {
  it(tc(TC.SMOKE_HEALTH, 'GET /health returns 200'), async () => {
    const response = await apiClient().get('/health')
    assert.strictEqual(response.status, HTTP.OK)
  })

  it(tc(TC.SMOKE_AUTH_LOGIN, 'POST /api/auth/login returns token'), async () => {
    const response = await apiClient().post('/api/auth/login', {
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })
    assert.strictEqual(response.status, HTTP.OK)
    validateSchema(response.data, { token: 'string', user: 'object' })
    assert.strictEqual(response.data.user.email, DEMO_EMAIL)
  })

  it(tc(TC.SMOKE_ERROR_404, 'GET /api/errors/404 returns 404'), async () => {
    const response = await apiClient().get('/api/errors/404')
    assert.strictEqual(response.status, HTTP.NOT_FOUND)
  })

  it(tc(TC.SMOKE_ERROR_422, 'GET /api/errors/422 returns 422'), async () => {
    const response = await apiClient().get('/api/errors/422')
    assert.strictEqual(response.status, HTTP.UNPROCESSABLE)
  })
})

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
