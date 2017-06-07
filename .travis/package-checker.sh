#!/bin/bash

echo
echo "+++ David dependency checker +++"
echo

npm i --global david

echo "+ checking .travis"
cd .travis
# node_modules/.bin/david
david
echo
cd ..

echo "+ checking api"
cd api
# ../.travis/node_modules/.bin/david
david
echo
cd ..

echo "+ checking app/webFrontend"
cd app/webFrontend
# ../../.travis/node_modules/.bin/david
david
echo
cd ../..
