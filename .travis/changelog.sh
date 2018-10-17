#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# shellcheck source=_shared-vars.sh
. "${DIR}/_shared-vars.sh"

if [[ ${TRAVIS_PULL_REQUEST} == false ]]; then
  echo -e "${GREEN}+ Skip changelog check (no pull request)"
  exit 0;
fi

if [[ ${TRAVIS_PULL_REQUEST_BRANCH} =~ ^dependabot/npm_and_yarn/(.+)$ ]]; then
  echo -e "${GREEN}+ Skip changelog check (dependency update)"
  exit 0;
fi

if [[ ${TRAVIS_BRANCH} == "develop" ]]; then
  echo "+ Pull Request from ${TRAVIS_PULL_REQUEST_BRANCH} to ${TRAVIS_BRANCH}"
  RESULT=$(curl --silent https://raw.githubusercontent.com/geli-lms/geli/"${TRAVIS_BRANCH}"/CHANGELOG.md \
  | diff CHANGELOG.md - \
  | grep -P '^< - .{8,}' - -q)

  if [[ ${RESULT} == 0 ]]; then
    ech -e "${GREEN}+ Update in CHANGELOG.md found"
    exit 0
  else
    echo -e "${RED}+ ERROR: No Update in CHANGELOG.md found!"
    echo "+ Please check if a line was added in the CHANGELOG.md."
    exit 1
   fi
fi

if [[ ${TRAVIS_BRANCH} == "master" ]]; then
  echo "+ Pull Request from ${TRAVIS_PULL_REQUEST_BRANCH} to ${TRAVIS_BRANCH}"
  RESULT=$(curl --silent https://raw.githubusercontent.com/geli-lms/geli/"${TRAVIS_BRANCH}"/CHANGELOG.md \
  | diff CHANGELOG.md - \
  | grep -P '^< ## \[\[\d{1,3}\.\d{1,3}\.\d{1,3}\].*\] - \d{4}-\d{2}-\d{2} - .{10,}' - -q)

  if [[ ${RESULT} != 0 ]]; then
    echo -e "${GREEN}+ Update in CHANGELOG.md found"
    exit 0
  else
    echo -e "${RED}+ ERROR: No Update in CHANGELOG.md found!"
    echo "+ Please check if a new version was added in the CHANGELOG.md."
    echo "+ Or a new section for the next release was added."
    exit 1
  fi
fi

echo -e "${YELLOW}+ Pull Request but not against develop or master. No update for CHANGELOG.md required."
exit 0
