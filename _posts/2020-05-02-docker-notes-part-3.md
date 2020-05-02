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