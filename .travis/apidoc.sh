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
if [[ "$TRAVIS_BRANCH" == "master" ]] || [[ -n "$TRAVIS_TAG" ]]; then
  if [[ "$TRAVIS_PULL_REQUEST" == "false" ]] || [[ -n "$TRAVIS_TAG" ]]; then
    if [[ -z $GITHUB_DOCU_TOKEN ]]; then
        echo -e "${RED}+ ERROR: NO GITHUB_DOCU_TOKEN ENVVAR DEFINED. GO TO TRAVIS-SETTINGS AND DEFINE ONE.${NC}"
        exit 1
    fi

    GITHUB_URL="github.com/geli-lms/geli-docs.git"
    GITHUB_FOLDER="geli-docs"
    DOCU_SOURCE="apidocs"

    echo "+ Generate API-Doc"
    cd api
    npm run apidoc
    echo "+ Publish API-Doc to $GITHUB_URL"

    echo "+ git set user.name" ; git config --global user.name 'Travis'
    echo "+ git set user.email" ; git config --global user.email 'travis@travis-ci.org'

    echo "+ Clone $GITHUB_FOLDER"
    git clone https://$GITHUB_URL -q -b master $GITHUB_FOLDER &>/dev/null

    echo "+ Clear geli-docs"
    find $GITHUB_FOLDER | grep -v -E "$GITHUB_FOLDER$|$GITHUB_FOLDER/.git$|$GITHUB_FOLDER/.git/" | xargs rm -rf

    echo "+ Copy files"
    cp -rT ./$DOCU_SOURCE ./$GITHUB_FOLDER

    cd $GITHUB_FOLDER
    echo "+ git add"
    git add --all &>/dev/null
    echo "+ git commit"
    git commit -m "Travis build: $TRAVIS_BUILD_NUMBER" &>/dev/null

    if [[ -n "$TRAVIS_TAG" ]]; then
        echo "+ git tag" ; git tag -a $TRAVIS_TAG -m "Release $TRAVIS_TAG"
    else
        echo -e "${YELLOW}+ skipping: git tag - not tagged build${NC}"
    fi

    echo "+ git push"
    git push --follow-tags -q https://micpah:$GITHUB_DOCU_TOKEN@$GITHUB_URL &>/dev/null
  else
    echo -e "${YELLOW}+ WARNING: pull request #$TRAVIS_PULL_REQUEST -> skipping api-doc${NC}";
  fi
else
  echo -e "${YELLOW}+ WARNING: branch $TRAVIS_BRANCH is not whitelisted -> skipping api-doc${NC}";
fi
