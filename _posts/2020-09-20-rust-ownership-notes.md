---
layout: post
title: Rust ownership notes
categories: Rust Memory
date: 2020-09-20 05:59 -0700
---
So Rust has a steep learning curve. I keep coming back to the ownership documentation to clear a few things up. Here are some of the things I might find useful for later. 

## Stack v/s Heap

### Stack

* Stack allows only a fixed size data
* Stack is faster since it just has to go to the next consecutive pointer position (which increments after a push)


### Heap

* Requires the heap to locate space for data (which can be variable) 
* Pointer has to move around since it's not consecutive given that data can be of different size
* Processor slows down since it has to follow the pointer

## The `String` type

* Gets allocated - i.e. stored on the heap. 
* Can use the `from` function to create a String from a string literal

```rust
let s = String::from("my literal");
```

* Literals are cool, they're hard coded, need only a set amount of space and the compiler doesn't have to worry about allocating more.
* But for stuff that's mutable we don't know how much is going to be required at compile time
* Rust cleans up after the variable leaves scope.

```rust
let s1 = String::from("my literal");
let s2 = s1;
```

* `s1` is now invalidated. Can't have two pointers pointing to the same location. `s2` now has ownership. This is called **move** also knows as shallow copy.
* We can do a hard copy too, it's called `clone` it copies data. It creates a copy on the heap which means it's expensive.

```rust
let s1 = String::from("something);
let s2 = s1.clone();
```

## Other pre declared types

```rust
let x = 10;
let y = x;
```

* Here `x` is stored on the stack, not the heap because there is a pre determined data type size that is either inferred by the compiler or the programmer actually declares
* `x` doesn't lose ownership here, `y` is a hard copy of `x` because it's not on the heap. It's on the stack.



## Copy & Drop trait

* A type with a `Copy` trait will allow an older variable is still usable after assignment.
* However a `Copy` trait is not allowd to be placed on a type that also implements a `Drop` trait.
* Types like `bool`, `i32` etc. implement `Copy` and are put on the stack but things like `String` aren't


## Function calls and ownership

* Everytime you pass a variable to a function, the ownership changes
* For things like `String` the variable can't be used after it's passed to the function call
* For things like `i32` the variable can be used after it's been passed
* Example taken from the documentation


```rust
fn main() {
    let s = String::from("hello");  // s comes into scope

    takes_ownership(s);             // s's value moves into the function...
                                    // ... and so is no longer valid here

    let x = 5;                      // x comes into scope

    makes_copy(x);                  // x would move into the function,
                                    // but i32 is Copy, so it’s okay to still
                                    // use x afterward

    println!("{}", x);              // this will be okay

} // Here, x goes out of scope, then s. But because s's value was moved, nothing
  // special happens.

fn takes_ownership(some_string: String) { // some_string comes into scope
    println!("{}", some_string);
} // Here, some_string goes out of scope and `drop` is called. The backing
  // memory is freed.

fn makes_copy(some_integer: i32) { // some_integer comes into scope
    println!("{}", some_integer);
} // Here, some_integer goes out of scope. Nothing special happens.
```