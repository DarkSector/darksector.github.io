---
layout: post
title: "Arduino IR code: updated"
date: 2012-06-26 13:34
comments: true
categories: ["AVR", "Arduino", "IR", "Remote control", "Home Automation"]
---

Here's my updated Arduino code that I wrote to go with the protoshield by [9circuits](http://www.9circuits.com) and the relay shield connected to the protoshield.


{% img http://arduino.cc/en/uploads/Main/ArduinoUno_r2_front450px.jpg %}

```obj-c ArduinoIR.cpp
int RECV_PIN = 11;
int relay2 = 7;
int relay1 = 6;
long vol_down = 948321226;
long vol_up = 948321218;

boolean relay1_FLAG = false;
boolean relay2_FLAG = false;

#include <IRremote.h>

IRrecv irrecv(RECV_PIN);

decode_results results;

void setup()
{
  Serial.begin(9600);
  irrecv.enableIRIn();
  pinMode(relay1,OUTPUT);
  pinMode(relay2,OUTPUT);

}

void check_val_execute(long a) {
  if (a == vol_down) {
    
    if (relay1_FLAG) {
      light1_on();
      relay1_FLAG = !(relay1_FLAG);
    
    }
    else {
      light1_off();
      relay1_FLAG = !(relay1_FLAG);
    }  
  }
  
  else if (a == vol_up){
    
    if (relay2_FLAG) {
      light2_on();
      relay2_FLAG = !(relay2_FLAG);
    }
    
    else {
      light2_off();
      relay2_FLAG = !(relay2_FLAG);
    }  
  }
}

void light1_on() {
  digitalWrite(relay1,HIGH);
}

void light2_on() {
  digitalWrite(relay2,HIGH);
}


void light1_off() {
  digitalWrite(relay1,LOW);
}

void light2_off() {
  digitalWrite(relay2,LOW);
}

void loop()
{
  if (irrecv.decode(&results)) {
    
    //Serial.println(results.value, DEC);
    delay(300);
    irrecv.resume();
    long x = results.value;
    check_val_execute(x);
  }
}
```

No comments yet, I'll do that later.r