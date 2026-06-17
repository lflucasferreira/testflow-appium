import type { ExpectWebdriverIO } from 'expect-webdriverio'

declare global {
  namespace WebdriverIO {
    interface Matchers<R, T> extends ExpectWebdriverIO.Matchers<R, T> {}
  }
}

export {}
