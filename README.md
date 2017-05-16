# Great E-Learning Informatics (geli)

[![NodeJS Version](https://img.shields.io/badge/nodeJS-7.9-blue.svg)](https://nodejs.org/en)
[![MongoDB Version](https://img.shields.io/badge/mongoDB-3.4-blue.svg)](https://www.mongodb.com/download-center#community)
[![GitHub release](https://img.shields.io/github/release/h-da/geli.svg)](https://github.com/h-da/geli/releases)
[![Build Status](https://travis-ci.org/h-da/geli.svg?branch=develop)](https://travis-ci.org/h-da/geli)

[![Dependency Checker](https://david-dm.org/h-da/geli.svg)](https://david-dm.org/h-da/geli)
[![Coverage Status](https://coveralls.io/repos/github/h-da/geli/badge.svg?branch=develop)](https://coveralls.io/github/h-da/geli?branch=develop)
[![Gitter chat](https://badges.gitter.im/h-da/geli.png)](https://gitter.im/mpse-geli/Lobby)

---

This project aims to develop a Open-Source platform for E-Learning in computer science.
We want to have an API, so Apps and other "Frontends" can be added easily.

This project is mainly developed by master-students of the University of Applied Science in Darmstadt, Germany.
If you want to support this project, just say hello on Gitter.

---

# Usage with Vagrant
To use Vagrant for the development download VirtualBox, install it and then do the same with vagrant.
After that open the e.g. __git bash__ _AS ADMIN_ and go to the project root. Now run `vagrant up`.

After everything is installed and all npm dependencies are downloaded you can connect to the VirtualBox
via `vagrant ssh`. The Ports 4200 and 27017 are forwarded to your host system. Just type localhost:4200 in your
browser.

## Start services
To start the backend ssh into the VM with `vagrant ssh` and run the commands seen under [Run app](#run-app).

To start the frontend ssh into VM with a second shell and run the commands seen under [Development server](#development-server).

# Usage with Docker
You need `docker` and `docker-compose`.

## Installing dependencies
You can install dependencies by running the following commands from the project root.

    docker-compose run --rm --no-deps api npm install
    docker-compose run --rm --no-deps web-frontend npm install
    
## Running the application
After installing the dependencies you can run the application by executing:

    docker-compose up
    
You can access the web frontend on your host machine at `http://localhost:4200`.

The API will be proxied to `http://localhost:4200/api` and MongoDB is accessible at `localhost:27017`.

# Backend

```diff
- This content may not be up to date... we try to update it asap.
```

## Installation

1. Open a Terminal and type following:

```bash
cd /path/to/project/api
npm install
```

## Run APP

```bash
cd /api
npm start-dev
```

or `nodemon -L index.js` to 'poll'. You can use this if you are using vagrant or docker on windows/mac.

## Testing

1. Copy `config/test.dist.json` to `config/test.json` and change it accordingly.
2. To execute the tests:

```bash
cd /api
npm test
```

# Frontend
```diff
- This content may not be up to date... we try to update it asap.
```
## Getting started

## Angular CLI (globally required):

Run `npm install -g @angular/cli@latest` to install the latest version of the angular cli globally.

## How to use:

1. Go to `app/webFrontend/`
2. Run `npm install` in the root folder of the app
3. Run `npm start` to use angular-cli serve

If you have problems with the angular-cli version try following:

1. Create a new anglular-cli projekt `ng new example-app`
2. Copy the folder ´/src´ from this project to the new project
3. Run `ng serve`

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.17.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). 
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Contributuion

Please have a look at [CONTRIBUTING.md](.github/CONTRIBUTING.md)

# Apache-Licensed Software
This block contains all software-packages that are licensed under the Apache-License.  
**Last edit: 10.05.2017**

## Api
- [atob](https://npmjs.com/package/atob)
- [aws-sign2](https://npmjs.com/package/aws-sign2)
- [bson](https://npmjs.com/package/bson)
- [caseless](https://npmjs.com/package/caseless)
- [ecdsa-sig-formatter](https://npmjs.com/package/ecdsa-sig-formatter)
- [forever-agent](https://npmjs.com/package/forever-agent)
- [kareem](https://npmjs.com/package/kareem)
- [mongodb](https://npmjs.com/package/mongodb)
- [mongodb-core](https://npmjs.com/package/mongodb-core)
- [oauth-sign](https://npmjs.com/package/oauth-sign)
- [pause-stream](https://npmjs.com/package/pause-stream)
- [rc](https://npmjs.com/package/rc)
- [reflect-metadata](https://npmjs.com/package/reflect-metadata)
- [request](https://npmjs.com/package/request)
- [require_optional](https://npmjs.com/package/require_optional)
- [spdx-correct](https://npmjs.com/package/spdx-correct)
- [tslint](https://npmjs.com/package/tslint)
- [tunnel-agent](https://npmjs.com/package/tunnel-agent)
- [typedoc](https://npmjs.com/package/typedoc)
- [typedoc-default-themes](https://npmjs.com/package/typedoc-default-themes)
- [typescript](https://npmjs.com/package/typescript)
- [validate-npm-package-license](https://npmjs.com/package/validate-npm-package-license)

## WebFrontend
- [ansi-html](https://npmjs.com/package/ansi-html)
- [aws-sign2](https://npmjs.com/package/aws-sign2)
- [caseless](https://npmjs.com/package/caseless)
- [forever-agent](https://npmjs.com/package/forever-agent)
- [jasmine-spec-reporter](https://npmjs.com/package/jasmine-spec-reporter)
- [less](https://npmjs.com/package/less)
- [log4js](https://npmjs.com/package/log4js)
- [material-design-icons](https://npmjs.com/package/material-design-icons)
- [oauth-sign](https://npmjs.com/package/oauth-sign)
- [rc](https://npmjs.com/package/rc)
- [reflect-metadata](https://npmjs.com/package/reflect-metadata)
- [request](https://npmjs.com/package/request)
- [rx](https://npmjs.com/package/rx)
- [rxjs](https://npmjs.com/package/rxjs)
- [selenium-webdriver](https://npmjs.com/package/selenium-webdriver)
- [spdx-correct](https://npmjs.com/package/spdx-correct)
- [tsickle](https://npmjs.com/package/tsickle)
- [tslint](https://npmjs.com/package/tslint)
- [tunnel-agent](https://npmjs.com/package/tunnel-agent)
- [typescript](https://npmjs.com/package/typescript)
- [validate-npm-package-license](https://npmjs.com/package/validate-npm-package-license)