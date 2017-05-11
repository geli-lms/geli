#!/usr/bin/env bash
YELLOW='\033[0;33m'
NC='\033[0m'

echo
echo "+++ Run docker build and publish. +++"
echo
if [ "$TRAVIS_BRANCH" == "master" ] || [ "$TRAVIS_BRANCH" == "develop" ]; then
  if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    echo "build docker images";
    docker build -t hdafbi/geli-api:latest -f .docker/api/Dockerfile .
    docker tag hdafbi/geli-api hdafbi/geli-api:$TRAVIS_BRANCH
    docker build -t hdafbi/geli-web-frontend:latest -f .docker/web-frontend/Dockerfile .
    docker tag hdafbi/geli-web-frontend hdafbi/geli-web-frontend:$TRAVIS_BRANCH

    echo "publish docker images";
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
    docker push hdafbi/geli-api;
    docker push hdafbi/geli-api:$TRAVIS_BRANCH;
    docker push hdafbi/geli-web-frontend;
    docker push hdafbi/geli-web-frontend:$TRAVIS_BRANCH;
  else
    echo -e "${YELLOW}+ WARNING: pull request #$TRAVIS_PULL_REQUEST -> skipping docker build and publish${NC}";
  fi
else
  echo -e "${YELLOW}+ WARNING: branch $TRAVIS_BRANCH is not whitelisted -> skipping docker build and publish${NC}";
fi
