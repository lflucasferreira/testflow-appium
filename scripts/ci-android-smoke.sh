#!/usr/bin/env bash
set -euo pipefail
TEST_COMMAND="npm run test:smoke" exec bash "$(dirname "$0")/ci-android-suite.sh"
