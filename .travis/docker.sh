#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" == "master" ] || [ "$TRAVIS_BRANCH" == "develop" ]; then
  if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
    docker build -t hdafbi/geli-api:latest -f .docker/api/Dockerfile .
    docker tag hdafbi/geli-api hdafbi/geli-api:$TRAVIS_BRANCH
    docker build -t hdafbi/geli-web-frontend:latest -f .docker/web-frontend/Dockerfile .
    docker tag hdafbi/geli-web-frontend hdafbi/geli-web-frontend:$TRAVIS_BRANCH

    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
    docker push hdafbi/geli-api;
    docker push hdafbi/geli-api:$TRAVIS_BRANCH;
    docker push hdafbi/geli-web-frontend;
    docker push hdafbi/geli-web-frontend:$TRAVIS_BRANCH;
  fi
fi
