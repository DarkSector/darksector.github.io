---
layout: post
title: Typescript imports
date: 2020-05-04 11:35 -0700
categories: Typescript Javascript
---

So to work with Typescript we need to get a type definitions for the packages we're using. But we generally see this error when we try to import the package.

`TS1192: Module '"fs"' has no default export.`

Of course replace fs with literally anything from what I've seen. 

It makes sense to see this since none of the type definitions actually export anything. Now since the error talks about `default` imports, I thought this should work. 

`import {fs} from 'fs';`

However, there is not just no default export but rather no export in the td files.

[So this post talks about using](https://github.com/microsoft/TypeScript-React-Starter/issues/8)

`import * as fs from 'fs'`

That fixes it, but I still don't understand what it does. So I searched further and [found this post](https://stackoverflow.com/questions/35706164/typescript-import-as-vs-import-require)

And I quote:

> import * as creates an identifier that is a module object, emphasis on object. According to the ES6 spec, this object is never callable or newable - it only has properties. If you're trying to import a function or class, you should use

So this just props it up as an object and it's not actually callable, for that `require` is still required. 

Good to know.



