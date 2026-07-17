#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -eq 0 ]; then
	exec tsc -p tsconfig.test.json
fi

TEMP_CONFIG="$(mktemp ./.tsconfig.test.target.XXXXXX.json)"

cleanup() {
	rm -f "$TEMP_CONFIG"
}

trap cleanup EXIT

node ./.commands/scripts/create-target-tsconfig.mjs "$TEMP_CONFIG" "$@"

tsc -p "$TEMP_CONFIG"