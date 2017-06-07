#!/bin/bash

echo
echo "+++ David dependency checker +++"
echo

npm i david

echo "+ checking .travis"
cd .travis
pwd
node_modules/.bin/david
# david
echo
cd ..

echo "+ checking api"
cd api
pwd
../.travis/node_modules/.bin/david
# david
echo
cd ..

echo "+ checking app/webFrontend"
cd app/webFrontend
pwd
../../.travis/node_modules/.bin/david
# david
echo
cd ../..
