(function () {
  const STORAGE_KEY = 'testflow-appium-theme'

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }

  function resolveBasePath(scriptEl) {
    const base = scriptEl?.getAttribute('data-base') || '.'
    return base.replace(/\/?$/, '/')
  }

  function swapStylesheet(id, href) {
    const link = document.getElementById(id)
    if (link && href) link.href = href
  }

  function syncMacLogos(theme) {
    document.querySelectorAll('img.logo-macos[data-logo-dark]').forEach((img) => {
      img.src = theme === 'light' ? img.dataset.logoLight : img.dataset.logoDark
    })
  }

  function applyTheme(theme, basePath) {
    document.documentElement.setAttribute('data-theme', theme)
    syncMacLogos(theme)

    if (basePath) {
      const revealFile = theme === 'light' ? 'white.css' : 'black.css'
      swapStylesheet('reveal-theme', `${basePath}node_modules/reveal.js/dist/theme/${revealFile}`)
    }

    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme')
      btn.setAttribute('title', theme === 'light' ? 'Dark theme' : 'Light theme')
    })
  }

  function initToggleButtons(onToggle) {
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      if (btn.dataset.themeBound) return
      btn.dataset.themeBound = 'true'
      btn.addEventListener('click', onToggle)
    })
  }

  const earlyScript = document.currentScript
  const basePath = resolveBasePath(earlyScript)

  window.__apApplyTheme = function (theme) {
    applyTheme(theme, basePath)
  }

  applyTheme(getPreferredTheme(), basePath)

  function bindToggles() {
    initToggleButtons(() => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, next)
      applyTheme(next, basePath)
      if (window.hljs) window.hljs.highlightAll()
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles)
  } else {
    bindToggles()
  }
})()
