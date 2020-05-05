---
layout: post
title: Python 3.5.X base64 encoding
date: 2016-10-20 03:51 - 0700
categories: Python API Gmail Google
---

I swear to god, I am not dark, but I have pretty much thought about drowning myself ten times in the last hour trying to figure this out. So I guess this is worthy of a post.I've been working with the GMail Python API and in order to send data it has to be b64 encoded. 

Now, the samples are shit. They don't mention this will work with python2 only. So, when you try to do this: `base64.urlsafe_b64encode('Some String')`

You get an output `'U29tZSBTdHJpbmc='`. However let's try that with Python 3.5.2 and you get:

```python
Traceback (most recent call last): 
File "<stdin>", line 1, in <module>
File "/usr/local/Cellar/python3/3.5.2_1/Frameworks/Python.framework/Versions/3.5/lib/python3.5/base64.py", line 119, in urlsafe_b64encode
    return b64encode(s).translate(_urlsafe_encode_translation)
File "/usr/local/Cellar/python3/3.5.2_1/Frameworks/Python.framework/Versions/3.5/lib/python3.5/base64.py", line 59, in b64encode
    encoded = binascii.b2a_base64(s)[:-1]
    TypeError: a bytes-like object is required, not 'str'
```

The solution is to encode it in `UTF-8` and then once encoded as base64, it needs to be decoded as ascii

So this is the python3 implementation

`base64.urlsafe_b64encode('Some String'.encode('UTF-8')).decode('ascii')`

I am so done. Enough dev work for today.


