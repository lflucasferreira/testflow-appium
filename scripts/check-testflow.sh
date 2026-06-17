#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:5050}"
HEALTH_URL="${BASE_URL%/}/health"

echo "Checking TestFlow at ${HEALTH_URL}..."

if curl -sf "${HEALTH_URL}" > /dev/null; then
  echo "TestFlow OK"
  exit 0
fi

echo "TestFlow is not reachable at ${BASE_URL}"
echo "Start with: docker run --rm -p 5050:5050 qaschool/testflow:latest"
exit 1
