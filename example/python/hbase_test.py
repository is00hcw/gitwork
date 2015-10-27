#!/usr/bin/python
# -*- coding: utf-8 -*-
import requests
import hashlib, time, re, json
from xml.etree import ElementTree as ET

__author__ = 'Administrator'

import happybase

connection = happybase.Connection('114.215.109.199')
table = connection.table('hb_device_info')

# table.put('row-key', {'family:qual1': 'value1',  'family:qual2': 'value2'})
row = table.row('99EC87E12F8F692B9978A57C21E4F56E2A373401')
print row['info:t#40e766e1c3278998bfcbc62c7faa37d1']  # prints 'value1'

for key, data in table.rows(['99EC87E12F8F692B9978A57C21E4F56E2A373401', 'BAC50A51A5B7601A31200F975D4A7FF541D8F91C']):
    print key, data  # prints row key and data for each row

for key, data in table.scan(row_prefix=''):
    print key, data  # prints 'value1' and 'value2'

#row = table.delete('row-key')

if __name__ == '__main__':
    print 'main'