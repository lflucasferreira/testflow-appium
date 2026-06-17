#!/usr/bin/env bash
set -euo pipefail

driver_installed() {
  local driver="$1"
  npx appium driver list --installed --json 2>/dev/null \
    | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')); process.exit(d[process.argv[1]]?.installed ? 0 : 1)" "${driver}"
}

install_if_missing() {
  local driver="$1"

  if driver_installed "${driver}"; then
    echo "Appium driver '${driver}' already installed — skipping"
    return 0
  fi

  echo "Installing Appium driver '${driver}'..."
  npx appium driver install "${driver}"
}

install_if_missing uiautomator2
install_if_missing xcuitest
