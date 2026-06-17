#!/usr/bin/env bash
set -euo pipefail

echo "Setting up adb reverse for TestFlow (host:5050 -> emulator:5050)..."
adb reverse tcp:5050 tcp:5050

echo "Waiting for emulator to finish booting..."
adb wait-for-device
boot_completed=""
for _ in $(seq 1 60); do
  boot_completed="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)"
  if [ "${boot_completed}" = "1" ]; then
    break
  fi
  sleep 2
done

if [ "${boot_completed}" != "1" ]; then
  echo "Emulator did not report sys.boot_completed=1 in time"
  adb shell getprop sys.boot_completed || true
  exit 1
fi

echo "Emulator boot complete"
adb devices

export PLATFORM=android
export CI=true
export API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:5050}"
export ANDROID_BASE_URL="${ANDROID_BASE_URL:-http://127.0.0.1:5050}"

echo "Checking TestFlow health at ${API_BASE_URL}/health ..."
curl -sf "${API_BASE_URL}/health" | tee /tmp/testflow-health.json
echo

mkdir -p screenshots test-results

npm run test:smoke
