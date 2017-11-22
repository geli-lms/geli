#!/usr/bin/env bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

function tag_and_push_api_and_web {
    docker tag hdafbi/geli-api hdafbi/geli-api:${1}
    docker tag hdafbi/geli-web-frontend hdafbi/geli-web-frontend:${1}
    docker push hdafbi/geli-api:${1}
    docker push hdafbi/geli-web-frontend:${1}
}

echo
echo "+++ Run docker build and publish. +++"
echo
if [ "$TRAVIS_BRANCH" == "master" ] || [ "$TRAVIS_BRANCH" == "develop" ]; then
  if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "+ build docker images";
    echo "+ prune dev-dependencies"
    ( cd api && npm prune --production )
    docker build -t hdafbi/geli-api:latest -f .docker/api/Dockerfile .
    docker build -t hdafbi/geli-web-frontend:latest -f .docker/web-frontend/Dockerfile .
    
    echo "+ publish docker images";
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
    echo "+ => tagged: latest"
    tag_and_push_api_and_web "latest"
    echo "+ => tagged: ${TRAVIS_BRANCH}"
    tag_and_push_api_and_web ${TRAVIS_BRANCH}
  else
    echo -e "${YELLOW}+ WARNING: pull request #$TRAVIS_PULL_REQUEST -> skipping docker build and publish${NC}";
  fi
else
  if [ -n "${TRAVIS_TAG}" ]; then
    echo "+ this is a tagged build: $TRAVIS_TAG";
    echo "+ build docker images";
    echo "+ prune dev-dependencies"
    ( cd api && npm prune --production )
    docker build -t hdafbi/geli-api:$TRAVIS_TAG -f .docker/api/Dockerfile .
    docker build -t hdafbi/geli-web-frontend:$TRAVIS_TAG -f .docker/web-frontend/Dockerfile .
    
    echo "+ publish docker images";
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
    echo "+ => tagged: ${TRAVIS_TAG}"
    tag_and_push_api_and_web ${TRAVIS_TAG}

    echo "+ retrieve semver-parts of tag"
    . ${DIR}/_semver.sh
    MAJOR=0;MINOR=0;PATCH=0;SPECIAL=""
    semverParseInto ${TRAVIS_TAG} MAJOR MINOR PATCH SPECIAL
    REAL_MAJOR="v${MAJOR}"
    REAL_MINOR="v${MAJOR}.${MINOR}"
    REAL_PATCH="v${MAJOR}.${MINOR}.${PATCH}"

    if [ "${SPECIAL}" ]; then
        echo -e "${YELLOW}+ WARNING: tag '${TRAVIS_TAG}' has special-part '${SPECIAL}'${NC}"
        echo -e "${YELLOW}+ WARNING: will NOT tag Major '${REAL_MAJOR}' and Minor '${REAL_MINOR}', only the full tag '${TRAVIS_TAG}'${NC}"
    else
        echo "+ tag images"
        echo -e "${YELLOW}+ WARNING: Major tagging is currently not implemented, will skip major tagging"
        if [ "there isnt a higher version of this major" = "" ]; then
            # TODO: Check Docker api for versions
            echo "+ => tagged Major: ${REAL_MAJOR}"
            tag_and_push_api_and_web REAL_MAJOR
        fi
        echo "+ => tagged Minor: ${REAL_MINOR}"
        tag_and_push_api_and_web REAL_MINOR
    fi
  else
    echo -e "${YELLOW}+ WARNING: branch $TRAVIS_BRANCH is not whitelisted -> skipping docker build and publish${NC}";
  fi
fi
