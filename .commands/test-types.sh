#!/bin/bash

set -e

ARGUMENTS="$@"

tsc -p tsconfig.test.json $ARGUMENTS
