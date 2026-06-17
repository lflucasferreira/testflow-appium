import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

dotenv.config()

const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots')

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true })
}

export const sharedConfig = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true,
    },
  },
  specs: ['./tests/**/*.spec.ts'],
  exclude: ['./tests/api/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'info',
  bail: 0,
  waitforTimeout: process.env.CI ? 30000 : 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  services: [
    [
      'appium',
      {
        args: {
          relaxedSecurity: true,
        },
        command: 'appium',
      },
    ],
  ],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: process.env.CI ? 120000 : 90000,
  },
  onPrepare: () => {
    ensureDir(SCREENSHOTS_DIR)
    ensureDir(path.join(process.cwd(), 'test-results'))
  },
  afterTest: async (_test: Mocha.Test, _context: unknown, result: { passed?: boolean }) => {
    if (!result.passed) {
      ensureDir(SCREENSHOTS_DIR)
      const safeName = _test.title.replace(/\s+/g, '_').replace(/[^\w-]/g, '')
      await browser.saveScreenshot(path.join(SCREENSHOTS_DIR, `failure-${Date.now()}-${safeName}.png`))
    }
  },
} as unknown as WebdriverIO.Config
