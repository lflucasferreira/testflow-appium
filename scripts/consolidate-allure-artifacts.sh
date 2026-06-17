#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "${root}"

rm -rf allure-results allure-report
mkdir -p allure-results

if [ ! -d ci-artifacts ]; then
  echo "No ci-artifacts directory — skipping Allure merge"
  exit 0
fi

shopt -s nullglob
for results_dir in ci-artifacts/*/allure-results ci-artifacts/allure-results; do
  if [ -d "${results_dir}" ]; then
    cp -R "${results_dir}/." allure-results/
    echo "Merged ${results_dir}"
  fi
done

for report_dir in ci-artifacts/*/allure-report ci-artifacts/allure-report; do
  if [ -f "${report_dir}/index.html" ]; then
    rm -rf allure-report
    cp -R "${report_dir}" ./allure-report
    echo "Using prebuilt report from ${report_dir}"
  fi
done

file_count="$(find allure-results -type f 2>/dev/null | wc -l | tr -d ' ')"
echo "Consolidated ${file_count} Allure result file(s)"

if [ "${file_count}" = "0" ] && [ ! -f allure-report/index.html ]; then
  echo "No Allure data found — docs site will use report placeholder"
  exit 0
fi
