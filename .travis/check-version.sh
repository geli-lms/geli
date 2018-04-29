#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

PATHS_TO_CHECK=("api" "app/webFrontend")

echo
echo "+++ Check if current version already used +++"
echo

# If is PR against master
if [ "$TRAVIS_BRANCH" == "master" ]; then
    if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
        . ${DIR}/_semver.sh

        EXISTING_TAGS=$( \
            wget -q https://registry.hub.docker.com/v1/repositories/hdafbi/geli-api/tags -O - \
            | sed -e 's/[][]//g' -e 's/"//g' -e 's/ //g' \
            | tr '}' '\n' \
            | awk -F: '{print $3}' \
            )

        for CUR_PATH in "${PATHS_TO_CHECK[@]}"
        do
            echo "+ checking '$CUR_PATH/package.json'"

            PACKAGE_VERSION=$(cat "$CUR_PATH/package.json" \
                | grep version \
                | head -1 \
                | awk -F: '{ print $2 }' \
                | sed 's/[",]//g' \
                )

            while read -r LINE; do
                # Check if line beginns with a "v"
                if [[ $LINE == v* ]]; then
                    semverEQ "$LINE" "$PACKAGE_VERSION"
                    
                    # Check if same
                    if [[ $? == 0 ]]; then
                        echo -e "${RED}+ ERROR: Version '$LINE' already exists on DockerHub${NC}"
                        exit 1
                    fi
                fi
            done <<< "$EXISTING_TAGS"

            echo -e "${GREEN}+ package.json is ok${NC}"
        done

        echo -e "${GREEN}+ Everything is fine, have a great day :)${NC}"
    else
        echo -e "${YELLOW}+ WARNING: is NO pull request -> skipping${NC}";
    fi
else
    echo -e "${YELLOW}+ WARNING: branch $TRAVIS_BRANCH is not whitelisted -> skipping version check${NC}";
fi
