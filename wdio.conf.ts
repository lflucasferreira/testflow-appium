import { sharedConfig } from './wdio.shared.conf'

const androidCaps = {
  platformName: 'Android',
  browserName: 'Chrome',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.ANDROID_DEVICE ?? 'Android Emulator',
  'appium:platformVersion': process.env.ANDROID_VERSION ?? '14.0',
  'appium:chromedriverAutodownload': true,
  'appium:newCommandTimeout': 240,
  'appium:autoGrantPermissions': true,
}

export const config = {
  ...sharedConfig,
  capabilities: [androidCaps],
} as WebdriverIO.Config
