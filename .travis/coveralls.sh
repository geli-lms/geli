#!/bin/bash

# Variables
MODULE_PATH=".travis/node_modules"
BIN_PATH="coveralls/bin"

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
  RED='\033[0;31m'
  NC='\033[0m'
  echo -e "${RED}+ ERROR: coveralls is not installed, please add coveralls to the .travis/package.json${NC}"
  exit 1
fi
cd ..

echo "+ sending lcov file to coveralls"
cat ../coverage/lcov.info | ../$MODULE_PATH/$BIN_PATH/coveralls.js -v
