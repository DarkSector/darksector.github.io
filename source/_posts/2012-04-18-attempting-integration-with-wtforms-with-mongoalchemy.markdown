---
layout: post
title: "Attempting integration with WTForms with MongoAlchemy"
date: 2012-04-18 10:56
comments: true
categories: [code, MongoAlchemy, Python, Flask, Database, WTForms]
---

So the forms.py looks something like this.

``` python forms.py 
from __future__ import with_statement

from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash
from flaskext.wtf import Form, TextField, TextAreaField, \
	 PasswordField, SubmitField, Required, SelectField, ValidationError, \
	 RadioField
		
from foo import app
from foo import db

class BuilderForm(Form):
	"""Function used to create custom fields"""
	field_name = TextField()
	field_type = SelectField(u'Type of Field',choices=[('','')])
	submit = SubmitField('Submit Information')
	
class Register(Form):
	"""Form for registeration of professional, org or moderator"""		
	usertype = SelectField(u'Type of user', choices=[('org','Organization'),('pro','Professional'),('mod','Moderator')])
	name = TextField('Organization/Professional Name')
	email = TextField('Email addresss *')
	phone = TextField('Phone Number *')
	register = SubmitField('Submit user information')
	
class LoginForm(Form):
	"""Form for logging in for Professionals and Orgs"""
		
	email = TextField('Your email which you used to register')
	password = PasswordField('Your passsword')
	usertype = SelectField(u'Log me in as', choices=[('org','Organization'),('pro','Professional'),('mod','Moderator')])
	login = SubmitField('Login')
	
class StarterForm(Form):
	"""Form for starting off the profile display process"""
	region = SelectField(u'Select you state', choices=[])
	pincode = TextField("Your pincode")
	specific = TextField("Town or Village")
	submit = SubmitField('Submit')
```

Notice how the region field in StarterForm would require database driven choices? Yeah I need to figure out how to do that in my views function. It's important to render the views otherwise it might break the whole thing by circular imports. 

Also since Forms are classes it would be difficult to pass the arguments when calling the form in views. Okay let's attempt that.