---
layout: post
title: Docker Notes - Part 4
date: 2020-05-04 20:10 -0700
categories: Docker DevOps Deployment Containers
---

While working with celery workers it's important to understand scale. Recently while trying to stand up celery workers for development I was confronted with an opportunity to stand up independent celery boxes to run multiple workers.

## Shared networks

First issue was to have them be able to communicate with the broker and backend. The way docker does it by default - if you start services within the same `docker-compose.yml` - is by putting all services on the same default network.

So, if we want to connect multiple containers it's best to specify an external network.

Create a network first

`docker network create my-network` 

By default the driver used is Bridge so it's a bridged network.

`docker network inspect my-network` will blurt out all the details for this network. 

## Indpendent containers 

Here's our first container with the broker and the backend

```yaml
version: '3'
services:
  backend:
    image: 'redis'
  broker:
    image: 'rabbitmq'  
networks:
  default:
    external:
      name: my-network
```

Celery worker container

```yaml
version: '3'
services:
  worker:
    restart: always
    build: . # assuming context is here          
networks:
  default:
    external:
      name: my-network
```

Here's the Dockerfile to go with the worker `docker-compose.yml`

```docker
FROM python:3.8

WORKDIR /packages

# copy current code context to /packages
COPY . .

RUN pip install -r requirements.txt

CMD ["celery", "worker", "-A", "tasks", "-l", "INFO"]
```

So in order to communicate with the broker and backend, the worker is going to use `backend` and `broker` host names to communicate with the services.

Here's the celery config

```python
from celery import Celery

app = Celery('tasks',
             broker='pyamqp://guest@broker'),
             backend='redis://backend')

@app.task
def add(x: int, y: int):
    return x+y

```

## Container scale

Spin up multiple containers for this service 

`docker-compose up --scale worker=3`

This will spin up three containers of the service worker and show them in the logs and the processes

[I found this article that talks about using the scale option when you have a port that needs to be exposed and how to access the services using a load balancer](https://pspdfkit.com/blog/2018/how-to-use-docker-compose-to-run-multiple-instances-of-a-service-in-development/)