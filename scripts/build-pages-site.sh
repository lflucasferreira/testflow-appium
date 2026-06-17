#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
site="${root}/site"

mkdir -p "${site}/report" "${site}/assets"
cp "${root}/docs/index.html" "${site}/index.html"
cp -R "${root}/docs/assets/." "${site}/assets/"

if [ -f "${root}/allure-report/index.html" ]; then
  cp -R "${root}/allure-report/." "${site}/report/"
  echo "Using allure-report/ for site/report/"
else
  cat > "${site}/report/index.html" <<'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Allure Report</title>
  </head>
  <body>
    <h1>No Allure report generated</h1>
    <p>Check workflow logs.</p>
  </body>
</html>
EOF
  echo "No allure-report found — wrote placeholder at site/report/"
fi

touch "${site}/.nojekyll"
echo "GitHub Pages site ready at site/"
