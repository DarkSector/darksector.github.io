---
layout: post
title: "My experience with CentOS 5.8 and setting up Flask"
date: 2012-08-26 03:44
comments: true
categories: ["Linux", "CentOS", "Flask", "Python2.7.3", "Python", "mod_wsgi", "httpd"]
---

I have worked with Debian, Ubuntu Server, ArchLinux and now CentOS and what a kick in the nuts it has been. CentOS 5.8 ships with Python 2.4 and it is an absolute pain to setup. But finally it's done.

So I began with installing Python2.7.3 first. 

```bash install Python2.7
$ wget http://www.python.org/ftp/python/2.7/Python-2.7.tgz
$ tar -xvf Python-2.7.tgz
$ cd Python-2.7
$ su
root$ ./configure --prefix=/usr/local
root$ make && make altinstall
```

Now we have Python2.7 binary in /usr/local/bin and we can go about installing Setuptools

```bash install Setuptools
$ wget http://pypi.python.org/packages/source/s/setuptools/setuptools-0.6c11.tar.gz#md5=7df2a529a074f613b509fb44feefe74e
$ tar -xvf setuptools-0.6c11.tar.gz
$ cd setuptools-0.6c11
$ su
root$ python2.7 setup.py install
root$ easy_install-2.7 install pip
root$ pip-2.7 install virtualenv
```
Now, after having done all of this, I needed to install mod_wsgi

```bash mod_wsgi
$ yum install mod_wsgi
```

And that's where I asked people at #pocoo to shoot me in the face. It turns out you need mod_wsgi compiled with Python2.7 to use it with Python2.7

So, let's uninstall mod_wsgi and then build it from source

```bash compile mod_wsgi
$ wget http://code.google.com/p/modwsgi/downloads/detail?name=mod_wsgi-3.4.tar.gz
$ tar -xvf mod_wsgi-3.4.tar.gz
$ cd mod_wsgi-3.4
$ ./configure --using-python=/usr/local/bin/python2.7
$ make
```

I got this error [http://code.google.com/p/modwsgi/wiki/InstallationIssues#Mixing_32_Bit_And_64_Bit_Packages](http://code.google.com/p/modwsgi/wiki/InstallationIssues#Mixing_32_Bit_And_64_Bit_Packages) Which means it needs Python2.7 built with x86_64 not the 32 bit.

So, now, reinstall Python2.7

```bash install Python2.7
$ cd Python-2.7
$ su
root$ ./configure --prefix=/usr/local --enable-shared
root$ make && make altinstall
```

And now reinstall mod_wsgi. Wow, this has been so difficult. 

Anyway the problem doesn't end here. Now we have to configure httpd.conf

```xml httpd.conf
WSGISocketPrefix /var/run/wsgi
WSGIPythonHome /var/www/virtual
#WSGIPythonPath /var/www/test/virtual
<VirtualHost 122.99.126.71:80>
ServerName rhknhost
WSGIDaemonProcess herokufinal user=pronoy group=pronoy threads=5
WSGIScriptAlias / "/var/www/herokufinal/herokufinal.wsgi"
DocumentRoot /var/www/herokufinal
ErrorLog /var/www/herokufinal/logs/error.log

        <Directory /var/www/herokufinal>
                WSGIProcessGroup herokufinal
                WSGIApplicationGroup %{GLOBAL}
                WSGIScriptReloading On
                Options Indexes FollowSymlinks Multiviews
                Order deny,allow
                Allow from all
        </Directory>

</VirtualHost>
```

And then create the .wsgi file for running the application

```python myapplication.wsgi
activate_this  = '/var/www/virtual/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))
import sys
sys.path.insert(0, '/var/www/herokufinal')
from profilebuilder import app as application
```

Jesus. The time it took to figure this out. Oh God, I could've built a fucking house by then. 12 continuous hours. Never again CentOS. Never again.