#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

# Variables
DEBUG=false

CSV_FILE="nlf-licenses"
FT_APACHE=".apache.csv"
FT_ALL=".csv"
FT_PROD=".prod.csv"

# Functions
function npm_package_is_installed {
  local return_=1
  ls node_modules | grep $1 > /dev/null 2>&1 || { local return_=0; }
  echo "$return_"
}

# Begin of code
echo
echo "+++ Run NLF to search for Apache-Licenses +++"
echo

echo "+ checking if on branch -develop- and no pull-request"
if ( [ "$TRAVIS_BRANCH" != "develop" ] || [ "$TRAVIS_PULL_REQUEST" != "false" ] ) && [ ! $DEBUG ]; then
  echo -e "${YELLOW}+ WARNING: not on branch -develop- and/or a pull request${NC}"
  exit 1
fi

echo "+ checking if nlf is installed"
cd ${DIR}
if [ $(npm_package_is_installed nlf) == 0 ]; then
  echo -e "${RED}+ ERROR: nlf is not installed, please add nlf to the .travis/package.json${NC}"
  exit 1
fi
cd ${IPWD}

echo + going to folder api
cd api

echo + crawling licenses from api
echo + ... all
${BIN_PATH_FULL}/nlf --csv > $CSV_FILE$FT_ALL
echo + ... production only
${BIN_PATH_FULL}/nlf --csv -d > $CSV_FILE$FT_PROD

echo + copy results to project root
cp $CSV_FILE$FT_ALL ../$CSV_FILE$FT_ALL
cp $CSV_FILE$FT_PROD ../$CSV_FILE$FT_PROD

echo + going to folder app/webFrontend
cd ../app/webFrontend

echo + crawling licenses from app/webFrontend
# append frontend licenses to existing csv; we have to skip the first line (header)
echo + ... all
${BIN_PATH_FULL}/nlf --csv > $CSV_FILE$FT_ALL
# ../../${BIN_PATH_FULL}/nlf-cli.js --csv | awk '{if(NR>1)print}'  >> ../../$CSV_FILE
echo + ... production only
${BIN_PATH_FULL}/nlf --csv -d > $CSV_FILE$FT_PROD

echo + copy results to project root
cat $CSV_FILE$FT_ALL >> ../../$CSV_FILE$FT_ALL
cat $CSV_FILE$FT_PROD >> ../../$CSV_FILE$FT_PROD

echo + going back to root folder
cd ../..

echo
echo + Finished crawling
echo + Printing out found Apache Licenses

# print first line (head => column-titles) of csv
head -1 $CSV_FILE$FT_ALL
echo "-------------------------------------------------------------------------------------------------------------------"

# print rows which contain apache, with the caseinsensitive flag
cat $CSV_FILE$FT_ALL | grep -i "apache" > $CSV_FILE$FT_APACHE
cat $CSV_FILE$FT_APACHE

echo
echo + we have found $(wc -l $CSV_FILE$FT_APACHE) potential modules with the Apache-License.
echo

