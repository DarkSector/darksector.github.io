---
layout: post
title: OpenCV 4.2 on Apple M1 (Pro) with Python3.8 bindings
date: 2023-12-26 01:26 -0800
categories: OpenCV Python Apple M1
---

I wasted 2 hours on building OpenCV 4.2.0 from source on Apple M1 Pro with Python3.8 bindings. Here are the steps if anyone else is stuck on this. I am on Mac OS Mojave btw.

Note: Don't waste your time with Pyenv. Too much goes wrong with it, stick to `/usr/bin/python3` (system install python3). In my case this was Python 3.8.9

## Virtualenv 

Start by creating virtualenv with the new bundled in `venv` module. Simple enough

```shell
mkdir ~/.virtualenvs
# calling my env gurus because I am trying to get through pyimagesearch gurus course
/usr/bin/python3 -m venv ~/.virtualenvs/gurus 
```

## Dependencies from Homebrew

```shell
brew update
brew install wget cmake jpeg libpng libtiff openexr eigen tbb
```

## Install numpy

```shell
source ~/.virtualenvs/gurus/bin/activate
pip install numpy
```

## Download and build OpenCV 4.2.0

```shell
wget -O opencv.zip https://github.com/opencv/opencv/archive/4.2.0.zip
wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/4.2.0.zip
unzip opencv-4.2.0.zip
unzip opencv_contrib.zip
mv opencv-4.2.0 opencv
mv opencv_contrib-4.2.0 opencv_contrib
cd ~/opencv
mkdir build && cd build
source ~/.virtualenvs/gurus/bin/activate
```

Okay so this is where all my time went. `python-config` doesn't have the option of `--configdir` any more. So if you need to find out where the `libpython3.8.dylib` is located, you have to play by the new rules. Head to python3 shell

```python3
import distutils.sysconfig as s
print(s.get_python_inc())
```

This will very likely lead to something like:
`/Library/Developer/CommandLineTools/Library/Frameworks/Python3.framework/Versions/3.8/include/python3.8`

Well, the dylib is at `/Library/Developer/CommandLineTools/Library/Frameworks/Python3.framework/Versions/3.8/lib/libpython3.8.dylib`. 

Best to verify it yourself. This path is going to be used for our CMAKE command when configuring OpenCV. Particularly the variable `PYTHON3_LIBRARY`

So, now we continue with our configuration process. Within the build directory

```shell
cmake -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
    -D PYTHON3_LIBRARY=‘/Library/Developer/CommandLineTools/Library/Frameworks/Python3.framework/Versions/3.8/lib/libpython3.8.dylib’ \
    -D PYTHON3_INCLUDE_DIR=`python -c 'import distutils.sysconfig as s; print(s.get_python_inc())'` \
    -D PYTHON3_EXECUTABLE=$VIRTUAL_ENV/bin/python \
    -D BUILD_opencv_python2=OFF \
    -D BUILD_opencv_python3=ON \
    -D INSTALL_PYTHON_EXAMPLES=ON \
    -D INSTALL_C_EXAMPLES=OFF \
    -D OPENCV_ENABLE_NONFREE=ON \
    -D BUILD_EXAMPLES=ON ..
```

Which will yield a lot of config stuff. Then simply build it.

```shell
make -j4
sudo make install
```

## Symlink

Once it has been built and installed, simply go ahead and find out where the cv2.cpython file was spit out.

`mdfind cv2.cpython`

In my case I saw it installed here: 

```
/usr/local/lib/python3.8/site-packages/cv2/python-3.8/cv2.cpython-38-darwin.so
```

Sweet, now let's symlink it in our `site-packages`. To locate that you can call `get_python_lib()` with distutils sysconfig

```python
import distutils.sysconfig as s
s.get_python_lib()
```
Head to `site-packages` and simply link the `cv2.python` 

```shell
cd '/Users/<your user>/.virtualenvs/gurus/lib/python3.8/site-packages'
ln -s /usr/local/lib/python3.8/site-packages/cv2/python-3.8/cv2.cpython-38-darwin.so
```

## Test

```shell
source ~/.virtualenvs/gurus/bin/activate
python3 -c "import cv2; print(cv2.__version__)"
# 4.2.0
```

That's it. Now I can actually get to the learning bit.

Also, hooray! First and last post of 2023 \o/