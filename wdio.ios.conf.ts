import { sharedConfig } from './wdio.shared.conf'

const iosCaps = {
  platformName: 'iOS',
  browserName: 'Safari',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': process.env.IOS_DEVICE ?? 'iPhone 15',
  'appium:platformVersion': process.env.IOS_VERSION ?? '17.0',
  'appium:newCommandTimeout': 240,
  'appium:safariAllowPopups': true,
  'appium:safariIgnoreFraudWarning': true,
  'wdio:enforceWebDriverClassic': true,
}

export const config = {
  ...sharedConfig,
  capabilities: [iosCaps],
} as WebdriverIO.Config
