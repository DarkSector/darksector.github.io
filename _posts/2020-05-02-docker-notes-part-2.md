---
layout: post
title: Docker Notes Part 2
date: 2020-05-02 00:30 -0700
categories: docker devops deployment containers
---

Now that the basics are down, time to actually create a simple app and dockerize it. A simple python Flask app should do it.

## Application Structure

```
 - Repo
    - server.py
    - templates
        - base.html
        - index.html
    - requirements.txt
    - random_folder_that_has_other_stuff
    - Dockerfile
    - .dockerignore
```

So the Dockerfile is the one that has instructions on what to do to build this thing. Our app has basic stuff in it.

## Code

```python
from flask import Flask, render_template


app = Flask(__name__)

@app.route("/")
def index():
    return "Hello, World - I hate docker"

@app.route("/templated_response/<var>")
def t_response(var)
    return render_template("index.html", var=var)

app.run("0.0.0.0", port=5051)
```

Here's the HTML

```html
<html>
<head>
</head>
<body>
    My variable: {% raw %}{{ var }}{% endraw %}
</body>
</html>
```

The requirements are obviously just a dump of Flask dependencies

```
click==7.1.2
Flask==1.1.2
itsdangerous==1.1.0
Jinja2==2.11.2
MarkupSafe==1.1.1
Werkzeug==1.0.1
```

And now for the Dockerfile

```docker
# which image to use
FROM python:3.8

# Change to the workdirectory within Docker
WORKDIR /app

# Copy requirements
COPY ./requirements.txt ./

# Install the packages
RUN pip install -r requirements.txt

# Now copy the relevant files from the build context
COPY ./ ./

# And this is the command
CMD ["python", "server.py"]
```

Notice the change to working directory, copying the requirements and THEN copying the source? That's because you want to avoid unnecessary rebuilds. What if the requirements include a package that takes a lot of time to build. You definitely don't want a simple change in the source to trigger an entire re-install. So it's best to setup env first and then copy stuff over.

Another important issue is build context but I'll talk about that later. The `.dockerignore` file shouldn't avoided too

```docker
random_folder_that_has_other_stuff
```

The `.dockerignore` can also work on exclusions so this is perfectly valid

```docker
**
!templates
!requirements.txt
!server.py
```

Useful I guess. 

## Building the image

`docker build -t pronoyc/flaskapp .`

That dot is important - specifies the build context of the container.

## Running the container

`docker run -p 5000:5000 pronoyc/flaskapp`

`-p` flag maps host port with container port. So this follows as `-p [HOST]:[CONTAINER]`

## Important stuff

The build context is one of the stupidest things ever. Here try this. So apparently the "build context" is nothing but your current directory which is supposed to be integrated into the FS of the target container. So if I wanted to change something and copy stuff from a folder outside (parent) of the current directory - I can't.

So let's say I did this

```docker
# which image to use
FROM python:3.8

# Change to the workdirectory within Docker
WORKDIR /app

# Copy requirements
COPY ./requirements.txt ./

# Install the packages
RUN pip install -r requirements.txt

# Now copy the relevant files from the build context
COPY ./ ./

# Copy an additional file from a directory somehwere else, maybe a bindings file
COPY ../../bindings.cpp ./

# And this is the command
CMD ["python", "server.py"]
```

Guess what - can't do that! Because now I have to organize my project according to this god forsaken tool. Why? Docker's exists for a simple reason. To deploy projects - why do I need to modify my structure to support this POS? 

Whatever - there seems to be a way to do it by using `-f` flag. [Here's a post that talks more about it](https://stackoverflow.com/questions/27068596/how-to-include-files-outside-of-dockers-build-context)

