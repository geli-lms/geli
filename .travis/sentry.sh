#!/usr/bin/env bash

#if [ "$TRAVIS_PULL_REQUEST" == "false" ] && ([ "$TRAVIS_BRANCH" == "master" ] || [ "$TRAVIS_BRANCH" == "develop" ]); then
if [[ "$TRAVIS_PULL_REQUEST" == "true" || ("$TRAVIS_BRANCH" == "master" || "$TRAVIS_BRANCH" == "develop" || "$TRAVIS_BRANCH" == "feature/427-Improve-Sentry-error-handling") ]]; then
    echo "Downloading and installing sentry-cli"
    export INSTALL_DIR=$(pwd)
    curl -sL https://sentry.io/get-cli/ | bash

    echo "Creating Sentry release and uploading source maps"
    ./sentry-cli releases -o geli -p staging new $TRAVIS_COMMIT
    ./sentry-cli releases -o geli -p staging files $TRAVIS_COMMIT upload-sourcemaps app/webFrontend/dist
fi
