"use strict";
const fs = require('fs');
const nlf = require('nlf');

const LICENSE_FILE_NAME = 'nlf-licenses';
const PATH_API = '../api/';
const PATH_APP_WEB = '../app/webFrontend/';

console.log('\n+++ Starting license js\n');

// API
console.log('+ starting api crawl');
nlf.find({
  directory: PATH_API,
  production: true,
  depth: 1
}, (err, data) => {
  console.log('+ api: polish json');
  let json = JSON.stringify(
    {data: polishJson(data)}
  );

  fs.writeFile(
    PATH_API + LICENSE_FILE_NAME + '.json',
    json,
    'utf8',
    () => console.log('+ api: wrote json')
  );
});

// WEB_APP
console.log('+ starting appWeb crawl');
nlf.find({
  directory: PATH_APP_WEB,
  production: true,
  depth: 1
}, (err, data) => {
  console.log('+ appWeb: polish json');
  let json = polishJson(data);

  let out = '';
  json.forEach((value, i, arr) => {
    // TODO BUILD STRING
  });

  // TODO WRITE OUT TO dependencies.ts
});

// FUNCTIONS
function polishJson(raw) {
  let out = [];
  raw.forEach((val) => {
    out.push({
      name: val.name,
      version: val.version,
      repository: val.repository,
      license: val.licenseSources.package.sources[0].license,
      devDependency: false
    });
  });
  return out;
}

