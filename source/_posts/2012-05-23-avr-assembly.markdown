---
layout: post
title: "AVR Assembly revisted"
date: 2012-05-23 23:22
comments: true
categories: ["AVR", "ATMEL", "ATmega32", "Assembly", "Microcontrollers"]
---

Assembly for AVR is really interesting. Back in college I wrote a number of programs and I've been going over them again. This is some of the code.

{% gist 2776751 %}

I have 8 LEDs connected from D0 to D7 on PORTC and they are in the source configuration. 0xFF makes them light up and 0x00 shuts them down. So this is the blinky for you.

Now the DELAY function can only be called if the STACKPOINTER is set. The first few lines after .ORG do just that. Now I'll be working on timer and interrupts but first I'll put in some more code for simple things like adding 16 bit numbers etc.