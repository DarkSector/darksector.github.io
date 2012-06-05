---
layout: post
title: "Configured Linksys WRT120N: Bye bye old Wifi"
date: 2012-06-05 11:23
comments: true
categories: ["WiFi","Linksys","Cisco","Network","WRT120N","Subnet"]
---

So I finally decided to close my native router (Teracom's) Wifi and get a proper lossless Wifi running at home. I have had the urge to use this router for a long time now. It was gifted to me by my cousin but I never got around to understanding how to deploy it. Except today. I closed the Teracom Wifi and extended an ethernet cable to the Linksys router.

Now earlier I wasn't able to deploy it because I didn't realize it ran on an extended bridged network. I thought it ran PPPoE. I mean it does run PPPoE but only via a service provider's ethernet network. Considering over here in India we don't have that we use a bridged network. Okay so that being said and done, I tried to plug an ethernet cable running from the Teracom (henceforth called T) to the Cisco. 

{% img http://www.zdtronic.com/images/WRT120N.jpg %}

It didn't obviously work the first time (No surprised there). But strangely it was communicating with the network but not relaying packets here. Then I remembered our old exercises back from college. It was obvious, there was subnet conflict. The second router would have two networks. One terminating at it and the other originating from it.

So, if the first subnet was as 192.168.1.foo the other would obviously have to be different. So, the other became 192.160.1.foo and voila it worked like a charm. The problem with T's network was that it was dropping packets a lot. I don't know why that started happening suddenly but hey, use Cisco be safe.

