#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

echo
echo "+++ Create and publish API-Doc +++"
echo
if [ "$TRAVIS_BRANCH" == "master" ] || [ "$TRAVIS_BRANCH" == "develop" ]; then
  if [ ! "$TRAVIS_PULL_REQUEST" == "false" ]; then
    if [[ -z $GITHUB_TOKEN ]]; then
        echo "${RED}+ ERROR: NO GITHUB_TOKEN ENVVAR DEFINED. GO TO TRAVIS-SETTINGS AND DEFINE ONE.${NC}"
        exit 1
    fi

    echo "+ Generate API-Doc"
    cd api
    npm run apidoc
    echo "+ Publish API-Doc to h-da/geli-doc"
    ls -lah ./ ./apidocs # for debug only
    cd apidocs
    echo "+ git init" ; git init
    echo "+ git checkout" ; git checkout -b gh-pages
    echo "+ git add" ; git add . &>/dev/null
    echo "+ git commit" ; git -c user.name='Travis' -c user.email='travis@travis-ci.org' commit -m 'Travis build: $TRAVIS_BUILD_NUMBER'
    echo "+ git push" ; git push -f -q https://micpah:$GITHUB_TOKEN@github.com/h-da/geli-docs master &>/dev/null
  else
    echo -e "${YELLOW}+ WARNING: pull request #$TRAVIS_PULL_REQUEST -> skipping api-doc${NC}";
  fi
else
  echo -e "${YELLOW}+ WARNING: branch $TRAVIS_BRANCH is not whitelisted -> skipping api-doc${NC}";
fi
