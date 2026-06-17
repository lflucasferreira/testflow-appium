#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
docs="${root}/docs"
site="${root}/site"

rm -rf "${site}"
mkdir -p "${site}/report"

cp "${docs}/index.html" "${site}/index.html"
cp -R "${docs}/assets" "${site}/assets"
cp -R "${docs}/css" "${site}/css"
cp -R "${docs}/js" "${site}/js"
cp -R "${docs}/slides" "${site}/slides"

mkdir -p "${site}/node_modules"
cp -R "${root}/node_modules/reveal.js" "${site}/node_modules/reveal.js"
cp -R "${root}/node_modules/highlight.js" "${site}/node_modules/highlight.js"

# Slides live at site/slides/ on Pages — deps sit at site/node_modules/ (one level up).
while IFS= read -r -d '' file; do
  sed -e 's|\../../node_modules|../node_modules|g' \
      -e 's|data-base="../../"|data-base="../"|g' \
      "${file}" > "${file}.tmp"
  mv "${file}.tmp" "${file}"
done < <(find "${site}/slides" -name '*.html' -print0)

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

required=(
  "${site}/index.html"
  "${site}/css/landing.css"
  "${site}/css/theme-toggle.css"
  "${site}/js/theme-init.js"
  "${site}/js/theme-toggle.js"
  "${site}/slides/index.html"
  "${site}/node_modules/reveal.js/dist/reveal.js"
  "${site}/node_modules/reveal.js/dist/reveal.css"
  "${site}/node_modules/highlight.js/styles/github-dark.css"
)

for path in "${required[@]}"; do
  if [ ! -e "${path}" ]; then
    echo "Missing required Pages asset: ${path}" >&2
    exit 1
  fi
done

echo "GitHub Pages site ready at site/"
