#!/usr/bin/env bash
set -euo pipefail

if [ -f allure-report/index.html ]; then
  echo "Using existing allure-report/index.html"
  exit 0
fi

if [ ! -d allure-results ]; then
  echo "No allure-results directory found" >&2
  exit 1
fi

file_count="$(find allure-results -type f 2>/dev/null | wc -l | tr -d ' ')"
if [ "${file_count}" = "0" ]; then
  echo "allure-results is empty" >&2
  exit 1
fi

echo "Found ${file_count} file(s) in allure-results — generating report"
npm run allure:generate

if [ ! -f allure-report/index.html ]; then
  echo "Allure report generation did not produce allure-report/index.html" >&2
  exit 1
fi

echo "Allure report ready at allure-report/index.html"
