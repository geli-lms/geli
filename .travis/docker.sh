#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" == "master" ] || [ "$TRAVIS_BRANCH" == "develop" ]; then
    docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD";
    docker push hdafbi/geli-api;
    docker push hdafbi/geli-web-frontend;
fi
