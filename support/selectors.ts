export const byTestId = (id: string): string => `[data-testid="${id}"]`

export async function $(testId: string) {
  return browser.$(byTestId(testId))
}

export async function $$(testIdPrefix: string) {
  return browser.$$(`[data-testid^="${testIdPrefix}"]`)
}

export async function waitForTestId(testId: string, timeout = 15000) {
  const el = await $(testId)
  await el.waitForDisplayed({ timeout })
  return el
}

export async function clickTestId(testId: string) {
  const el = await waitForTestId(testId)
  await el.click()
}

export async function fillTestId(testId: string, value: string) {
  const el = await waitForTestId(testId)
  await el.clearValue()
  await el.setValue(value)
}

export async function getTextTestId(testId: string): Promise<string> {
  const el = await waitForTestId(testId)
  return el.getText()
}

export async function isDisplayedTestId(testId: string): Promise<boolean> {
  const el = await $(testId)
  return el.isDisplayed()
}
