---
layout: post
title: "Finally got Allegro 5 working on Mac OS X"
date: 2012-07-21 20:43
comments: true
categories: ["Mac OS X Lion", "Allegro"]
---

I've ranted about this before I was unable to get Allegro working on Mac OS X. So today, for no reason I tried it again. Followed the [Wiki](http://wiki.allegro.cc/index.php?title=OSX,_Xcode_4,_Framework) to the letter and yet, it wouldn't work. It was unable to find the frameworks. Specifically Allegro-5.0Framework. I did EVERYTHING and couldn't figure it out. Until while searching for Header Search Paths in Build Settings caught my eye. There was a Framework Search Path too. And I provided it with the path /Library/Framework.

{% img http://f.cl.ly/items/0d2p1b3y2n2D3b0f0R1q/Screen%20Shot%202012-07-21%20at%209.42.25%20PM.png %}


It worked and I need to kill someone now. Seriously, fuck you Xcode, fuck you.