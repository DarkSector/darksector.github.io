---
layout: post
title: "A random graph using d3.js"
date: 2012-05-01 19:17
comments: true
categories: ['JavaScript,d3.js']
---

[D3.js](http://d3js.org) created by [Mike Bostock](http://bost.ocks.org/mike/) is basically a javascript library that allows you to create documents based on data. The name D3 means Data Driven Documents and is a very nifty library to represent data on the web.
I came across this when I was looking for ways to represent data in real time on a web browser. I am trying to create data acquisition devices that do that. I've also been working on Python for that same thing but I'll get to that later.

So I have this random graph on my homepage, it's just an edited version of an [example](http://mbostock.github.com/d3/ex/stack.html) on the d3 page. Here's the code if you want to take a look at it. 

```javascript stack.js
var n = 2, // number of layers
    m = 60, // number of samples per layer
    data = d3.layout.stack()(stream_layers(n, m, .1)),
    color = d3.interpolateRgb("#00bfff", "#aaa");
	//00bfff
	//1e90ff
var margin = 20,
    width = 824,
    height = 300 - .5 - margin,
    mx = m,
    my = d3.max(data, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    }),
    mz = d3.max(data, function(d) {
      return d3.max(d, function(d) {
        return d.y;
      });
    }),
    x = function(d) { return d.x * width / mx; },
    y0 = function(d) { return height - d.y0 * height / my; },
    y1 = function(d) { return height - (d.y + d.y0) * height / my; },
    y2 = function(d) { return d.y * height / mz; }; // or `my` to not rescale

var vis = d3.select("#chart")
  .append("svg")
    .attr("width", width)
    .attr("height", height + margin);

var layers = vis.selectAll("g.layer")
    .data(data)
  .enter().append("g")
    .style("fill", function(d, i) { return color(i / (n - 1)); })
    .attr("class", "layer");

var bars = layers.selectAll("g.bar")
    .data(function(d) { return d; })
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d) + ",0)"; });

bars.append("rect")
    .attr("width", x({x: .9}))
    .attr("x", 0)
    .attr("y", height)
    .attr("height", 0)
  .transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", y1)
    .attr("height", function(d) { return y0(d) - y1(d); });

var labels = vis.selectAll("text.label")
    .data(data[0])
  .enter().append("text")
    .attr("class", "label")
    .attr("x", x)
    .attr("y", height + 6)
    .attr("dx", x({x: .45}))
    .attr("dy", ".71em")
    .attr("text-anchor", "middle")
    .text(function(d, i) { return i; });

vis.append("line")
    .attr("x1", 0)
    .attr("x2", width - x({x: .1}))
    .attr("y1", height)
    .attr("y2", height);

function transitionGroup() {
  var group = d3.selectAll("#chart");

  group.select("#group")
      .attr("class", "first active");

  group.select("#stack")
      .attr("class", "last");

  group.selectAll("g.layer rect")
    .transition()
      .duration(500)
      .delay(function(d, i) { return (i % m) * 10; })
      .attr("x", function(d, i) { return x({x: .9 * ~~(i / m) / n}); })
      .attr("width", x({x: .9 / n}))
      .each("end", transitionEnd);

  function transitionEnd() {
    d3.select(this)
      .transition()
        .duration(500)
        .attr("y", function(d) { return height - y2(d); })
        .attr("height", y2);
  }
}

function transitionStack() {
  var stack = d3.select("#chart");

  stack.select("#group")
      .attr("class", "first");

  stack.select("#stack")
      .attr("class", "last active");

  stack.selectAll("g.layer rect")
    .transition()
      .duration(500)
      .delay(function(d, i) { return (i % m) * 10; })
      .attr("y", y1)
      .attr("height", function(d) { return y0(d) - y1(d); })
      .each("end", transitionEnd);

  function transitionEnd() {
    d3.select(this)
      .transition()
        .duration(500)
        .attr("x", 0)
        .attr("width", x({x: .9}));
  }
}
```

I've just changed a bit, only 2 layers instead of 4 and the colors are more according to my theme on the front page. The random number generation is also done through javascript. Here's the code:

```javascript random.js
/* Inspired by Lee Byron's test data generator. */
function stream_layers(n, m, o) {
  if (arguments.length < 3) o = 0;
  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < m; i++) {
      var w = (i / m - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map(stream_index);
    });
}

/* Another layer generator using gamma distributions. */
function stream_waves(n, m) {
  return d3.range(n).map(function(i) {
    return d3.range(m).map(function(j) {
        var x = 20 * j / m - i / 3;
        return 2 * x * Math.exp(-.5 * x);
      }).map(stream_index);
    });
}

function stream_index(d, i) {
  return {x: i, y: Math.max(0, d)};
}
```

I asked a stupid question before, on the mailing list. Here's [the link](http://groups.google.com/group/d3-js/browse_thread/thread/891cd4f571b0f6e4#) to it. It's good if you want to start with d3.js. All the best if you are.