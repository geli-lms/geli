# Great E-Learning Informatics (geli)

## Communication

- [geli gitter channel](https://gitter.im/mpse-geli/)

## Requirements

- [Node.js | 7.9](https://nodejs.org/en/)
- [MongoDB | 3.4.3](https://www.mongodb.com/download-center#community)

# Vagrant
To use Vagrant for the development download VirtualBox, install it and then do the same with vagrant.
After that open the e.g. __git bash__ _AS ADMIN_ and go to the project root. Now run `vagrant up`.

After everything is installed and all npm dependencies are downloaded you can connect to the VirtualBox
via `vagrant ssh`. The Ports 4200 and 27017 are forwarded to your host system. Just type localhost:4200 in your
browser.

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

## Installation

1. Open a Terminal and type following:

```bash
cd /path/to/project/api
npm install
```

## Run APP

```bash
cd /api
npm run start-dev
```

## Testing

1. Copy `config/test.dist.json` to `config/test.json` and change it accordingly.
2. To execute the tests:

```bash
cd /api
npm test
```

# Frontend
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


