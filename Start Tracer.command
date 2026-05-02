#!/bin/bash
set -eu

ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT=3000
MAX_ATTEMPTS=20
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
    attempt=0
    server_ready=0
    while [ "$attempt" -lt "$MAX_ATTEMPTS" ]; do
      if curl -fsS "http://localhost:${PORT}/health" >/dev/null 2>&1; then
        server_ready=1
        break
      fi
      attempt=$((attempt + 1))
      sleep 1
    done
    if [ "$server_ready" -eq 1 ]; then
      open_target "http://localhost:${PORT}"
    else
      echo "Tracer server did not respond after about ${MAX_ATTEMPTS} seconds."
      echo "Opening portable standalone mode instead..."
      open_target "$ROOT/docs/index.html"
    fi
  else
    sleep 2
    open_target "http://localhost:${PORT}"
  fi
) &
echo "Launching local Tracer server..."
npm run serve
