---
layout: post
title: Rust async is only available in 2018 edition error
date: 2020-04-21 12:15 -0700
categories: Rust Cargo Intelli-j
---

A common issue while working with a cargo project is seeing an annoying squiggly line under `async` keyword with the error

<img src="/assets/posts/2020-04-21-rust-async-is-only-available-in-2018-edition-error.md/error.png" alt="async error" />

Despite what [this issue says](https://github.com/intellij-rust/intellij-rust/issues/4382) it's not just a plugin error that was fixed. The Rust plugin expects a workspace for this error to go away.

When you create a rust project you need to have a parent `Cargo.toml` file declaring workspaces in order for this plugin to recognize a binary. Here's an example

```
mkdir parent-directory && cd parent-directory
cargo bin --new myproject
touch Cargo.toml
```

Your parent Cargo.toml should like this

```
[workspace]
members = [
  "myproject",
]
```

And that should fix that
