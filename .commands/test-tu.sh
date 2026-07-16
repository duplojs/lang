#!/bin/bash

set -e

ARGUMENTS="$@"

vitest --coverage $ARGUMENTS