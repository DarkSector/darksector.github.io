---
layout: post
title: "Prototyping web based data acquisition applications"
date: 2012-04-17 03:15
comments: true
categories: [Python, Code, Serial, Hardware]
---

In order to build an application that processes or even simply displays data being acquired by say the serial port, it is not important to actually have the device connected.

We can build virtual serial pairs and have our backend transmit and acquire dummy data and then test the processing logic. This is one of the reasons why I love Python. It just doesn't get in your way and gets you all the stuff you need to get started ASAP.

So I've resorted to [PySerial](http://pyserial.sourceforge.net/) and this application called [Virtual Serial Port](http://code.google.com/p/macosxvirtualserialport/). The latter creates a pair in the /dev and the former is used to put in the data from one end and retrieve it at the other. An important question one could ask, why not just generate dummy data than getting it passed through a virtual serial pipe? Answer is that it's the closest way to the real thing, might as well get it done.

So, after having created serial ports, now to simply create two scripts that pour and retrieve data.

``` python Dummy-feeder.py
#!/usr/bin/python

import serial
import random
import time

_portname = '/dev/master'
dumper = serial.Serial(_portname,115200,timeout=1)
while(1):
	l = random.randint(0,1023)
	k = random.choice('abcdef')
	dumper.write(k)
	dumper.write(str(l))
	print "random sensor:",k
	print "random print: ",l 
	time.sleep(2)
```

``` python Receiver.py
#!/usr/bin/python

import serial
import json

_recvport = '/dev/slave'
recv = serial.Serial(_recvport,115200,timeout=1)
while(1):
	data = recv.readline()
	print "received:", data
```

Yeah, so as it's pretty obvious, dummy feeds the data and receiver receives it and just dumps it out on STDOUT. Now, that I've got this data, I need to be able to manipulate it to be able to send it to my application server. I think I'll need the involvement of JSON here. Must experiment.