import assert from 'node:assert/strict'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { DEMO_EMAIL, DEMO_PASSWORD, getBaseUrl } from '../config'

let client: AxiosInstance | null = null

export function apiClient(): AxiosInstance {
  if (!client) {
    client = axios.create({
      baseURL: getBaseUrl(),
      validateStatus: () => true,
    })
  }
  return client
}

export async function loginAndGetToken(
  email = DEMO_EMAIL,
  password = DEMO_PASSWORD,
): Promise<string> {
  const response = await apiClient().post('/api/auth/login', { email, password })
  return response.data.token
}

export async function authenticatedRequest(config: AxiosRequestConfig) {
  const token = await loginAndGetToken()
  return apiClient().request({
    ...config,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(config.headers ?? {}),
    },
  })
}

export type Schema = Record<string, 'string' | 'number' | 'boolean' | 'array' | 'object'>

export function validateSchema(obj: Record<string, unknown>, schema: Schema): void {
  for (const [key, type] of Object.entries(schema)) {
    assert.ok(key in obj, `missing key ${key}`)
    if (type === 'array') {
      assert.ok(Array.isArray(obj[key]), `"${key}" should be array`)
    } else {
      assert.strictEqual(typeof obj[key], type, `"${key}" should be ${type}`)
    }
  }
}

export { assert }
