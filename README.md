 # geli -- unfortunately no active developers for now :(

![geli-Logo](.var/geli-readme-icon.png)

[![GitHub release](https://img.shields.io/github/release/geli-lms/geli.svg)](https://github.com/geli-lms/geli/releases)
[![Build Status](https://travis-ci.com/geli-lms/geli.svg?branch=develop)](https://travis-ci.com/geli-lms/geli)
[![Coverage Status](https://coveralls.io/repos/github/geli-lms/geli/badge.svg?branch=develop)](https://coveralls.io/github/geli-lms/geli?branch=develop)
[![Uptime Robot ratio](https://img.shields.io/uptimerobot/ratio/m779032297-cd1143fdc10b510896f2a344.svg)](https://stats.uptimerobot.com/mq8EDc8lx)
[![Gitter chat](https://badges.gitter.im/geli-lms/geli.png)](https://gitter.im/mpse-geli/Lobby)
[![DavidDM-API](https://david-dm.org/geli-lms/geli.svg?path=api)](https://david-dm.org/geli-lms/geli?path=api)
[![DavidDM-WEB](https://david-dm.org/geli-lms/geli.svg?path=app/webFrontend)](https://david-dm.org/geli-lms/geli?path=app/webFrontend)

geli is an open source e-learning platform. Try the [demo](https://demo.geli.fbi.h-da.de/)!

The project is mainly developed by Computer Science Master's students at the 
[University of Applied Sciences in Darmstadt, Germany](https://www.fbi.h-da.de).

If you need help using or want to support the project, just say hello on 
[Gitter](https://gitter.im/mpse-geli/Lobby).


## Usage

Your best option for running the project is by using our Docker images:

- [API](https://hub.docker.com/r/hdafbi/geli-api)
- [Web frontend](https://hub.docker.com/r/hdafbi/geli-web-frontend)

Have a look at the sample [docker-compose file](docker-compose.prod.yml) on how 
to wire things together.

For a list of all configuration options see [docs/configuration](docs/configuration.md).


## Development

The codebase is written entirely in [TypeScript](https://www.typescriptlang.org/).

The API is based on [Node.js](https://nodejs.org) together with [Express](http://expressjs.com), 
[routing controllers](https://github.com/pleerock/routing-controllers) and 
[MongoDB](https://www.mongodb.com).
Have a look at our [API documentation](https://github.com/geli-lms/geli-docs/).

The web frontend is built with [Angular](https://angular.io/) 6 and 
[Angular Material](https://material.angular.io/) components.


### Running

You have multiple options for running the project for development purposes.

- [Docker](docs/development/running-with-docker.md)
- [Locally](docs/development/running-locally.md)
<!--- Needs to be updated: - [Vagrant](docs/development/running-with-vagrant.md) --->

After successfully starting, the web frontend will be available at 
[http://localhost:4200](http://localhost:4200).

The API will be available at [http://localhost:3030](http://localhost:3030). To avoid 
[CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) the API will also be proxied by 
the Angular development server and be available at 
[http://localhost:4200/api](http://localhost:4200/api).


### Configuration

The default configuration should already enable you to start developing.

For more information on how to configure e.g. e-mail see 
[docs/development/configuration](docs/development/configuration.md).


### Commands

#### API & web frontend
  - __Running__: `npm run start`
  - __Linting__: `npm run lint`
  - __Testing__: `npm run test`
  
#### API
  - __Loading fixtures__ (sample data): `npm run load:fixtures`
  - __[Debugging](https://nodejs.org/en/docs/inspector/)__: `npm run start:inspect`
  
#### Web frontend
  - __End to end tests__: `npm run e2e`
  - __[Angular CLI](https://cli.angular.io/)__: `npm run ng`
    (Be sure to pass flags with additional dashes. E.g.: `npm run ng build -- --prod`)


## Contributing

Please have a look at our [contributing guide](.github/CONTRIBUTING.md).


## LICENSING
Copyright [2018] [Ute Trapp]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
