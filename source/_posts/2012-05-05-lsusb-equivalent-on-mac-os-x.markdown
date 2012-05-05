---
layout: post
title: "lsusb equivalent on Mac OS X"
date: 2012-05-05 22:58
comments: true
categories: ['Mac OS X Lion', 'lsusb', 'system_profiler']
---

Strangely there is no lsusb on Mac OS X. So I searched and found this command

```bash system_profiler
$ system_profiler SPUSBDataType
```

Check out the man page for system_profiler, it's got loads of options.