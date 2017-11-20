#!/usr/bin/env bash

# Import shared vars
. ./_shared-vars.sh

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
    docker tag hdafbi/geli-api hdafbi/geli-api:$TRAVIS_BRANCH
    docker build -t hdafbi/geli-web-frontend:latest -f .docker/web-frontend/Dockerfile .
    docker tag hdafbi/geli-web-frontend hdafbi/geli-web-frontend:$TRAVIS_BRANCH

    echo "+ publish docker images";
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
    docker push hdafbi/geli-api;
    docker push hdafbi/geli-api:$TRAVIS_BRANCH;
    docker push hdafbi/geli-web-frontend;
    docker push hdafbi/geli-web-frontend:$TRAVIS_BRANCH;
  else
    echo -e "${YELLOW}+ WARNING: pull request #$TRAVIS_PULL_REQUEST -> skipping docker build and publish${NC}";
  fi
else
  if [ -n "${TRAVIS_TAG}" ]; then
    echo "+ This is a tagged build: $TRAVIS_TAG";
    echo "+ build docker images";
    echo "+ prune dev-dependencies"
    ( cd api && npm prune --production )
    docker build -t hdafbi/geli-api:$TRAVIS_TAG -f .docker/api/Dockerfile .
    docker build -t hdafbi/geli-web-frontend:$TRAVIS_TAG -f .docker/web-frontend/Dockerfile .
    
    echo "+ publish docker images";
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
    docker push hdafbi/geli-api:$TRAVIS_TAG;
    docker push hdafbi/geli-web-frontend:$TRAVIS_TAG;
    
    echo "+ retrieve semver-parts of tag"
    . ./_semver.sh
    MAJOR=0
    MINOR=0
    PATCH=0
    SPECIAL=""
    semverParseInto $TRAVIS_TAG MAJOR MINOR PATCH SPECIAL

    if [ -z "${SPECIAL}" ]; then
        echo "+ tag ${TRAVIS_TAG} has special-part ${SPECIAL}"
        echo "+ will NOT tag Major ${MAJOR} and Minor ${MAJOR}.${MINOR}, only the full tag"
    else
        echo "+ tag images"
        REAL_MAJOR=$MAJOR
        REAL_MINOR=$MAJOR.$MINOR
        echo "+ => Major: ${REAL_MAJOR}"
        tag_and_push_api_and_web REAL_MAJOR
        echo "+ => Minor: ${REAL_MINOR}"
        tag_and_push_api_and_web REAL_MINOR
    fi
  else
    echo -e "${YELLOW}+ WARNING: branch $TRAVIS_BRANCH is not whitelisted -> skipping docker build and publish${NC}";
  fi
fi
