import { appPath } from './config'

const DEFAULT_TIMEOUT = process.env.CI ? 45000 : 15000

export async function openAppPath(relativePath: string, timeout = DEFAULT_TIMEOUT): Promise<void> {
  const url = appPath(relativePath)
  await browser.url(url)
  await browser.waitUntil(
    async () => {
      const state = await browser.execute(() => document.readyState)
      return state === 'complete' || state === 'interactive'
    },
    { timeout, timeoutMsg: `Page did not reach interactive state: ${url}` },
  )
}

export async function seedSessionOnOrigin(
  inject: () => Promise<void>,
  landingPath = '/web/index.html',
): Promise<void> {
  await openAppPath(landingPath)
  await inject()
}
