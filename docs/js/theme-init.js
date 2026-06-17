(function () {
  var key = 'testflow-appium-theme'
  var t = localStorage.getItem(key)
  if (t !== 'light' && t !== 'dark') {
    t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  document.documentElement.setAttribute('data-theme', t)
})()
