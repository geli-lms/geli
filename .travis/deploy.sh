#!/usr/bin/env bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

echo
echo "+++ Run automate deployment script. +++"
echo
if [ "$TRAVIS_BRANCH" == "master" ] || [ "$TRAVIS_BRANCH" == "develop" ]; then
  if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "+ Sending deploy webhook"
    echo "+ Waiting for response..."
    curl --connect-timeout 60 --max-time 600 --data "key=$DEPLOY_SECRET-$TRAVIS_BRANCH" $DEPLOY_URL
  else
    echo -e "${YELLOW}+ WARNING: pull request #$TRAVIS_PULL_REQUEST -> skipping automate deployment${NC}";
  fi
else
  echo -e "${YELLOW}+ WARNING: branch $TRAVIS_BRANCH is not whitelisted -> skipping automate deployment${NC}";
fi
