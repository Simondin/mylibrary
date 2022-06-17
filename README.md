# README

## WITH DOCKER

Prerequisites:

[Docker](https://docs.docker.com/engine/install/)

[Docker Compose](https://docs.docker.com/compose/install/)

### Development mode

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build`

This runs and orchestrates all the project entities (client, rest, and proxy) and makes the app accessible from [localhost](http://localhost).

*NOTE:*

 1 -  (`--build` it's optional after the first build)
 2 -  In order to add a new library to the package.json we need to stop the single container and rebuild it.

*Example:*
I have modified the package.json of the frontend (app), so:

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml stop app`

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build app`

### Production mode

`docker-compose -f docker-compose.yml -f docker-compose.pro.yml up -d --build`

This runs and orchestrates all the project entities (client, rest, and proxy) and makes the app accessible from [localhost](http://localhost).

## USEFUL COMMANDS

### OPEN CONTAINER SHELL

`docker exec -it container-name bash`

### CONTAINER DELETION (need to rebuild after)

`docker container rm -f container-name`

### USE DETACH MODE  (-d == detach - non blocking shell)

`docker-compose -f docker-compose.yml -f docker-compose.(pro/dev).yml up -d`

### UP & BUILD A SINGLE SERVICE (-d == detach - non blocking shell)

`docker-compose -f docker-compose.yml -f docker-compose.(pro/dev).yml up -d --build service-name`

### SHOW LOGS FROM THE CONTAINER**

`docker logs -f 3f7937cd3acd`

### STOP AND REMOVE ALL CONTAINERS**

`docker-compose -f docker-compose.yml -f docker-compose.pro.yml down --rmi all`


## WITHOUT DOCKER

### Client

First install dependencies for the client project:

`npm install`

Then run the command:

`yarn build && serve -p 8000 -s build`

### Rest

First install dependencies for the client project:

`npm install`

Then run the command:

`yarn start`