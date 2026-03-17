#!/bin/bash
set -euo pipefail

echo -e "\033[1m\033[36mStarting RP Mobile Container 🚀\033[0m"

cd /shared

if [ ! -f package.json ]; then
    echo "Mobile app not found at /shared"
    exit 1
fi

echo -e "\033[1mInstalling mobile dependencies...\033[0m"
yarn install

case "${MOBILE_COMMAND:-start}" in
  start)
    exec npx expo start --port 8081 --tunnel
    ;;
  start-clear)
    exec npx expo start -c --port 8081 --tunnel
    ;;
  start-web)
    exec npx expo start --web --port 19006
    ;;
  *)
    exec "$@"
    ;;
esac
