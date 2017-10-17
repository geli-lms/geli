/* tslint:disable:max-line-length */
import {IFixture} from '../IFixture';
import {FreeTextUnit} from '../../src/models/units/FreeTextUnit';

// TODO: Load this fixtures
export const readmeFreeTextFixture: IFixture = {
  Model: FreeTextUnit,
  data: [
    {
      name: 'Readmy',
      description: 'actually an old readme (v0.1.0)',
      markdown: '# Great E-Learning Informatics (geli)\n' +
      '\n' +
      '[![NodeJS Version](https://img.shields.io/badge/nodeJS-7.9-blue.svg)](https://nodejs.org/en)\n' +
      '[![MongoDB Version](https://img.shields.io/badge/mongoDB-3.4-blue.svg)](https://www.mongodb.com/download-center#community)\n' +
      '\n' +
      '[![GitHub release](https://img.shields.io/github/release/h-da/geli.svg)](https://github.com/h-da/geli/releases)\n' +
      '[![Build Status](https://travis-ci.org/h-da/geli.svg?branch=develop)](https://travis-ci.org/h-da/geli)\n' +
      '[![Dependency Checker](https://david-dm.org/h-da/geli.svg)](https://david-dm.org/h-da/geli)\n' +
      '\n' +
      'API: [![Docker Stars](https://img.shields.io/docker/stars/hdafbi/geli-api.svg)](https://hub.docker.com/r/hdafbi/geli-api/)\n' +
      '[![Docker Pulls](https://img.shields.io/docker/pulls/hdafbi/geli-api.svg)](https://hub.docker.com/r/hdafbi/geli-api/)   \n' +
      'Web-Frontend: [![Docker Stars](https://img.shields.io/docker/stars/hdafbi/geli-web-frontend.svg)](https://hub.docker.com/r/hdafbi/geli-web-frontend/)\n' +
      '[![Docker Pulls](https://img.shields.io/docker/pulls/hdafbi/geli-web-frontend.svg)](https://hub.docker.com/r/hdafbi/geli-web-frontend/)\n' +
      '\n' +
      '[![license](https://img.shields.io/github/license/h-da/geli.svg)](https://github.com/h-da/geli/blob/develop/LICENSE)\n' +
      '![Github Downloads](https://img.shields.io/github/downloads/h-da/geli/latest/total.svg)\n' +
      '[![Gitter chat](https://badges.gitter.im/h-da/geli.png)](https://gitter.im/mpse-geli/Lobby)\n' +
      '\n' +
      '---\n' +
      '\n' +
      'This project aims to develop a Open-Source platform for E-Learning in computer science.\n' +
      'We want to have an API, so Apps and other "Frontends" can be added easily.\n' +
      '\n' +
      'This project is mainly developed by master-students of the University of Applied Science in Darmstadt, Germany.\n' +
      'If you want to support this project, just say hello on Gitter.\n' +
      '\n' +
      '---\n' +
      '\n' +
      '# Usage with Vagrant\n' +
      'To use Vagrant for the development download VirtualBox, install it and then do the same with vagrant.\n' +
      'After that open the e.g. __git bash__ _AS ADMIN_ and go to the project root. Now run `vagrant up`.\n' +
      '\n' +
      'After everything is installed and all npm dependencies are downloaded you can connect to the VirtualBox\n' +
      'via `vagrant ssh`. The Ports 4200 and 27017 are forwarded to your host system. Just type localhost:4200 in your\n' +
      'browser.\n' +
      '\n' +
      '## Start services\n' +
      'To start the backend ssh into the VM with `vagrant ssh` and run the commands seen under [Run app](#run-app).\n' +
      '\n' +
      'To start the frontend ssh into VM with a second shell and run the commands seen under [Development server](#development-server).\n' +
      '\n' +
      '# Usage with Docker\n' +
      'You need `docker` and `docker-compose`.\n' +
      '\n' +
      '## Installing dependencies\n' +
      'You can install dependencies by running the following commands from the project root.\n' +
      '\n' +
      '    docker-compose run --rm --no-deps api npm install\n' +
      '    docker-compose run --rm --no-deps web-frontend npm install\n' +
      '    \n' +
      '## Running the application\n' +
      'After installing the dependencies you can run the application by executing:\n' +
      '\n' +
      '    docker-compose up\n' +
      '    \n' +
      'You can access the web frontend on your host machine at `http://localhost:4200`.\n' +
      '\n' +
      'The API will be proxied to `http://localhost:4200/api` and MongoDB is accessible at `localhost:27017`.\n' +
      '\n' +
      '# Backend\n' +
      '\n' +
      '```diff\n' +
      '- This content may not be up to date... we try to update it asap.\n' +
      '```\n' +
      '\n' +
      '## Installation\n' +
      '\n' +
      '1. Open a Terminal and type following:\n' +
      '\n' +
      '```bash\n' +
      'cd /path/to/project/api\n' +
      'npm install\n' +
      '```\n' +
      '\n' +
      '## Run APP\n' +
      '\n' +
      '```bash\n' +
      'cd /api\n' +
      'npm start-dev\n' +
      '```\n' +
      '\n' +
      'or `nodemon -L index.js` to \'poll\'. You can use this if you are using vagrant or docker on windows/mac.\n' +
      '\n' +
      '## Testing\n' +
      '\n' +
      '1. Copy `config/test.dist.json` to `config/test.json` and change it accordingly.\n' +
      '2. To execute the tests:\n' +
      '\n' +
      '```bash\n' +
      'cd /api\n' +
      'npm test\n' +
      '```\n' +
      '\n' +
      '# Frontend\n' +
      '```diff\n' +
      '- This content may not be up to date... we try to update it asap.\n' +
      '```\n' +
      '## Getting started\n' +
      '\n' +
      '## Angular CLI (globally required):\n' +
      '\n' +
      'Run `npm install -g @angular/cli@latest` to install the latest version of the angular cli globally.\n' +
      '\n' +
      '## How to use:\n' +
      '\n' +
      '1. Go to `app/webFrontend/`\n' +
      '2. Run `npm install` in the root folder of the app\n' +
      '3. Run `npm start` to use angular-cli serve\n' +
      '\n' +
      'If you have problems with the angular-cli version try following:\n' +
      '\n' +
      '1. Create a new anglular-cli projekt `ng new example-app`\n' +
      '2. Copy the folder ´/src´ from this project to the new project\n' +
      '3. Run `ng serve`\n' +
      '\n' +
      'This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.17.\n' +
      '\n' +
      '## Development server\n' +
      'Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.\n' +
      '\n' +
      '## Code scaffolding\n' +
      '\n' +
      'Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.\n' +
      '\n' +
      '## Build\n' +
      '\n' +
      'Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.\n' +
      '\n' +
      '## Running unit tests\n' +
      '\n' +
      'Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).\n' +
      '\n' +
      '## Running end-to-end tests\n' +
      '\n' +
      'Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/). \n' +
      'Before running the tests make sure you are serving the app via `ng serve`.\n' +
      '\n' +
      '## Further help\n' +
      '\n' +
      'To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).\n' +
      '\n' +
      '# Contributuion\n' +
      '\n' +
      'Please have a look at [CONTRIBUTING.md](.github/CONTRIBUTING.md)\n' +
      '\n' +
      '# Apache-Licensed Software\n' +
      'This block contains all software-packages that are licensed under the Apache-License.  \n' +
      '**Last edit: 10.05.2017**\n' +
      '\n' +
      '## Api\n' +
      '- [atob](https://npmjs.com/package/atob)\n' +
      '- [aws-sign2](https://npmjs.com/package/aws-sign2)\n' +
      '- [bson](https://npmjs.com/package/bson)\n' +
      '- [caseless](https://npmjs.com/package/caseless)\n' +
      '- [ecdsa-sig-formatter](https://npmjs.com/package/ecdsa-sig-formatter)\n' +
      '- [forever-agent](https://npmjs.com/package/forever-agent)\n' +
      '- [kareem](https://npmjs.com/package/kareem)\n' +
      '- [mongodb](https://npmjs.com/package/mongodb)\n' +
      '- [mongodb-core](https://npmjs.com/package/mongodb-core)\n' +
      '- [oauth-sign](https://npmjs.com/package/oauth-sign)\n' +
      '- [pause-stream](https://npmjs.com/package/pause-stream)\n' +
      '- [rc](https://npmjs.com/package/rc)\n' +
      '- [reflect-metadata](https://npmjs.com/package/reflect-metadata)\n' +
      '- [request](https://npmjs.com/package/request)\n' +
      '- [require_optional](https://npmjs.com/package/require_optional)\n' +
      '- [spdx-correct](https://npmjs.com/package/spdx-correct)\n' +
      '- [tslint](https://npmjs.com/package/tslint)\n' +
      '- [tunnel-agent](https://npmjs.com/package/tunnel-agent)\n' +
      '- [typedoc](https://npmjs.com/package/typedoc)\n' +
      '- [typedoc-default-themes](https://npmjs.com/package/typedoc-default-themes)\n' +
      '- [typescript](https://npmjs.com/package/typescript)\n' +
      '- [validate-npm-package-license](https://npmjs.com/package/validate-npm-package-license)\n' +
      '\n' +
      '## WebFrontend\n' +
      '- [ansi-html](https://npmjs.com/package/ansi-html)\n' +
      '- [aws-sign2](https://npmjs.com/package/aws-sign2)\n' +
      '- [caseless](https://npmjs.com/package/caseless)\n' +
      '- [forever-agent](https://npmjs.com/package/forever-agent)\n' +
      '- [jasmine-spec-reporter](https://npmjs.com/package/jasmine-spec-reporter)\n' +
      '- [less](https://npmjs.com/package/less)\n' +
      '- [log4js](https://npmjs.com/package/log4js)\n' +
      '- [material-design-icons](https://npmjs.com/package/material-design-icons)\n' +
      '- [oauth-sign](https://npmjs.com/package/oauth-sign)\n' +
      '- [rc](https://npmjs.com/package/rc)\n' +
      '- [reflect-metadata](https://npmjs.com/package/reflect-metadata)\n' +
      '- [request](https://npmjs.com/package/request)\n' +
      '- [rx](https://npmjs.com/package/rx)\n' +
      '- [rxjs](https://npmjs.com/package/rxjs)\n' +
      '- [selenium-webdriver](https://npmjs.com/package/selenium-webdriver)\n' +
      '- [spdx-correct](https://npmjs.com/package/spdx-correct)\n' +
      '- [tsickle](https://npmjs.com/package/tsickle)\n' +
      '- [tslint](https://npmjs.com/package/tslint)\n' +
      '- [tunnel-agent](https://npmjs.com/package/tunnel-agent)\n' +
      '- [typescript](https://npmjs.com/package/typescript)\n' +
      '- [validate-npm-package-license](https://npmjs.com/package/validate-npm-package-license)'
    },
  ]
};
