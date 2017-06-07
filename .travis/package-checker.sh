#!/bin/bash

PATH_BIN=".travis/node_modules/.bin/david"

echo
echo "+++ David dependency checker +++"
echo

cd .travis
npm i david
cd ..

echo "+ checking .travis"
$PATH_BIN --package .travis/package.json

echo "+ checking api"
$PATH_BIN --package api/package.json

echo "+ checking app/webFrontend"
$PATH_BIN --package app/webFrontend/package.json

