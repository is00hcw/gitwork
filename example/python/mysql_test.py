#!/usr/bin/python
# -*- coding: utf-8 -*-

__author__ = 'Administrator'


import datetime
import mysql.connector
import MySQLdb

def connectortest():
    con = mysql.connector.connect(user='root', password='root',  host='127.0.0.1', database='test')
    cursor = con.cursor()
    query = ("SELECT * FROM users "
             "WHERE enable=%d")
    hire_start = datetime.date(1999, 1, 1)
    cursor.execute("SELECT * FROM users" )
    for (username, password,enabled) in cursor:
      print("{}, {} ".format( username, password))
    cursor.close()

    cursor = con.cursor()
    cursor.execute('select * from users')
    print cursor.fetchall()


    con.close()
    # output = open(filename,'w')
    # output.write(str(page_title).lstrip('(b\'').rstrip('\',)')+"\n")
    # output.close()

def dbtest():
    conn = MySQLdb.connect(host='127.0.0.1', user='root', passwd='root', port=3306, charset='utf8')
    cursor = conn.cursor()
    conn.select_db("test")
    cursor.execute("select * from users")

    result = cursor.fetchall()
    print type(result)
    for column in result:
        print column[0], column[1], column[2]

if __name__ == '__main__':
    print 'main'
    dbtest()