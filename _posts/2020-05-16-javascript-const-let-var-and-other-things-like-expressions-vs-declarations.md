---
layout: post
title: Javascript const, let, var and other things like expressions vs declarations
date: 2020-05-16 20:37 -0700
categories: Javascript
---
ES2015 introduced `let` and `const` which has really increased the readability of javascript code and helps fix an important issue with how variables are declared. Before this, we had `var`, the only way to declare variables. Turns out it was quite a bad idea since `var` didn't allow block scoping. It used to pierce through `for`, `if` etc. blocks which meant you could have an unexpected output on your hands. It was especially bad since you didn't have to declare the variable to initialize it and use it in code lexically.  

What does that mean? 

It means that I can do this

```javascript
function myFunction() {
    myVar = "this is weird";

    console.log(myVar); // this is after manual initialization

    var myVar;
}

function myOtherFunction() {
    console.log("First invocation ", myVar);
    
    var myVar; // gets initialized with an undefined so the first invocation is undefined
    myVar = "initialized manually"

    console.log("Second invocation ", myVar); // now we've initialized it
}
```

Genius. Why does this work? Because of something called "hoisting". The variable declaration is processed at the start of the function which means declare them anywhere but they won't have any value till you initialize them. So you can do pretty weird things like this one

```javascript
function anotherFunction() {
    var myVar;

    console.log(myVar); // this doesn't throw an error! Unreal (it ouputs undefined)

    myVar = "here's another weird thing"; //lol
}

```

Now, the block level scoping issues with `var`. So if you declare a `var` within a block, it will pierce through it unless it's within a function. Here's an example

```javascript
(function() {
    if (true) {
        var myVar = "something's not right with this";
    }

    console.log(myVar); // your curly braces mean nothing here

})();
```

You can do the same thing with for loops. But `var` does have function scoping which means it can't escape the bounds of a function. So if I were to call `console.log(myVar)` outside of that anonymous function it will be undefined. Glad to know this shit has some limits at least. 

**Hol' up**: <u>the function above is anonymous but it has parenthesis around it. Why?</u> 

Let's understand the difference between the following before we answer this questions: function __declaration__ v/s __expression__

## Declaration

Commonly this is considered to be a declaration: 

```javascript
function myFunction () { 
    console.log("Within myFunction");
}
```

I wrote a function but I didn't use it. It has been declared (and defined obviously since javascript doesn't have or need `prototyping` support - not be mistaken with `prototypes`). So the function exists in this context (whatever it is) but it hasn't been executed. 

## Expression

Commonly this is considered an expression:

```javascript
var myFunction = function() { console.log("Within myFunction expression")};
```

Function body was defined and assigned to `myFunction` variable in this case. It can now be called, by calling the variable in its place. This way, the function doesn't need identifier.

The difference here is that in the case of declaration, just like variables, you can call the function first and then declare it. So it gets hoisted just like variables. But in the second case it will only work when the interpreter reaches that line of code. 

```javascript
console.log(myFunction()); // this will work
function myFunction() {return "myFunction executed"}
```

```javascript
myFunction(); // this will fail
var myFunction = function() {return "myFunction executed"};
```

Wait wait wait, [but according to ECMA specs](https://www.ecma-international.org/ecma-262/5.1/#sec-13) `FunctionDeclaration` & `FunctionExpression` can be the same if expression is given the otherwise optional identifier.

```javascript
FunctionDeclaration : 
    function Identifier ( FormalParameterList opt ) { FunctionBody }

FunctionExpression :
    function Identifier opt ( FormalParameterList opt ) { FunctionBody }

// opt means optional
```

So what's the difference? 

Well the difference is scope. The **where** matters. A `declaration` is a function defined inside a function or global context. However, an `expression` is when a function is defined inside an assignment (you assign the function to a variable), call `new` on it or even shove it in an operator like the grouping operator `( )`

```javascript
function foo () {
    function myDeclaredFunction() {} // easily a declaration 
}

function myAnotherDeclaredFunction() {} // yep declared as well

var myExpressedFunction = function () { } // assigned, so this is an expression

new function myAnotherExpressedFunction() {} // surprisingly not a declaration but an expression

// The grouping operator `( )` can only contain an expression and not other statments so by definition that is an expression
(function() {}
)(); // expressed and executed

(function() {
    function anotherDeclaredFunction() {} // this is a declaration though
})(); // expressed and executed
```

Here are some more examples of function `expression`

```javascript

// grouping operator
(function() {console.log("foo")})();

// unary operator
+(function() { console.log("foo")})();

// and many more using operators
```

Alright, now back to the original discussion: 

## Mutability and scope restriction

Okay so this is pretty incredible, we have to literally create functions to restrict scope pollution by using `var`. So we write expressions just to evaluate variables, this can get really hard to read. Thankfully, the new standard came up with `const` and `let`. First they're block scoped. So out of the box that's fixed. Secondly, `const` stops you from replacing the reference of the thing you're referencing. **THIS IS NOT IMMUTABILITY** I'll talk more about this in a second, but first:- 

A common example for const;

```javascript
const myVar = "this is immutable";
myVar = "So this won't work";
```

But this can

```javascript
let myVar = "Some value";
myVar = "oh look, it has changed";
```

What about hoisting? Does it work the same for `let` and `const` the way. Well, for `var` we know that when the variable was declared it gets initialized with `undefined` and then it gets evaluated later when the engine reaches the manual initialization by the user. But `let` isn't the same. It doesn't get an `undefined`. Instead it is initialized only when the engine gets to the manual initialization. 

So this won't work

```javascript
function myFunctionUsingLet() {

    console.log("first invocation ", variable);  // will straight up throw a ReferenceError
    
    /* everything before this is a temporal dead zone resulting in ReferenceError */
    let variable; // hoisted but not initialized so won't evaluate

    variable = "some value";
    
    console.log("second invocation ", variable);
}
```

`const` is the same way except of course you can't have the variable change its reference to a different thing in memory. **What does that mean?** 

It means that I can do this

```javascript
const myList = ["foo", "bar"]; 
myList.push("foobar");   // I shouldn't be able to do this

console.log(myList);
```

Why did this work? Simple, it was referencing an array which is mutable. However, if I were to reassign `myList` another structure like so: 

```javascript
const myList = ["foo", "bar"];
myList = ["foobar"]; // this will fail

console.log(myList);
```

So `const` isn't technically immutable. It just can't be re-declared or re-initialized which is different from immutability. No re-binding.

Okay so now we know expressions, we know that we can assign a variable a javascript function expression and use the variable to call it. We can do the same thing with `const` and `let`

```javascript
// rebinding is allowed with let
let myFunction = () => {};
myFunction = (x, y) => console.log(x * y);

myFunction(); // will log NaN since x & y are undefined and undefined * undefined is NaN

// OR
// no rebinding allowed
const myConstFunction = () => {};
```

**The fat arrow** just makes it more readable. 


Phew, so now I finally understand how and why we can use `let`, `const`, `var` as variables and even function expressions.


Posts I've read to understand all of this:

* [https://kangax.github.io/nfe/#expr-vs-decl](https://kangax.github.io/nfe/#expr-vs-decl)
* [https://stackoverflow.com/questions/43709005/let-const-and-var-on-global-functions-in-javascript](https://stackoverflow.com/questions/43709005/let-const-and-var-on-global-functions-in-javascript)
* [https://stackoverflow.com/questions/45846053/named-function-expression-with-let-or-const-in-es6](https://stackoverflow.com/questions/45846053/named-function-expression-with-let-or-const-in-es6
)
* [https://stackoverflow.com/questions/34181804/anonymous-function-vs-const-function-javascript](https://stackoverflow.com/questions/34181804/anonymous-function-vs-const-function-javascript)
* [https://stackoverflow.com/questions/33040703/proper-use-of-const-for-defining-functions-in-javascript](https://stackoverflow.com/questions/33040703/proper-use-of-const-for-defining-functions-in-javascript)
* [https://ponyfoo.com/articles/const-variables-not-immutable](https://ponyfoo.com/articles/const-variables-not-immutable)
* [https://mathiasbynens.be/notes/es6-const](https://mathiasbynens.be/notes/es6-const)
* [https://dmitripavlutin.com/variables-lifecycle-and-why-let-is-not-hoisted/](https://dmitripavlutin.com/variables-lifecycle-and-why-let-is-not-hoisted/)
* [https://www.vojtechruzicka.com/javascript-hoisting-var-let-const-variables/](https://www.vojtechruzicka.com/javascript-hoisting-var-let-const-variables/)
* [https://javascript.info/var](https://javascript.info/var)
* [https://www.ecma-international.org/ecma-262/5.1/#sec-13](https://www.ecma-international.org/ecma-262/5.1/#sec-13)