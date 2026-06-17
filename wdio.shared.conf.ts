import dotenv from 'dotenv'

dotenv.config()

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
  waitforTimeout: 15000,
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
    timeout: 90000,
  },
  afterTest: async (_test: Mocha.Test, _context: unknown, result: { passed?: boolean }) => {
    if (!result.passed) {
      const safeName = _test.title.replace(/\s+/g, '_').replace(/[^\w-]/g, '')
      await browser.saveScreenshot(`./screenshots/failure-${Date.now()}-${safeName}.png`)
    }
  },
} as unknown as WebdriverIO.Config
