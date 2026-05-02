#!/bin/bash
set -u

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT" || exit 1

open_target() {
  local target="$1"
  if command -v open >/dev/null 2>&1; then
    open "$target"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$target" >/dev/null 2>&1 &
  fi
}

echo "Starting Tracer from \"$ROOT\""
echo

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  echo "Node.js/npm not found."
  echo "Opening portable standalone mode instead..."
  open_target "$ROOT/docs/index.html"
  echo
  read -r -p "Press Enter to close this window."
  exit 0
fi

if [ ! -d "$ROOT/node_modules" ]; then
  echo "First run detected. Installing dependencies..."
  if ! npm install; then
    echo
    echo "npm install failed. Opening portable standalone mode instead..."
    open_target "$ROOT/docs/index.html"
    echo
    read -r -p "Press Enter to close this window."
    exit 0
  fi
fi

( if command -v curl >/dev/null 2>&1; then
    for _ in $(seq 1 20); do
      if curl -fsS "http://localhost:3000/health" >/dev/null 2>&1; then
        break
      fi
      sleep 1
    done
  else
    sleep 2
  fi
  open_target "http://localhost:3000"
) &
echo "Launching local Tracer server..."
npm run serve
