---
layout: post
title: "Octopress problem"
date: 2012-04-17 00:52
comments: true
categories: 
---

``` bash CNAME
$ echo "pronoy.blog.in" >> CNAME
$ git add CNAME
$ git commit -m 'added CNAME'
$ git push origin master 
```

every time I deploy it removes the CNAME record from the master branch. I wonder how to get it deployed properly.

Really weird, I'll have to keep looking.