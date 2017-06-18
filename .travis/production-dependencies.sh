#!/bin/bash

DIRS=( "api" )
TARGET=prodDeps

echo "+++ Generate production ready dependencies +++"

echo "+ go to project root"
cd ..
echo "+ now working in $(pwd)"

echo "+ create folder $TARGET"
mkdir -p $TARGET

echo "+ copy package.json and npm-shrinkwrap.json to new folder (rm content, if already exists)"
for d in "${DIRS[@]}"
do
  echo "  + $d"
  mkdir -p $TARGET/$d
  rm -rf $TARGET/$d/*
  cp $d/package.json $d/npm-shrinkwrap.json $TARGET/$d
done

echo "+ install dependencies"
CWD=$(pwd)
for d in "${DIRS[@]}"
do
  echo "  + $d"
  cd $TARGET/$d
  npm install --production
  cd $CWD
done
