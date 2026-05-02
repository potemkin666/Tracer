#!/bin/bash
set -eu

ROOT="$(cd "$(dirname "$0")" && pwd)"
STANDALONE_TARGET="$ROOT/index.html"
PORT=3000
MAX_ATTEMPTS=20
cd "$ROOT" || exit 1

open_target() {
  local target="$1"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$target" >/dev/null 2>&1 &
  elif command -v gio >/dev/null 2>&1; then
    gio open "$target" >/dev/null 2>&1 &
  fi
}

open_standalone() {
  local reason="$1"
  echo "$reason"
  echo "Standalone mode is opening now from the repo root..."
  open_target "$STANDALONE_TARGET"
  echo "You can use Tracer right away with the built-in open APIs."
  echo "Install Node.js 18+ later from https://nodejs.org if you want the 550+ engine local server."
}

server_responding() {
  node -e "fetch(process.argv[1]).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" \
    "http://localhost:${PORT}/health" >/dev/null 2>&1
}

echo "Starting Tracer from \"$ROOT\""
echo

if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
  open_standalone "Node.js/npm not found."
  echo
  read -r -p "Press Enter to close this window."
  exit 0
fi

if [ ! -d "$ROOT/node_modules" ]; then
  echo "First run detected. Installing dependencies..."
  if ! npm install; then
    echo
    open_standalone "npm install failed."
    echo
    read -r -p "Press Enter to close this window."
    exit 0
  fi
fi

( attempt=0
  server_ready=0
  while [ "$attempt" -lt "$MAX_ATTEMPTS" ]; do
    if server_responding; then
      server_ready=1
      break
    fi
    attempt=$((attempt + 1))
    sleep 1
  done
  if [ "$server_ready" -eq 1 ]; then
    open_target "http://localhost:${PORT}"
  else
    open_standalone "Tracer server did not respond after about ${MAX_ATTEMPTS} checks."
  fi
) &
echo "Launching local Tracer server..."
npm run serve
