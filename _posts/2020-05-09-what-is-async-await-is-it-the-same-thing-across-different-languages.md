---
layout: post
title: What is async/await? Is it the same thing across different languages?
date: 2020-05-09 19:21 -0700
categories: Async Rust Python Javascript
---

So I have the basics down, all programs run sequentially. You have a single thread running tasks one at a time irrespective of the time they take to execute.

```
Task A --> Task B --> Task C
```

Most time consuming tasks could be I/O bound or even Network bound so they're best done in the background while the rest of the things that are not dependent on them are done. Other times when the blocking function is required, it's best to not have the program halt while the task completes. Good to have the user is notified.

So `async` allows things to happen in the background - asynchronously without blocking while handing off control to the program to do other things. Now, different languages, while having the same interpretation implement it differently. 

## Javascript


The browser can be blocked while a network or I/O operation takes place. Generally the interaction with the browser halts because of that, it seems like it is frozen. However, in reality something is still occurring in the back.

### Callbacks

To avoid such an issue, Javascript has had something called `async callbacks` which used to call the specified piece of code once the background task was accomplished. An example, taken from Mozilla's own [documentation](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) is `addEventListener()`

You attach it to an event like `click` and when that event is fired it fires the code added to it as the callback. 

Here's a good example I found on [Mozilla developer docs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing)

```javascript
console.log("registering click handler");

button.addEventListener('click', () => {
  console.log("get click");
});

console.log("all done");
```

The order of the `console.log` statemetns is going to be:

1. Registering click handler
2. All Done
3. Get click

The second message (from the code) is blocked till somebody hits the button so first and third get executed sequentially.

[But callbacks can be messy](http://callbackhell.com/). So to clean it up something new was designed - called Promises

### Promises

Promises or future guarantees are an escape from defining callbacks. It's the new cleaner way of writing code that will happen in the background and is then expected to be handled once it has occurred. 

You basically execute a piece of code and then guarantee that once that has occurred it's result can be handled definitely


```javascript
console.log("Hello, this is a promise example");

fetch('foo.json')
.then(response => {
    return response.json();
})
.then(json => {
    products = json;
    initialize();
    console.log("Initialized with JSON");
})
.catch(error => {
    console.log("Some error occurred");
})


console.log("All done");

```

In this case, we see a similar issue

1. Hello, this is a promise example
2. All done
3. Initialized with JSON

But if we wanted to make sure that it happened sequentially like it was intended in the first place we could add another `then` block and have the last `console.log` statement in there.

But this also gives way to callback hell, here's an example taken from [this post](https://wecodetheweb.com/2017/10/27/async-...-await-in-javascript/)

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

So to solve this problem, now we finally get to `Async await` introduced in ES2017

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
}
```

This would be a replacement for `.then` where you block till you resolve or reject the function being awaited. Now bear in mind only the async function here is being blocked, rest of the stuff outside of this function is still executing in the thread. 

