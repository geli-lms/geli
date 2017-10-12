# Running with docker

You need [docker](https://docs.docker.com/engine/installation/) and
[docker-compose](https://docs.docker.com/compose/install/).

Clone:

    git clone git@github.com:h-da/geli.git
    
Install dependencies:

    cd geli
    
    # API
    docker-compose run --rm --no-deps api npm install
    
    # Web frontend
    docker-compose run --rm --no-deps web-frontend npm install
    
Running:

    docker-compose up

This will launch the Docker containers in foreground and show the logs. For running in
background add the `-d` flag.

The code is mounted from your host machine into both containers, so changes you
make will be automatically reflected and recompiled.

When the code is not getting recompiled automatically (especially when you are using 
Docker for Windows/Mac) you will want to use polling instead of inotify based 
filesystem change detection.


## Running commands

To execute commands inside the running containers you can use:

    # API
    docker-compose exec api <command>
    
    # Web frontend
    docker-compose exec web-frontend <command>
    
For more information continue reading the main [README](../../README.md).


## Personal configuration

You can create a file called `docker-compose.override.yml` that will be [automatically 
recognized](https://docs.docker.com/compose/extends/#multiple-compose-files) by 
docker-compose and should not be comitted.

So for example when you want to enable debugging create the file with the following contents

    version: "2"
    services:
      api:
        ports:
          - "9229:9229"
        command: "npm run start:inspect"

Or for setting environment variables:

    version: "2"
    services:
      api:
        environment:
          MAILUSER: "myaccount"
          MAILPASS: "mypass"
