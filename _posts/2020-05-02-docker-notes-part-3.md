---
layout: post
title: Docker Notes - Part 3
date: 2020-05-02 02:46 -0700
categories: Docker DevOps Deployment Containers
---

Multi container applications. You need multiple docker containers to do your bidding because every component might need to be scaled. And obviously because you hate yourself so you resort to _automating_ this stuff that takes you longer than it would if you were to use bare deployments using Ansible. 

Anyway, so `docker-compose`. Multiple containers in one file and how they work with each other. Docker-compose is going to orchestrate these containers on a shared network. Here's an example of a js app working with redis via one `docker-compose.yml`

```yaml
version: '3'
services: 
    redis-server:
        image: 'redis' # use redis image

    visits:
        build: .
        ports:
            - "4001:8081" # host:container
```

Now to build them - `docker-compose build` and then to run them `docker-compose up`.

To daemonize them so that they run in background `docker-compose up -d`

To bring them down `docker-compose down`

## Error handling within containers

Stuff crashes all the time so there has to be a way to restart the container if it fails for some reason. 

So Docker has restart policies in place according to the exit code it receives.

```yaml
'no': "Never attempt to restart"
always: "If container stops for any reason - restart it"
on-failure: Only restart if stopped with an error code
unless-stopped: always restart till forced to stop (manually)
```

We just add the `restart` key under the container to instate the police

```yaml
version: '3'
services: 
    redis-server:
        image: 'redis' # use redis image

    visits:
        restart: always
        build: .
        ports:
            - "4001:8081" # host:container
```

This will restart no matter what. 


## Checking status

So just like `docker ps` we have `docker-compose ps` as well. But just like the other commands it needs to be run in the directory where you have `docker-compose.yml` for a targetted status


## Docker compose build context

Oh dear lord. Why does Docker do this? One of the dumbest things I've seen in any util. Let us specify context manually - why is there a wall around where I can send the files from? 

Here's the directory structure: 

```
    parent_directory
        src_code1
        src_code2
        src_code3
        docker_stuff
             project
                Dockerfile
                .dockerignore
                docker-compose.yml
```

Anyway, here's how to specify context and a custom Dockerfile

```yaml
version: '3'
services: 
    redis-server:
        image: 'redis' # use redis image
    visits:
        restart: always
        build:
            context: ../..
            dockerfile: ${PWD}/Dockerfile

        ports:
            - "4001:8081" # host:container
```

[Apparently according to this post](https://github.com/docker/compose/issues/4926) dockerfile is relative to context. If that were true this wouldn't have worked `$PWD/Dockerfile` 

One aspect of Docker is that it builds everything serially. However that can be sped up by using something called **BuildKit**


BuildKit brings concurrency into the game and it's probably the best way to build containers. However, we need a bit of a hack to pass the actual BuildKit environment variable via the cli. That's how to pass it through to `docker-compose`

`COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build`

