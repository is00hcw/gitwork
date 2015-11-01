#!/usr/bin/python
# -*- coding: utf-8 -*-
import requests
import hashlib, time, re, json
from xml.etree import ElementTree as ET
import qrcode

__author__ = 'Administrator'

# http://www.cnblogs.com/linjiqin/p/4140455.html
def qrimg(str, file):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(str)
    qr.make(fit=True)
    img = qr.make_image()
    img.save( file)

def test():
    for line in open("e:/dump/qrcode.txt"):
        li =  line.strip()
        if(li == ""):
            continue
        s = json.loads(li)
        print li
        print s["deviceid"]
        print s["qrticket"]
        qrimg(s["qrticket"], "e:/dump/" + s["deviceid"] + ".png")

if __name__ == '__main__':
    test()