#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

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
cd ${DIR}
if [ $(npm_package_is_installed coveralls) == 0 ]; then
  echo -e "${RED}+ ERROR: coveralls is not installed, please add coveralls to the .travis/package.json${NC}"
  exit 1
fi
cd ${IPWD}

echo "+ sending lcov file to coveralls"
# since we are using typescript and remap our coverage data to the ts files we need to remove the "build" part of all paths
# this could easily be done with some sed magic
# search for "api/build/src" and replace it with "api/src"
sed -i "s/api\/build\/src/api\/src/g" api/coverage/lcov.info
cat api/coverage/lcov.info | $BIN_PATH_FULL/coveralls

echo "+ INFO: Currently only the api-coverdata are generated and send"

