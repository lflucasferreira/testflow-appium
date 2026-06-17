export async function swipeUp(options: { percent?: number; speed?: number } = {}) {
  const { width, height } = await browser.getWindowSize()
  const startX = Math.floor(width / 2)
  const startY = Math.floor(height * 0.75)
  const endY = Math.floor(height * (1 - (options.percent ?? 0.4)))

  await browser.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: options.speed ?? 600, x: startX, y: endY },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ])
  await browser.releaseActions()
}

export async function swipeDown(options: { percent?: number; speed?: number } = {}) {
  const { width, height } = await browser.getWindowSize()
  const startX = Math.floor(width / 2)
  const startY = Math.floor(height * 0.25)
  const endY = Math.floor(height * (options.percent ?? 0.75))

  await browser.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y: startY },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: options.speed ?? 600, x: startX, y: endY },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ])
  await browser.releaseActions()
}

type ElementLike = WebdriverIO.Element | ReturnType<typeof $>

export async function longPress(element: ElementLike, durationMs = 1500) {
  const el = (await element) as WebdriverIO.Element
  const location = await el.getLocation()
  const size = await el.getSize()
  const x = Math.floor(location.x + size.width / 2)
  const y = Math.floor(location.y + size.height / 2)

  await browser.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x, y },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: durationMs },
        { type: 'pointerUp', button: 0 },
      ],
    },
  ])
  await browser.releaseActions()
}

export async function scrollIntoView(element: ElementLike) {
  const el = (await element) as WebdriverIO.Element
  await browser.execute((node) => {
    node.scrollIntoView({ block: 'center', behavior: 'instant' })
  }, el)
}

export async function hideKeyboardIfShown() {
  try {
    if (await browser.isKeyboardShown()) {
      await browser.hideKeyboard()
    }
  } catch {
    // Safari / desktop web may not support keyboard API
  }
}

export async function setOrientation(orientation: 'PORTRAIT' | 'LANDSCAPE') {
  await browser.setOrientation(orientation)
}

export async function getCurrentContext(): Promise<string> {
  return String(await browser.getContext())
}

export async function listContexts(): Promise<string[]> {
  const contexts = await browser.getContexts()
  return contexts.map((ctx) => String(ctx))
}

export async function switchToWebContext() {
  const contexts = await listContexts()
  const webContext = contexts.find((ctx) => ctx.includes('WEBVIEW') || ctx === 'WEBVIEW')
  if (webContext) {
    await browser.switchContext(webContext)
  }
}
