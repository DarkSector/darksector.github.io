---
layout: post
title: "Heroku is full of surprises"
date: 2012-05-29 23:47
comments: true
categories: ["Heroku", "Cloud","Deployment","Resource Management"]
---

So we finally deployed on [Heroku](http://heroku.com) for a quick run and what do we find? The dynos idle if not used for an hour. So your app will sleep if you don't send it a request for an hour. I was scared for a second when I realized my app had been killed because probably it refused to sleep.

But hey what's this, there's another app that sends request to wake idling apps so that the dynos won't sleep. Enter [Wekkars](http://www.wekkars.com/). I mean there isn't a puzzle created by human beings that another human being can't solve. Well I read that in an Edgar Allan Poe book so nevermind the cheesy lines. 

On the other hand, the good thing about Heroku is it's ease of deployment. I mean what do you need to do really:

1. Create your app
2. Create a Procfile that will start your app
3. Commit code to heroku master (using git)
4. Profit

there's an additional 3.5 that involves adding a helper add on but that is trivial. So Heroku is pretty good, we'll continue testing.