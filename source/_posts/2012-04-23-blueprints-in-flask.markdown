---
layout: post
title: "Blueprints in Flask"
date: 2012-04-23 15:52
comments: true
categories: [Python, Flask, Code]
published: false
---

So, I discovered this and seems to be a more professional way to protect content.

``` python __init__.py The application __init__.py
from flask import Flask
import admin
app = Flask(__name__)
app.register_blueprint(admin.bp, url_prefix='/admin')
```

``` python admin/__init__.py The admin module __init__.py

```
