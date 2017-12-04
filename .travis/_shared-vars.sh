#!/bin/bash

# DECALRE COLORS
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

# DECALRE PATHS
if [ -z "${DIR}" ]; then
	DIR=""
fi
MODULE_PATH="${DIR}/node_modules"
BIN_PATH=".bin"
BIN_PATH_FULL="${MODULE_PATH}/${BIN_PATH}"
