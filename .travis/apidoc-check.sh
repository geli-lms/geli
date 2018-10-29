#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh


echo
echo "+++ Check API-Doc +++"
echo

if ([ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "develop" ]) || ([ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "master" ]); then
  echo "+ detected pull request from ($TRAVIS_PULL_REQUEST_BRANCH) to $TRAVIS_BRANCH"
  cd api
  npm run apidoc
else
  echo -e "${YELLOW}+ WARNING: No Pull Request agiainst Develop or Master -> skipping automate api doc check${NC}";
fi
