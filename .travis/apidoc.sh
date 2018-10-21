#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# shellcheck source=_shared-vars.sh
. "${DIR}/_shared-vars.sh"

echo
echo "+++ Create and publish API-Doc +++"
echo

if [[ ${TRAVIS_PULL_REQUEST} != false ]]; then
  echo -e "${GREEN}+ Skip api-doc check (pull request)${NC}"
  exit 0;
fi

if [[ -z ${GIT_PRIVATE_KEY} ]]; then
  echo -e "${WARNING}+ No private key (add GIT_PRIVATE_KEY for travis)${NC}"
  exit 1;
fi

GITHUB_URL="git@github.com:geli-lms/geli-docs.git"
GITHUB_DIR="/opt/geli-docs/"

rm -rf ${GITHUB_DIR}
mkdir -p ${GITHUB_DIR}

eval "$(ssh-agent -s)"
ssh-add <(echo "${GIT_PRIVATE_KEY}")

if [[ ${TRAVIS_BRANCH} == "master" ]] || [[ ${TRAVIS_BRANCH} == "develop" ]] || [[ -n ${TRAVIS_TAG} ]]; then
  echo "+ Generate API-Doc"
  cd api || exit 1
  npm run apidoc

  echo "+ Publish API-Doc to ${GITHUB_URL}"
  if [[ ${TRAVIS_BRANCH} == "develop" ]]; then
    git clone ${GITHUB_URL} -b develop ${GITHUB_DIR}
  else
    git clone ${GITHUB_URL} -b master ${GITHUB_DIR}
  fi

  rsync -a -delete apidocs/ ${GITHUB_DIR}
  cd ${GITHUB_DIR} || exit 1

  git config user.name "Travis"
  git config user.email "travis@travis-ci.org"

  git add --all
  git commit -m "Travis build: ${TRAVIS_BUILD_NUMBER}"

  if [[ -n ${TRAVIS_TAG} ]]; then
    git tag -a "${TRAVIS_TAG}" -m "Release ${TRAVIS_TAG}"
  fi

  git push --follow-tags ${GITHUB_URL}
  exit 0
fi

echo -e "${YELLOW}+ Branch not master or develop and no tag. Nothing todo.${NC}"
exit 0
