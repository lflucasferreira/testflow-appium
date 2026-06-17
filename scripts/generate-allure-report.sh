#!/usr/bin/env bash
set -euo pipefail

OUTPUT_DIR="${ALLURE_REPORT_DIR:-allure-report}"

if [ ! -d allure-results ] || [ -z "$(find allure-results -type f 2>/dev/null | head -1)" ]; then
  echo "No Allure results found in allure-results/"
  exit 1
fi

rm -rf "${OUTPUT_DIR}"
npx allure generate allure-results --output "${OUTPUT_DIR}"
echo "Allure report generated at ${OUTPUT_DIR}/index.html"
