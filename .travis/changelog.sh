#!/bin/bash

# Path to this file
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path the script was called from
IPWD="$(pwd)"
# Import shared vars
. ${DIR}/_shared-vars.sh

echo
echo "+++ Check if changelog was updated +++"
echo


if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "develop" ]; then
  echo "+ detected pull request from ($TRAVIS_PULL_REQUEST_BRANCH) to $TRAVIS_BRANCH"
  curl --silent https://raw.githubusercontent.com/geli-lms/geli/$TRAVIS_BRANCH/CHANGELOG.md \
  | diff CHANGELOG.md - \
  | grep -P '^< - .{8,}' - -q

  if [[ $? == 0 ]]; then
    echo -e "${GREEN}+ Update in CHANGELOG.md found, exit${NC}"
  else
    echo -e "${RED}+ ERROR: No Update in CHANGELOG.md found!"
    echo -e "+ Please check if a line was added in the CHANGELOG.md.${NC}"
    exit 1
  fi
elif [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then
  echo "+ detected pull request from ($TRAVIS_PULL_REQUEST_BRANCH) to $TRAVIS_BRANCH"
  curl --silent https://raw.githubusercontent.com/geli-lms/geli/$TRAVIS_BRANCH/CHANGELOG.md \
  | diff CHANGELOG.md - \
  | grep -P '^< ## \[\[\d{1,3}\.\d{1,3}\.\d{1,3}\].*\] - \d{4}-\d{2}-\d{2} - .{10,}' - -q

  if [[ $? == 0 ]]; then
    echo -e "${GREEN}+ Update in CHANGELOG.md found, exit${NC}"
  else
    echo -e "${RED}+ ERROR: No Update in CHANGELOG.md found!"
    echo -e "+ Please check if a new version was added in the CHANGELOG.md."
    echo -e "+ Or a new section for the next release was added${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}+ WARNING: No Pull Request agiainst Develop or Master -> skipping automate changelog checking${NC}";
fi
