# Running locally

For running locally you first have to install [Node.js](https://nodejs.org/en/download/package-manager/) 
and [MongoDB](https://docs.mongodb.com/manual/installation/) on your machine.

⚠️ **It is important to only use versions of Node.js and MongoDB that are currently 
supported by the project. You can find out which versions are currently supported by 
looking at the [docker-compose.yml](../../docker-compose.yml) file.** ⚠️

For running multiple versions of Node.js [nvm](https://github.com/creationix/nvm)
is a very good option.

Clone:

    git clone git@github.com:h-da/geli.git

Install Dependencies:

    cd geli/api
    npm install
    cd ../app/webFrontend
    npm install
    cd ..


## Running the API server

First start MongoDB so that it is listening on `localhost:27017`. Then you can start up the API server:

    cd api
    npm run start


## Running the web frontend

    cd app/webFrontend
    npm run start


Both commands will automatically watch for filesystem changes and recompile the code
once you change it.

For more information continue reading the main [README](../../README.md).
