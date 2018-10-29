#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# shellcheck source=_shared-vars.sh
. "${DIR}/_shared-vars.sh"

echo
echo "+++ Check if changelog was updated +++"
echo

if [[ ${TRAVIS_PULL_REQUEST} == false ]]; then
  echo -e "${GREEN}+ Skip changelog check (no pull request)${NC}"
  exit 0;
fi

if [[ ${TRAVIS_PULL_REQUEST_BRANCH} =~ ^dependabot/npm_and_yarn/(.+)$ ]]; then
  echo -e "${GREEN}+ Skip changelog check (dependency update)${NC}"
  exit 0;
fi

if [[ ${TRAVIS_BRANCH} == "develop" ]]; then
  echo "+ Pull Request from ${TRAVIS_PULL_REQUEST_BRANCH} to ${TRAVIS_BRANCH}"
  curl --silent "https://raw.githubusercontent.com/geli-lms/geli/${TRAVIS_BRANCH}/CHANGELOG.md" \
  | diff CHANGELOG.md - \
  | grep -P '^< - .{8,}' - -q
  RESULT=$?;

  if [[ ${RESULT} -eq 0 ]]; then
    echo -e "${GREEN}+ Update in CHANGELOG.md found${NC}"
    exit 0
  else
    echo -e "${RED}+ ERROR: No Update in CHANGELOG.md found!${NC}"
    echo "+ Please check if a line was added in the CHANGELOG.md."
    exit 1
   fi
fi

if [[ ${TRAVIS_BRANCH} == "master" ]]; then
  echo "+ Pull Request from ${TRAVIS_PULL_REQUEST_BRANCH} to ${TRAVIS_BRANCH}"
  curl --silent "https://raw.githubusercontent.com/geli-lms/geli/${TRAVIS_BRANCH}/CHANGELOG.md" \
  | diff CHANGELOG.md - \
  | grep -P '^< ## \[\[\d{1,3}\.\d{1,3}\.\d{1,3}\].*\] - \d{4}-\d{2}-\d{2} - .{10,}' - -q
  RESULT=$?;

  if [[ ${RESULT} -eq 0 ]]; then
    echo -e "${GREEN}+ Update in CHANGELOG.md found${NC}"
    exit 0
  else
    echo -e "${RED}+ ERROR: No Update in CHANGELOG.md found!${NC}"
    echo "+ Please check if a new version was added in the CHANGELOG.md."
    echo "+ Or a new section for the next release was added."
    exit 1
  fi
fi

echo -e "${YELLOW}+ Pull Request but not against develop or master. No update for CHANGELOG.md required.${NC}"
exit 0
