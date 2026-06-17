export const DEMO_EMAIL = process.env.DEMO_EMAIL ?? 'demo@automation.io'
export const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'Demo123!'

const DEFAULT_BASE_URL = 'http://localhost:5050'
const ANDROID_LOOPBACK = 'http://10.0.2.2:5050'
const IOS_LOOPBACK = 'http://127.0.0.1:5050'

function detectPlatform(): 'android' | 'ios' | 'unknown' {
  const envPlatform = process.env.PLATFORM?.toLowerCase()
  if (envPlatform === 'android' || envPlatform === 'ios') return envPlatform

  try {
    const caps = browser.capabilities as WebdriverIO.Capabilities
    const platform = String(caps.platformName ?? '').toLowerCase()
    if (platform.includes('android')) return 'android'
    if (platform.includes('ios')) return 'ios'
  } catch {
    // browser not initialized (API-only runs)
  }

  return 'unknown'
}

export function getBaseUrl(): string {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, '')

  const platform = detectPlatform()
  if (platform === 'android') {
    return (process.env.ANDROID_BASE_URL ?? ANDROID_LOOPBACK).replace(/\/$/, '')
  }
  if (platform === 'ios') {
    return (process.env.IOS_BASE_URL ?? IOS_LOOPBACK).replace(/\/$/, '')
  }

  return DEFAULT_BASE_URL
}

export function appPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${getBaseUrl()}${normalized}`
}

export function isMobilePlatform(): boolean {
  return detectPlatform() !== 'unknown'
}

export function isAndroid(): boolean {
  return detectPlatform() === 'android'
}

export function isIOS(): boolean {
  return detectPlatform() === 'ios'
}
