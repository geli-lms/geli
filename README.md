 # Great E-Learning Informatics (geli)

![Geli-Logo](.var/geli-readme-icon.png)

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

# Workflow
Our workflow is as following:
- Create a Ticket for the Issue
- Create a branch for that ticket with the naming: `feature/{ticket-no}-{description-seperated-by-spaces}`
- Develop your code
- Commit and push in regulary intervalls ([How to commit](https://chris.beams.io/posts/git-commit/))
- Run the tests locally
- Open a Pull-Request
- If CI / Coverage give their OK we can merge
- Thr PR gets merged to `develop`, which will push a new Docker-Image-Version
- The staging-system will then be updated to the latest Image from Docker-Hub
- If we have enough features we will merge the `develop` into the `master` branch, which will add a new 'stable' image on Docker-Hub. The livesysten then pulls that new image and starts up with the latest stable version

If we have bugfixes we create a `bugfix/{descriptive-name}` and open a PR, issues are not required for that. But it's important to have a good description of the bugfix in the PR-Comment.

# Docker
Our complete build-process is running with docker, so here is our [Docker-Hub-Page](https://hub.docker.com/r/hdafbi).

## API-Image
[![Docker Stars](https://img.shields.io/docker/stars/hdafbi/geli-api.svg)](https://hub.docker.com/r/hdafbi/geli-api/)
[![Docker Pulls](https://img.shields.io/docker/pulls/hdafbi/geli-api.svg)](https://hub.docker.com/r/hdafbi/geli-api/)   

This is our [image](https://hub.docker.com/r/hdafbi/geli-api) for the API of Geli.

## Web-Frontend-Image
[![Docker Stars](https://img.shields.io/docker/stars/hdafbi/geli-web-frontend.svg)](https://hub.docker.com/r/hdafbi/geli-web-frontend/)
[![Docker Pulls](https://img.shields.io/docker/pulls/hdafbi/geli-web-frontend.svg)](https://hub.docker.com/r/hdafbi/geli-web-frontend/)

This is the [image](https://hub.docker.com/r/hdafbi/geli-web-frontend) for the web-frontend of Geli.

---

# Development
## Tech-Stack
This project is build on the MEAN _(MongoDB | Express | Angular | NodeJS)_ -Stack.
So we are currently using the following technologies:

| Software     | Version | Description                                                        |
|--------------|---------|--------------------------------------------------------------------|
| MongoDB      | 3.4.3   | A NoSQL-Database - Documentoriented                                |
| Express      | 4.14.0  | A NodeJS router                                                    |
| Angular      | 4.0.0   | A JS-Based frontend framework                                      |
| NodeJS       | 7.9     | A JS-Runtime                                                       |
| Docker       | -       | A virtualisation software to run our software in dev and on server |
| Typescript   | 2.2.0   | A object-oriented superset of plain JS                             |
| ECMAScript 6 | -       | The 2015 released version of JS                                    |

## Commands
Run the commands for the api or web-frontend either in `api` or `app/webFrontend`.
- Start the webserver
  - __API:__ `npm run start`
  - __FE:__ `npm run start` _(please see docker/vagrant section for specific infos)_
- Lint
  - __API:__ `npm run tslint`
  - __FE:__ `npm run lint`
- Test
  - __API:__ `npm run test`
  - __FE:__
    - unit-tests: `npm run test`
    - integration (end2end): `npm run e2e`
- NG-CLI
  - You can add modules etc with the `ng`-[command](https://cli.angular.io/).

## Usage with Vagrant
To use Vagrant for the development download VirtualBox, install it and then do the same with vagrant.
After that open the e.g. `git bash` __AS ADMIN__ and go to the project root. Now run `vagrant up`.

After everything is installed and all npm dependencies are downloaded you can connect to the VirtualBox
via `vagrant ssh`. The Ports 4200 and 27017 are forwarded to your host system. Just type `localhost:4200` in your
browser and you will (almost) see your local geli-instance.

### Start services
To start the __backend__ ssh into the VM with `vagrant ssh` and run the following lines. This will lint and compile the code, aswell start the api-webserver.

    cd api
    npm run start

To start the __frontend__ ssh into VM with a __second__ shell (`vagrant ssh`) and run the following commands. This will lint and compile the code, aswell start the frontend-develop-webserver.

    cd app/webFrontend
    npm run start-vagrant-dev

## Usage with Docker
You need `docker` and `docker-compose`.

### Installing dependencies
You can install dependencies by running the following commands from the project root.

    docker-compose run --rm --no-deps api npm install
    docker-compose run --rm --no-deps web-frontend npm install
    
### Running the application
After installing the dependencies you can run the application by executing:

    docker-compose up
    
You can access the web frontend on your host machine at `http://localhost:4200`.

The API will be proxied to `http://localhost:4200/api` and MongoDB is accessible at `localhost:27017`.

---

# Getting Started
## Installation
Clone this project to a folder you like:

    cd /path/to/project
    git clone git@github.com:h-da/geli.git

Here you should decide if you install everything native on your pc, use [docker](#usage-with-docker) or [vagrant](#usage-with-vagrant). 

Open a Terminal and type following. It will install all dependencies of the api and the web-frontend:

    cd /path/to/project/geli
    cd api
    npm install
    cd ../app/webFrontend
    npm install

## Run APP
Run this in one console to start the api:

    cd api
    npm run start

Run this in a nother console to start the frontend:

    cd app/webFrontend
    npm run start-[docker|vagrant]-dev

## Testing
To test and lint the api just call:

    cd api
    npm run test

To run the unittest of the web-frontend call:

    cd app/webFrontend
    npm run test

To run the end to end test, which is a integration-test, which tests the compability between the api and the web-fronted just call:

    cd app/webFrontend
    bpm run e2e

## Angular CLI (globally required):
Run `npm install -g @angular/cli@latest` to install the latest version of the angular cli globally.   
If you have problems with the angular-cli version try following:

1. Create a new anglular-cli projekt `ng new example-app`
2. Copy the folder ´/src´ from this project to the new project
3. Run `ng serve`

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.17.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help
To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

---

# Contributuion
Please have a look at [CONTRIBUTING.md](.github/CONTRIBUTING.md)

---

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
