#!/usr/bin/python
# -*- coding: utf-8 -*-
from xml.etree import ElementTree as ET
import requests
import hashlib, time, re, json

__author__ = 'Administrator'

# xml = ET.fromstring(request.raw_post_data)
# content = xml.find("Content").text

#  http://iot.weixin.qq.com/document-2_5.html
def test():
    r = requests.get(url='https://api.weixin.qq.com/cgi-bin/token',  params={'grant_type' :'client_credential' , 'appid':'','secret':''})
    print r.text
    json = r.json()
    token = json['access_token'];
    print "token :" ,token
    # token = 'fcjsxxFQL_WF3F_gHoDMC6LCh5sY7xID1yJTb-CPfp3KSpylmqEdYlvT0XvuGMkdxP7X8h8gtTuWc1apQu3GsHf8HP9vobe0eXiYOUpaNqw'

    url = 'https://api.weixin.qq.com/device/create_qrcode'
    print 'post ' , url
    data = '{"device_num":1,"device_id_list":["01234"]}'
    print data
    r = requests.post(url=url, params={'access_token':token}, data=data)
    print r.text

    url = 'https://api.weixin.qq.com/device/getqrcode?access_token=' + token
    r= requests.get(url=url)
    print r.text   # {"base_resp":{"errcode":100020,"errmsg":"account quota not enough"}}

if __name__ == '__main__':
    print 'main'
    test()