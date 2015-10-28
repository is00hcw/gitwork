#!/bin/bash

echo "local server"

cp ~/nginx/local.conf /etc/nginx/conf.d/app.atsmart.io.conf

#查找字符，然后打印输出
sed -n '/\sserver\s.*8080/p'  /etc/nginx/conf.d/app.atsmart.io.conf
sleep 2s

echo "restart nginx"
sudo /etc/init.d/nginx restart  
