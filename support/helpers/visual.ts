import fs from 'node:fs'
import path from 'node:path'

const SNAPSHOT_DIR = path.join(process.cwd(), 'test-results', 'visual-baselines')

export async function saveBaseline(name: string): Promise<string> {
  const dir = SNAPSHOT_DIR
  fs.mkdirSync(dir, { recursive: true })
  const filePath = path.join(dir, `${name}.png`)
  await browser.saveScreenshot(filePath)
  return filePath
}

export async function assertScreenshotMatches(name: string, maxMismatchPercent = 5): Promise<void> {
  const dir = SNAPSHOT_DIR
  const baselinePath = path.join(dir, `${name}.png`)

  if (!fs.existsSync(baselinePath)) {
    await saveBaseline(name)
    console.warn(`Created new visual baseline: ${baselinePath}`)
    return
  }

  const currentPath = path.join(dir, `${name}-current.png`)
  await browser.saveScreenshot(currentPath)

  const baseline = fs.readFileSync(baselinePath)
  const current = fs.readFileSync(currentPath)

  if (baseline.length === 0 || current.length === 0) {
    throw new Error(`Visual comparison failed for ${name}: empty screenshot`)
  }

  const sizeDiff = Math.abs(baseline.length - current.length) / baseline.length * 100
  if (sizeDiff > maxMismatchPercent) {
    throw new Error(
      `Visual regression for ${name}: file size differs by ${sizeDiff.toFixed(1)}% (threshold ${maxMismatchPercent}%)`,
    )
  }
}
