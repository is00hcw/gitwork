#-*- coding: utf-8 -*-
__author__ = 'hcw'

from bson.objectid import ObjectId
from pymongo import MongoClient
import datetime

# http://www.2cto.com/database/201409/338199.html
# http://api.mongodb.org/python/current/tutorial.html
con = MongoClient('localhost', 29017)
#client = MongoClient('mongodb://localhost:27017/')

db = con.test # new a database
test = db.test

post = {"author": "Mike",  "text": "My first blog post!",  "tags": ["mongodb", "python", "pymongo"], "date": datetime.datetime.utcnow()}
test.insert(post)

print test.find_one()

