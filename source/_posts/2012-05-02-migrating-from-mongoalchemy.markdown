---
layout: post
title: "Migrating from MongoAlchemy"
date: 2012-05-02 22:59
comments: true
categories: ['MongoDB', 'Flask', 'Flask-MongoAlchemy','Python', 'PyMongo']
---

Extensions like [Flask-MongoAlchemy](http://packages.python.org/Flask-MongoAlchemy/) and [Flask-MongoKit](http://flask.pocoo.org/docs/patterns/mongokit/) are probably the most useless extensions for [Flask](http://flask.pocoo.org/) because they ignore the inherent reason why Mongo is to be used. What is the point of using [MongoDB](http://www.mongodb.org/) when you are going to used a fix schema. A fixed model declaration should be used with RDBMS like PostGRE and SQLite by using [SQLAlchemy](http://www.sqlalchemy.org/). 

I wonder why hasn't anyone come up with this question before. Either way I'll be using PyMongo now. Flask has an extension for that, it's called [Flask-PyMongo](http://flask-pymongo.readthedocs.org/en/0-1/index.html). 

##MongoDB Basics

Here're some interesting relations between SQL and MongoDB's way of organizing things.
<table class="table table-bordered table-striped">
	<thead>
		<tr>
			<th>SQL</th>
			<th>MongoDB</th>
		</tr>	
	</thead>
	<tbody>	
    	<tr>
        	<td>Database</td>
			<td>Database</td>
    	</tr>
		<tr>
        	<td>Table</td>
			<td>Collection</td>
    	</tr>
		<tr>
        	<td>Row</td>
			<td>Document</td>
    	</tr>
		<tr>
        	<td>Index</td>
			<td>Index</td>
    	</tr>
		<tr>
        	<td>Primary key</td>
			<td>_id field</td>
    	</tr>
	</tbody>
</table>

A complete list of relations is given in the mapping chart over at [MongoDB's website](http://www.mongodb.org/display/DOCS/SQL+to+Mongo+Mapping+Chart)

This is neat considering you don't need any fixed schema, just stash the data in and you can easily recover it. So now instead of using MongoAlchemy we will be using PyMongo directly which is fairly easy as well.

##Why Mongo with Python makes sense

Python Dicts and Mongo's BSON documents are just the same. So passing dicts as documents is fairly intuitive. Here's a comparison:

```python dict.py
>>> a = {"a" : "b", "c" : "d", "k" : 3}
```

```javascript MongoDB schema example
{
  _id : ObjectId("4e77bb3b8a3e000000004f7a"),
  when : Date("2011-09-19T02:10:11.3Z",
  author : "alex",
  title : "No Free Lunch",
  text : "This is the text of the post.  It could be very long.",
  tags : [ "business", "ramblings" ],
  votes : 5,
  voters : [ "jane", "joe", "spencer", "phyllis", "li" ],
  comments : [
    { who : "jane", when : Date("2011-09-19T04:00:10.112Z"),
      comment : "I agree." },
    { who : "meghan", when : Date("2011-09-20T14:36:06.958Z"),
      comment : "You must be joking.  etc etc ..." }
  ]
}
```

It's similar and therefore easier.

##PyMongo Usage

```bash  start the mongo daemon on any port and application directory to store database
$ mongod --port 45000 --dbpath $PATHTOAPPLICATIONDIRECTORY
```

```python 
#import pymongo and make the connection
from pymongo import Connection
#connect it to the mongo daemon running on the port
connection = Connection('localhost', 45000)
```

After that we'll need to start creating databases and collections and inserting documents, I'll post the code later when I am done with general implementation.