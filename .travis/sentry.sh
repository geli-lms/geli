#!/usr/bin/env bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

echo
echo "+++ Sentry +++"
echo

if [[ "$TRAVIS_PULL_REQUEST" == "false" && ("$TRAVIS_BRANCH" == "master" || "$TRAVIS_BRANCH" == "develop") ]]; then
    echo "+ Downloading and installing sentry-cli"
    export INSTALL_DIR=$(pwd)
    curl -sL https://sentry.io/get-cli/ | bash

    if [[ "${TRAVIS_BRANCH}" == "master" ]]; then SENTRY_PROJECT="production"; else SENTRY_PROJECT="staging"; fi
    echo "+ Sentry Project: ${SENTRY_PROJECT}"

    echo "+ Creating Sentry release and uploading source maps"
    ./sentry-cli releases -o geli -p $SENTRY_PROJECT new $TRAVIS_COMMIT
    ./sentry-cli releases -o geli -p $SENTRY_PROJECT files $TRAVIS_COMMIT upload-sourcemaps app/webFrontend/dist
    ./sentry-cli releases -o geli -p $SENTRY_PROJECT files $TRAVIS_COMMIT upload-sourcemaps --url-prefix /usr/src/app api/build
else
  	echo -e "${YELLOW}+ Skipping Sentry - not on develop or master${NC}"
fi
