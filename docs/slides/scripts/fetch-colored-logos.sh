#!/usr/bin/env bash
# Fetch brand-colored SVGs from Simple Icons CDN (market-standard colors)
set -euo pipefail

DIR="$(cd "$(dirname "$0")/../assets/logos" && pwd)"

fetch() {
  local file="$1"
  local slug="$2"
  local color="$3"
  if curl -fsSL "https://cdn.simpleicons.org/${slug}/${color}" -o "${DIR}/${file}"; then
    echo "✓ ${file}"
  else
    echo "⚠ skipped ${file} (${slug})"
  fi
}

fetch macos.svg apple FFFFFF
fetch ios.svg apple FFFFFF
# windows.svg — custom blue tile (not on Simple Icons CDN under stable slug)
fetch linux.svg linux FCC624
fetch nodejs.svg nodedotjs 339933
fetch java.svg openjdk 437291
fetch npm.svg npm CB3837
fetch docker.svg docker 2496ED
fetch git.svg git F05032
fetch homebrew.svg homebrew FBB040
fetch android.svg android 3DDC84
fetch androidstudio.svg androidstudio 3DDC84
fetch xcode.svg xcode 147EFB
fetch googlechrome.svg googlechrome 4285F4
fetch safari.svg safari 006CFF
# appium-logo.png — official logo from devicefarm.org (not Simple Icons)
fetch webdriverio.svg webdriverio EA5906
fetch mocha.svg mocha 8D6748
fetch mochajs.svg mocha 8D6748
fetch typescript.svg typescript 3178C6
fetch playwright.svg playwright 2EAD33
fetch axios.svg axios 5A29E4
fetch github.svg github 181717
fetch githubactions.svg githubactions 2088FF
fetch vscode.svg visualstudiocode 007ACC
fetch cursor.svg cursor 000000

# macOS light variant (Apple black glyph for light backgrounds)
fetch macos-light.svg apple 000000
fetch ios-light.svg apple 000000

# Custom / fallback
curl -fsSL "https://cdn.simpleicons.org/revealdotjs/FFFFFF" -o "${DIR}/revealjs.svg" 2>/dev/null || \
  curl -fsSL "https://cdn.simpleicons.org/slidesdotjs/FFFFFF" -o "${DIR}/revealjs.svg" 2>/dev/null || true

echo "Done — $(ls "${DIR}"/*.svg | wc -l | tr -d ' ') logos in ${DIR}"
