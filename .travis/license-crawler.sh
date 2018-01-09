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

echo "+ 0 => true ; 1 => false"
echo "+ IS_PR     => $IS_PR ($TRAVIS_PULL_REQUEST)"
echo "+ IS_BRANCH => $IS_BRANCH ($TRAVIS_BRANCH)"
echo "+ IS_TAG    => $IS_TAG ($TRAVIS_TAG)"

if ( [ "$IS_BRANCH" == "0" ] && [ "$IS_PR" == "1" ] ) || [ "$IS_TAG" == "0" ]; then
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
  echo "
{
\"data\": [
  {\"name\":\"NO-DEP\",\"version\":\"0.0.1\",\"repository\":\"https://exmaple.com\",\"license\":\"MIT\",\"devDependency\":false},
  {\"name\":\"NO-DEP\",\"version\":\"0.0.1\",\"repository\":\"https://exmaple.com\",\"license\":\"MIT\",\"devDependency\":true},
]
}
  " > api/nlf-licenses.json
  FE_DATA="
new Dependency('NO-DEP', '0.0.1', 'https://example.com', 'MIT', false),
new Dependency('NO-DEP', '0.0.1', 'https://example.com', 'MIT', true)
  "
  FE_DATA=`echo $FE_DATA | tr '\n' "\\n"`
  sed -i "s!// DEPENDENCY_REPLACE!$FE_DATA!" app/webFrontend/src/app/about/licenses/dependencies.ts
fi

echo
echo "+ finished"
