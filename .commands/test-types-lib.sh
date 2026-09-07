#!/usr/bin/env bash

set -euo pipefail

tsc -p tsconfig.lib.json "$@"
