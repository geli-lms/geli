#!/bin/bash

CSV_FILE="nlf-licenses.csv"
CSV_FILE_APACHE="nlf-licenses.apache.csv"

echo
echo +++ Run NLF to search for Apache-Licenses +++
echo

echo + going to folder api
cd api

echo + installing nlf
npm install nlf

echo + crawling licenses from api
./node_modules/nlf/bin/nlf-cli.js --csv > ../$CSV_FILE

echo + going to folder app/webFrontend
cd ../app/webFrontend

echo + crawling licenses from app/webFrontend
# append frontend licenses to existing csv; we have to skip the first line (header)
../../api/node_modules/nlf/bin/nlf-cli.js --csv | awk '{if(NR>1)print}'  >> ../../$CSV_FILE

echo
echo + Finished crawling
echo + Printing out found Apache Licenses

# print first line (head => column-titles) of csv
tail -p $CSV_FILE

# print rows which contain apache, with the caseinsensitive flag
cat $CSV_FILE | grep -i "apache" > $CSV_FILE_APACHE
cat $CSV_FILE_APACHE

echo + we have found $(wc -l $CSV_FILE_APACHE) potential modules with the Apache-License.

