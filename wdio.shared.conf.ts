import dotenv from 'dotenv'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import allureReporter from '@wdio/allure-reporter'

dotenv.config()

const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots')
const ALLURE_RESULTS_DIR = path.join(process.cwd(), 'allure-results')

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
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverScreenshotsReporting: false,
        addConsoleLogs: true,
        reportedEnvironmentVars: {
          NODE_VERSION: process.version,
          PLATFORM: process.env.PLATFORM ?? 'unknown',
          CI: process.env.CI ?? 'false',
          API_BASE_URL: process.env.API_BASE_URL ?? process.env.BASE_URL ?? 'n/a',
          ANDROID_BASE_URL: process.env.ANDROID_BASE_URL ?? 'n/a',
          IOS_BASE_URL: process.env.IOS_BASE_URL ?? 'n/a',
          OS_PLATFORM: os.platform(),
          OS_RELEASE: os.release(),
        },
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: process.env.CI ? 120000 : 90000,
  },
  onPrepare: () => {
    ensureDir(SCREENSHOTS_DIR)
    ensureDir(ALLURE_RESULTS_DIR)
    ensureDir(path.join(process.cwd(), 'test-results'))
  },
  afterTest: async (_test: Mocha.Test, _context: unknown, result: { passed?: boolean }) => {
    if (result.passed) return

    ensureDir(SCREENSHOTS_DIR)
    const safeName = _test.title.replace(/\s+/g, '_').replace(/[^\w-]/g, '')

    try {
      const screenshot = await browser.takeScreenshot()
      const buffer = Buffer.from(screenshot, 'base64')
      allureReporter.addAttachment('Failure screenshot', buffer, 'image/png')
      await browser.saveScreenshot(path.join(SCREENSHOTS_DIR, `failure-${Date.now()}-${safeName}.png`))
    } catch {
      // session may already be closed
    }

    try {
      const url = await browser.getUrl()
      allureReporter.addAttachment('Current URL', url, 'text/plain')
    } catch {
      // ignore
    }
  },
} as unknown as WebdriverIO.Config
