#!/usr/bin/env bash
set -euo pipefail

staging="${ALLURE_PAGES_DIR:-pages-allure-staging}"

if [ -f allure-report/index.html ]; then
  echo "Using existing allure-report/index.html"
  rm -rf "${staging}"
  cp -R allure-report "${staging}"
  echo "Staged for Pages at ${staging}/index.html"
  exit 0
fi

if [ ! -d allure-results ]; then
  echo "No allure-results — skipping report generation"
  exit 0
fi

file_count="$(find allure-results -type f 2>/dev/null | wc -l | tr -d ' ')"
if [ "${file_count}" = "0" ]; then
  echo "allure-results is empty — skipping report generation"
  exit 0
fi

echo "Found ${file_count} file(s) in allure-results — generating report"
npm run allure:generate

if [ ! -f allure-report/index.html ]; then
  echo "Allure report generation did not produce index.html — continuing without report"
  exit 0
fi

rm -rf "${staging}"
cp -R allure-report "${staging}"

echo "Allure report ready at allure-report/index.html"
echo "Staged for Pages at ${staging}/index.html"
