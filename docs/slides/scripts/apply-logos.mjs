import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const slidesDir = path.resolve(dir, '..')
const docsDir = path.resolve(dir, '../..')

const LOGO = 'assets/logos'
const img = (name, { color = false, macos = false, w = 24, cls = '' } = {}) => {
  const classes = ['logo-color', macos ? 'logo-macos' : '', cls].filter(Boolean).join(' ')
  return `<img src="${LOGO}/${name}" alt="" width="${w}" height="${w}"${classes ? ` class="${classes.trim()}"` : ''} aria-hidden="true" />`
}

const patches = [
  // link CSS
  [
    '<link rel="stylesheet" href="css/guide.css" />',
    '<link rel="stylesheet" href="css/guide.css" />\n    <link rel="stylesheet" href="css/logos.css" />',
  ],
  [
    '<link rel="stylesheet" href="css/theme-appium.css" />',
    '<link rel="stylesheet" href="css/theme-appium.css" />\n    <link rel="stylesheet" href="css/logos.css" />',
  ],

  // PT feature cards
  [
    '<h4>📱 Integração Appium nativa</h4>',
    `<h4 class="card-heading">${img('appium.svg', { color: true, cls: 'card-logo' })} Integração Appium nativa</h4>`,
  ],
  [
    '<h4>📱 Native Appium integration</h4>',
    `<h4 class="card-heading">${img('appium.svg', { color: true, cls: 'card-logo' })} Native Appium integration</h4>`,
  ],
  [
    '<h4>🎯 expect-webdriverio</h4>',
    `<h4 class="card-heading">${img('webdriverio.svg', { color: true, cls: 'card-logo' })} expect-webdriverio</h4>`,
  ],
  [
    '<h4>🔧 TypeScript first</h4>',
    `<h4 class="card-heading">${img('typescript.svg', { color: true, cls: 'card-logo' })} TypeScript first</h4>`,
  ],
  [
    '<h4>📊 Allure + spec reporter</h4>',
    `<h4 class="card-heading">${img('allure.svg', { color: true, cls: 'card-logo' })} Allure + spec reporter</h4>`,
  ],

  // OS cards
  ['<h4>🍎 macOS</h4>', `<h4 class="logo-heading">${img('macos.svg', { macos: true })} macOS</h4>`],
  ['<h4>🪟 Windows</h4>', `<h4 class="logo-heading">${img('windows.svg', { color: true })} Windows</h4>`],
  ['<h4>🐧 Linux</h4>', `<h4 class="logo-heading">${img('linux.svg', { color: true })} Linux</h4>`],

  // CI / Allure cards PT
  [
    '<h4>☕ Java 17+</h4>',
    `<h4 class="card-heading">${img('java.svg', { color: true, cls: 'card-logo' })} Java 17+</h4>`,
  ],
  [
    '<h4>📱 Android smoke</h4>',
    `<h4 class="card-heading">${img('android.svg', { color: true, cls: 'card-logo' })} Android smoke</h4>`,
  ],
  [
    '<h4>📊 GitHub Pages</h4>',
    `<h4 class="card-heading">${img('github.svg', { color: true, cls: 'card-logo' })} GitHub Pages</h4>`,
  ],
  [
    '<h4>🧪 TestFlow</h4>',
    `<h4 class="card-heading">${img('testflow.svg', { color: true, cls: 'card-logo' })} TestFlow</h4>`,
  ],

  // Next steps book emoji
  ['<h4>📖 Este guia (PT)</h4>', `<h4 class="card-heading">${img('appium-logo.png', { color: true, cls: 'card-logo' })} Este guia (PT)</h4>`],
  ['<h4>📖 Complete Guide (EN)</h4>', `<h4 class="card-heading">${img('appium-logo.png', { color: true, cls: 'card-logo' })} Complete Guide (EN)</h4>`],

  // WebdriverIO doc link
  [
    '<h4>Documentação WebdriverIO</h4>',
    `<h4 class="card-heading">${img('webdriverio.svg', { color: true, cls: 'card-logo' })} Documentação WebdriverIO</h4>`,
  ],
  [
    '<h4>WebdriverIO documentation</h4>',
    `<h4 class="card-heading">${img('webdriverio.svg', { color: true, cls: 'card-logo' })} WebdriverIO documentation</h4>`,
  ],

  // Slides index feature icons
  [
    '<div class="icon">📱</div>\n              <h4>Dispositivos reais</h4>',
    `<img class="icon-logo logo-color" src="${LOGO}/android.svg" alt="" aria-hidden="true" />\n              <h4>Dispositivos reais</h4>`,
  ],
  [
    '<div class="icon">🌐</div>\n              <h4>Mobile web</h4>',
    `<img class="icon-logo logo-color" src="${LOGO}/googlechrome.svg" alt="" aria-hidden="true" />\n              <h4>Mobile web</h4>`,
  ],
  [
    '<div class="icon">🔧</div>\n              <h4>Appium 2 local</h4>',
    `<img class="icon-logo logo-color" src="${LOGO}/appium.svg" alt="" aria-hidden="true" />\n              <h4>Appium 2 local</h4>`,
  ],
  [
    '<div class="icon">📊</div>\n              <h4>Allure + CI</h4>',
    `<img class="icon-logo logo-color" src="${LOGO}/allure.svg" alt="" aria-hidden="true" />\n              <h4>Allure + CI</h4>`,
  ],

  // Slides OS h2
  ['<h2>macOS — Android + iOS</h2>', `<h2 class="logo-heading">${img('macos.svg', { macos: true, w: 32 })} macOS — Android + iOS</h2>`],
  ['<h2>Windows — Android</h2>', `<h2 class="logo-heading">${img('windows.svg', { color: true, w: 32 })} Windows — Android</h2>`],
  ['<h2>Linux — Android (CI)</h2>', `<h2 class="logo-heading">${img('linux.svg', { color: true, w: 32 })} Linux — Android (CI)</h2>`],
]

const prereqPt = `<h3>Ambiente geral</h3>
              <ul class="logo-list">
                <li>${img('nodejs.svg', { color: true, w: 20 })}<span><strong>Node.js</strong> 20+</span></li>
                <li>${img('java.svg', { color: true, w: 20 })}<span><strong>Java 17+</strong> (para <code>allure generate</code>)</span></li>
                <li>${img('npm.svg', { color: true, w: 20 })}<span><strong>npm</strong> (ou pnpm / yarn)</span></li>
                <li>${img('testflow.svg', { color: true, w: 20 })}<span>TestFlow na porta <code>5050</code></span></li>
                <li>${img('vscode.svg', { color: true, w: 20 })}<span>Editor: VS Code / ${img('cursor.svg', { color: true, w: 16 })} Cursor</span></li>
              </ul>
              <h3 class="logo-heading">${img('android.svg', { color: true, w: 22 })} Android</h3>
              <ul class="logo-list">
                <li>${img('androidstudio.svg', { color: true, w: 20 })}<span>Android SDK + emulator ou dispositivo</span></li>
                <li>${img('googlechrome.svg', { color: true, w: 20 })}<span>Chrome instalado no emulador</span></li>
                <li>${img('appium.svg', { color: true, w: 20 })}<span>Appium driver <code>uiautomator2</code></span></li>
              </ul>
              <h3 class="logo-heading">${img('ios.svg', { color: true, w: 22 })} iOS (macOS only)</h3>
              <ul class="logo-list">
                <li>${img('xcode.svg', { color: true, w: 20 })}<span>Xcode + iOS Simulator</span></li>
                <li>${img('safari.svg', { color: true, w: 20 })}<span>Safari mobile web</span></li>
                <li>${img('appium.svg', { color: true, w: 20 })}<span>Appium driver <code>xcuitest</code></span></li>
              </ul>`

const prereqEn = `<h3>General environment</h3>
              <ul class="logo-list">
                <li>${img('nodejs.svg', { color: true, w: 20 })}<span><strong>Node.js</strong> 20+</span></li>
                <li>${img('java.svg', { color: true, w: 20 })}<span><strong>Java 17+</strong> (for <code>allure generate</code>)</span></li>
                <li>${img('npm.svg', { color: true, w: 20 })}<span><strong>npm</strong> (or pnpm / yarn)</span></li>
                <li>${img('testflow.svg', { color: true, w: 20 })}<span>TestFlow on port <code>5050</code></span></li>
                <li>${img('vscode.svg', { color: true, w: 20 })}<span>Editor: VS Code / ${img('cursor.svg', { color: true, w: 16 })} Cursor</span></li>
              </ul>
              <h3 class="logo-heading">${img('android.svg', { color: true, w: 22 })} Android</h3>
              <ul class="logo-list">
                <li>${img('androidstudio.svg', { color: true, w: 20 })}<span>Android SDK + emulator or device</span></li>
                <li>${img('googlechrome.svg', { color: true, w: 20 })}<span>Chrome on the emulator</span></li>
                <li>${img('appium.svg', { color: true, w: 20 })}<span>Appium driver <code>uiautomator2</code></span></li>
              </ul>
              <h3 class="logo-heading">${img('ios.svg', { color: true, w: 22 })} iOS (macOS only)</h3>
              <ul class="logo-list">
                <li>${img('xcode.svg', { color: true, w: 20 })}<span>Xcode + iOS Simulator</span></li>
                <li>${img('safari.svg', { color: true, w: 20 })}<span>Safari mobile web</span></li>
                <li>${img('appium.svg', { color: true, w: 20 })}<span>Appium driver <code>xcuitest</code></span></li>
              </ul>`

const toolRowPt = `<div class="tool-row">
            <span class="tool-chip">${img('nodejs.svg', { color: true, w: 16 })} Node.js 20+</span>
            <span class="tool-chip">${img('git.svg', { color: true, w: 16 })} Git</span>
            <span class="tool-chip">${img('java.svg', { color: true, w: 16 })} Java 17+</span>
            <span class="tool-chip">${img('docker.svg', { color: true, w: 16 })} Docker</span>
            <span class="tool-chip">${img('android.svg', { color: true, w: 16 })} Android</span>
            <span class="tool-chip">${img('ios.svg', { color: true, w: 16 })} iOS</span>
          </div>`

const toolRowEn = `<div class="tool-row">
            <span class="tool-chip">${img('nodejs.svg', { color: true, w: 16 })} Node.js 20+</span>
            <span class="tool-chip">${img('git.svg', { color: true, w: 16 })} Git</span>
            <span class="tool-chip">${img('java.svg', { color: true, w: 16 })} Java 17+</span>
            <span class="tool-chip">${img('docker.svg', { color: true, w: 16 })} Docker</span>
            <span class="tool-chip">${img('android.svg', { color: true, w: 16 })} Android</span>
            <span class="tool-chip">${img('ios.svg', { color: true, w: 16 })} iOS</span>
          </div>`

const comparePt = `<tr><th>Aspecto</th><th>${img('appium.svg', { color: true, w: 18 })} Appium + WDIO</th><th>${img('playwright.svg', { color: true, w: 18 })} Playwright (desktop)</th></tr>
            </thead>
            <tbody>
              <tr><td>Alvo</td><td><span class="logo-cell">${img('googlechrome.svg', { color: true, w: 16 })} Chrome Android / ${img('safari.svg', { color: true, w: 16 })} Safari iOS</span></td><td>${img('playwright.svg', { color: true, w: 16 })} Chromium, Firefox, WebKit desktop</td></tr>`

const compareEn = `<tr><th>Aspect</th><th>${img('appium.svg', { color: true, w: 18 })} Appium + WDIO</th><th>${img('playwright.svg', { color: true, w: 18 })} Playwright (desktop)</th></tr>
            </thead>
            <tbody>
              <tr><td>Target</td><td><span class="logo-cell">${img('googlechrome.svg', { color: true, w: 16 })} Chrome Android / ${img('safari.svg', { color: true, w: 16 })} Safari iOS</span></td><td>${img('playwright.svg', { color: true, w: 16 })} Chromium, Firefox, WebKit desktop</td></tr>`

function patchFile(filePath, extra = []) {
  let html = fs.readFileSync(filePath, 'utf8')
  for (const [from, to] of [...patches, ...extra]) {
    if (html.includes(from)) html = html.replace(from, to)
  }
  fs.writeFileSync(filePath, html)
  console.log('patched', path.basename(filePath))
}

patchFile(path.join(docsDir, 'guia-completo.html'), [
  [
    `<thead>
              <tr><th>Aspecto</th><th>Appium + WDIO</th><th>Playwright (desktop)</th></tr>
            </thead>
            <tbody>
              <tr><td>Alvo</td><td>Chrome Android / Safari iOS</td><td>Chromium, Firefox, WebKit desktop</td></tr>`,
    `<thead>\n              ${comparePt}`,
  ],
  [
    `<h3>Ambiente geral</h3>
              <ul>
                <li><strong>Node.js</strong> 20+</li>
                <li><strong>Java 17+</strong> (para <code>allure generate</code>)</li>
                <li><strong>npm</strong> (ou pnpm / yarn)</li>
                <li>TestFlow na porta <code>5050</code></li>
                <li>Editor: VS Code / Cursor</li>
              </ul>
              <h3>Android</h3>
              <ul>
                <li>Android SDK + emulator ou dispositivo</li>
                <li>Chrome instalado no emulador</li>
                <li>Appium driver <code>uiautomator2</code></li>
              </ul>
              <h3>iOS (macOS only)</h3>
              <ul>
                <li>Xcode + iOS Simulator</li>
                <li>Appium driver <code>xcuitest</code></li>
              </ul>`,
    prereqPt,
  ],
  [
    `Android e iOS têm requisitos adicionais por plataforma.
          </p>

          <div class="feature-grid platform-grid">`,
    `Android e iOS têm requisitos adicionais por plataforma.
          </p>
          ${toolRowPt}

          <div class="feature-grid platform-grid">`,
  ],
  [
    `<p><strong>Android:</strong> Android Studio → SDK Manager → API 34 emulator</p>
              <p><strong>iOS:</strong> <code>npm run test:ios</code> requer Simulator</p>`,
    `<p><strong>${img('androidstudio.svg', { color: true, w: 16 })} Android:</strong> Android Studio → SDK Manager → API 34 emulator</p>
              <p><strong>${img('xcode.svg', { color: true, w: 16 })} iOS:</strong> <code>npm run test:ios</code> requer Simulator</p>`,
  ],
  [
    `<p><strong>Android:</strong> Android Studio + variáveis <code>ANDROID_HOME</code>, <code>JAVA_HOME</code>.</p>`,
    `<p><strong>${img('androidstudio.svg', { color: true, w: 16 })} Android:</strong> Android Studio + variáveis <code>ANDROID_HOME</code>, <code>JAVA_HOME</code>.</p>`,
  ],
  [
    `<p><strong>Android:</strong> Android SDK + KVM habilitado (CI usa <code>android-emulator-runner</code>).</p>`,
    `<p><strong>${img('android.svg', { color: true, w: 16 })} Android:</strong> Android SDK + KVM habilitado (CI usa <code>githubactions.svg</code> <code>android-emulator-runner</code>).</p>`.replace('githubactions.svg', `${LOGO}/githubactions.svg`).replace('<code>githubactions.svg</code>', `<img src="${LOGO}/githubactions.svg" alt="" width="14" height="14" class="logo-color" style="vertical-align:-2px" aria-hidden="true" />`),
  ],
])

patchFile(path.join(docsDir, 'complete-guide.html'), [
  [
    `<thead>
              <tr><th>Aspect</th><th>Appium + WDIO</th><th>Playwright (desktop)</th></tr>
            </thead>
            <tbody>
              <tr><td>Target</td><td>Chrome Android / Safari iOS</td><td>Chromium, Firefox, WebKit desktop</td></tr>`,
    `<thead>\n              ${compareEn}`,
  ],
  [
    `<h3>General environment</h3>
              <ul>
                <li><strong>Node.js</strong> 20+</li>
                <li><strong>Java 17+</strong> (for <code>allure generate</code>)</li>
                <li><strong>npm</strong> (or pnpm / yarn)</li>
                <li>TestFlow on port <code>5050</code></li>
                <li>Editor: VS Code / Cursor</li>
              </ul>
              <h3>Android</h3>
              <ul>
                <li>Android SDK + emulator or device</li>
                <li>Chrome installed on the emulator</li>
                <li>Appium driver <code>uiautomator2</code></li>
              </ul>
              <h3>iOS (macOS only)</h3>
              <ul>
                <li>Xcode + iOS Simulator</li>
                <li>Appium driver <code>xcuitest</code></li>
              </ul>`,
    prereqEn,
  ],
  [
    `Android and iOS have additional platform-specific requirements.
          </p>

          <div class="feature-grid platform-grid">`,
    `Android and iOS have additional platform-specific requirements.
          </p>
          ${toolRowEn}

          <div class="feature-grid platform-grid">`,
  ],
  [
    `<p><strong>Android:</strong> Android Studio → SDK Manager → API 34 emulator</p>
              <p><strong>iOS:</strong> <code>npm run test:ios</code> requires Simulator</p>`,
    `<p><strong>${img('androidstudio.svg', { color: true, w: 16 })} Android:</strong> Android Studio → SDK Manager → API 34 emulator</p>
              <p><strong>${img('xcode.svg', { color: true, w: 16 })} iOS:</strong> <code>npm run test:ios</code> requires Simulator</p>`,
  ],
  [
    `<p><strong>Android:</strong> Android Studio + <code>ANDROID_HOME</code>, <code>JAVA_HOME</code> env vars.</p>`,
    `<p><strong>${img('androidstudio.svg', { color: true, w: 16 })} Android:</strong> Android Studio + <code>ANDROID_HOME</code>, <code>JAVA_HOME</code> env vars.</p>`,
  ],
  [
    `<p><strong>Android:</strong> Android SDK + KVM enabled (CI uses <code>android-emulator-runner</code>).</p>`,
    `<p><strong>${img('android.svg', { color: true, w: 16 })} Android:</strong> Android SDK + KVM enabled (CI uses <img src="${LOGO}/githubactions.svg" alt="" width="14" height="14" class="logo-color" style="vertical-align:-2px" aria-hidden="true" /> <code>android-emulator-runner</code>).</p>`,
  ],
])

patchFile(path.join(slidesDir, 'index.html'))

console.log('done')
