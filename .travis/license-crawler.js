"use strict";
const fs = require('fs');
const nlf = require('nlf');

const API_PATH = '../api/';
const API_FILE_NAME = 'nlf-licenses';
const WEB_PATH = '../app/webFrontend/';
const WEB_FILE_NAME = 'src/app/about/licenses/dependencies.ts';

const PACKAGE_BLACKLIST = ['geli-api', 'geli-web-frontend', 'rxjs-compat'];
const SEARCH_FOR = '// DEPENDENCY_REPLACE';

console.log('\n+++ Starting license js +++\n');

// API
console.log('+ starting api crawl');
nlf.find({
  directory: API_PATH,
  production: true,
  depth: 1
}, (err, data) => {
  if (err) {
    throw err;
  }
  console.log('+ api: polish json');
  let json = JSON.stringify(
    {data: polishJson(data)}
  );

  fs.writeFile(
    API_PATH + API_FILE_NAME + '.json',
    json,
    'utf8',
    () => console.log('+ api: wrote json')
  );
});

// WEB_APP
console.log('+ starting appWeb crawl');
nlf.find({
  directory: WEB_PATH,
  production: true,
  depth: 1
}, (err, data) => {
  console.log('+ appWeb: polish json');
  let json = polishJson(data);

  let out = '';
  json.forEach((value, i) => {
    if (i > 0) {
      out += ',\n      ';
    }

    let sep = '\', \'';
    out += 'new Dependency(\''
      + value.name + sep
      + value.version + sep
      + value.repository + sep
      + value.license + '\', '
      + value.devDependency
      + ')';
  });

  fs.readFile(WEB_PATH + WEB_FILE_NAME, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }

    fs.writeFile(
      WEB_PATH + WEB_FILE_NAME,
      data.replace(SEARCH_FOR, out),
      'utf8',
      () => console.log(('+ appWeb: wrote file'))
    );
  })
});

// FUNCTIONS
function polishJson(raw) {
  let out = [];
  raw.forEach((val) => {
    if (PACKAGE_BLACKLIST.includes(val.name)) {
      return;
    }

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
