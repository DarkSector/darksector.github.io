---
layout: post
title: "First steps in programming an AVR"
date: 2012-05-05 22:20
comments: true
categories: ['AVR','Microcontrollers', 'Embedded Systems', 'Hardware', 'Electronics']
publish: false
---

So, this has been due for a long time now. First programs on how to program the AVR. If you don't know what that is, you need to google ATMEL AVR. If you know what that is, great!

I am going to be using an ATMega32 with an external crystal with 16MHz clock. I have a MKII programmer that allows me to use AVR Studio with it. It's the first use of Windows in programming I've found, ever. AVR Studio, rest everything is shite.

I am currently on Mac OS X so I need to use AVR-GCC for this which can be obtained as a crosspack from Objective Development or Ob-dev as we know them. Really cool people. I'll be later using AVRDUDE to actually burn the chip. I'll share the circuit later.

First, let's code.

```objc blinky.c
#define F_CPU 16000000UL
//defines the clock being used, for calculating delay

#include <inttypes.h>
#include <avr/io.h>
#include <util/delay.h>
//this is the delay function included here

int main(){
	
	DDRC |= 0xFF;
	//set the data direction registers of PORTC as output, all of them.
	
	while(1){
		
		PORTC |= 0xFF;
		//write the value 255 or FF in hex so that all LEDs may light up
		//or go out as per your LED configuration
		
		_delay_ms(100);
		//this is for providing delay of 100 milliseconds
		
		PORTC = ~PORTC;
		//just negate the last value on PORTC, so it toggles the values and
		//hence the LEDs
		
		_delay_ms(100);
		//This delay is necessary, you'll have to run the program to understand
		//why
		
	}
	return 0;
	//return 0 because main is int type
}
```

So, this is the basic AVR C program. Let's compile it. But compiling is not enough, we want a .hex file that we'll eventually burn on the chip's Flash ROM. But luckily we can produce that from the .elf we'll create. This is how it's done.

```bash avr-gcc commands to compile blinky.c
$ avr-gcc -g -Os -mmcu=atmega32 -c blinky.c
$ avr-gcc -g -mmcu=atmega32 -o blinky.c blinky.o
$ avr-objcopy -j .text -j .data -O ihex blinky.elf blinky.hex
```

So now we have the blinky.hex, let's burn it to the chip. I'll be using AVRDUDE as I mentioned before. Here's the one command that solves our problem

```bash avrdude
avrdude -F -c avrispmkII -p m32 -P /dev/ttyUSB0 -b 19200 -U flash:w:$filename".hex" -e -vv
```