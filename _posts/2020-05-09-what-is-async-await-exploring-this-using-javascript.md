---
layout: post
title: What is Async/Await? Exploring this using Javascript
date: 2020-05-09 19:21 -0700
categories: Async Javascript
---
Okay so I spent way too much time on this and in the end the most basic question kept ringing in my head **"What is the purpose of async code?"**. I understand (now) what the `async` `await` keywords do but the fundamental question is what is asynchronous code and why is it useful? So I am going to tackle that first.

Synchronous by definition means something that happens at the same time and asynchronous means that which doesn't happen simultaneously. But Synchronous code executes sequentially, not in parallel or as we like to say in programming - **simultaneously**. So this is a discrepancy. However, the answer lies in how instructions are executed on the lower layer. Synchronous on that level implies, the same clock. An instruction set that uses that same global clock is said to execute synchronously. Similarly, an [asynchronous system doesn't share the same clock so the instructions don't execute in a coordinated way](https://en.wikipedia.org/wiki/Asynchronous_system). 

Glad we got that out of the way. So in case of higher level programming, **Sync** code gets to execute sequentially whereas **async** code can execute out of order. Now bear in mind, this has nothing to do with threads. Async code can run on single or multiple threads. What it does mean is that whether or not they can be started/stopped, does not depend upon some other tasks starting/stopping. _So async code CAN be started or stopped without having to worry about the previous block of code_. That is important.

It is to be noted that async code cannot by definition then rely on results of a previous task. They have to be indpendent of that. A good example [listed in this post illustrates how quick sort is async in nature](https://stackoverflow.com/questions/748175/asynchronous-vs-synchronous-execution-what-does-it-really-mean)

> The quicksort routine, for example, splits the list into two lists and performs a quicksort on each of them, calling itself (quicksort) recursively. In both of the above examples, the two tasks can (and often were) executed asynchronously. They do not need to be on separate threads. Even a machine with one CPU and only one thread of execution can be coded to initiate processing of a second task before the first one has completed. The only criterion is that the results of one task are not necessary as inputs to the other task

I love the responses illustrating this concept in a better fashion - here's one that caught my eye:

**You go to the restaurant to order, Synchronous code can be thought to work as follows:**

>  if you wanted the restaurant scenario to be synchronous, then when you order food, everyone else in the restaurant would have to wait for your food to arrive before they can order their food etc. Now this seems like a really dumb scenario to be in, but in the computing world this scenario could be useful. Say each customer cant decide what they want, and instead want to look at what the previous customer orders to decide if they want that or not, then it makes sense that they have to wait for the food to arrive before ordering

**Async code on the other hand is like so:**

> You are in a restaurant with many other people. You order your food. Other people can also order their food, they don't have to wait for your food to be cooked and served to you before they can order. In the kitchen restaurant workers are continuously cooking, serving, and taking orders. People will get their food served as soon as it is cooked.

Okay that's great, now the second question: 

## Why is it useful? 

Okay that's easy to answer at this point. I'll use the example of a webpage for now. Say, you go to a page where you are supposed to view a lot of data. Unfortuantely the network request that loads the data takes a bit before it's able to pull it into the page. Now I understand the purpose of this page is to load and show this data, so if there is no data to show, being on the page is pointless. However, while the data is loading, you shouldn't feel like your browser is unresponsive and is stuck. You should be able to retain control over the page while the operation is executing in the back. That also includes things like showing the user a spinner since that too is a form of control. 

So the answer is (in case of javascript at least for now) : **user experience**

I know, sounds crazy. Why would we create something this smart only to waste it on something like user experience. But think about it, user experience isn't just how much the user likes being on the page, but how much control the user has. So user experience actually means control over things no matter how limited.

Alright, so we have the basics down, lets look at the implementation of async code across different platforms and languages. 

### Javascript Callbacks

Now as previously stated, async code is useful so that our user can retain control while JS does its thing in the background. But since the purpose of the whole operation may be dependent on that one async block we need for it to join our main execution order. The data needs to be fetched and something needs to be done with it. That's why we need something that can handle the result of the async code that got executed.

For that, Javascript has had something called `async callbacks` which used to call the specified piece of code once the background task was accomplished. An example, taken from Mozilla's own [documentation](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) is `addEventListener()`

You attach it to an event like `click` and when that event is fired it fires the code added to it as the callback. 

Here's a good example I found on [Mozilla developer docs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing)

```javascript
console.log("registering click handler");

button.addEventListener('click', () => {
  console.log("get click");
});

console.log("all done");
```

The order of the `console.log` statements is going to be:

1. Registering click handler
2. All Done
3. Get click

The second message (from the code) is blocked till somebody hits the button so first and third get executed sequentially.

[But callbacks can be messy](http://callbackhell.com/). So to clean it up something new was designed - called Promises. 

### Promises

Promise is literally something that was invented to escape callback hell. To make code readable and doesn't drive us insane. They are responsible for the same thing, for async code that is being executed - do something with their results. Making a piece of code `async` means making sure it returns a `promise`. Luckily we have the `fetch` api to show us `async` code without using the word `async`.

I've created a real world example to understand this by creating a simple Python flask server that waits 2 seconds before sending back some JSON data.

```python
import pathlib
import json
from flask import Flask, jsonify
import time


def run_server():
    app = Flask(__name__)

    @app.route("/")
    def delayed_response():
        time.sleep(2)
        return jsonify({"data": "some data here"    })

    app.run(port=5500, debug=True, host="0.0.0.0")


if __name__ == "__main__":
    run_server()
```

When you hit the route, it sleeps for 2 seconds and then sends back a python dict as JSON. Quick and dirty


```javascript
console.log("Hello, this is a promise example");

fetch('http://localhost:5500/')
.then(response => {
    return response.json();
})
.then(json => {
    console.log(json);
})
.catch(error => {
    console.log("Some error occurred");
    console.log(error);
})

console.log("All done");
```

In this case, we see a similar pattern

1. Hello, this is a promise example
2. All done
3. `{"data": "some data here"}` OR an error

But this also gives way to callback hell, here's an example taken from [this post](https://wecodetheweb.com/2017/10/27/async-...-await-in-javascript/). Notice that there's a `.then` after the response handler? That's because even `.json()` returns a promise. Here's another example from the aforementioned link: 

```javascript
fetchUsers()
  .then((users) => {
    return fetchScores(users)
      .then((scores) => {
        return users.map(user => ({
          ...user,
          score: scores[user.id]
        }));
      });
  });
```

There's a second `.then` on the `fetchScores` invocation which is understandable, because after you got the users only then do you want to get their scores.

So to solve this problem (of readability), now we finally get to `Async await` introduced in ES2017

First off, let's start by marking a function async this will ensure that the function returns a promise

```javascript
async function fetchUsersWithScores() {
}
```

Now, let's `await` results within it. Await is only usable within async functions.

```javascript
async function fetchUsersWithScores() {
    const users = await fetchUsers();
    const scores = await fetchScores(users);
    return users.map(user => ({
          ...user,
          score: scores[user.id]

        });
}
```

This would be a replacement for `.then` where you block till you resolve or reject the function being awaited. Now bear in mind only the async function here is being blocked, rest of the stuff outside of this function is still executing in the thread. 

That's it. That's what `async`/`await` does in Javascript. It's a saner replacement for Promise. It doesn't offer any new functionalities as one would think. Callbacks already did the async code result handling. This is just easier to read and understand.