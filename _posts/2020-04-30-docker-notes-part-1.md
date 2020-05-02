---
layout: post
title: Docker notes - part 1
date: 2020-04-30 23:04 -0700
categories: docker devops deployment containers
---

I am not a big fan of Docker because I think it creates more problems than it solves. However I've needed to use it for work because well - nevermind. Anyway, here are some Docker notes I am keeping for myself so that I can refer them later.


## Docker quick intro

### Docker image
Docker image contains a snapshot of the filesystem required to run a particular command and the command itself. e.g. a busybox image will include `dev bin sbin etc` etc. so that we can use the busybox utils. So it comes with this stuff and a command you can use to run things.

### Docker container
Docker uses existing resources on the system to create "containers". A container is a logical space/way for the kernel to organize and route system calls to particular resources depending on the processes that called it. So in the case of a busybox image, it copies the fs snapshot to a sanctioned space on system/host storage and routes all system calls from say `ls -alh` run within the busybox container to this space. 

The stupid thing about all of this is that it doesn't actually have native implementations. You'd think that you would have a native logical machine for major OS since that's why docker is so popular in the first place. But nope, docker requires you to download your own abstract linux VM running a linux kernel. Good thing is, it does that for you but goodby bare metal performance. Anyway, enough bitching.


## Docker commands

### docker run

`docker run <container-name>`
e.g. `docker run hello-world`

**Basically same as doing the following**

1. Creates a container `docker create hello-world` spits out an ID
2. Starts the container `docker start -a <ID>` Note that without -a it won't actually attach the container to stdout

### docker ps

1. Get truncated results of all containers running `docker ps`
2. Get detailed results of all containers running/exited `docker ps --all`
3. Re run container even if exited by grabbing container ID and hitting `docker run <ID>`


### docker system prune

1. Clears all exited containers
2. **Removes build cache** meaning images will have to be re-downloaded from docker hub
3. Clears unused networks


### docker logs

Usage: `docker logs <ID>`

Show the logs of an already running or exited container

### docker stop

SIGTERM the process in the container and stop it within 10 seconds otherwise it's going to be killed

### docker kill

SIGKILL the process - don't wait for anything just kill it


## Multiple commands within a container

usage: `docker exec -it <ID> <sub command>`

The `-it` flag is required to get an interactive terminal if you are using something like a CLI. It's actually two flags `-i` and `-t`. The first attaches the standard input and the latter makes stuff pretty (I know)

e.g. `docker exec -it busybox sh`

Oh and BTW the containers are isolated, but that was obvious.