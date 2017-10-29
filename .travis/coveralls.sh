#!/bin/bash

# Variables
MODULE_PATH=".travis/node_modules"
# BIN_PATH="coveralls/bin"
BIN_PATH=".bin"

RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

# Functions
function npm_package_is_installed {
  local return_=1
  ls node_modules | grep $1 > /dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}

# Begin of code
echo
echo "+++ Run coveralls send +++"
echo

echo "+ checking if coveralls is installed"
cd .travis
if [ $(npm_package_is_installed coveralls) == 0 ]; then
  echo -e "${RED}+ ERROR: coveralls is not installed, please add coveralls to the .travis/package.json${NC}"
  exit 1
fi
cd ..

echo "+ sending lcov file to coveralls"
# since we are using typescript and remap our coverage data to the ts files we need to remove the "build" part of all paths
# this could easily be done with some sed magic
# search for "api/build/src" and replace it with "api/src"
sed "s/api\/build\/src/api\/src/g" api/coverage/lcov.info | $MODULE_PATH/$BIN_PATH/coveralls -v

echo "+ INFO: Currently only the api-coverdata are generated and send"

