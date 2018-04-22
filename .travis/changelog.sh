#!/bin/bash

echo
echo "+++ Check if changelog was updatet"
echo


if [ "$TRAVIS_PULL_REQUEST" != "false" ] && [ "$TRAVIS_BRANCH" != "master" ] && [ "$TRAVIS_BRANCH" != "develop" ]; then
  curl https://raw.githubusercontent.com/h-da/geli/develop/CHANGELOG.md --output CHANGELOG.file
  diff ../CHANGELOG.md CHANGELOG.file > diff.file

  if grep -P '^< - .{8,100}' -q diff.file; then
     echo "Update in CHANGELOG.md found"
  else
     echo "No Update in CHANGELOG.md found exit"
     exit 1
  fi
fi
