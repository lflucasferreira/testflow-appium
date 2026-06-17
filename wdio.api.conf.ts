import dotenv from 'dotenv'

dotenv.config()

export const config = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true,
    },
  },
  specs: ['./tests/api/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'warn',
  bail: 0,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
  },
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless=new', '--disable-gpu', '--no-sandbox'],
      },
    },
  ],
  services: [],
  beforeSession: () => {
    process.env.WDIO_API_ONLY = 'true'
  },
}
