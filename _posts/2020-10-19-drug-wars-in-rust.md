---
layout: post
title: Drug wars in Rust
categories: Rust Gamedev Javascript Typescript PhaserJS
date: 2020-10-19 19:11 -0700
---
I remember the OG Drugwarz. It was a tiny game with a text UI. Then I played it on [Windows with a small UI](https://drug-wars-underworld.en.softonic.com/). It was a lot of fun. I want to now build it using JS. But I want to use Rust to create the core of it. So the idea is to use Rust with wasm-bindgen to create a javascript backend and use it with something like PhaserJS as a UI.

I don't like that I have to deal with Rust's steep learning curve and I feel that after python you frequently ask yourself, why? But then you see how slow Python can be sometimes especially for interaction related work and you want to switch over to a systems language for the raw power. But CPP is a whole another game and while it's not a bad idea to go with the tried and tested, it's a good idea to get in at something at the ground level and see it progress while you partake into its applications.

I was motivated by [rs-asteroids](https://github.com/justinmimbs/rs-asteroids) and wanted to see if I could do something. It uses SVG to draw everything in the browser on a canvas and uses Rust to actually do the heavy work in the background. I wanna do that, except I don't want a point and shoot game. So yeah, let's try something else.

Here's the game plan: 

 1. Map out data structures
 2. Create initial JS bindings and use JS to initialize and play around with them
 3. Understand data handling and pass through JS<->Rust
 4. Create scenes like you would in Unity or Godot
 5. First iteration


 I know it's a little generic, but it's good for an overall game plan. I can't assign a time line yet because I am busy practicing Godot in my off time. But I have done some work on this and pushed my work to [this repo](https://github.com/DarkSector/rs-drugwars). Very minor work on the first one really.

 Anyway, glad to get it out there and hope to work on it some more soon.
