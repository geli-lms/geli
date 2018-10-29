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
echo "+++ Run NLF +++"
echo

[ ! "$TRAVIS_PULL_REQUEST" == "false" ] ; IS_PR=$?
( [ "$TRAVIS_BRANCH" == "master" ] || [ "$TRAVIS_BRANCH" == "develop" ] ) ; IS_BRANCH=$?
[ -n "$TRAVIS_TAG" ] ; IS_TAG=$?

IS_PR=$(if [ "$IS_PR" == "0" ]; then echo -n true; else echo -n false; fi)
IS_BRANCH=$(if [ "$IS_BRANCH" == "0" ]; then echo -n true; else echo -n false; fi)
IS_TAG=$(if [ "$IS_TAG" == "0" ]; then echo -n true; else echo -n false; fi)

echo -e "+ IS_PR     => $IS_PR\t($TRAVIS_PULL_REQUEST)"
echo -e "+ IS_BRANCH => $IS_BRANCH\t($TRAVIS_BRANCH)"
echo -e "+ IS_TAG    => $IS_TAG\t($TRAVIS_TAG)"
echo

if ( [ "$IS_BRANCH" == "true" ] && [ "$IS_PR" == "false" ] ) || [ "$IS_TAG" == "true" ]; then
  echo "+ checking if nlf is installed"
  cd ${DIR}
  if [ $(npm_package_is_installed nlf) == 0 ]; then
    echo -e "${RED}+ ERROR: nlf is not installed, please add nlf to the .travis/package.json${NC}"
    exit 1
  fi
  cd ${IPWD}

  echo "+ run node"
  echo

  cd ${DIR}
  node license-crawler.js
  cd ${IPWD}
else
  echo -e "${YELLOW}+ WARNING: Branch not whitelisted OR PullRequest${NC}";
  echo "+ will write dummy data"
  echo "{
  \"data\": [
    {\"name\":\"NO-DEP\",\"version\":\"0.0.1\",\"repository\":\"https://exmaple.com\",\"license\":\"MIT\",\"devDependency\":false},
    {\"name\":\"NO-DEP\",\"version\":\"0.0.1\",\"repository\":\"https://exmaple.com\",\"license\":\"MIT\",\"devDependency\":true}
  ]
}" > api/nlf-licenses.json
  FE_DATA="
new Dependency('NO-DEP', '0.0.1', 'https://example.com', 'MIT', false),
new Dependency('NO-DEP', '0.0.1', 'https://example.com', 'MIT', true)
  "
  FE_DATA=`echo $FE_DATA | tr '\n' "\\n"`
  sed -i "s!// DEPENDENCY_REPLACE!$FE_DATA!" app/webFrontend/src/app/about/licenses/dependencies.ts
fi

echo
echo "+ finished"
