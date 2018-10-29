#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh
SECONDS=0

echo
echo "+++ Check if this is prod-build"
echo

cd app/webFrontend

export NODE_OPTIONS=--max_old_space_size=4096 # allow up to 4gb for ng build

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    echo "+++ in PR; do not build sourcemaps"
    npm run build-pr
else
    echo "+++ is no PR; build with sourcemaps"
    npm run build
fi

echo
echo "+ Needed $SECONDS Seconds"
