---
layout: post
title: "Command line pastebin"
date: 2012-05-06 22:45
comments: true
categories: ['Command line','Pastebin']
---

Found out about a command line pastebin. I really like the example. it's simple for instance, you'd like the output of /foo/bar directly on pastebin, you do this.

```bash Sprunge
$ cat /foo/bar | curl -F 'sprunge=<-' http://sprunge.us
  http://sprunge.us/Zi1Lk
```

Yep, [Sprunge.us](http://sprunge.us/)
It's source resides on [Github](http://github.com/rupa/sprunge)

Of course writing the whole syntax will loose it's novelty, so I advise you to use an alias for the same.

```bash pastebin
$ echo "alias = \"curl -F 'sprunge=<-' http://sprunge.us\"" >> ~/.bash_profile
$ source ~/.bash_profile
```
Yep, that will add an alias to your bash_profile and then source it to use the commands immediately

##Here's how it'll look
```bash Using pastie as an alias
$ echo "alias pastie=\"curl -F 'sprunge=<-' http://sprunge.us\"" >> ~/.bash_profile
$ source ~/.bash_profile
$ brew doctor | pastie
```