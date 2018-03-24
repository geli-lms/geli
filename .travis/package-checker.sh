#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

PATHS_TO_CHECK=(".travis" "api" "app/webFrontend")
SECONDS=0

# Functions
function npm_package_is_installed {
  local return_=1
  ls node_modules | grep $1 > /dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}

# Begin of code
echo
echo "+++ David dependency checker +++"
echo

echo "+ checking if david is installed"
cd ${DIR}
if [ $(npm_package_is_installed david) == 0 ]; then
  echo -e "${RED}+ ERROR: david is not installed, please add david to the .travis/package.json${NC}"
  exit 1
fi
cd ${IPWD}

for i in "${PATHS_TO_CHECK[@]}"
do
  echo "+ checking $i"
  ${BIN_PATH_FULL}/david --package $i/package.json
  echo
done

echo
echo "+ Needed $SECONDS seconds"
