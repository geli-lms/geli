#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

echo
echo "+++ Check if current version already used"
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

        PACKAGE_VERSION=$(cat api/package.json \
            | grep version \
            | head -1 \
            | awk -F: '{ print $2 }' \
            | sed 's/[",]//g' \
            )

        while read -r line; do
            # Check if line beginns with a "v"
            if [[ $line == v* ]]; then
                semverEQ "$line" "$PACKAGE_VERSION"
                
                # Check if same
                if [[ $? == 0 ]]; then
                    echo -e "${RED}+ ERROR: Version '$line' already exists on DockerHub${NC}"
                    exit 1
                fi
            fi
        done <<< "$EXISTING_TAGS"

        echo -e "${GREEN}+ Everything is fine, have a great day :)${NC}"
    else
        echo -e "${YELLOW}+ WARNING: is NO pull request -> skipping${NC}";
    fi
else
    echo -e "${YELLOW}+ WARNING: branch $TRAVIS_BRANCH is not whitelisted -> skipping version check${NC}";
fi
