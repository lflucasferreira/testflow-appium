export async function waitForUrl(pattern: RegExp, timeout = 15000) {
  await browser.waitUntil(
    async () => pattern.test(await browser.getUrl()),
    { timeout, timeoutMsg: `URL did not match ${pattern}` },
  )
}

export async function waitForText(testId: string, text: string | RegExp, timeout = 15000) {
  const el = await browser.$(`[data-testid="${testId}"]`)
  await el.waitForDisplayed({ timeout })
  if (typeof text === 'string') {
    await browser.waitUntil(async () => (await el.getText()).includes(text), { timeout })
  } else {
    await browser.waitUntil(async () => text.test(await el.getText()), { timeout })
  }
}

export async function pollUntil<T>(
  fn: () => Promise<T>,
  predicate: (value: T) => boolean,
  timeout = 10000,
  interval = 250,
): Promise<T> {
  let last: T
  await browser.waitUntil(
    async () => {
      last = await fn()
      return predicate(last)
    },
    { timeout, interval },
  )
  return last!
}
